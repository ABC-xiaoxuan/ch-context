import { useEffect, useMemo, useRef, useState, type ReactElement, type ReactNode } from 'react'
import { summarizeActivity } from './activity.ts'
import { Icon } from './components.tsx'
import { Inspector } from './Inspector.tsx'
import { Overview } from './Overview.tsx'
import {
  useCurrentSession,
  useHistory,
  useLocale,
  useOverviewUsage,
  useSessions,
  useUsage,
  type ViewContext,
} from './hooks.ts'
import { isThreadId, recordOf } from './model.ts'
import { translator } from './i18n.ts'
import { relatedSessions } from './relationships.ts'
import {
  buildDiagnosticJson,
  buildDiagnosticMarkdown,
  downloadTextFile,
  safeFileSlug,
} from './report.ts'
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
  const [exportOpen, setExportOpen] = useState(false)
  const [mode, setMode] = useState<'overview' | 'inspector'>('inspector')
  const candidate = sessionId ?? picked ?? current
  const selected = isThreadId(candidate) ? candidate : undefined
  const activeView = embedded ? 'inspector' : selected ? mode : 'overview'
  const [revision, setRevision] = useState(0)
  const [cursors, setCursors] = useState<(string | null)[]>([null])
  const [pageIndex, setPageIndex] = useState(0)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const [exportStatus, setExportStatus] = useState<'idle' | 'copied' | 'downloaded' | 'failed'>(
    'idle',
  )
  const list = useSessions(cursors[pageIndex] ?? null, revision)
  const overviewUsage = useOverviewUsage(
    list.page?.items ?? [],
    !embedded && activeView === 'overview',
    revision,
  )
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
    setExportStatus('idle')
    setExportOpen(false)
  }, [selected])
  const refresh = (): void => setRevision((value) => value + 1)
  const select = (id: string): void => {
    if (embedded) {
      const workspace = recordOf(ctx.get('uiWorkspace'))
      if (typeof workspace?.openSession === 'function') workspace.openSession(id)
      return
    }
    setPicked(id)
    setMode('inspector')
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
  const workspaceName = row?.cwd?.split(/[\\/]/).filter(Boolean).at(-1)
  const currentTitle = row?.title || selected || t('noSession')
  const currentHarness = row?.harness ?? 'CodexHost'
  const buildReportInput = () => {
    const items = history.page?.items ?? []
    return {
      threadId: selected ?? '',
      title: currentTitle,
      harness: currentHarness,
      cwd: row?.cwd,
      exportedAt: Date.now(),
      usage: usage.usage,
      summary: history.page ? summarizeActivity(items) : null,
      items,
      related: selected ? relatedSessions(list.page?.items ?? [], selected) : [],
    }
  }
  const copyReportMarkdown = async (): Promise<void> => {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(buildDiagnosticMarkdown(buildReportInput(), locale))
      setExportStatus('copied')
      setExportOpen(false)
    } catch {
      setExportStatus('failed')
    }
  }
  const downloadReport = (format: 'md' | 'json'): void => {
    if (!selected) return
    const input = buildReportInput()
    const slug = safeFileSlug(currentTitle, selected)
    const content =
      format === 'md'
        ? buildDiagnosticMarkdown(input, locale)
        : JSON.stringify(buildDiagnosticJson(input), null, 2)
    const ok = downloadTextFile(
      `ch-context-${slug}.${format}`,
      content,
      format === 'md' ? 'text/markdown;charset=utf-8' : 'application/json;charset=utf-8',
    )
    setExportStatus(ok ? 'downloaded' : 'failed')
    setExportOpen(false)
  }
  return (
    <div
      ref={surface}
      className={`ch-context ${embedded ? 'ch-embedded' : ''}`}
      lang={locale.startsWith('zh') ? 'zh-CN' : 'en'}
    >
      <div className="ch-shell">
        <header className={`ch-page-heading ${embedded ? 'ch-heading-embedded' : ''}`}>
          <div className="ch-heading-left">
            <div className="ch-heading-title">
              <div className="ch-brand-icon" aria-hidden="true">
                <Icon size={14} />
              </div>
              <div className="ch-brand-stack">
                {!embedded ? <h1>{t('title')}</h1> : <span className="ch-brand-name">CH CONTEXT</span>}
                <div className="ch-brand">
                  <span>CH-CONTEXT</span>
                  <a
                    className="ch-version"
                    href="https://github.com/ABC-xiaoxuan/ch-context"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {__CH_CONTEXT_VERSION__}
                  </a>
                </div>
              </div>
            </div>
            {!embedded && (
              <>
                <span className="ch-divider-v" aria-hidden="true" />
                <div className="ch-seg ch-view-seg" role="tablist" aria-label={t('title')}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'overview'}
                    className={activeView === 'overview' ? 'is-active' : ''}
                    onClick={() => {
                      setMode('overview')
                      setChooserOpen(false)
                    }}
                  >
                    {t('overview')}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'inspector'}
                    className={activeView === 'inspector' ? 'is-active' : ''}
                    disabled={!selected}
                    onClick={() => setMode('inspector')}
                  >
                    {t('inspectorView')}
                  </button>
                </div>
                <details
                  className="ch-session-picker"
                  open={chooserOpen}
                  onToggle={(event) => setChooserOpen(event.currentTarget.open)}
                >
                  <summary title={currentTitle}>
                    <span className="ch-meta-tag ch-session-harness">{currentHarness}</span>
                    <strong>{row?.title || (selected ? t('following') : t('noSession'))}</strong>
                    {workspaceName && <span className="ch-meta-tag is-muted">{workspaceName}</span>}
                    <small aria-hidden="true">▾</small>
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
                          type="button"
                          className="ch-mini-button"
                          onClick={() => {
                            setPicked(undefined)
                            setMode('inspector')
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
                        <button type="button" className="ch-mini-button" onClick={refresh}>
                          {t('retry')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="ch-session-list" role="list">
                          {list.loading ? (
                            <div
                              className="ch-skeleton ch-session-skeleton"
                              aria-label={t('loading')}
                            />
                          ) : filtered.length === 0 ? (
                            <p className="ch-note">{t('emptyList')}</p>
                          ) : (
                            filtered.map((item) => (
                              <div key={item.id} role="listitem">
                                <button
                                  type="button"
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
                              type="button"
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
                              type="button"
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
              </>
            )}
          </div>
          <div className="ch-heading-actions">
            {headerActions}
            {selected && activeView === 'inspector' && (
              <span className={`ch-status ${usage.connected ? '' : 'is-offline'}`}>
                <i />
                {t(usage.connected ? 'live' : 'disconnected')}
              </span>
            )}
            {selected && activeView === 'inspector' && (
              <button
                type="button"
                className="ch-mini-button"
                disabled={!usage.usage}
                onClick={() => {
                  void copy()
                }}
              >
                {t(copied === 'done' ? 'copied' : copied === 'failed' ? 'copyFailed' : 'copy')}
              </button>
            )}
            {selected && activeView === 'inspector' && (
              <details
                className="ch-export-menu"
                open={exportOpen}
                onToggle={(event) => setExportOpen(event.currentTarget.open)}
              >
                <summary className="ch-button">
                  {t(
                    exportStatus === 'copied'
                      ? 'reportCopied'
                      : exportStatus === 'downloaded'
                        ? 'reportDownloaded'
                        : exportStatus === 'failed'
                          ? 'copyFailed'
                          : 'exportReport',
                  )}{' '}
                  ▾
                </summary>
                <div className="ch-export-pop" role="menu">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      void copyReportMarkdown()
                    }}
                  >
                    {t('copyMarkdown')}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => downloadReport('md')}
                  >
                    {t('downloadMarkdown')}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => downloadReport('json')}
                  >
                    {t('downloadJson')}
                  </button>
                </div>
              </details>
            )}
            <button
              type="button"
              className="ch-button"
              disabled={activeView === 'overview' ? list.loading : usage.loading}
              onClick={refresh}
            >
              {t((activeView === 'overview' ? list.loading : usage.loading) ? 'loading' : 'refresh')}
            </button>
          </div>
        </header>

        {activeView === 'overview' ? (
          <Overview
            rows={list.page?.items ?? []}
            usageById={overviewUsage}
            loading={list.loading}
            error={list.error}
            selected={selected}
            hasSelected={Boolean(selected)}
            pageIndex={pageIndex}
            hasNext={Boolean(list.page?.nextCursor)}
            onPrev={() => setPageIndex((value) => Math.max(0, value - 1))}
            onNext={() => {
              const next = list.page?.nextCursor
              if (!next) return
              setCursors((values) => [...values.slice(0, pageIndex + 1), next])
              setPageIndex((value) => value + 1)
            }}
            onSelect={select}
            onRetry={refresh}
            t={t}
          />
        ) : !selected ? (
          <div className="ch-empty">
            <Icon size={28} />
            <h2>{t('noSession')}</h2>
            <p>{t('choose')}</p>
          </div>
        ) : (
          <>
            {usage.error && (
              <div className="ch-error" role="alert">
                {t('usageError')}
                <span>{usage.error}</span>
                <button type="button" className="ch-mini-button" onClick={refresh}>
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
              currentTitle={currentTitle}
              currentHarness={currentHarness}
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
