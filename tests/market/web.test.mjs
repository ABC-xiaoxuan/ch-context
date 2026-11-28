import assert from 'node:assert/strict'
import { access, readFile, mkdir } from 'node:fs/promises'
import { createServer } from 'node:http'
import test from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright-core'

async function browserPath() {
  if (process.env.CH_CONTEXT_CHROME_PATH) return process.env.CH_CONTEXT_CHROME_PATH
  for (const path of [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ]) {
    try {
      await access(path)
      return path
    } catch {}
  }
}

test('native market Web entry', async (t) => {
  const executablePath = await browserPath()
  if (!executablePath) {
    t.skip('Set CH_CONTEXT_CHROME_PATH to an installed Chromium browser')
    return
  }
  const bundle = await build({
    entryPoints: ['src/market/web.tsx'],
    bundle: true,
    write: false,
    platform: 'browser',
    format: 'iife',
    globalName: 'MarketEntry',
    jsx: 'automatic',
    loader: { '.woff2': 'binary' },
    define: { 'process.env.NODE_ENV': '"production"', __CH_CONTEXT_VERSION__: '"fixture"' },
  })
  const css = (await readFile('src/codexhost/styles.css', 'utf8')).replaceAll(
    'body[data-ds-dark-theme]',
    ':host([data-ds-dark-theme])',
  )
  const html =
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Native market entry fixture</title><style>html,body{margin:0;background:Canvas;color:CanvasText}body{color-scheme:light}body[data-ds-dark-theme]{color-scheme:dark}#panel,#settings{height:100vh}#panel:empty,#settings:empty{display:none}</style></head><body><div id="panel"></div><div id="settings"></div><script src="/entry.js"></script></body></html>'
  const server = createServer((request, response) => {
    if (request.url === '/entry.js')
      response
        .writeHead(200, { 'content-type': 'application/javascript' })
        .end(bundle.outputFiles[0].text)
    else if (request.url === '/web/style.css')
      response.writeHead(200, { 'content-type': 'text/css' }).end(css)
    else response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html)
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  let browser
  try {
    browser = await chromium.launch({ executablePath, headless: true })
    const address = server.address()
    const browserErrors = []
    const open = async () => {
      const page = await browser.newPage()
      page.on('pageerror', (error) => browserErrors.push(error.message))
      page.on('console', (message) => {
        if (message.type() === 'error') browserErrors.push(message.text())
      })
      await page.route('**/api/ch/v1/**', (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: '{"items":[]}' }),
      )
      await page.goto(`http://127.0.0.1:${address.port}/`)
      await page.evaluate(() => {
        window.fixture = (values = {}) => {
          const controller = new AbortController()
          const panels = []
          const settings = []
          const tracked = []
          const listeners = new Set()
          const state = {
            values,
            reads: 0,
            writes: [],
            unregistered: 0,
            unsubscribed: 0,
            get: undefined,
            set: undefined,
          }
          const api = {
            signal: controller.signal,
            assets: { url: (path) => `/${path}` },
            track: (cleanup) => tracked.push(cleanup),
            panels: {
              register: (panel) => {
                panels.push(panel)
                return () => {
                  state.unregistered += 1
                }
              },
            },
            settings: {
              registerPage: (page) => {
                settings.push(page)
                return () => {
                  state.unregistered += 1
                }
              },
            },
            storage: {
              get: async () => {
                state.reads += 1
                return state.get ? state.get() : state.values
              },
              set: async (next) => {
                if (state.set) await state.set(next)
                state.writes.push(next)
                state.values = next
                for (const listener of listeners) listener(next)
                return next
              },
              onChange: (listener) => {
                listeners.add(listener)
                return () => {
                  listeners.delete(listener)
                  state.unsubscribed += 1
                }
              },
            },
          }
          return { api, controller, panels, settings, tracked, listeners, state }
        }
        window.start = (values) => {
          const fixture = window.fixture(values)
          window.current = fixture
          fixture.stop = window.MarketEntry.activate(fixture.api)
          return fixture
        }
        window.surface = (id) => document.querySelector(`${id} [data-ch-context-host]`)?.shadowRoot
        window.mountSettings = () => {
          const fixture = window.current
          fixture.renderSignal = new AbortController()
          fixture.unmount = fixture.settings[0].render(
            document.querySelector('#settings'),
            fixture.renderSignal.signal,
          )
        }
      })
      return page
    }
    await t.test('already aborted activation has no registrations or storage access', async () => {
      const page = await open()
      try {
        const result = await page.evaluate(() => {
          const fixture = window.fixture()
          fixture.controller.abort()
          const stop = window.MarketEntry.activate(fixture.api)
          stop()
          stop()
          return {
            panels: fixture.panels.length,
            settings: fixture.settings.length,
            reads: fixture.state.reads,
            listeners: fixture.listeners.size,
          }
        })
        assert.deepEqual(result, { panels: 0, settings: 0, reads: 0, listeners: 0 })
      } finally {
        await page.close()
      }
    })
    await t.test(
      'owned shadow roots isolate styles, mirror theme and preserve native children',
      async () => {
        const page = await open()
        try {
          await page.evaluate(() => {
            const legacyStyle = document.createElement('style')
            legacyStyle.textContent = '.ch-context { font-size: 60px !important; }'
            document.head.append(legacyStyle)
            const nativeChild = document.createElement('span')
            nativeChild.id = 'native-child'
            nativeChild.className = 'ch-context'
            nativeChild.textContent = 'Native child'
            document.querySelector('#settings').append(nativeChild)
            window.start({ language: 'en' })
            window.mountSettings()
          })
          await page.locator('#settings h1').waitFor()
          await page.waitForFunction(
            () => window.surface('#settings').querySelector('link').sheet !== null,
          )
          const result = await page.evaluate(async () => {
            const host = document.querySelector('#settings [data-ch-context-host]')
            const shadow = host.shadowRoot
            const root = shadow.querySelector('div')
            const fontSize = getComputedStyle(shadow.querySelector('.ch-context')).fontSize
            document.body.setAttribute('data-ds-dark-theme', '')
            await Promise.resolve()
            const dark = host.hasAttribute('data-ds-dark-theme')
            window.current.unmount()
            document.body.removeAttribute('data-ds-dark-theme')
            await Promise.resolve()
            return {
              stylesheet: shadow.querySelector('link').getAttribute('href'),
              hostHeight: host.style.height,
              innerHeight: root.style.height,
              fontSize,
              dark,
              detachedThemeUnchanged: host.hasAttribute('data-ds-dark-theme'),
              remaining: document.querySelector('#settings').innerHTML,
              globalLinks: document.head.querySelectorAll('link[rel="stylesheet"]').length,
            }
          })
          assert.deepEqual(result, {
            stylesheet: '/web/style.css',
            hostHeight: '100%',
            innerHeight: '100%',
            fontSize: '12.5px',
            dark: true,
            detachedThemeUnchanged: true,
            remaining: '<span id="native-child" class="ch-context">Native child</span>',
            globalLinks: 0,
          })
        } finally {
          await page.close()
        }
      },
    )
    await t.test(
      'public registrations and locale changes update mounted App and preserve settings',
      async () => {
        const page = await open()
        try {
          await page.evaluate(() => {
            const fixture = window.start({ language: 'en', unrelated: { keep: true } })
            fixture.panelSignal = new AbortController()
            fixture.panels[0].render(document.querySelector('#panel'), fixture.panelSignal.signal)
            window.mountSettings()
          })
          await page.locator('#settings button', { hasText: '中文' }).click()
          await page.waitForFunction(
            () => window.surface('#panel')?.querySelector('.ch-context')?.lang === 'zh-CN',
          )
          await page.getByText('语言偏好已保存。', { exact: true }).waitFor()
          const result = await page.evaluate(() => ({
            id: window.current.panels[0].id,
            title: window.current.panels[0].title,
            placement: window.current.panels[0].placement,
            writes: window.current.state.writes,
            styles: document.head.querySelectorAll('style').length,
          }))
          assert.deepEqual(result, {
            id: 'insights',
            title: { en: 'Context Insights', 'zh-CN': '上下文洞察' },
            placement: 'main',
            writes: [{ language: 'zh', unrelated: { keep: true } }],
            styles: 1,
          })
        } finally {
          await page.close()
        }
      },
    )
    await t.test(
      'main panel language selector shares settings and disables during loading and saving',
      async () => {
        const page = await open()
        try {
          await page.evaluate(() => {
            const fixture = window.fixture({ unrelated: { keep: true } })
            window.current = fixture
            fixture.state.get = () => new Promise((resolve) => (fixture.resolveRead = resolve))
            fixture.stop = window.MarketEntry.activate(fixture.api)
            fixture.panels[0].render(document.querySelector('#panel'), new AbortController().signal)
            window.mountSettings()
          })
          const select = page.locator('#panel .ch-market-language-select')
          await select.waitFor()
          assert.equal(await select.isDisabled(), true)
          assert.equal(await select.getAttribute('aria-label'), 'Interface language')
          await page.evaluate(() => {
            const fixture = window.current
            fixture.state.get = undefined
            fixture.resolveRead({ language: 'en' })
            fixture.state.set = () => new Promise((resolve) => (fixture.resolveSave = resolve))
          })
          await select.selectOption('zh')
          await page.waitForFunction(
            () => window.surface('#panel').querySelector('select').disabled,
          )
          assert.equal(await select.getAttribute('aria-label'), '界面语言')
          assert.equal(
            await page
              .locator('#settings')
              .getByRole('button', { name: '中文', exact: true })
              .getAttribute('aria-pressed'),
            'true',
          )
          await page.evaluate(() => {
            const fixture = window.current
            fixture.resolveSave()
            fixture.state.set = undefined
          })
          await page.getByText('语言偏好已保存。', { exact: true }).waitFor()
          await select.selectOption('auto')
          await page.getByText('Language preference saved.', { exact: true }).waitFor()
          assert.equal(await select.inputValue(), 'auto')
          assert.equal(await select.getAttribute('aria-label'), 'Interface language')
          assert.deepEqual(await page.evaluate(() => window.current.state.writes), [
            { unrelated: { keep: true }, language: 'zh' },
            { unrelated: { keep: true }, language: 'auto' },
          ])
          assert.equal(await page.evaluate(() => document.documentElement.lang), 'en')
        } finally {
          await page.close()
        }
      },
    )
    await t.test('new settings notifications win over a stale initial storage read', async () => {
      const page = await open()
      try {
        await page.evaluate(() => {
          const fixture = window.fixture()
          window.current = fixture
          fixture.state.get = () => new Promise((resolve) => (fixture.resolveRead = resolve))
          fixture.stop = window.MarketEntry.activate(fixture.api)
          window.mountSettings()
          for (const listener of fixture.listeners) listener({ language: 'zh' })
          fixture.resolveRead({ language: 'en' })
        })
        await page.waitForFunction(
          () => window.surface('#settings')?.querySelector('.ch-context')?.lang === 'zh-CN',
        )
        assert.equal(
          await page
            .getByRole('button', { name: '中文', exact: true })
            .getAttribute('aria-pressed'),
          'true',
        )
      } finally {
        await page.close()
      }
    })
    await t.test('render abort, remount and activation cleanup are idempotent', async () => {
      const page = await open()
      try {
        await page.evaluate(() => {
          window.start({ language: 'en' })
          window.mountSettings()
        })
        await page.locator('#settings h1').waitFor()
        await page.evaluate(() => {
          const fixture = window.current
          fixture.renderSignal.abort()
          fixture.unmount()
          fixture.unmount()
        })
        assert.equal(await page.locator('#settings').innerHTML(), '')
        await page.evaluate(() => {
          const fixture = window.current
          const signal = new AbortController()
          signal.abort()
          fixture.settings[0].render(document.querySelector('#settings'), signal.signal)()
          window.mountSettings()
          fixture.settings[0].render(
            document.querySelector('#settings'),
            fixture.renderSignal.signal,
          )
        })
        await page.locator('#settings h1').waitFor()
        const result = await page.evaluate(() => {
          const fixture = window.current
          fixture.controller.abort()
          fixture.stop()
          fixture.tracked[0]()
          fixture.unmount()
          return {
            unregistered: fixture.state.unregistered,
            unsubscribed: fixture.state.unsubscribed,
            listeners: fixture.listeners.size,
            html: document.querySelector('#settings').innerHTML,
          }
        })
        assert.deepEqual(result, { unregistered: 2, unsubscribed: 1, listeners: 0, html: '' })
      } finally {
        await page.close()
      }
    })
    await t.test(
      'storage failures keep the chosen language usable and retry preserves fields',
      async () => {
        const page = await open()
        try {
          await page.evaluate(() => {
            const fixture = window.fixture({ extra: ['retained'] })
            fixture.state.get = () => Promise.reject(new Error('unavailable'))
            window.current = fixture
            fixture.stop = window.MarketEntry.activate(fixture.api)
            window.mountSettings()
          })
          await page.locator('#settings button', { hasText: '中文' }).click()
          await page.waitForFunction(
            () => window.surface('#settings')?.querySelector('.ch-context')?.lang === 'zh-CN',
          )
          await page.getByRole('status').filter({ hasText: '失败' }).waitFor()
          assert.equal(await page.evaluate(() => window.current.state.writes.length), 0)
          await page.evaluate(() => {
            window.current.state.get = undefined
            window.current.state.set = () => Promise.reject(new Error('save unavailable'))
          })
          await page.getByRole('button', { name: 'English', exact: true }).click()
          await page.getByRole('status').filter({ hasText: 'could not' }).waitFor()
          await page.evaluate(() => (window.current.state.set = undefined))
          await page.getByRole('button', { name: 'English', exact: true }).click()
          await page.getByText('Language preference saved.', { exact: true }).waitFor()
          assert.deepEqual(await page.evaluate(() => window.current.state.writes), [
            { extra: ['retained'], language: 'en' },
          ])
        } finally {
          await page.close()
        }
      },
    )
    await t.test('disable during a pending language save prevents the later write', async () => {
      const page = await open()
      try {
        await page.evaluate(() => {
          window.start({ language: 'en' })
          window.mountSettings()
        })
        await page.getByRole('button', { name: '中文', exact: true }).waitFor()
        await page.waitForFunction(
          () => !window.surface('#settings').querySelector('button').disabled,
        )
        await page.evaluate(() => {
          const fixture = window.current
          fixture.state.get = () => new Promise((resolve) => (fixture.resolveRead = resolve))
        })
        await page.getByRole('button', { name: '中文', exact: true }).click()
        await page.evaluate(async () => {
          const fixture = window.current
          fixture.controller.abort()
          fixture.resolveRead({ language: 'en', retained: 7 })
          await Promise.resolve()
          await Promise.resolve()
        })
        assert.equal(await page.evaluate(() => window.current.state.writes.length), 0)
        assert.equal(await page.locator('#settings').innerHTML(), '')
      } finally {
        await page.close()
      }
    })
    await t.test(
      'a render closed before settings load stays unmounted when the read resolves',
      async () => {
        const page = await open()
        try {
          await page.evaluate(() => {
            const fixture = window.fixture()
            window.current = fixture
            fixture.state.get = () => new Promise((resolve) => (fixture.resolveRead = resolve))
            fixture.stop = window.MarketEntry.activate(fixture.api)
            window.mountSettings()
          })
          await page.locator('#settings h1').waitFor()
          await page.evaluate(async () => {
            const fixture = window.current
            fixture.renderSignal.abort()
            fixture.resolveRead({ language: 'zh' })
            await Promise.resolve()
            await Promise.resolve()
          })
          assert.equal(await page.locator('#settings').innerHTML(), '')
          await page.evaluate(() => window.mountSettings())
          await page.getByRole('heading', { name: '上下文洞察设置', exact: true }).waitFor()
        } finally {
          await page.close()
        }
      },
    )
    await t.test(
      'failed settings registration rolls back the panel and subscriptions',
      async () => {
        const page = await open()
        try {
          const result = await page.evaluate(() => {
            const fixture = window.fixture()
            fixture.api.settings.registerPage = () => {
              throw new Error('registration unavailable')
            }
            let error
            try {
              window.MarketEntry.activate(fixture.api)
            } catch (failure) {
              error = failure.message
            }
            return {
              error,
              unregistered: fixture.state.unregistered,
              unsubscribed: fixture.state.unsubscribed,
              listeners: fixture.listeners.size,
            }
          })
          assert.deepEqual(result, {
            error: 'registration unavailable',
            unregistered: 1,
            unsubscribed: 1,
            listeners: 0,
          })
        } finally {
          await page.close()
        }
      },
    )
    await t.test('abort during registration cleans a late returned registration', async () => {
      const page = await open()
      try {
        const result = await page.evaluate(() => {
          const fixture = window.fixture()
          fixture.api.panels.register = () => {
            fixture.controller.abort()
            return () => {
              fixture.state.unregistered += 1
            }
          }
          window.MarketEntry.activate(fixture.api)()
          return {
            settings: fixture.settings.length,
            unregistered: fixture.state.unregistered,
            unsubscribed: fixture.state.unsubscribed,
            listeners: fixture.listeners.size,
          }
        })
        assert.deepEqual(result, { settings: 0, unregistered: 1, unsubscribed: 1, listeners: 0 })
      } finally {
        await page.close()
      }
    })
    await t.test(
      'automatic locale and settings layout work at narrow and wide widths in both themes',
      async () => {
        const page = await open()
        try {
          await page.evaluate(() => {
            document.documentElement.lang = ''
            Object.defineProperty(navigator, 'language', { configurable: true, value: 'zh-CN' })
            window.start()
            window.mountSettings()
          })
          await page.waitForFunction(
            () => window.surface('#settings')?.querySelector('.ch-context')?.lang === 'zh-CN',
          )
          await mkdir('.tmp/market-adapter-tests', { recursive: true })
          for (const theme of ['light', 'dark']) {
            await page.evaluate((theme) => {
              document.body.toggleAttribute('data-ds-dark-theme', theme === 'dark')
            }, theme)
            await page.waitForFunction(
              (dark) =>
                document
                  .querySelector('#settings [data-ch-context-host]')
                  .hasAttribute('data-ds-dark-theme') === dark,
              theme === 'dark',
            )
            for (const width of [375, 768, 1280, 1920]) {
              await page.setViewportSize({ width, height: 900 })
              const sizes = await page.evaluate(() => ({
                width: document.documentElement.clientWidth,
                content: document.documentElement.scrollWidth,
              }))
              assert.ok(sizes.content <= sizes.width, `${theme} ${width}: horizontal overflow`)
              await page.screenshot({ path: `.tmp/market-adapter-tests/${theme}-${width}.png` })
            }
          }
          await page.evaluate(() => (document.documentElement.lang = 'en'))
          await page
            .getByRole('heading', { name: 'Context Insights settings', exact: true })
            .waitFor()
          await page.evaluate(() => {
            window.current.controller.abort()
            document.documentElement.lang = 'zh-CN'
            window.dispatchEvent(new Event('languagechange'))
          })
          assert.equal(await page.locator('#settings').innerHTML(), '')
        } finally {
          await page.close()
        }
      },
    )
    await t.test('palette and density preferences sync across settings and main panel', async () => {
      const page = await open()
      try {
        await page.evaluate(() => {
          const fixture = window.start({ language: 'en', unrelated: { keep: true } })
          fixture.panelSignal = new AbortController()
          fixture.panels[0].render(document.querySelector('#panel'), fixture.panelSignal.signal)
          window.mountSettings()
        })
        await page
          .locator('#settings')
          .getByRole('button', { name: 'Warm Paper', exact: true })
          .waitFor()
        await page.locator('#settings').getByRole('button', { name: 'Warm Paper', exact: true }).click()
        await page.waitForFunction(
          () =>
            window.surface('#panel')?.querySelector('.ch-context')?.dataset.chPalette === 'paper',
        )
        await page.locator('#settings').getByRole('button', { name: 'Compact', exact: true }).click()
        await page.waitForFunction(
          () =>
            window.surface('#panel')?.querySelector('.ch-context')?.dataset.chDensity === 'compact',
        )
        await page
          .locator('#settings')
          .getByRole('button', { name: 'Mono Metrics', exact: true })
          .click()
        await page.waitForFunction(
          () =>
            window.surface('#panel')?.querySelector('.ch-context')?.dataset.chFont ===
            'mono-metrics',
        )
        const stored = await page.evaluate(() => window.current.state.writes.at(-1))
        assert.deepEqual(stored, {
          language: 'en',
          unrelated: { keep: true },
          palette: 'paper',
          density: 'compact',
          font: 'mono-metrics',
        })
      } finally {
        await page.close()
      }
    })
    assert.deepEqual(browserErrors, [])
  } finally {
    await browser?.close()
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
})
