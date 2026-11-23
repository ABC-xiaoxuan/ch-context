import { useEffect, useMemo, useState, type ReactElement } from 'react'
import {
  Card,
  ContextCard,
  HistoryRows,
  Icon,
  PerformanceCard,
  TimelineCard,
  UsageCard,
} from './components.tsx'
import {
  useCurrentSession,
  useHistory,
  useLocale,
  useSessions,
  useUsage,
  type ClientContext,
} from './hooks.ts'
import { isThreadId } from './model.ts'
import { translator } from './i18n.ts'

export interface AppProps {
  ctx: ClientContext
  sessionId?: string
  projection?: unknown
  embedded?: boolean
}

export function App({ ctx, sessionId, projection, embedded = false }: AppProps): ReactElement {
  const locale = useLocale(ctx)
  const t = useMemo(() => translator(locale), [locale])
  const current = useCurrentSession(ctx)
  const [picked, setPicked] = useState<string | undefined>()
  const candidate = sessionId ?? picked ?? current
  const selected = isThreadId(candidate) ? candidate : undefined
  const [revision, setRevision] = useState(0)
  const [cursors, setCursors] = useState<(string | null)[]>([null])
  const [pageIndex, setPageIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const list = useSessions(cursors[pageIndex] ?? null, revision)
  const usage = useUsage(selected, projection, revision)
  const history = useHistory(selected, revision)
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
      className={`ch-context ${embedded ? 'ch-embedded' : ''}`}
      lang={locale.startsWith('zh') ? 'zh-CN' : 'en'}
    >
      <div className="ch-shell">
        <header className="ch-page-heading">
          <div>
            <div className="ch-brand">
              <Icon size={16} />
              <span>CH CONTEXT</span>
              <span className="ch-version">{__CH_CONTEXT_VERSION__}</span>
            </div>
            <h1>{t('title')}</h1>
            <p>{t('subtitle')}</p>
          </div>
          <div className="ch-heading-actions">
            <span className={`ch-status ${usage.connected ? '' : 'is-offline'}`}>
              <i />
              {t(usage.connected ? 'live' : 'disconnected')}
            </span>
            <button
              className="ch-button"
              onClick={refresh}
              disabled={usage.loading || list.loading}
            >
              {t(usage.loading ? 'loading' : 'refresh')}
            </button>
          </div>
        </header>
        {!embedded && (
          <section className="ch-session-picker" aria-label={t('sessions')}>
            <div className="ch-picker-header">
              <h2>{t('sessions')}</h2>
              <label className="ch-search">
                <span aria-hidden="true">⌕</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('search')}
                  aria-label={t('search')}
                />
              </label>
              {current && (
                <button className="ch-button ch-button-subtle" onClick={() => setPicked(undefined)}>
                  {t('following')}
                </button>
              )}
            </div>
            {list.error ? (
              <div className="ch-error" role="alert">
                {t('listError')} <span>{list.error}</span>
                <button className="ch-button" onClick={refresh}>
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
                          onClick={() => setPicked(item.id)}
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
                      className="ch-button ch-button-subtle"
                      disabled={pageIndex === 0 || list.loading}
                      onClick={() => setPageIndex((value) => Math.max(0, value - 1))}
                    >
                      {t('previous')}
                    </button>
                    <span>
                      {t('page')} {pageIndex + 1}
                    </span>
                    <button
                      className="ch-button ch-button-subtle"
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
          </section>
        )}
        {!selected ? (
          <div className="ch-empty">
            <Icon size={36} />
            <h2>{t('noSession')}</h2>
            <p>{t('choose')}</p>
          </div>
        ) : (
          <>
            <div className="ch-selected-header">
              <div>
                <span className="ch-eyebrow">{row?.harness ?? 'CodexHost'}</span>
                <h2 title={row?.title ?? selected}>{row?.title ?? selected}</h2>
              </div>
              <button
                className="ch-button ch-button-subtle"
                disabled={!usage.usage}
                onClick={() => {
                  void copy()
                }}
              >
                {t(copied === 'done' ? 'copied' : copied === 'failed' ? 'copyFailed' : 'copy')}
              </button>
            </div>
            {usage.error && (
              <div className="ch-error" role="alert">
                {t('usageError')}
                <span>{usage.error}</span>
                <button className="ch-button" onClick={refresh}>
                  {t('retry')}
                </button>
              </div>
            )}
            {usage.loading && !usage.usage ? (
              <div className="ch-dashboard ch-loading" aria-busy="true" aria-label={t('loading')}>
                <div className="ch-card ch-skeleton" />
                <div className="ch-card ch-skeleton" />
              </div>
            ) : (
              <>
                {!usage.usage && !usage.error && (
                  <p className="ch-note ch-availability">{t('noUsage')}</p>
                )}
                <div className="ch-dashboard">
                  <ContextCard usage={usage.usage} t={t} />
                  <UsageCard usage={usage.usage} t={t} />
                </div>
                <PerformanceCard usage={usage.usage} t={t} />
                <TimelineCard samples={usage.samples} t={t} />
              </>
            )}
            <Card title={t('history')} aside={<span className="ch-eyebrow">{t('readOnly')}</span>}>
              <p className="ch-note">
                {t('historyNote')} {t('clipped')}
              </p>
              {history.error && (
                <div className="ch-error" role="alert">
                  {t('historyError')}
                  <span>{history.error}</span>
                  <button className="ch-button" onClick={refresh}>
                    {t('retry')}
                  </button>
                </div>
              )}
              {history.loading && !history.page ? (
                <div className="ch-skeleton ch-history-skeleton" aria-label={t('historyLoading')} />
              ) : (
                history.page && <HistoryRows key={selected} items={history.page.items} t={t} />
              )}
              {history.page?.hasMore && (
                <div className="ch-history-footer">
                  <button className="ch-button" onClick={history.older} disabled={history.loading}>
                    {t(history.loading ? 'historyLoading' : 'older')}
                  </button>
                </div>
              )}
            </Card>
            <section className="ch-limit">
              <span className="ch-limit-icon" aria-hidden="true">
                i
              </span>
              <div>
                <h2>{t('limits')}</h2>
                <p>{t('limitsNote')}</p>
              </div>
            </section>
          </>
        )}
        <footer className="ch-footer">
          <span>ch-context · CodexHost</span>
          <span>{t('localOnly')}</span>
        </footer>
      </div>
    </div>
  )
}
