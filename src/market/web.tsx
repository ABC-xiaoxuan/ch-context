import { useEffect, useId, useRef, useSyncExternalStore, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { App, type DensityMode, type FontPreset, type PaletteTheme } from '../codexhost/App.tsx'
import { acquireBundledFonts } from '../codexhost/fonts.ts'
import type { ViewContext } from '../codexhost/hooks.ts'
import type { JsonObject, WebExtensionApi } from './types.ts'

type Language = 'auto' | 'en' | 'zh'
type Locale = 'en' | 'zh-CN'
type StorageStatus = 'loading' | 'ready' | 'saving' | 'saved' | 'unavailable'
type StatusScope = 'language' | 'appearance'

interface PreferencesSnapshot {
  language: Language
  active: Locale
  palette: PaletteTheme
  density: DensityMode
  font: FontPreset
  status: StorageStatus
  statusScope: StatusScope
}

interface PreferencesStore {
  getSnapshot(): PreferencesSnapshot
  subscribe(listener: () => void): () => void
  select(language: Language): Promise<void>
  selectPalette(palette: PaletteTheme): Promise<void>
  selectDensity(density: DensityMode): Promise<void>
  selectFont(font: FontPreset): Promise<void>
  dispose(): void
}

const title = { en: 'Context Insights', 'zh-CN': '上下文洞察' }
const noop = (): void => undefined

function automaticLocale(): Locale {
  const documentLanguage = typeof document === 'undefined' ? '' : document.documentElement.lang
  const browserLanguage = typeof navigator === 'undefined' ? '' : navigator.language
  return /^zh(?:[-_]|$)/i.test(documentLanguage.trim() || browserLanguage || 'en') ? 'zh-CN' : 'en'
}

function languageOf(values: JsonObject): Language {
  return values.language === 'en' || values.language === 'zh' ? values.language : 'auto'
}

function paletteOf(values: JsonObject): PaletteTheme {
  return values.palette === 'paper' || values.palette === 'slate' ? values.palette : 'graphite'
}

function densityOf(values: JsonObject): DensityMode {
  return values.density === 'compact' ? 'compact' : 'comfortable'
}

function fontOf(values: JsonObject): FontPreset {
  return values.font === 'mono-metrics' || values.font === 'system' ? values.font : 'modern'
}

function createPreferencesStore(api: WebExtensionApi): PreferencesStore {
  let disposed = false
  let revision = 0
  let dirty: JsonObject = {}
  let snapshot: PreferencesSnapshot = {
    language: 'auto',
    active: automaticLocale(),
    palette: 'graphite',
    density: 'comfortable',
    font: 'modern',
    status: 'loading',
    statusScope: 'language',
  }
  const listeners = new Set<() => void>()
  const active = (): boolean => !disposed && !api.signal.aborted
  const update = (
    language: Language,
    palette: PaletteTheme,
    density: DensityMode,
    font: FontPreset,
    status: StorageStatus,
    statusScope: StatusScope = snapshot.statusScope,
  ): void => {
    if (!active()) return
    const locale = language === 'auto' ? automaticLocale() : language === 'zh' ? 'zh-CN' : 'en'
    if (
      snapshot.language === language &&
      snapshot.active === locale &&
      snapshot.palette === palette &&
      snapshot.density === density &&
      snapshot.font === font &&
      snapshot.status === status &&
      snapshot.statusScope === statusScope
    )
      return
    snapshot = { language, active: locale, palette, density, font, status, statusScope }
    for (const listener of listeners) listener()
  }
  const refreshAutomaticLocale = (): void => {
    if (snapshot.language === 'auto')
      update(
        'auto',
        snapshot.palette,
        snapshot.density,
        snapshot.font,
        snapshot.status,
        snapshot.statusScope,
      )
  }
  let stopStorage = noop
  try {
    stopStorage = api.storage.onChange((values) => {
      if (!active()) return
      revision += 1
      if (snapshot.status !== 'saving') {
        dirty = {}
        update(
          languageOf(values),
          paletteOf(values),
          densityOf(values),
          fontOf(values),
          'ready',
          'language',
        )
      }
    })
  } catch {
    update(
      snapshot.language,
      snapshot.palette,
      snapshot.density,
      snapshot.font,
      'unavailable',
      'language',
    )
  }
  const initialRevision = revision
  void (async () => {
    try {
      const values = await api.storage.get()
      if (revision === initialRevision)
        update(
          languageOf(values),
          paletteOf(values),
          densityOf(values),
          fontOf(values),
          'ready',
          'language',
        )
    } catch {
      if (revision === initialRevision)
        update(
          snapshot.language,
          snapshot.palette,
          snapshot.density,
          snapshot.font,
          'unavailable',
          'language',
        )
    }
  })()
  const observer =
    typeof MutationObserver !== 'undefined' && typeof document !== 'undefined'
      ? new MutationObserver(refreshAutomaticLocale)
      : undefined
  observer?.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
  if (typeof window !== 'undefined')
    window.addEventListener('languagechange', refreshAutomaticLocale)
  const persist = async (
    nextLanguage: Language,
    nextPalette: PaletteTheme,
    nextDensity: DensityMode,
    nextFont: FontPreset,
    patch: JsonObject,
    scope: StatusScope,
  ): Promise<void> => {
    if (!active() || snapshot.status === 'loading' || snapshot.status === 'saving') return
    revision += 1
    const pendingPatch: JsonObject = { ...dirty, ...patch }
    update(nextLanguage, nextPalette, nextDensity, nextFont, 'saving', scope)
    try {
      const values = await api.storage.get()
      if (!active()) return
      const merged: JsonObject = { ...values, ...pendingPatch }
      await api.storage.set(merged)
      dirty = {}
      update(
        languageOf(merged),
        paletteOf(merged),
        densityOf(merged),
        fontOf(merged),
        'saved',
        scope,
      )
    } catch {
      dirty = pendingPatch
      update(nextLanguage, nextPalette, nextDensity, nextFont, 'unavailable', scope)
    }
  }
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (!active()) return noop
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    select: (language) =>
      persist(language, snapshot.palette, snapshot.density, snapshot.font, { language }, 'language'),
    selectPalette: (palette) =>
      persist(snapshot.language, palette, snapshot.density, snapshot.font, { palette }, 'appearance'),
    selectDensity: (density) =>
      persist(snapshot.language, snapshot.palette, density, snapshot.font, { density }, 'appearance'),
    selectFont: (font) =>
      persist(snapshot.language, snapshot.palette, snapshot.density, font, { font }, 'appearance'),
    dispose() {
      if (disposed) return
      disposed = true
      observer?.disconnect()
      if (typeof window !== 'undefined')
        window.removeEventListener('languagechange', refreshAutomaticLocale)
      listeners.clear()
      stopStorage()
    },
  }
}

const settingsText = {
  en: {
    heading: 'Context Insights settings',
    language: 'Interface language',
    automatic: 'Automatic',
    automaticNote:
      'Automatic uses the document language, then the browser language. The native Web extension API does not expose the CodexHost interface language.',
    appearance: 'Appearance & density',
    palette: 'Palette',
    paletteGraphite: 'Apple Graphite',
    palettePaper: 'Warm Paper',
    paletteSlate: 'Precision Slate',
    density: 'Layout density',
    densityComfortable: 'Standard',
    densityCompact: 'Compact',
    font: 'Typography',
    fontModern: 'Modern Sans (Inter)',
    fontMonoMetrics: 'Mono Metrics',
    fontSystem: 'System',
    appearanceNote:
      'Applies only inside the Context Insights shadow panel and does not modify the CodexHost interface theme.',
    appearanceSaving: 'Saving appearance preference…',
    appearanceSaved: 'Appearance preference saved.',
    appearanceUnavailable:
      'Appearance applies for this activation. Settings could not be saved; choose an option again to retry.',
    loading: 'Loading language preference…',
    ready: 'Language changes apply to open Context Insights panels.',
    saving: 'Saving language preference…',
    saved: 'Language preference saved.',
    unavailable:
      'Language applies for this activation. Settings could not be loaded or saved; choose a language again to retry.',
    about: 'About',
    aboutNote:
      'Choose a conversation in the main panel to inspect the usage snapshots and history available from CodexHost. Current context occupancy and cumulative billed tokens are separate; unavailable values remain unknown.',
    privacy: 'Read-only inspection and privacy',
    privacyNote:
      'Conversation data is read through the authenticated, same-origin CodexHost client channel. This extension does not change conversations, send their data to an external service, or start a backend process. Only extension UI preferences are saved in extension settings.',
    attribution:
      'ch-context is an independent adaptation of bowenliang123/dsh-context under Apache-2.0. It is not an official CodexHost or DeepSeek product.',
  },
  zh: {
    heading: '上下文洞察设置',
    language: '界面语言',
    automatic: '自动',
    automaticNote:
      '自动模式优先使用文档语言，其次使用浏览器语言。原生 Web 扩展 API 未提供 CodexHost 界面语言。',
    appearance: '外观与密度',
    palette: '配色方案',
    paletteGraphite: '苹果素灰',
    palettePaper: '纸感暖灰',
    paletteSlate: '冷静石板',
    density: '界面密度',
    densityComfortable: '标准',
    densityCompact: '紧凑',
    font: '字体风格',
    fontModern: '现代清透 (Inter)',
    fontMonoMetrics: '等宽数值',
    fontSystem: '跟随系统',
    appearanceNote: '仅作用于上下文洞察扩展的独立 Shadow DOM 面板，不会修改 CodexHost 宿主主题。',
    appearanceSaving: '正在保存外观偏好…',
    appearanceSaved: '外观偏好已保存。',
    appearanceUnavailable: '外观已在本次启用期间生效。设置保存失败；请重新选择以重试。',
    loading: '正在加载语言偏好…',
    ready: '语言更改会立即应用于已打开的上下文洞察面板。',
    saving: '正在保存语言偏好…',
    saved: '语言偏好已保存。',
    unavailable: '语言已在本次启用期间生效。设置加载或保存失败；请重新选择语言以重试。',
    about: '关于',
    aboutNote:
      '在主面板中选择会话，查看 CodexHost 提供的用量快照和历史记录。当前上下文占用与累计计费用量分别展示；不可用的数据保持未知。',
    privacy: '只读查看与隐私',
    privacyNote:
      '会话数据通过经过身份验证的同源 CodexHost 客户端通道读取。本扩展不会修改会话、向外部服务发送会话数据或启动后台进程。扩展设置仅保存界面偏好。',
    attribution:
      'ch-context 基于 bowenliang123/dsh-context 独立改编，遵循 Apache-2.0 许可，并非 CodexHost 或 DeepSeek 官方产品。',
  },
}

function LanguageSelect({ store }: { store: PreferencesStore }): ReactElement {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const t = settingsText[snapshot.active === 'zh-CN' ? 'zh' : 'en']
  return (
    <select
      className="ch-market-language-select"
      aria-label={t.language}
      value={snapshot.language}
      disabled={snapshot.status === 'loading' || snapshot.status === 'saving'}
      onChange={(event) => {
        void store.select(event.currentTarget.value as Language)
      }}
    >
      <option value="auto">{snapshot.active === 'zh-CN' ? '自动' : 'Auto'}</option>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  )
}

function PanelHost({
  ctx,
  store,
}: {
  ctx: ViewContext
  store: PreferencesStore
}): ReactElement {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  return (
    <App
      ctx={ctx}
      palette={snapshot.palette}
      density={snapshot.density}
      font={snapshot.font}
      headerActions={<LanguageSelect store={store} />}
    />
  )
}

function Settings({ store }: { store: PreferencesStore }): ReactElement {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => acquireBundledFonts(rootRef.current?.ownerDocument), [])
  const t = settingsText[snapshot.active === 'zh-CN' ? 'zh' : 'en']
  const descriptionId = useId()
  const busy = snapshot.status === 'loading' || snapshot.status === 'saving'
  return (
    <div
      ref={rootRef}
      className="ch-context"
      lang={snapshot.active}
      data-ch-palette={snapshot.palette}
      data-ch-density={snapshot.density}
      data-ch-font={snapshot.font}
    >
      <div className="ch-shell" style={{ maxWidth: '76ch' }}>
        <header className="ch-page-heading">
          <div className="ch-heading-title">
            <h1>{t.heading}</h1>
          </div>
        </header>
        <section className="ch-card" aria-label={t.language}>
          <div className="ch-card-heading">
            <h2>{t.language}</h2>
          </div>
          <div
            role="group"
            aria-label={t.language}
            aria-describedby={descriptionId}
            className="ch-picker-header"
          >
            {(['auto', 'en', 'zh'] as const).map((language) => (
              <button
                key={language}
                type="button"
                className="ch-button"
                aria-pressed={snapshot.language === language}
                disabled={busy}
                style={{
                  minHeight: 44,
                  borderColor: snapshot.language === language ? 'var(--ch-accent)' : undefined,
                }}
                onClick={() => {
                  void store.select(language)
                }}
              >
                {language === 'auto' ? t.automatic : language === 'en' ? 'English' : '中文'}
              </button>
            ))}
          </div>
          <p id={descriptionId}>{t.automaticNote}</p>
          <p role="status" aria-live="polite" className="ch-note" style={{ marginTop: 8 }}>
            {snapshot.statusScope === 'language' ? t[snapshot.status] : t.ready}
          </p>
        </section>
        <section className="ch-card" aria-label={t.appearance}>
          <div className="ch-card-heading">
            <h2>{t.appearance}</h2>
          </div>
          <div className="ch-pref-row">
            <span className="ch-pref-label">{t.palette}</span>
            <div role="group" aria-label={t.palette} className="ch-picker-header">
              {(
                [
                  ['graphite', t.paletteGraphite],
                  ['paper', t.palettePaper],
                  ['slate', t.paletteSlate],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="ch-button"
                  aria-pressed={snapshot.palette === key}
                  disabled={busy}
                  style={{
                    minHeight: 38,
                    borderColor: snapshot.palette === key ? 'var(--ch-accent)' : undefined,
                  }}
                  onClick={() => {
                    void store.selectPalette(key)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="ch-pref-row">
            <span className="ch-pref-label">{t.density}</span>
            <div role="group" aria-label={t.density} className="ch-picker-header">
              {(
                [
                  ['comfortable', t.densityComfortable],
                  ['compact', t.densityCompact],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="ch-button"
                  aria-pressed={snapshot.density === key}
                  disabled={busy}
                  style={{
                    minHeight: 38,
                    borderColor: snapshot.density === key ? 'var(--ch-accent)' : undefined,
                  }}
                  onClick={() => {
                    void store.selectDensity(key)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="ch-pref-row">
            <span className="ch-pref-label">{t.font}</span>
            <div role="group" aria-label={t.font} className="ch-picker-header">
              {(
                [
                  ['modern', t.fontModern],
                  ['mono-metrics', t.fontMonoMetrics],
                  ['system', t.fontSystem],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="ch-button"
                  aria-pressed={snapshot.font === key}
                  disabled={busy}
                  style={{
                    minHeight: 38,
                    borderColor: snapshot.font === key ? 'var(--ch-accent)' : undefined,
                  }}
                  onClick={() => {
                    void store.selectFont(key)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="ch-note">{t.appearanceNote}</p>
          {snapshot.statusScope === 'appearance' &&
            (snapshot.status === 'saving' ||
              snapshot.status === 'saved' ||
              snapshot.status === 'unavailable') && (
              <p role="status" aria-live="polite" className="ch-note">
                {snapshot.status === 'saving'
                  ? t.appearanceSaving
                  : snapshot.status === 'saved'
                    ? t.appearanceSaved
                    : t.appearanceUnavailable}
              </p>
            )}
        </section>
        <section className="ch-card" aria-label={t.about}>
          <div className="ch-card-heading">
            <h2>{t.about}</h2>
          </div>
          <p>{t.aboutNote}</p>
        </section>
        <section className="ch-card" aria-label={t.privacy}>
          <div className="ch-card-heading">
            <h2>{t.privacy}</h2>
          </div>
          <p>{t.privacyNote}</p>
        </section>
        <footer className="ch-footer">{t.attribution}</footer>
      </div>
    </div>
  )
}

export function activate(api: WebExtensionApi): () => void {
  if (api.signal.aborted) return noop
  let disposed = false
  const cleanups = new Set<() => void>()
  const mounts = new Map<HTMLElement, () => void>()
  const own = (cleanup: () => void): void => {
    if (disposed) cleanup()
    else cleanups.add(cleanup)
  }
  const dispose = (): void => {
    if (disposed) return
    disposed = true
    api.signal.removeEventListener('abort', dispose)
    for (const cleanup of [...cleanups].reverse()) {
      try {
        cleanup()
      } catch {}
    }
    cleanups.clear()
    mounts.clear()
  }
  api.signal.addEventListener('abort', dispose, { once: true })
  if (api.signal.aborted) {
    dispose()
    return dispose
  }
  try {
    const store = createPreferencesStore(api)
    own(store.dispose)
    const viewCtx: ViewContext = {
      get: () => undefined,
      locale: {
        getLocale: () => ({ active: store.getSnapshot().active }),
        subscribe: store.subscribe,
      },
    }
    const mount = (
      container: HTMLElement,
      signal: AbortSignal,
      element: ReactElement,
    ): (() => void) => {
      if (disposed || api.signal.aborted || signal.aborted) return noop
      mounts.get(container)?.()
      if (disposed || api.signal.aborted || signal.aborted) return noop
      const document = container.ownerDocument
      const host = document.createElement('div')
      host.dataset.chContextHost = ''
      host.style.height = '100%'
      host.style.minHeight = '0'
      host.style.width = '100%'
      const shadow = host.attachShadow({ mode: 'open' })
      const stylesheet = document.createElement('link')
      stylesheet.rel = 'stylesheet'
      stylesheet.href = api.assets.url('web/style.css')
      const inner = document.createElement('div')
      inner.style.height = '100%'
      inner.style.minHeight = '0'
      shadow.append(stylesheet, inner)
      if (disposed || api.signal.aborted || signal.aborted) return noop
      const root = createRoot(inner)
      let unmounted = false
      const mirrorTheme = (): void => {
        if (!unmounted)
          host.toggleAttribute(
            'data-ds-dark-theme',
            document.body?.hasAttribute('data-ds-dark-theme') ?? false,
          )
      }
      const observer = new MutationObserver(mirrorTheme)
      const unmount = (): void => {
        if (unmounted) return
        unmounted = true
        signal.removeEventListener('abort', unmount)
        observer.disconnect()
        if (mounts.get(container) === unmount) mounts.delete(container)
        cleanups.delete(unmount)
        try {
          root.unmount()
        } finally {
          host.remove()
        }
      }
      mounts.set(container, unmount)
      own(unmount)
      signal.addEventListener('abort', unmount, { once: true })
      try {
        if (disposed || api.signal.aborted || signal.aborted) unmount()
        else {
          mirrorTheme()
          if (document.body)
            observer.observe(document.body, {
              attributes: true,
              attributeFilter: ['data-ds-dark-theme'],
            })
          container.append(host)
          if (disposed || api.signal.aborted || signal.aborted) unmount()
          else root.render(element)
        }
      } catch (error) {
        unmount()
        throw error
      }
      return unmount
    }
    if (!disposed)
      own(
        api.panels.register({
          id: 'insights',
          title,
          placement: 'main',
          render: (container, signal) =>
            mount(container, signal, <PanelHost ctx={viewCtx} store={store} />),
        }),
      )
    if (!disposed)
      own(
        api.settings.registerPage({
          id: 'settings',
          title,
          render: (container, signal) => mount(container, signal, <Settings store={store} />),
        }),
      )
    if (!disposed) api.track(dispose)
    return dispose
  } catch (error) {
    dispose()
    throw error
  }
}
