import { Fragment, memo, useCallback, useMemo, useState, type ReactElement } from 'react'
import { fmtTime } from '../client/format.ts'
import {
  commandProgram,
  type ActivitySummary,
  type CommandActivity,
  type FileActivity,
} from './activity.ts'
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

const EMPTY_FILES: readonly FileActivity[] = []
const EMPTY_COMMANDS: readonly CommandActivity[] = []

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

interface EnrichedFile {
  file: FileActivity
  dir: string
  base: string
  pathLower: string
  ext: { label: string; tone: string }
  latestTime: number
  totalOps: number
}

const FileRow = memo(function FileRow({
  entry,
  isOpen,
  itemById,
  onToggle,
  onFocus,
  t,
}: {
  entry: EnrichedFile
  isOpen: boolean
  itemById: ReadonlyMap<string, { item: HistoryItem; pos: number }>
  onToggle: (path: string) => void
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const { file, dir, base, ext, latestTime } = entry
  return (
    <div className={`ch-file-item ${isOpen ? 'is-open' : ''}`}>
      <div className="ch-file-row-wrap">
        <button
          type="button"
          className="ch-file-expand"
          aria-expanded={isOpen}
          aria-label={t('openOperations')}
          onClick={() => onToggle(file.path)}
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
            {latestTime >= 0 && <span className="ch-fa-time">{fmtTime(latestTime)}</span>}
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="ch-file-ops">
          {file.recordIds.map((recordId) => {
            const found = itemById.get(recordId)
            return (
              <button
                key={recordId}
                type="button"
                className="ch-fa-op"
                onClick={() => onFocus(recordId)}
              >
                <span className="ch-fa-op-tool">{found?.item.toolName ?? t('tool')}</span>
                <span className="ch-fa-op-seq">
                  #{found?.item.seq ?? ''} · {t('jumpToBrowser')} ↗
                </span>
                {found?.item.time !== undefined && (
                  <span className="ch-fa-time">{fmtTime(found.item.time)}</span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
})

export const FileActivityCard = memo(function FileActivityCard({
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
  const files = summary?.files ?? EMPTY_FILES
  const enrichedFiles = useMemo<EnrichedFile[]>(() => {
    return files.map((file) => {
      const { dir, base } = splitFilePath(file.path)
      let latestTime = -1
      for (const id of file.recordIds) {
        const time = itemById.get(id)?.item.time ?? -1
        if (time > latestTime) latestTime = time
      }
      return {
        file,
        dir,
        base,
        pathLower: file.path.toLocaleLowerCase(),
        ext: fileExtension(file.path),
        latestTime,
        totalOps: file.reads + file.writes + file.searches,
      }
    })
  }, [files, itemById])
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
  const visibleFiles = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const filtered = enrichedFiles.filter((entry) => {
      if (filter !== 'all' && entry.file[filter] === 0) return false
      if (!needle) return true
      return entry.pathLower.includes(needle)
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'path') return a.file.path.localeCompare(b.file.path)
      if (sort === 'name') return a.base.localeCompare(b.base)
      if (sort === 'latest') return b.latestTime - a.latestTime
      return b.totalOps - a.totalOps
    })
  }, [enrichedFiles, filter, query, sort])
  const toggleFile = useCallback((path: string) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }, [])
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
          {visibleFiles.map((entry) => (
            <FileRow
              key={entry.file.path}
              entry={entry}
              isOpen={expanded.has(entry.file.path)}
              itemById={itemById}
              onToggle={toggleFile}
              onFocus={onFocus}
              t={t}
            />
          ))}
        </div>
      )}
    </Card>
  )
})

interface EnrichedCommand {
  command: CommandActivity
  program: string
  commandLower: string
}

const CommandRow = memo(function CommandRow({
  entry,
  isOpen,
  callTime,
  resultText,
  onToggle,
  onFocus,
  t,
}: {
  entry: EnrichedCommand
  isOpen: boolean
  callTime?: number
  resultText?: string
  onToggle: (id: string) => void
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const { command, program } = entry
  const tokens = useMemo(() => renderShellTokens(command.command), [command.command])
  return (
    <div
      className={`ch-command-row ${command.isError ? 'is-error' : ''} ${isOpen ? 'is-open' : ''}`}
    >
      <div className="ch-command-line">
        <button
          type="button"
          className="ch-file-expand"
          aria-expanded={isOpen}
          aria-label={t('details')}
          onClick={() => onToggle(command.id)}
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
          <code>{tokens}</code>
        </button>
        <span className="ch-cmd-time">
          #{command.seq}
          {callTime !== undefined ? ` · ${fmtTime(callTime)}` : ''}
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
              <span className="ch-ts-call-name">{program}</span>
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
            {resultText && (
              <>
                <pre className="ch-cmd-out">
                  {resultText.length > 1200 ? `${resultText.slice(0, 1200)}\n…` : resultText}
                </pre>
                {resultText.length > 1200 && command.resultId && (
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
})

export const CommandExecutionsCard = memo(function CommandExecutionsCard({
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
  const commands = summary?.commands ?? EMPTY_COMMANDS
  const enrichedCommands = useMemo<EnrichedCommand[]>(
    () =>
      commands.map((command) => ({
        command,
        program: commandProgram(command.command),
        commandLower: command.command.toLocaleLowerCase(),
      })),
    [commands],
  )
  const { failedCount, okCount, pendingCount, firstFailed, programs } = useMemo(() => {
    let failed = 0
    let ok = 0
    let pending = 0
    let firstErr: CommandActivity | undefined
    const counts = new Map<string, number>()
    for (const entry of enrichedCommands) {
      const command = entry.command
      if (command.isError === true) {
        failed += 1
        if (!firstErr) firstErr = command
      } else if (command.isError === false) {
        ok += 1
      } else if (!command.resultId) {
        pending += 1
      }
      counts.set(entry.program, (counts.get(entry.program) ?? 0) + 1)
    }
    return {
      failedCount: failed,
      okCount: ok,
      pendingCount: pending,
      firstFailed: firstErr,
      programs: [...counts.entries()].sort((a, b) => b[1] - a[1]),
    }
  }, [enrichedCommands])
  const activeProgram =
    selectedProgram !== null && programs.some(([prog]) => prog === selectedProgram)
      ? selectedProgram
      : null
  const visiblePrograms = useMemo(() => {
    const needle = progQuery.trim().toLocaleLowerCase()
    return needle ? programs.filter(([prog]) => prog.toLocaleLowerCase().includes(needle)) : programs
  }, [programs, progQuery])
  const topProgram = programs[0]
  const visibleCommands = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const filtered = enrichedCommands.filter((entry) => {
      const command = entry.command
      if (statusFilter === 'err' && command.isError !== true) return false
      if (statusFilter === 'ok' && command.isError !== false) return false
      if (statusFilter === 'pending' && (command.resultId || command.isError !== undefined))
        return false
      if (activeProgram !== null && entry.program !== activeProgram) return false
      if (needle && !entry.commandLower.includes(needle)) return false
      return true
    })
    return sortLatest ? [...filtered].reverse() : filtered
  }, [enrichedCommands, statusFilter, activeProgram, query, sortLatest])
  const toggleCommand = useCallback((id: string) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])
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
                {visibleCommands.map((entry) => {
                  const callItem = itemById.get(entry.command.recordId)
                  const resultItem = entry.command.resultId
                    ? itemById.get(entry.command.resultId)
                    : undefined
                  return (
                    <CommandRow
                      key={entry.command.id}
                      entry={entry}
                      isOpen={expanded.has(entry.command.id)}
                      callTime={callItem?.time}
                      resultText={resultItem?.text}
                      onToggle={toggleCommand}
                      onFocus={onFocus}
                      t={t}
                    />
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
})
