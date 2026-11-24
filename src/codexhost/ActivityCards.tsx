import { Fragment, useMemo, useState, type ReactElement } from 'react'
import { fmtTime } from '../client/format.ts'
import { commandProgram, type ActivitySummary } from './activity.ts'
import type { HistoryItem } from './api.ts'
import type { Translate } from './i18n.ts'
import { Card } from './components.tsx'

const PROG_COLORS = [
  'var(--ch-blue)',
  'var(--ch-teal)',
  'var(--ch-indigo)',
  'var(--ch-amber)',
  'var(--ch-purple)',
  'var(--ch-green)',
]

export type FileFilter = 'all' | 'reads' | 'writes' | 'searches'
function fileExtension(path: string): { label: string; tone: string } {
  const base = path.split(/[\\/]/).at(-1) ?? path
  const dot = base.lastIndexOf('.')
  if (dot <= 0 || dot === base.length - 1) return { label: 'FILE', tone: 'is-muted' }
  const ext = base.slice(dot + 1).toUpperCase().slice(0, 5)
  const tone =
    ext === 'TS'
      ? 'is-ts'
      : ext === 'TSX' || ext === 'JSX'
        ? 'is-tsx'
        : ext === 'JS' || ext === 'MJS' || ext === 'CJS'
          ? 'is-js'
          : ext === 'CSS' || ext === 'SCSS'
            ? 'is-css'
            : ext === 'JSON' || ext === 'YAML' || ext === 'YML'
              ? 'is-json'
              : ext === 'MD' || ext === 'TXT'
                ? 'is-md'
                : 'is-muted'
  return { label: ext, tone }
}

function splitFilePath(path: string): { dir: string; base: string } {
  const slash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  if (slash < 0) return { dir: '', base: path }
  return { dir: path.slice(0, slash + 1), base: path.slice(slash + 1) }
}

function renderShellTokens(command: string): ReactElement {
  const tokens = command.split(/(\s+|&&|\|\||\|)/)
  let firstWordSeen = false
  return (
    <>
      {tokens.map((token, index) => {
        if (!token) return null
        if (/^\s+$/.test(token)) return <Fragment key={index}>{token}</Fragment>
        if (token === '&&' || token === '||' || token === '|')
          return (
            <span key={index} className="ch-sh-op">
              {token}
            </span>
          )
        if (!firstWordSeen) {
          firstWordSeen = true
          return (
            <span key={index} className="ch-sh-prog">
              {token}
            </span>
          )
        }
        if (token.startsWith('-'))
          return (
            <span key={index} className="ch-sh-flag">
              {token}
            </span>
          )
        return <Fragment key={index}>{token}</Fragment>
      })}
    </>
  )
}

export function FileActivityCard({
  summary,
  items,
  filter,
  onFilter,
  onFocus,
  t,
}: {
  summary: ActivitySummary | null
  items: readonly HistoryItem[]
  filter: FileFilter
  onFilter: (value: FileFilter) => void
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'active' | 'latest' | 'path' | 'name'>('active')
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const itemById = useMemo(
    () => new Map(items.map((item, idx) => [item.id, { item, pos: idx + 1 }])),
    [items],
  )
  const files = summary?.files ?? []
  const totals = useMemo(() => {
    let reads = 0
    let writes = 0
    let searches = 0
    for (const file of files) {
      reads += file.reads
      writes += file.writes
      searches += file.searches
    }
    return { all: reads + writes + searches, reads, writes, searches }
  }, [files])
  const lastTimeOf = (recordIds: readonly string[]): number => {
    let latest = -1
    for (const id of recordIds) {
      const time = itemById.get(id)?.item.time ?? -1
      if (time > latest) latest = time
    }
    return latest
  }
  const visibleFiles = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const filtered = files.filter((file) => {
      if (filter !== 'all' && file[filter] === 0) return false
      if (!needle) return true
      return file.path.toLocaleLowerCase().includes(needle)
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'path') return a.path.localeCompare(b.path)
      if (sort === 'name') return splitFilePath(a.path).base.localeCompare(splitFilePath(b.path).base)
      if (sort === 'latest') return lastTimeOf(b.recordIds) - lastTimeOf(a.recordIds)
      return b.reads + b.writes + b.searches - (a.reads + a.writes + a.searches)
    })
  }, [files, filter, query, sort, itemById])
  return (
    <Card
      title={t('files')}
      className="ch-file-card"
      aside={
        <div className="ch-fa-head-right">
          <span className="ch-card-meta">
            {summary ? files.length : '—'} {t('filesUnit')}
          </span>
          <div className="ch-seg ch-fa-filter" role="group" aria-label={t('files')}>
            {(
              [
                ['all', t('all'), totals.all, 'is-all'],
                ['reads', t('reads'), totals.reads, 'is-read'],
                ['writes', t('writes'), totals.writes, 'is-write'],
                ['searches', t('searches'), totals.searches, 'is-search'],
              ] as const
            ).map(([key, label, count, tone]) => (
              <button
                key={key}
                type="button"
                className={`${tone} ${filter === key ? 'is-active' : ''}`}
                aria-pressed={filter === key}
                onClick={() => onFilter(key)}
              >
                {label} <span className="ch-cnt">{summary ? count : '—'}</span>
              </button>
            ))}
          </div>
        </div>
      }
    >
      {files.length > 0 && (
        <div className="ch-fa-toolbar">
          <input
            className="ch-mini-input ch-flex-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('filterPath')}
            aria-label={t('filterPath')}
          />
          <div className="ch-seg" role="group">
            {(
              [
                ['active', 'sortMostActive'],
                ['latest', 'sortLatest'],
                ['path', 'sortByPath'],
                ['name', 'sortByName'],
              ] as const
            ).map(([key, labelKey]) => (
              <button
                key={key}
                type="button"
                className={sort === key ? 'is-active' : ''}
                aria-pressed={sort === key}
                onClick={() => setSort(key)}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>
      )}
      {!summary || files.length === 0 ? (
        <p className="ch-note">{t(summary ? 'noFiles' : 'unavailable')}</p>
      ) : visibleFiles.length === 0 ? (
        <p className="ch-note">{t('noMatches')}</p>
      ) : (
        <div className="ch-file-list">
          {visibleFiles.map((file) => {
            const { dir, base } = splitFilePath(file.path)
            const ext = fileExtension(file.path)
            const isOpen = expanded.has(file.path)
            const latest = lastTimeOf(file.recordIds)
            return (
              <div key={file.path} className={`ch-file-item ${isOpen ? 'is-open' : ''}`}>
                <div className="ch-file-row-wrap">
                  <button
                    type="button"
                    className="ch-file-expand"
                    aria-expanded={isOpen}
                    aria-label={t('openOperations')}
                    onClick={() =>
                      setExpanded((previous) => {
                        const next = new Set(previous)
                        if (next.has(file.path)) next.delete(file.path)
                        else next.add(file.path)
                        return next
                      })
                    }
                  >
                    {isOpen ? '▾' : '▸'}
                  </button>
                  <button
                    type="button"
                    className="ch-file-row"
                    title={file.path}
                    onClick={() => onFocus(file.recordIds[0])}
                  >
                    <div className="ch-file-left">
                      <span className={`ch-ext-badge ${ext.tone}`}>{ext.label}</span>
                      <span className="ch-file-path">
                        {dir && <span className="ch-file-dir">{dir}</span>}
                        <strong>{base}</strong>
                      </span>
                    </div>
                    <div className="ch-file-right">
                      <span className="ch-op-badges">
                        {file.reads > 0 && (
                          <i className="ch-op-tag is-r" title={t('reads')}>
                            <em />
                            {file.reads}
                          </i>
                        )}
                        {file.writes > 0 && (
                          <i className="ch-op-tag is-w" title={t('writes')}>
                            <em />
                            {file.writes}
                          </i>
                        )}
                        {file.searches > 0 && (
                          <i className="ch-op-tag is-s" title={t('searches')}>
                            <em />
                            {file.searches}
                          </i>
                        )}
                      </span>
                      {latest >= 0 && <span className="ch-fa-time">{fmtTime(latest)}</span>}
                    </div>
                  </button>
                </div>
                {isOpen && (
                  <div className="ch-file-ops">
                    {file.recordIds.map((recordId) => {
                      const entry = itemById.get(recordId)
                      return (
                        <button
                          key={recordId}
                          type="button"
                          className="ch-fa-op"
                          onClick={() => onFocus(recordId)}
                        >
                          <span className="ch-fa-op-tool">{entry?.item.toolName ?? t('tool')}</span>
                          <span className="ch-fa-op-seq">
                            #{entry?.item.seq ?? ''} · {t('jumpToBrowser')} ↗
                          </span>
                          {entry?.item.time !== undefined && (
                            <span className="ch-fa-time">{fmtTime(entry.item.time)}</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}

export function CommandExecutionsCard({
  summary,
  items,
  selectedProgram,
  onSelectProgram,
  onFocus,
  t,
}: {
  summary: ActivitySummary | null
  items: readonly HistoryItem[]
  selectedProgram: string | null
  onSelectProgram: (program: string | null) => void
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const [statusFilter, setStatusFilter] = useState<'all' | 'err' | 'ok' | 'pending'>('all')
  const [query, setQuery] = useState('')
  const [progQuery, setProgQuery] = useState('')
  const [sortLatest, setSortLatest] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set())
  const itemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items])
  const commands = summary?.commands ?? []
  const failedCount = useMemo(
    () => commands.filter((command) => command.isError === true).length,
    [commands],
  )
  const okCount = useMemo(
    () => commands.filter((command) => command.isError === false).length,
    [commands],
  )
  const pendingCount = useMemo(
    () => commands.filter((command) => !command.resultId && command.isError === undefined).length,
    [commands],
  )
  const programs = useMemo(() => {
    const counts = new Map<string, number>()
    for (const command of commands) {
      const prog = commandProgram(command.command)
      counts.set(prog, (counts.get(prog) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [commands])
  const activeProgram =
    selectedProgram !== null && programs.some(([prog]) => prog === selectedProgram)
      ? selectedProgram
      : null
  const visiblePrograms = useMemo(() => {
    const needle = progQuery.trim().toLocaleLowerCase()
    return needle ? programs.filter(([prog]) => prog.toLocaleLowerCase().includes(needle)) : programs
  }, [programs, progQuery])
  const firstFailed = useMemo(
    () => commands.find((command) => command.isError === true),
    [commands],
  )
  const topProgram = programs[0]
  const visibleCommands = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const filtered = commands.filter((command) => {
      if (statusFilter === 'err' && command.isError !== true) return false
      if (statusFilter === 'ok' && command.isError !== false) return false
      if (statusFilter === 'pending' && (command.resultId || command.isError !== undefined))
        return false
      if (activeProgram !== null && commandProgram(command.command) !== activeProgram) return false
      if (needle && !command.command.toLocaleLowerCase().includes(needle)) return false
      return true
    })
    return sortLatest ? [...filtered].reverse() : filtered
  }, [commands, statusFilter, activeProgram, query, sortLatest])
  const failedRate =
    commands.length > 0 ? `${((failedCount / commands.length) * 100).toFixed(1)}%` : '0%'
  return (
    <Card
      title={t('commands')}
      className="ch-command-card"
      aside={
        <div className="ch-seg ch-cmd-filter" role="group" aria-label={t('commands')}>
          {(
            [
              ['all', t('all'), commands.length, 'is-all'],
              ['err', t('failed'), failedCount, 'is-err'],
              ['ok', t('statusOk'), okCount, 'is-ok'],
              ['pending', t('pending'), pendingCount, 'is-pend'],
            ] as const
          ).map(([key, label, count, tone]) => (
            <button
              key={key}
              type="button"
              className={`${tone} ${statusFilter === key ? 'is-active' : ''}`}
              aria-pressed={statusFilter === key}
              onClick={() => {
                setStatusFilter(key)
                if (key === 'all') onSelectProgram(null)
              }}
            >
              {label} <span className="ch-cnt">{summary ? count : '—'}</span>
            </button>
          ))}
        </div>
      }
    >
      {!summary || commands.length === 0 ? (
        <p className="ch-note">{t(summary ? 'noCommands' : 'unavailable')}</p>
      ) : (
        <div className="ch-cmd-body">
          <aside className="ch-cmd-rail">
            <div className="ch-cmd-rail-sec">
              <div className="ch-rail-h">{t('cmdSummary')}</div>
              <div className="ch-cmd-kpis">
                <button
                  type="button"
                  className="ch-cmd-kpi"
                  onClick={() => {
                    setStatusFilter('all')
                    onSelectProgram(null)
                  }}
                >
                  <b>{commands.length}</b>
                  <span>{t('settledRuns')}</span>
                </button>
                <button
                  type="button"
                  className="ch-cmd-kpi is-err"
                  onClick={() => setStatusFilter('err')}
                >
                  <b>{failedCount}</b>
                  <span>
                    {t('failedShare')} · {failedRate}
                  </span>
                </button>
                <button
                  type="button"
                  className="ch-cmd-kpi is-ok"
                  onClick={() => setStatusFilter('ok')}
                >
                  <b>{okCount}</b>
                  <span>{t('succeededRuns')}</span>
                </button>
                <button type="button" className="ch-cmd-kpi" onClick={() => onSelectProgram(null)}>
                  <b>{programs.length}</b>
                  <span>{t('programsLabel')}</span>
                </button>
              </div>
            </div>
            {(firstFailed || (topProgram && topProgram[1] > 1)) && (
              <div className="ch-cmd-rail-sec">
                <div className="ch-rail-h">{t('attentionLabel')}</div>
                <div className="ch-attn-list">
                  {firstFailed && (
                    <button
                      type="button"
                      className={`ch-attn-row is-err ${statusFilter === 'err' ? 'is-active' : ''}`}
                      onClick={() => {
                        const next = statusFilter === 'err' ? 'all' : 'err'
                        setStatusFilter(next)
                        if (next === 'err') onSelectProgram(null)
                      }}
                    >
                      <i />
                      <span className="ch-attn-k">{t('failed')}</span>
                      <span className="ch-attn-v">{firstFailed.command}</span>
                      <span className="ch-attn-n">×{failedCount}</span>
                    </button>
                  )}
                  {topProgram && topProgram[1] > 1 && (
                    <button
                      type="button"
                      className={`ch-attn-row is-rep ${activeProgram === topProgram[0] ? 'is-active' : ''}`}
                      onClick={() =>
                        onSelectProgram(activeProgram === topProgram[0] ? null : topProgram[0])
                      }
                    >
                      <i />
                      <span className="ch-attn-k">{t('repeatedLabel')}</span>
                      <span className="ch-attn-v">{topProgram[0]}</span>
                      <span className="ch-attn-n">×{topProgram[1]}</span>
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="ch-cmd-rail-sec ch-cmd-progs">
              <div className="ch-rail-h">
                <span>
                  {t('programsLabel')} · {programs.length}
                </span>
                {programs.length > 5 && (
                  <input
                    className="ch-prog-search"
                    value={progQuery}
                    onChange={(event) => setProgQuery(event.target.value)}
                    placeholder={t('filterPrograms')}
                    aria-label={t('filterPrograms')}
                  />
                )}
              </div>
              <div className="ch-prog-list">
                {visiblePrograms.map(([prog, count], index) => {
                  const pct = Math.round((count / commands.length) * 100)
                  const color = PROG_COLORS[index % PROG_COLORS.length]
                  return (
                    <button
                      key={prog}
                      type="button"
                      className={`ch-prog-row ${activeProgram === prog ? 'is-active' : ''}`}
                      aria-pressed={activeProgram === prog}
                      onClick={() => onSelectProgram(activeProgram === prog ? null : prog)}
                    >
                      <i className="ch-prog-dot" style={{ background: color }} />
                      <span className="ch-prog-name">{prog}</span>
                      <span className="ch-prog-cnt">×{count}</span>
                      <span className="ch-prog-pct">{pct}%</span>
                      <i className="ch-prog-bar" style={{ width: `${pct}%`, background: color }} />
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          <div className="ch-cmd-main-pane">
            <div className="ch-fa-toolbar">
              <input
                className="ch-mini-input ch-flex-input"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('filterCommands')}
                aria-label={t('filterCommands')}
              />
              <div className="ch-seg" role="group">
                <button
                  type="button"
                  className={sortLatest ? 'is-active' : ''}
                  aria-pressed={sortLatest}
                  onClick={() => setSortLatest(true)}
                >
                  {t('sortLatest')}
                </button>
                <button
                  type="button"
                  className={!sortLatest ? 'is-active' : ''}
                  aria-pressed={!sortLatest}
                  onClick={() => setSortLatest(false)}
                >
                  {t('sortSeq')}
                </button>
              </div>
            </div>
            {visibleCommands.length === 0 ? (
              <p className="ch-note">{t('noMatches')}</p>
            ) : (
              <div className="ch-command-list">
                {visibleCommands.map((command) => {
                  const isOpen = expanded.has(command.id)
                  const callItem = itemById.get(command.recordId)
                  const resultItem = command.resultId ? itemById.get(command.resultId) : undefined
                  return (
                    <div
                      key={command.id}
                      className={`ch-command-row ${command.isError ? 'is-error' : ''} ${isOpen ? 'is-open' : ''}`}
                    >
                      <div className="ch-command-line">
                        <button
                          type="button"
                          className="ch-file-expand"
                          aria-expanded={isOpen}
                          aria-label={t('details')}
                          onClick={() =>
                            setExpanded((previous) => {
                              const next = new Set(previous)
                              if (next.has(command.id)) next.delete(command.id)
                              else next.add(command.id)
                              return next
                            })
                          }
                        >
                          {isOpen ? '▾' : '▸'}
                        </button>
                        <button
                          type="button"
                          className="ch-command-main"
                          onClick={() => onFocus(command.recordId)}
                        >
                          <span
                            className={
                              command.isError === true
                                ? 'ch-cmd-status ch-result-error'
                                : command.isError === false
                                  ? 'ch-cmd-status ch-result-known'
                                  : 'ch-cmd-status ch-result-state'
                            }
                            title={t(
                              command.isError === true
                                ? 'failed'
                                : command.isError === false
                                  ? 'statusOk'
                                  : command.resultId
                                    ? 'completed'
                                    : 'pending',
                            )}
                          >
                            {command.isError === true
                              ? '!'
                              : command.isError === false
                                ? '✓'
                                : command.resultId
                                  ? '↳'
                                  : '…'}
                          </span>
                          <code>{renderShellTokens(command.command)}</code>
                        </button>
                        <span className="ch-cmd-time">
                          #{command.seq}
                          {callItem?.time !== undefined ? ` · ${fmtTime(callItem.time)}` : ''}
                        </span>
                        {command.resultId && (
                          <button
                            type="button"
                            className="ch-command-result"
                            onClick={() => onFocus(command.resultId!)}
                          >
                            {t('toolOutput')} ↗
                          </button>
                        )}
                      </div>
                      {isOpen && (
                        <div className="ch-cmd-inline">
                          <div className="ch-ts-card">
                            <div className="ch-ts-head">
                              <span className="ch-ts-call-name">
                                {commandProgram(command.command)}
                              </span>
                              <div className="ch-ts-right">
                                {command.isError === true ? (
                                  <span className="ch-call-state is-err">
                                    <i />
                                    {t('failed')}
                                  </span>
                                ) : command.isError === false ? (
                                  <span className="ch-call-state is-ok">
                                    <i />
                                    {t('statusOk')}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <pre className="ch-cmd-full">{command.command}</pre>
                            {resultItem && resultItem.text && (
                              <>
                                <pre className="ch-cmd-out">
                                  {resultItem.text.length > 1200
                                    ? `${resultItem.text.slice(0, 1200)}\n…`
                                    : resultItem.text}
                                </pre>
                                {resultItem.text.length > 1200 && command.resultId && (
                                  <div className="ch-cmd-trunc">
                                    <span>{t('previewShort')}</span>
                                    <button
                                      type="button"
                                      className="ch-link-btn"
                                      onClick={() => onFocus(command.resultId!)}
                                    >
                                      {t('jumpToBrowser')} ↗
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
