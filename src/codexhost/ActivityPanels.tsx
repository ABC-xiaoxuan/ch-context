import { Fragment, useMemo, useState, type MouseEvent, type ReactElement } from 'react'
import { fmtTime } from '../client/format.ts'
import { commandProgram, type ActivitySummary } from './activity.ts'
import type { HistoryItem } from './api.ts'
import type { RelatedSession } from './relationships.ts'
import type { Translate } from './i18n.ts'
import { Card } from './components.tsx'
import { previewLine } from './format.ts'
import { eventIndexAt, eventX } from './event-geometry.ts'

export const ROLE_COLOR = {
  user: 'var(--ch-green)',
  assistant: 'var(--ch-blue)',
  tool: 'var(--ch-teal)',
  event: 'var(--ch-purple)',
}

export type SignalTab = 'files' | 'commands' | 'family'

interface TurnSpan {
  turn: number
  start: number
  end: number
}

function computeTurns(items: readonly HistoryItem[]): {
  turns: TurnSpan[]
  turnByIndex: number[]
} {
  const turns: TurnSpan[] = []
  const turnByIndex: number[] = []
  let current = 0
  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    if (item.kind === 'user' || current === 0) current += 1
    turnByIndex.push(current)
    const last = turns.at(-1)
    if (!last || last.turn !== current) turns.push({ turn: current, start: index, end: index })
    else last.end = index
  }
  return { turns, turnByIndex }
}

export function ActivityTimeline({
  items,
  pairs,
  available,
  loading,
  focus,
  onFocus,
  t,
}: {
  items: readonly HistoryItem[]
  pairs: ReadonlyMap<string, string>
  available: boolean
  loading: boolean
  focus?: string
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const [hover, setHover] = useState<number | null>(null)
  const selected = items.findIndex((item) => item.id === focus)
  const effective = selected < 0 ? Math.max(0, items.length - 1) : selected
  const indexAt = (event: MouseEvent<SVGSVGElement>): number | null => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return bounds.width > 0
      ? eventIndexAt((event.clientX - bounds.left) / bounds.width, items.length)
      : null
  }
  const pick = (event: MouseEvent<SVGSVGElement>): void => {
    const index = indexAt(event)
    if (index !== null && items[index]) onFocus(items[index].id)
  }
  const lanes = ['user', 'assistant', 'tool', 'event'] as const
  const xOf = (index: number) => eventX(index, items.length)
  const yOf = (kind: HistoryItem['kind']) => 26 + lanes.indexOf(kind) * 25
  const markerWidth = Math.max(3.5, Math.min(10, 560 / Math.max(1, items.length)))
  const previewIndex = hover !== null && items[hover] ? hover : effective
  const preview = items[previewIndex]
  const { turns, turnByIndex } = useMemo(() => computeTurns(items), [items])
  const indexById = useMemo(() => new Map(items.map((item, idx) => [item.id, idx])), [items])
  const bridges = useMemo(() => {
    const list: { key: string; x1: number; x2: number; isError: boolean }[] = []
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      if (item.eventType !== 'tool/call') continue
      const partnerId = pairs.get(item.id)
      if (!partnerId) continue
      const targetIndex = indexById.get(partnerId)
      if (targetIndex === undefined || targetIndex <= index) continue
      const result = items[targetIndex]
      list.push({
        key: `${item.id}-${partnerId}`,
        x1: xOf(index),
        x2: xOf(targetIndex),
        isError: result?.isError === true || item.isError === true,
      })
    }
    return list
  }, [items, pairs, indexById])
  const previewPairId = preview ? pairs.get(preview.id) : undefined
  const previewPair = previewPairId ? items[indexById.get(previewPairId) ?? -1] : undefined
  const sliderPercent = items.length > 1 ? (effective / (items.length - 1)) * 100 : 100
  return (
    <Card
      title={t('activityTimeline')}
      className="ch-activity-timeline"
      aside={
        <span className="ch-scope">
          {t('historyWindow')} · {items.length ? `${items.length}` : '—'}
          {turns.length > 0 ? ` (${turns.length} ${t('turnsCount')})` : ''}
        </span>
      }
    >
      {items.length === 0 ? (
        <p className="ch-note">
          {t(available ? 'noHistory' : loading ? 'historyLoading' : 'unavailable')}
        </p>
      ) : (
        <>
          <div className="ch-activity-chart">
            <div className="ch-lane-labels">
              {lanes.map((lane) => (
                <span key={lane} className="ch-lane-label">
                  <i style={{ background: ROLE_COLOR[lane] }} />
                  {t(lane)}
                </span>
              ))}
            </div>
            <div className="ch-activity-plot">
              {turns.length > 0 && turns.length <= 16 && (
                <div className="ch-turn-axis" aria-hidden="true">
                  {turns.map((turn, turnIndex) => {
                    const x1 = turnIndex === 0 ? 0 : (xOf(turn.start - 1) + xOf(turn.start)) / 2
                    return (
                      <span
                        key={turn.turn}
                        className="ch-turn-tag"
                        style={{ left: `${(x1 / 720) * 100}%` }}
                      >
                        T{turn.turn}
                      </span>
                    )
                  })}
                </div>
              )}
              <svg
                viewBox="0 0 720 120"
                preserveAspectRatio="none"
                role="img"
                aria-label={t('activitySequence')}
                onClick={pick}
                onMouseMove={(event) => setHover(indexAt(event))}
                onMouseLeave={() => setHover(null)}
              >
                {turns.map((turn, turnIndex) => {
                  const x1 = turnIndex === 0 ? 0 : (xOf(turn.start - 1) + xOf(turn.start)) / 2
                  const x2 =
                    turnIndex === turns.length - 1 ? 720 : (xOf(turn.end) + xOf(turn.end + 1)) / 2
                  return (
                    <g key={turn.turn}>
                      {turnIndex % 2 === 1 && (
                        <rect
                          x={x1}
                          y={2}
                          width={Math.max(0, x2 - x1)}
                          height={116}
                          rx={4}
                          className="ch-turn-band"
                        />
                      )}
                      {turnIndex > 0 && (
                        <line x1={x1} x2={x1} y1={4} y2={116} className="ch-turn-divider" />
                      )}
                    </g>
                  )
                })}
                {lanes.map((lane) => (
                  <line
                    key={lane}
                    x1="0"
                    x2="720"
                    y1={yOf(lane)}
                    y2={yOf(lane)}
                    className="ch-lane-line"
                  />
                ))}
                {bridges.map((bridge) => (
                  <line
                    key={bridge.key}
                    x1={bridge.x1}
                    x2={bridge.x2}
                    y1={yOf('tool')}
                    y2={yOf('tool')}
                    className={`ch-tool-bridge ${bridge.isError ? 'is-error' : ''}`}
                  />
                ))}
                <line
                  x1={xOf(effective)}
                  x2={xOf(effective)}
                  y1="14"
                  y2="118"
                  className="ch-timeline-cursor"
                />
                {items.map((item, index) => {
                  const active = index === effective || hover === index
                  const width = active ? Math.min(12, markerWidth + 2) : markerWidth
                  const height = active ? 20 : 16
                  const y = yOf(item.kind) - height / 2
                  const fill = item.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[item.kind]
                  return (
                    <g key={item.id}>
                      <rect
                        x={xOf(index) - width / 2}
                        y={y}
                        width={width}
                        height={height}
                        rx="2.5"
                        fill={fill}
                        opacity={active ? 1 : 0.72}
                      />
                      {item.isError === true && (
                        <rect
                          x={xOf(index) - 4}
                          y={4}
                          width={8}
                          height={8}
                          rx={4}
                          fill="var(--ch-danger)"
                        />
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
          <div className="ch-scrubber-row">
            <input
              className="ch-sequence-slider"
              type="range"
              min="0"
              max={Math.max(0, items.length - 1)}
              value={effective}
              style={{
                background: `linear-gradient(to right, var(--ch-accent) ${sliderPercent}%, var(--ch-track) ${sliderPercent}%)`,
              }}
              onChange={(event) => {
                const item = items[Number(event.target.value)]
                if (item) onFocus(item.id)
              }}
              aria-label={t('activitySequence')}
            />
            <span className="ch-scrubber-pos">
              #{effective + 1} / {items.length}
            </span>
          </div>
          {preview && (
            <div
              className="ch-sequence-preview"
              style={{
                borderLeftColor:
                  preview.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[preview.kind],
              }}
            >
              <div className="ch-step-brief-top">
                <div className="ch-step-brief-meta">
                  <b data-seq={preview.seq} title={`Seq ${preview.seq}`}>
                    #{previewIndex + 1}
                  </b>
                  <span className={`ch-dot-pill ${preview.isError === true ? 'is-err' : ''}`}>
                    <i
                      style={{
                        background:
                          preview.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[preview.kind],
                      }}
                    />
                    {preview.isError === true ? t('failed') : t(preview.kind)}
                  </span>
                  <span className="ch-step-brief-time">
                    T{turnByIndex[previewIndex] ?? 1}
                    {preview.time !== undefined ? ` · ${fmtTime(preview.time)}` : ''}
                  </span>
                </div>
                {previewPair && (
                  <button
                    className="ch-mini-button ch-pair-jump"
                    onClick={() => onFocus(previewPair.id)}
                  >
                    {previewPair.eventType === 'tool/result'
                      ? `${t('jumpResult')} ↗`
                      : `${t('jumpCall')} ↖`}
                  </button>
                )}
              </div>
              <div className="ch-step-brief-text">
                {previewLine(
                  preview.title === 'user' || preview.title === 'assistant'
                    ? preview.text
                    : preview.title,
                  140,
                ) || t(preview.kind)}
              </div>
            </div>
          )}
          <p className="ch-note">{t('sequenceNote')}</p>
        </>
      )}
    </Card>
  )
}

function fileExtension(path: string): string {
  const base = path.split(/[\\/]/).at(-1) ?? path
  const dot = base.lastIndexOf('.')
  if (dot <= 0 || dot === base.length - 1) return 'FILE'
  return base.slice(dot + 1).toUpperCase().slice(0, 5)
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

export function SignalsCard({
  tab,
  onTab,
  summary,
  related,
  currentTitle,
  currentHarness,
  items,
  onFocus,
  onSelect,
  t,
}: {
  tab: SignalTab
  onTab: (tab: SignalTab) => void
  summary: ActivitySummary | null
  related: readonly RelatedSession[]
  currentTitle: string
  currentHarness: string
  items: readonly HistoryItem[]
  onFocus: (id: string) => void
  onSelect: (id: string) => void
  t: Translate
}): ReactElement {
  const [fileFilter, setFileFilter] = useState<'all' | 'reads' | 'writes' | 'searches'>('all')
  const [fileQuery, setFileQuery] = useState('')
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(() => new Set())
  const [cmdFilter, setCmdFilter] = useState<'all' | 'ok' | 'err'>('all')
  const [cmdProgram, setCmdProgram] = useState<string | null>(null)

  const recordIndexById = useMemo(
    () => new Map(items.map((item, idx) => [item.id, { seq: item.seq, pos: idx + 1, item }])),
    [items],
  )

  const files = summary?.files ?? []
  const filteredFiles = useMemo(() => {
    const needle = fileQuery.trim().toLocaleLowerCase()
    return files.filter((file) => {
      if (fileFilter !== 'all' && file[fileFilter] === 0) return false
      if (!needle) return true
      return file.path.toLocaleLowerCase().includes(needle)
    })
  }, [files, fileFilter, fileQuery])

  const commands = summary?.commands ?? []
  const failedCommandCount = useMemo(
    () => commands.filter((command) => command.isError === true).length,
    [commands],
  )
  const okCommandCount = useMemo(
    () => commands.filter((command) => command.isError === false).length,
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
    cmdProgram !== null && programs.some(([prog]) => prog === cmdProgram) ? cmdProgram : null

  const filteredCommands = useMemo(() => {
    return commands.filter((command) => {
      if (cmdFilter === 'err' && command.isError !== true) return false
      if (cmdFilter === 'ok' && command.isError !== false) return false
      if (activeProgram !== null && commandProgram(command.command) !== activeProgram) return false
      return true
    })
  }, [commands, cmdFilter, activeProgram])

  const kindLabels = {
    subagent: 'relationSubagent',
    fork: 'relationFork',
    tree: 'relationTree',
    parent: 'relationParent',
  } as const
  const parents = related.filter((row) => row.role === 'parent')
  const children = related.filter((row) => row.role === 'child')

  return (
    <section className="ch-card ch-signals-card">
      <div className="ch-tab-bar" role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'files'}
          className={`ch-tab-btn ${tab === 'files' ? 'is-active' : ''}`}
          onClick={() => onTab('files')}
        >
          {t('files')}
          <span className="ch-tab-count">{summary?.files.length ?? '—'}</span>
        </button>
        <button
          role="tab"
          aria-selected={tab === 'commands'}
          className={`ch-tab-btn ${tab === 'commands' ? 'is-active' : ''}`}
          onClick={() => onTab('commands')}
        >
          {t('commands')}
          <span className="ch-tab-count">{summary?.commands.length ?? '—'}</span>
          {failedCommandCount > 0 && <span className="ch-tab-err">{failedCommandCount}!</span>}
        </button>
        <button
          role="tab"
          aria-selected={tab === 'family'}
          className={`ch-tab-btn ${tab === 'family' ? 'is-active' : ''}`}
          onClick={() => onTab('family')}
        >
          {t('loadedFamily')}
          <span className="ch-tab-count">{related.length}</span>
        </button>
      </div>

      {tab === 'files' && (
        <div className="ch-signal-panel ch-file-card">
          {files.length > 0 && (
            <div className="ch-subfilter-row">
              <div className="ch-chip-group">
                {(
                  [
                    ['all', t('all'), files.length],
                    ['reads', t('reads'), files.filter((file) => file.reads > 0).length],
                    ['writes', t('writes'), files.filter((file) => file.writes > 0).length],
                    ['searches', t('searches'), files.filter((file) => file.searches > 0).length],
                  ] as const
                ).map(([key, label, count]) => (
                  <button
                    key={key}
                    className={`ch-chip ${fileFilter === key ? 'is-active' : ''}`}
                    aria-pressed={fileFilter === key}
                    onClick={() => setFileFilter(key)}
                  >
                    {label} {count}
                  </button>
                ))}
              </div>
              <input
                className="ch-mini-input"
                value={fileQuery}
                onChange={(event) => setFileQuery(event.target.value)}
                placeholder={t('filterPath')}
                aria-label={t('filterPath')}
              />
            </div>
          )}
          {!summary || files.length === 0 ? (
            <p className="ch-note">{t(summary ? 'noFiles' : 'unavailable')}</p>
          ) : filteredFiles.length === 0 ? (
            <p className="ch-note">{t('noMatches')}</p>
          ) : (
            <div className="ch-file-list">
              {filteredFiles.map((file) => {
                const { dir, base } = splitFilePath(file.path)
                const expanded = expandedFiles.has(file.path)
                return (
                  <div key={file.path} className="ch-file-item">
                    <div className="ch-file-row-wrap">
                      {file.recordIds.length > 1 && (
                        <button
                          className="ch-file-expand"
                          aria-expanded={expanded}
                          aria-label={t('openOperations')}
                          onClick={() =>
                            setExpandedFiles((previous) => {
                              const next = new Set(previous)
                              if (next.has(file.path)) next.delete(file.path)
                              else next.add(file.path)
                              return next
                            })
                          }
                        >
                          {expanded ? '▾' : '▸'}
                        </button>
                      )}
                      <button
                        className="ch-file-row"
                        title={file.path}
                        onClick={() => onFocus(file.recordIds[0])}
                      >
                        <div className="ch-file-left">
                          <span className="ch-ext-badge">{fileExtension(file.path)}</span>
                          <span className="ch-file-path">
                            {dir && <span className="ch-file-dir">{dir}</span>}
                            <strong>{base}</strong>
                          </span>
                        </div>
                        <span className="ch-op-badges">
                          {file.reads > 0 && (
                            <i className="ch-op-tag">
                              <em className="is-tool" />
                              {t('readShort')} {file.reads}
                            </i>
                          )}
                          {file.writes > 0 && (
                            <i className="ch-op-tag">
                              <em className="is-assistant" />
                              {t('writeShort')} {file.writes}
                            </i>
                          )}
                          {file.searches > 0 && (
                            <i className="ch-op-tag">
                              <em className="is-warn" />
                              {t('searchShort')} {file.searches}
                            </i>
                          )}
                        </span>
                      </button>
                    </div>
                    {expanded && file.recordIds.length > 1 && (
                      <div className="ch-file-ops">
                        {file.recordIds.map((recordId) => {
                          const entry = recordIndexById.get(recordId)
                          return (
                            <button
                              key={recordId}
                              className="ch-op-jump"
                              onClick={() => onFocus(recordId)}
                            >
                              ↗ {entry?.item.toolName ?? t('tool')} #{entry?.pos ?? ''}
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
        </div>
      )}

      {tab === 'commands' && (
        <div className="ch-signal-panel ch-command-card">
          {commands.length > 0 && (
            <>
              <div className="ch-subfilter-row">
                <div className="ch-chip-group">
                  {(
                    [
                      ['all', t('all'), commands.length],
                      ['ok', t('statusOk'), okCommandCount],
                      ['err', t('failed'), failedCommandCount],
                    ] as const
                  ).map(([key, label, count]) => (
                    <button
                      key={key}
                      className={`ch-chip ${cmdFilter === key ? 'is-active' : ''}`}
                      aria-pressed={cmdFilter === key}
                      onClick={() => {
                        setCmdFilter(key)
                        if (key === 'all') setCmdProgram(null)
                      }}
                    >
                      {label} {count}
                    </button>
                  ))}
                </div>
                <span className="ch-note">{t('programFilter')}</span>
              </div>
              {programs.length > 0 && (
                <div className="ch-prog-bars">
                  {programs.map(([prog, count]) => (
                    <button
                      key={prog}
                      className={`ch-prog-chip ${activeProgram === prog ? 'is-active' : ''}`}
                      aria-pressed={activeProgram === prog}
                      onClick={() => setCmdProgram((prev) => (prev === prog ? null : prog))}
                    >
                      <span>{prog}</span>
                      <b>×{count}</b>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          {!summary || commands.length === 0 ? (
            <p className="ch-note">{t(summary ? 'noCommands' : 'unavailable')}</p>
          ) : filteredCommands.length === 0 ? (
            <p className="ch-note">{t('noMatches')}</p>
          ) : (
            <div className="ch-command-list">
              {filteredCommands.map((command) => (
                <div
                  key={command.id}
                  className={`ch-command-row ${command.isError ? 'is-error' : ''}`}
                >
                  <button className="ch-command-main" onClick={() => onFocus(command.recordId)}>
                    <span
                      className={
                        command.isError
                          ? 'ch-cmd-status ch-result-error'
                          : command.resultId && command.isError === false
                            ? 'ch-cmd-status ch-result-known'
                            : 'ch-cmd-status ch-result-state'
                      }
                      title={t(
                        command.isError ? 'failed' : command.resultId ? 'completed' : 'pending',
                      )}
                    >
                      {command.isError
                        ? '!'
                        : command.resultId
                          ? command.isError === false
                            ? '✓'
                            : '↳'
                          : '…'}
                    </span>
                    <span className="ch-command-seq">#{command.seq}</span>
                    <code>{renderShellTokens(command.command)}</code>
                  </button>
                  {command.resultId && (
                    <button
                      className="ch-command-result"
                      onClick={() => onFocus(command.resultId!)}
                    >
                      {t('toolOutput')} ↗
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'family' && (
        <div className="ch-signal-panel ch-family-card">
          {related.length === 0 ? (
            <p className="ch-note">{t('noFamily')}</p>
          ) : (
            <div className="ch-family-list">
              {parents.map((row) => (
                <button
                  key={`${row.role}:${row.id}`}
                  className="ch-family-row"
                  title={row.title || row.id}
                  onClick={() => onSelect(row.id)}
                >
                  <div className="ch-family-node-main">
                    <div className="ch-family-node-tags">
                      <span className="ch-dot-pill">
                        <i className="is-user" />
                        {t('parentConversation')} · {t(kindLabels[row.kind])}
                      </span>
                      {row.harness && <span className="ch-meta-tag">{row.harness}</span>}
                    </div>
                    <b>{row.title || row.id}</b>
                  </div>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
              <div className="ch-family-current">
                <div className="ch-family-node-main">
                  <div className="ch-family-node-tags">
                    <span className="ch-dot-pill">
                      <i className="is-assistant" />
                      {t('currentSession')}
                    </span>
                    <span className="ch-meta-tag">{currentHarness}</span>
                  </div>
                  <b>{currentTitle}</b>
                </div>
                <span aria-hidden="true">●</span>
              </div>
              {children.map((row) => (
                <button
                  key={`${row.role}:${row.id}`}
                  className="ch-family-row is-child"
                  title={row.title || row.id}
                  onClick={() => onSelect(row.id)}
                >
                  <div className="ch-family-node-main">
                    <div className="ch-family-node-tags">
                      <span className="ch-dot-pill">
                        <i className="is-event" />
                        {t(kindLabels[row.kind])}
                      </span>
                      {row.harness && <span className="ch-meta-tag">{row.harness}</span>}
                    </div>
                    <b>{row.title || row.id}</b>
                  </div>
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
          )}
          <p className="ch-note">{t('familyScope')}</p>
        </div>
      )}
    </section>
  )
}
