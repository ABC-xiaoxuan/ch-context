import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { Icon } from './components.tsx'
import { Inspector } from './Inspector.tsx'
import {
  useCurrentSession,
  useHistory,
  useLocale,
  useSessions,
  useUsage,
  type ViewContext,
} from './hooks.ts'
import { isThreadId, recordOf } from './model.ts'
import { translator } from './i18n.ts'
import { useConversationSurface } from './conversation-surface.ts'

export interface AppProps {
  ctx: ViewContext
  sessionId?: string
  projection?: unknown
  embedded?: boolean
  headerActions?: ReactNode
}

export function App({
  ctx,
  sessionId,
  projection,
  embedded = false,
  headerActions,
}: AppProps): ReactElement {
  const surface = useRef<HTMLDivElement>(null)
  useConversationSurface(surface, embedded)
  const locale = useLocale(ctx)
  const t = useMemo(() => translator(locale), [locale])
  const current = useCurrentSession(ctx)
  const [picked, setPicked] = useState<string | undefined>()
  const [chooserOpen, setChooserOpen] = useState(false)
  const candidate = sessionId ?? picked ?? current
  const selected = isThreadId(candidate) ? candidate : undefined
  const [revision, setRevision] = useState(0)
  const [cursors, setCursors] = useState<(string | null)[]>([null])
  const [pageIndex, setPageIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const list = useSessions(cursors[pageIndex] ?? null, revision)
  const usage = useUsage(selected, projection, revision)
  const history = useHistory(selected, revision, usage.snapshotSequence || null)
  const row = list.page?.items.find((item) => item.id === selected)
  const filtered = (list.page?.items ?? []).filter(
    (item) =>
      isThreadId(item.id) &&
      `${item.title} ${item.harness ?? ''} ${item.cwd ?? ''}`
        .toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()),
  )
  useEffect(() => {
    setCopied('idle')
  }, [selected])
  const refresh = (): void => setRevision((value) => value + 1)
  const select = (id: string): void => {
    if (embedded) {
      const workspace = recordOf(ctx.get('uiWorkspace'))
      if (typeof workspace?.openSession === 'function') workspace.openSession(id)
      return
    }
    setPicked(id)
    setChooserOpen(false)
  }
  const copy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(
          { threadId: selected, observedAt: usage.updatedAt, usage: usage.usage },
          null,
          2,
        ),
      )
      setCopied('done')
    } catch {
      setCopied('failed')
    }
  }
  return (
    <div
      ref={surface}
      className={`ch-context ${embedded ? 'ch-embedded' : ''}`}
      lang={locale.startsWith('zh') ? 'zh-CN' : 'en'}
    >
      <div className="ch-shell">
        <header className={`ch-page-heading ${embedded ? 'ch-heading-embedded' : ''}`}>
          <div className="ch-heading-title">
            <div className="ch-brand">
              <Icon size={14} />
              <span>CH CONTEXT</span>
              <a
                className="ch-version"
                href="https://github.com/ABC-xiaoxuan/ch-context"
                target="_blank"
                rel="noopener noreferrer"
              >
                {__CH_CONTEXT_VERSION__}
              </a>
            </div>
            {!embedded && <h1>{t('title')}</h1>}
          </div>
          <div className="ch-heading-actions">
            {headerActions}
            <span className={`ch-status ${usage.connected ? '' : 'is-offline'}`}>
              <i />
              {t(usage.connected ? 'live' : 'disconnected')}
            </span>
            {selected && (
              <button
                className="ch-mini-button"
                disabled={!usage.usage}
                onClick={() => {
                  void copy()
                }}
              >
                {t(copied === 'done' ? 'copied' : copied === 'failed' ? 'copyFailed' : 'copy')}
              </button>
            )}
            <button className="ch-button" disabled={usage.loading} onClick={refresh}>
              {t(usage.loading ? 'loading' : 'refresh')}
            </button>
          </div>
        </header>
        {!embedded && (
          <details
            className="ch-session-picker"
            open={chooserOpen || !selected}
            onToggle={(event) => setChooserOpen(event.currentTarget.open)}
          >
            <summary>
              <span>{t('sessions')}</span>
              <strong>{row?.title || (selected ? t('following') : t('noSession'))}</strong>
              <span className="ch-session-harness">{row?.harness ?? 'CodexHost'}</span>
              <small>{t('changeConversation')}</small>
            </summary>
            <div className="ch-session-picker-body">
              <div className="ch-picker-header">
                <label className="ch-search">
                  <span aria-hidden="true">⌕</span>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('search')}
                    aria-label={t('search')}
                  />
                </label>
                {isThreadId(current) && (
                  <button
                    className="ch-mini-button"
                    onClick={() => {
                      setPicked(undefined)
                      setChooserOpen(false)
                    }}
                  >
                    {t('following')}
                  </button>
                )}
              </div>
              {list.error ? (
                <div className="ch-error" role="alert">
                  {t('listError')}
                  <span>{list.error}</span>
                  <button className="ch-mini-button" onClick={refresh}>
                    {t('retry')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="ch-session-list" role="list">
                    {list.loading ? (
                      <div className="ch-skeleton ch-session-skeleton" aria-label={t('loading')} />
                    ) : filtered.length === 0 ? (
                      <p className="ch-note">{t('emptyList')}</p>
                    ) : (
                      filtered.map((item) => (
                        <div key={item.id} role="listitem">
                          <button
                            className={`ch-session ${selected === item.id ? 'is-selected' : ''}`}
                            aria-pressed={selected === item.id}
                            title={item.title}
                            onClick={() => select(item.id)}
                          >
                            <span className="ch-session-marker" />
                            <span className="ch-session-title">
                              {item.title || item.id}
                              <small title={item.cwd}>
                                {item.harness ?? 'CodexHost'}
                                {item.cwd
                                  ? ` · ${item.cwd.split(/[\\/]/).filter(Boolean).at(-1)}`
                                  : ''}
                              </small>
                            </span>
                            <span aria-hidden="true">↗</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="ch-pagination">
                    <small>{t('loadedSearch')}</small>
                    <div>
                      <button
                        className="ch-mini-button"
                        disabled={pageIndex === 0 || list.loading}
                        onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
                      >
                        {t('previous')}
                      </button>
                      <span>
                        {t('page')} {pageIndex + 1}
                      </span>
                      <button
                        className="ch-mini-button"
                        disabled={!list.page?.nextCursor || list.loading}
                        onClick={() => {
                          const next = list.page?.nextCursor
                          if (!next) return
                          setCursors((values) => [...values.slice(0, pageIndex + 1), next])
                          setPageIndex((value) => value + 1)
                        }}
                      >
                        {t('next')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </details>
        )}
        {!selected ? (
          <div className="ch-empty">
            <Icon size={32} />
            <h2>{t('noSession')}</h2>
            <p>{t('choose')}</p>
          </div>
        ) : (
          <>
            {!embedded && !row?.title && (
              <div className="ch-selected-header">
                <span className="ch-eyebrow">{row?.harness ?? 'CodexHost'}</span>
                <h2 title={row?.title ?? selected}>{row?.title ?? selected}</h2>
              </div>
            )}
            {usage.error && (
              <div className="ch-error" role="alert">
                {t('usageError')}
                <span>{usage.error}</span>
                <button className="ch-mini-button" onClick={refresh}>
                  {t('retry')}
                </button>
              </div>
            )}
            {!usage.usage && !usage.error && !usage.loading && (
              <p className="ch-note ch-availability">{t('noUsage')}</p>
            )}
            <Inspector
              key={selected}
              usage={usage}
              history={history}
              rows={list.page?.items ?? []}
              selected={selected}
              onSelect={select}
              retry={refresh}
              t={t}
            />
          </>
        )}
        <footer className="ch-footer">
          <span>ch-context · {t('readOnly')}</span>
          <span>{t('localOnly')}</span>
        </footer>
      </div>
    </div>
  )
}
