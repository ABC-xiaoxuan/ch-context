import { useId, useSyncExternalStore, type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '../codexhost/App.tsx'
import type { ViewContext } from '../codexhost/hooks.ts'
import type { JsonObject, WebExtensionApi } from './types.ts'

type Language = 'auto' | 'en' | 'zh'
type Locale = 'en' | 'zh-CN'
type StorageStatus = 'loading' | 'ready' | 'saving' | 'saved' | 'unavailable'

interface LanguageSnapshot {
  language: Language
  active: Locale
  status: StorageStatus
}

interface LanguageStore {
  getSnapshot(): LanguageSnapshot
  subscribe(listener: () => void): () => void
  select(language: Language): Promise<void>
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

function createLanguageStore(api: WebExtensionApi): LanguageStore {
  let disposed = false
  let revision = 0
  let snapshot: LanguageSnapshot = {
    language: 'auto',
    active: automaticLocale(),
    status: 'loading',
  }
  const listeners = new Set<() => void>()
  const active = (): boolean => !disposed && !api.signal.aborted
  const update = (language: Language, status: StorageStatus): void => {
    if (!active()) return
    const locale = language === 'auto' ? automaticLocale() : language === 'zh' ? 'zh-CN' : 'en'
    if (snapshot.language === language && snapshot.active === locale && snapshot.status === status)
      return
    snapshot = { language, active: locale, status }
    for (const listener of listeners) listener()
  }
  const refreshAutomaticLocale = (): void => {
    if (snapshot.language === 'auto') update('auto', snapshot.status)
  }
  let stopStorage = noop
  try {
    stopStorage = api.storage.onChange((values) => {
      if (!active()) return
      revision += 1
      if (snapshot.status !== 'saving') update(languageOf(values), 'ready')
    })
  } catch {
    update(snapshot.language, 'unavailable')
  }
  const initialRevision = revision
  void (async () => {
    try {
      const values = await api.storage.get()
      if (revision === initialRevision) update(languageOf(values), 'ready')
    } catch {
      if (revision === initialRevision) update(snapshot.language, 'unavailable')
    }
  })()
  const observer =
    typeof MutationObserver !== 'undefined' && typeof document !== 'undefined'
      ? new MutationObserver(refreshAutomaticLocale)
      : undefined
  observer?.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
  if (typeof window !== 'undefined')
    window.addEventListener('languagechange', refreshAutomaticLocale)
  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      if (!active()) return noop
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    async select(language) {
      if (!active() || snapshot.status === 'loading' || snapshot.status === 'saving') return
      revision += 1
      update(language, 'saving')
      try {
        const values = await api.storage.get()
        if (!active()) return
        await api.storage.set({ ...values, language })
        update(language, 'saved')
      } catch {
        update(language, 'unavailable')
      }
    },
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
      'Conversation data is read through the authenticated, same-origin CodexHost client channel. This extension does not change conversations, send their data to an external service, or start a backend process. Only the language preference is saved in extension settings.',
    attribution:
      'ch-context is an independent adaptation of bowenliang123/dsh-context under Apache-2.0. It is not an official CodexHost or DeepSeek product.',
  },
  zh: {
    heading: '上下文洞察设置',
    language: '界面语言',
    automatic: '自动',
    automaticNote:
      '自动模式优先使用文档语言，其次使用浏览器语言。原生 Web 扩展 API 未提供 CodexHost 界面语言。',
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
      '会话数据通过经过身份验证的同源 CodexHost 客户端通道读取。本扩展不会修改会话、向外部服务发送会话数据或启动后台进程。扩展设置仅保存语言偏好。',
    attribution:
      'ch-context 基于 bowenliang123/dsh-context 独立改编，遵循 Apache-2.0 许可，并非 CodexHost 或 DeepSeek 官方产品。',
  },
}

function LanguageSelect({ store }: { store: LanguageStore }): ReactElement {
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

function Settings({ store }: { store: LanguageStore }): ReactElement {
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)
  const t = settingsText[snapshot.active === 'zh-CN' ? 'zh' : 'en']
  const descriptionId = useId()
  return (
    <div className="ch-context" lang={snapshot.active}>
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
                disabled={snapshot.status === 'loading' || snapshot.status === 'saving'}
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
            {t[snapshot.status]}
          </p>
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
    const store = createLanguageStore(api)
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
            mount(
              container,
              signal,
              <App ctx={viewCtx} headerActions={<LanguageSelect store={store} />} />,
            ),
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
