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
    if (file === '/fixture.js' || file === '/lib/client.js')
      response
        .writeHead(200, { 'content-type': 'application/javascript' })
        .end(await readFile(file === '/fixture.js' ? `${directory}/fixture.js` : 'lib/client.js'))
    else response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html)
  } catch {
    response.writeHead(500).end()
  }
})
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const address = server.address()
if (!address || typeof address === 'string') throw new Error('Fixture server did not start')
let executablePath = process.env.CH_CONTEXT_CHROME_PATH
if (!executablePath)
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
if (!executablePath) {
  server.close()
  throw new Error('Set CH_CONTEXT_CHROME_PATH to an installed Chromium browser')
}
const browser = await chromium.launch({ executablePath, headless: true })
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await context.newPage()
  page.setDefaultTimeout(10000)
  const errors = []
  const externalRequests = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('request', (request) => {
    if (new URL(request.url()).hostname !== '127.0.0.1') externalRequests.push(request.url())
  })
  const openChooser = async () => {
    const chooser = page.locator('details.ch-session-picker')
    if (!(await chooser.evaluate((element) => element.open)))
      await chooser.locator(':scope > summary').click()
  }
  const gauge = async (expected) =>
    page.waitForFunction(
      (value) => document.querySelector('.ch-occupancy-number strong')?.textContent === value,
      expected,
      { timeout: 10000 },
    )
  const record = async (seq) =>
    page.waitForFunction(
      (value) =>
        document.querySelector('.ch-record-detail .ch-record-meta span')?.textContent ===
        `#${value}`,
      seq,
      { timeout: 10000 },
    )
  await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: 'load' })
  await openChooser()
  await page.locator('.ch-session').first().waitFor()
  assert.equal(await page.locator('.ch-session').count(), 3)
  await page.locator('.ch-session').first().click()
  await gauge('38.2%')
  console.log('Browser: fixture ready')
  await record(9)
  assert.equal(await page.locator('.ch-error').count(), 0)
  await page
    .getByText('Text shortened to 8,000 characters in this view.', { exact: true })
    .waitFor()
  await page.evaluate(() => window.chFixture.updateContext(102400))
  await gauge('51.2%')
  assert.equal(await page.locator('.ch-chart-line').count(), 1)
  await page.getByRole('button', { name: 'Load older records', exact: true }).click()
  await page
    .locator('.ch-record-title')
    .filter({ hasText: 'Explain the context and tool activity in this conversation.' })
    .waitFor()
  await page
    .locator('.ch-browser-card .ch-filter')
    .getByRole('button', { name: 'Tools', exact: true })
    .click()
  await record(3)
  assert.equal(await page.locator('.ch-record-item').count(), 2)
  await page
    .getByText('The Host supplied a preview; the complete tool output is not included.', {
      exact: true,
    })
    .waitFor()
  await page.getByRole('button', { name: 'Rendered', exact: true }).click()
  assert.equal(await page.evaluate(() => window.injected), undefined)
  assert.equal(await page.locator('.ch-record-content img').count(), 0)
  const firstPage = await page.evaluate(() =>
    window.chFixture.requests.filter((request) => request.path.endsWith('session/page')).at(-1),
  )
  assert.equal(firstPage.args.throughSeq, 10)
  assert.equal(firstPage.args.beforeSeq, 6)
  await page.evaluate(() => window.chFixture.failNextHistoryRead())
  await page.getByRole('button', { name: 'Refresh', exact: true }).click()
  await page.locator('.ch-browser-card [role="alert"]').waitFor()
  const failedWindow = await page.evaluate(() =>
    window.chFixture.requests.filter((request) => request.path.endsWith('session/page')).at(-1),
  )
  assert.equal(failedWindow.args.beforeSeq, 6)
  assert.equal(failedWindow.args.throughSeq, 10)
  await page.locator('.ch-browser-card').getByRole('button', { name: 'Retry', exact: true }).click()
  await page.waitForFunction(
    () =>
      document.querySelector('.ch-browser-records')?.getAttribute('aria-busy') === 'false' &&
      !document.querySelector('.ch-browser-card [role="alert"]'),
  )
  const retriedWindow = await page.evaluate(() =>
    window.chFixture.requests.filter((request) => request.path.endsWith('session/page')).at(-1),
  )
  assert.equal(retriedWindow.args.beforeSeq, 6)
  assert.equal(retriedWindow.args.throughSeq, 10)
  await page.getByRole('button', { name: 'Copy usage JSON', exact: true }).click()
  await page.getByRole('button', { name: 'Copied', exact: true }).waitFor()
  assert.equal(
    JSON.parse(await page.evaluate(() => navigator.clipboard.readText())).usage.contextUsedTokens,
    102400,
  )
  await openChooser()
  await page.locator('.ch-session').nth(1).click()
  await page
    .getByText('This Harness has not reported usage for this conversation yet.', { exact: true })
    .waitFor()
  await openChooser()
  await page.locator('.ch-session').first().click()
  await record(9)
  await page.getByRole('button', { name: 'Load older records', exact: true }).click()
  await record(4)
  const slider = page.getByRole('slider', { name: 'Browse event sequence' })
  await slider.focus()
  await slider.press('Home')
  for (let index = 0; index < 3; index++) await slider.press('ArrowRight')
  await record(4)
  await page.getByRole('heading', { name: 'Context review', exact: true }).waitFor()
  assert.equal(await page.locator('.ch-record-content table').count(), 1)
  assert.equal(await page.locator('.ch-record-content .ch-code-block').count(), 1)
  assert.equal(await page.locator('.ch-record-content img').count(), 0)
  await page.getByRole('button', { name: 'Next record', exact: true }).click()
  await record(5)
  await page.getByRole('button', { name: 'Previous record', exact: true }).click()
  await record(4)
  await page
    .getByRole('textbox', { name: 'Search this history window', exact: true })
    .fill('window.injected')
  await record(3)
  assert.equal(await page.locator('.ch-record-item').count(), 1)
  await page.getByRole('textbox', { name: 'Search this history window', exact: true }).fill('')
  await page.locator('.ch-file-row').first().click()
  await record(2)
  assert.match(await page.locator('.ch-source-text').textContent(), /src\/context.ts/)
  const readsBefore = await page.evaluate(
    () =>
      window.chFixture.requests.filter((request) => request.path.endsWith('session/page')).length,
  )
  await page.evaluate(() => window.chFixture.updateContext(104000))
  await gauge('52.0%')
  await page.waitForTimeout(500)
  assert.equal(
    await page.evaluate(
      () =>
        window.chFixture.requests.filter((request) => request.path.endsWith('session/page')).length,
    ),
    readsBefore,
  )
  await page.evaluate(() => window.chFixture.appendActivity())
  await page.getByRole('button', { name: 'Latest history', exact: true }).click()
  await record(13)
  assert.equal(await page.locator('.ch-file-row').count(), 1)
  await page.getByRole('tab', { name: /Shell commands/ }).click()
  assert.equal(await page.locator('.ch-command-row').count(), 1)
  await page.locator('.ch-command-main').first().click()
  await record(7)
  await page.locator('.ch-command-result').first().click()
  await record(8)
  assert.equal(
    await page.locator('.ch-source-text').textContent(),
    ' {"id":9007199254740993,"dup":1,"dup":2} ',
  )
  await page.locator('.ch-record-detail').getByRole('button', { name: 'Copy', exact: true }).click()
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    ' {"id":9007199254740993,"dup":1,"dup":2} ',
  )
  await page
    .locator('.ch-browser-card .ch-filter')
    .getByRole('button', { name: 'Messages', exact: true })
    .click()
  await record(13)
  await page.evaluate(() => window.chFixture.setChildHistoryFailure(true))
  await page.getByRole('tab', { name: /Conversation relationships/ }).click()
  await page.locator('.ch-family-row').first().click()
  await page
    .getByText('This Harness has not reported usage for this conversation yet.', { exact: true })
    .waitFor()
  await page.locator('.ch-browser-card [role="alert"]').waitFor()
  assert.match(await page.locator('.ch-browser-card .ch-scope').textContent(), /—/)
  assert.equal(
    await page.getByText('No records in this history window.', { exact: true }).count(),
    0,
  )
  await page.evaluate(() => window.chFixture.setChildHistoryFailure(false))
  await page.locator('.ch-browser-card').getByRole('button', { name: 'Retry', exact: true }).click()
  await page.waitForFunction(
    () => document.querySelector('.ch-browser-card [role="alert"]') === null,
  )
  await page.getByRole('tab', { name: /Conversation relationships/ }).click()
  await page.locator('.ch-family-row').first().click()
  await gauge('52.0%')
  await record(13)
  await openChooser()
  await page.locator('.ch-session').nth(1).click()
  await page
    .getByText('This Harness has not reported usage for this conversation yet.', { exact: true })
    .waitFor()
  await openChooser()
  await page.locator('.ch-session').first().click()
  await gauge('52.0%')
  await record(13)
  await page.evaluate(() => {
    window.chFixture.freezeClock(true)
    window.chFixture.appendLiveReply()
    window.chFixture.updateContext(105000)
  })
  await gauge('52.5%')
  await page
    .locator('.ch-record-title')
    .filter({ hasText: 'Live incremental update from the observed history.' })
    .waitFor()
  await record(13)
  await page.evaluate(() => {
    window.chFixture.appendClockReply()
    window.chFixture.updateContext(106000)
  })
  await gauge('53.0%')
  await page
    .locator('.ch-record-title')
    .filter({ hasText: 'Frozen-clock history update.' })
    .waitFor()
  await page.evaluate(() => window.chFixture.freezeClock(false))
  await page
    .locator('.ch-browser-card .ch-filter')
    .getByRole('button', { name: 'Tools', exact: true })
    .click()
  await record(15)
  await page.locator('.ch-record-detail .ch-error-badge').waitFor()
  await page.getByText('The Host marked this tool result as an error.', { exact: true }).waitFor()
  await page
    .locator('.ch-browser-card .ch-filter')
    .getByRole('button', { name: 'Messages', exact: true })
    .click()
  await page.locator('.ch-record-item').filter({ hasText: 'Context review' }).click()
  await record(13)
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
  await page.setViewportSize({ width: 1440, height: 1100 })
  console.log('Browser: responsive captures complete')
  await page.evaluate(() => {
    window.chFixture.setLocale('zh')
    document.body.removeAttribute('data-ds-dark-theme')
    const root = document.querySelector('.ch-context')
    root.style.height = 'auto'
    root.style.overflow = 'visible'
    document.documentElement.style.height = 'auto'
    document.body.style.height = 'auto'
    document.getElementById('app').style.height = 'auto'
  })
  await page.getByRole('heading', { name: '上下文浏览器', exact: true }).waitFor()
  await page.waitForTimeout(180)
  await page.screenshot({ path: `${directory}/zh-light-full.png`, fullPage: true })
  console.log('Browser: full preview complete')
  await page.evaluate(() => {
    for (const element of [
      document.documentElement,
      document.body,
      document.getElementById('app'),
      document.querySelector('.ch-context'),
    ])
      element.style.height = '100%'
    document.querySelector('.ch-context').style.overflow = 'auto'
  })
  await page.evaluate(() => {
    const app = document.getElementById('app')
    const frame = document.createElement('div')
    frame.setAttribute('data-conversation-scroll', '')
    frame.style.height = '100%'
    app.before(frame)
    frame.append(app)
    const composer = document.createElement('div')
    composer.id = 'fixture-composer'
    composer.setAttribute('data-composer-seat', '')
    composer.textContent = 'Composer fixture'
    frame.append(composer)
    window.chFixture.setLocale('en')
    window.chFixture.mount('conversation.view')
  })
  await gauge('53.0%')
  assert.equal(await page.locator('.ch-session-picker').count(), 0)
  console.log('Browser: native slot mounted')
  assert.equal(
    await page
      .locator('#fixture-composer')
      .evaluate((element) => getComputedStyle(element).display),
    'none',
  )
  await page.evaluate(() => {
    const approval = document.createElement('div')
    approval.id = 'fixture-approval'
    approval.setAttribute('data-approval-key', 'pending')
    document.getElementById('fixture-composer').append(approval)
  })
  assert.notEqual(
    await page
      .locator('#fixture-composer')
      .evaluate((element) => getComputedStyle(element).display),
    'none',
  )
  await page.locator('#fixture-approval').evaluate((element) => element.remove())
  const beforeUsage = await page.evaluate(
    () => window.chFixture.requests.filter((request) => request.path.endsWith('ch/v1/rpc')).length,
  )
  await page.evaluate(() => window.chFixture.updateContext(120000))
  await gauge('60.0%')
  assert.equal(
    await page.evaluate(
      () =>
        window.chFixture.requests.filter((request) => request.path.endsWith('ch/v1/rpc')).length,
    ),
    beforeUsage,
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
    await gauge(`${((used / 200000) * 100).toFixed(1)}%`)
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
  await gauge('125.0%')
  assert.match(await page.locator('.ch-context-values').textContent(), /—/)
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
  for (const cacheRead of [60, 0]) {
    await page.evaluate(
      (value) =>
        window.chFixture.setUsage({
          contextUsagePercent: 125,
          inputTokens: 100,
          outputTokens: 20,
          cachedInputTokens: value,
        }),
      cacheRead,
    )
    await page.waitForFunction(
      (value) =>
        Array.from(document.querySelectorAll('.ch-independent-cache .ch-metric'))
          .find((element) => element.querySelector('dt')?.textContent === 'Cache read')
          ?.querySelector('dd')?.textContent === String(value),
      cacheRead,
    )
    assert.equal(
      await page
        .locator('.ch-independent-cache .ch-metric')
        .filter({ has: page.getByText('Cache write', { exact: true }) })
        .locator('dd')
        .textContent(),
      '—',
    )
  }
  await page.getByRole('tab', { name: /Conversation relationships/ }).click()
  await page.locator('.ch-family-row').first().click()
  await page
    .getByText('This Harness has not reported usage for this conversation yet.', { exact: true })
    .waitFor()
  assert.equal(
    await page.evaluate(() => window.chFixture.openedSessions.at(-1)),
    '33333333-3333-4333-8333-333333333333',
  )
  await page.getByRole('tab', { name: /Conversation relationships/ }).click()
  await page.locator('.ch-family-row').first().click()
  await gauge('125.0%')
  await page.evaluate(() => window.chFixture.denseHistory())
  await page.waitForFunction(
    () => document.querySelector('.ch-sequence-slider')?.getAttribute('max') === '199',
  )
  const plot = page.locator('.ch-activity-chart svg')
  await plot.scrollIntoViewIfNeeded()
  const bounds = await plot.boundingBox()
  assert.ok(bounds)
  await plot.click({ position: { x: (bounds.width * 8) / 720, y: (bounds.height * 26) / 120 } })
  await record(6)
  await page.mouse.move(
    bounds.x + (bounds.width * 712) / 720,
    bounds.y + (bounds.height * 51) / 120,
  )
  await page.waitForFunction(
    () => document.querySelector('.ch-sequence-preview b')?.getAttribute('data-seq') === '205',
  )
  await record(6)
  await plot.click({ position: { x: (bounds.width * 712) / 720, y: (bounds.height * 51) / 120 } })
  await record(205)
  await page.evaluate(() => {
    window.chFixture.setDraft()
    window.chFixture.mount('main')
  })
  await page.getByRole('heading', { name: 'Choose a conversation', exact: true }).waitFor()
  assert.equal(await page.locator('.ch-overview-card').count(), 3)
  assert.equal(await page.locator('[data-conversation-scroll][data-ch-context-surface]').count(), 0)
  assert.notEqual(
    await page
      .locator('#fixture-composer')
      .evaluate((element) => getComputedStyle(element).display),
    'none',
  )
  assert.deepEqual(
    await page.evaluate(() =>
      window.chFixture.requests.filter((request) =>
        JSON.stringify(request.args).includes('draft:pending'),
      ),
    ),
    [],
  )
  await page.evaluate(() => window.chFixture.unmount())
  console.log('Browser: native guards and cleanup complete')
  assert.equal(await page.locator('style[data-plugin="ch-context"]').count(), 0)
  assert.deepEqual(errors, [])
  assert.deepEqual(externalRequests, [])
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
    'Browser checks passed: linked timeline/browser, categories/search, rich text/XSS and remote-image isolation, file and command navigation, relationships, live latest-history updates with stable older pages, native projections/race guards, clipboard, draft/unmount cleanup and 16 responsive theme/locale captures.',
  )
} finally {
  await browser.close()
  await new Promise((resolve) => server.close(resolve))
}
