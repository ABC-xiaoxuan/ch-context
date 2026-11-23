import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { createServer } from 'node:http'
import { readFile, mkdir, access, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const directory = '.tmp/browser'
const auditSource = process.env.CH_CONTEXT_AUDIT_SCRIPT
  ? await readFile(process.env.CH_CONTEXT_AUDIT_SCRIPT, 'utf8')
  : undefined
const audits = []
await mkdir(directory, { recursive: true })
await build({
  entryPoints: ['tests/browser/fixture.tsx'],
  outfile: `${directory}/fixture.js`,
  bundle: true,
  platform: 'browser',
  format: 'iife',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
})
const html =
  '<!doctype html><html><head><meta charset="utf-8"><title>CH Context browser fixture</title><style>html,body,#app{margin:0;width:100%;height:100%;background:Canvas}body{color-scheme:light}body[data-ds-dark-theme]{color-scheme:dark}</style></head><body><div id="app"></div><script src="fixture.js"></script><script src="lib/client.js"></script></body></html>'
const server = createServer(async (request, response) => {
  try {
    const file = request.url?.split('?')[0]
    if (file === '/fixture.js' || file === '/lib/client.js') {
      response.writeHead(200, { 'content-type': 'application/javascript' })
      response.end(
        await readFile(file === '/fixture.js' ? `${directory}/fixture.js` : 'lib/client.js'),
      )
    } else response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html)
  } catch {
    response.writeHead(500).end()
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
if (!address || typeof address === 'string') throw new Error('Fixture server did not start')
let executablePath = process.env.CH_CONTEXT_CHROME_PATH
if (!executablePath) {
  for (const candidate of [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]) {
    try {
      await access(candidate)
      executablePath = candidate
      break
    } catch {
      continue
    }
  }
}
if (!executablePath) {
  server.close()
  throw new Error('Set CH_CONTEXT_CHROME_PATH to an installed Chromium browser')
}
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 1100 },
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: 'load' })
  await page.locator('.ch-session').first().waitFor()
  await page.waitForFunction(
    () => document.querySelector('.ch-occupancy-number strong')?.textContent === '38.2%',
  )
  assert.equal(await page.locator('.ch-session').count(), 2)
  assert.equal(await page.locator('.ch-error').count(), 0)
  await page.evaluate(() => window.chFixture.updateContext(102400))
  await page.waitForFunction(
    () => document.querySelector('.ch-occupancy-number strong')?.textContent === '51.2%',
  )
  assert.equal(await page.locator('.ch-chart .ch-chart-line').count(), 1)
  await page
    .locator('.ch-record')
    .filter({ has: page.locator('.ch-record-badge') })
    .first()
    .locator('summary')
    .click()
  await page
    .getByText('Text shortened to 8,000 characters in this view.', { exact: true })
    .waitFor()
  await page.getByRole('button', { name: 'Load older records', exact: true }).click()
  await page
    .locator('.ch-record-title')
    .filter({ hasText: 'Explain the context and tool activity in this conversation.' })
    .waitFor()
  await page.getByRole('button', { name: 'Tools', exact: true }).click()
  assert.equal(await page.locator('.ch-record').count(), 2)
  await page.locator('.ch-record summary').last().click()
  await page
    .getByText('The Host supplied a preview; the complete tool output is not included.', {
      exact: true,
    })
    .waitFor()
  assert.equal(await page.evaluate(() => window.injected), undefined)
  const pageRequest = await page.evaluate(() =>
    window.chFixture.requests.filter((request) => request.path.endsWith('session/page')).at(-1),
  )
  assert.equal(pageRequest.args.throughSeq, 10)
  assert.equal(pageRequest.args.beforeSeq, 6)
  await page.getByRole('button', { name: 'Copy usage JSON', exact: true }).click()
  await page.getByRole('button', { name: 'Copied', exact: true }).waitFor()
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  assert.equal(JSON.parse(copied).usage.contextUsedTokens, 102400)
  await page.locator('.ch-session').nth(1).click()
  await page
    .getByText('This Harness has not reported usage for this conversation yet.', { exact: true })
    .waitFor()
  assert.equal(await page.locator('.ch-occupancy-number strong').textContent(), '—')
  await page.locator('.ch-session').first().click()
  await page.waitForFunction(
    () => document.querySelector('.ch-occupancy-number strong')?.textContent === '51.2%',
  )
  for (const locale of ['en', 'zh']) {
    await page.evaluate((value) => window.chFixture.setLocale(value), locale)
    for (const dark of [false, true]) {
      await page.evaluate(
        (value) => document.body.toggleAttribute('data-ds-dark-theme', value),
        dark,
      )
      for (const width of [375, 768, 1280, 1920]) {
        await page.setViewportSize({ width, height: 1100 })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(180)
        const overflow = await page
          .locator('.ch-context')
          .evaluate((element) => ({ scroll: element.scrollWidth, client: element.clientWidth }))
        assert.ok(
          overflow.scroll <= overflow.client + 1,
          `Horizontal overflow: ${locale}/${dark}/${width}: ${JSON.stringify(overflow)}`,
        )
        await page.screenshot({
          path: `${directory}/${locale}-${dark ? 'dark' : 'light'}-${width}.png`,
        })
        if (auditSource) audits.push({ locale, dark, width, ...(await page.evaluate(auditSource)) })
      }
    }
  }
  await page.evaluate(() => {
    window.chFixture.setLocale('en')
    window.chFixture.mount('conversation.view')
  })
  await page.waitForFunction(
    () => document.querySelector('.ch-occupancy-number strong')?.textContent === '51.2%',
  )
  assert.equal(await page.locator('.ch-session-picker').count(), 0)
  const beforeUsageReads = await page.evaluate(
    () => window.chFixture.requests.filter((request) => request.path.endsWith('ch/v1/rpc')).length,
  )
  await page.evaluate(() => window.chFixture.updateContext(120000))
  await page.waitForFunction(
    () => document.querySelector('.ch-occupancy-number strong')?.textContent === '60.0%',
  )
  assert.equal(
    await page.evaluate(
      () =>
        window.chFixture.requests.filter((request) => request.path.endsWith('ch/v1/rpc')).length,
    ),
    beforeUsageReads,
  )
  assert.ok((await page.evaluate(() => window.chFixture.eventCancelled)) >= 1)
  for (const [used, fail] of [
    [140000, false],
    [160000, true],
  ]) {
    await page.evaluate(() => window.chFixture.delayNextUsage())
    await page.getByRole('button', { name: 'Refresh', exact: true }).click()
    await page.waitForFunction(() => window.chFixture.hasPendingUsage)
    await page.evaluate((value) => window.chFixture.updateContext(value), used)
    await page.waitForFunction(
      (value) =>
        document.querySelector('.ch-occupancy-number strong')?.textContent ===
        `${((value / 200000) * 100).toFixed(1)}%`,
      used,
    )
    await page.evaluate((value) => window.chFixture.releaseUsage(value), fail)
    await page.waitForTimeout(100)
    assert.equal(
      await page.locator('.ch-occupancy-number strong').textContent(),
      `${((used / 200000) * 100).toFixed(1)}%`,
    )
    assert.equal(await page.locator('.ch-error').count(), 0)
  }
  await page.evaluate(() =>
    window.chFixture.setUsage({
      contextUsagePercent: 125,
      totalCredits: 0.125,
      timeToFirstOutputMs: 0,
    }),
  )
  await page.waitForFunction(
    () => document.querySelector('.ch-occupancy-number strong')?.textContent === '125.0%',
  )
  assert.equal(await page.locator('.ch-context-values .ch-metric dd').first().textContent(), '—')
  assert.equal(
    await page
      .locator('.ch-metric')
      .filter({ has: page.getByText('AI credits', { exact: true }) })
      .locator('dd')
      .textContent(),
    '0.125',
  )
  assert.equal(
    await page
      .locator('.ch-metric')
      .filter({ has: page.getByText('Time to first output', { exact: true }) })
      .locator('dd')
      .textContent(),
    '0ms',
  )
  await page.evaluate(() => {
    window.chFixture.setDraft()
    window.chFixture.mount('main')
  })
  await page.getByText('Choose a conversation', { exact: true }).waitFor()
  const badRequests = await page.evaluate(() =>
    window.chFixture.requests.filter((request) =>
      JSON.stringify(request.args).includes('draft:pending'),
    ),
  )
  assert.deepEqual(badRequests, [])
  await page.evaluate(() => window.chFixture.unmount())
  assert.equal(await page.locator('style[data-plugin="ch-context"]').count(), 0)
  assert.deepEqual(errors, [])
  if (audits.length) {
    await writeFile(`${directory}/audit.json`, JSON.stringify(audits, null, 2))
    console.log(
      JSON.stringify(
        audits.map(({ locale, dark, width, errors, warnings }) => ({
          locale,
          dark,
          width,
          errors,
          warnings,
        })),
      ),
    )
    assert.ok(
      audits.every((audit) => audit.errors === 0),
      'Visual audit contains errors; inspect .tmp/browser/audit.json',
    )
  }
  console.log(
    'Browser checks passed: packaged ModuleLoader entry, session selection, live invalidation, native projection updates, snapshot race protection, fractional credits, percentage-only occupancy, per-record completeness labels, history continuation/filter, text escaping, clipboard, draft guard, unmount cleanup, and 16 locale/theme/width screenshots.',
  )
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
}
