import { memo, useMemo, useState, type MouseEvent, type ReactElement } from 'react'
import { fmt, fmtTime } from '../client/format.ts'
import type { HistoryItem } from './api.ts'
import type { RelatedSession } from './relationships.ts'
import type { Translate } from './i18n.ts'
import { Card } from './components.tsx'
import { previewLine } from './format.ts'
import { eventIndexAt, eventX } from './event-geometry.ts'
import { occupancyOf, type Usage } from './model.ts'

export const ROLE_COLOR = {
  user: 'var(--ch-green)',
  assistant: 'var(--ch-blue)',
  tool: 'var(--ch-teal)',
  event: 'var(--ch-purple)',
}

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

const LANES = ['user', 'assistant', 'tool', 'event'] as const

function laneY(kind: HistoryItem['kind']): number {
  return 26 + LANES.indexOf(kind) * 25
}

export const ActivityTimeline = memo(function ActivityTimeline({
  items,
  pairs,
  matchedIds,
  available,
  loading,
  focus,
  onFocus,
  t,
}: {
  items: readonly HistoryItem[]
  pairs: ReadonlyMap<string, string>
  matchedIds?: ReadonlySet<string>
  available: boolean
  loading: boolean
  focus?: string
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const [hover, setHover] = useState<number | null>(null)
  const indexById = useMemo(() => new Map(items.map((item, idx) => [item.id, idx])), [items])
  const selected = focus !== undefined ? (indexById.get(focus) ?? -1) : -1
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
  const xOf = (index: number) => eventX(index, items.length)
  const markerWidth = Math.max(3.5, Math.min(10, 560 / Math.max(1, items.length)))
  const previewIndex = hover !== null && items[hover] ? hover : effective
  const preview = items[previewIndex]
  const { turns, turnByIndex } = useMemo(() => computeTurns(items), [items])
  const turnByNumber = useMemo(() => new Map(turns.map((span) => [span.turn, span])), [turns])
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
        x1: eventX(index, items.length),
        x2: eventX(targetIndex, items.length),
        isError: result?.isError === true || item.isError === true,
      })
    }
    return list
  }, [items, pairs, indexById])
  const staticPlot = useMemo(
    () => (
      <>
        {turns.map((turn, turnIndex) => {
          const x1 =
            turnIndex === 0
              ? 0
              : (eventX(turn.start - 1, items.length) + eventX(turn.start, items.length)) / 2
          const x2 =
            turnIndex === turns.length - 1
              ? 720
              : (eventX(turn.end, items.length) + eventX(turn.end + 1, items.length)) / 2
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
        {LANES.map((lane) => (
          <line
            key={lane}
            x1="0"
            x2="720"
            y1={laneY(lane)}
            y2={laneY(lane)}
            className="ch-lane-line"
          />
        ))}
        {bridges.map((bridge) => (
          <line
            key={bridge.key}
            x1={bridge.x1}
            x2={bridge.x2}
            y1={laneY('tool')}
            y2={laneY('tool')}
            className={`ch-tool-bridge ${bridge.isError ? 'is-error' : ''}`}
          />
        ))}
        {items.map((item, index) => {
          const cx = eventX(index, items.length)
          const y = laneY(item.kind) - 8
          const fill = item.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[item.kind]
          const dimmed = matchedIds !== undefined && !matchedIds.has(item.id)
          return (
            <g key={item.id}>
              <rect
                x={cx - markerWidth / 2}
                y={y}
                width={markerWidth}
                height={16}
                rx="2.5"
                fill={fill}
                opacity={dimmed ? 0.16 : matchedIds !== undefined ? 0.94 : 0.76}
              />
              {item.isError === true && (
                <rect
                  x={cx - 4}
                  y={4}
                  width={8}
                  height={8}
                  rx={4}
                  fill="var(--ch-danger)"
                  opacity={dimmed ? 0.2 : 1}
                />
              )}
            </g>
          )
        })}
      </>
    ),
    [items, turns, bridges, markerWidth, matchedIds],
  )
  const previewPairId = preview ? pairs.get(preview.id) : undefined
  const previewPair = previewPairId ? items[indexById.get(previewPairId) ?? -1] : undefined
  const activeTurn = turnByIndex[previewIndex] ?? 1
  const activeTurnSpan = turnByNumber.get(activeTurn)
  const turnUserRecord = useMemo(() => {
    if (!activeTurnSpan) return undefined
    for (let idx = activeTurnSpan.start; idx <= activeTurnSpan.end; idx++) {
      if (items[idx]?.kind === 'user') return items[idx]
    }
    return undefined
  }, [activeTurnSpan, items])
  const turnReplyRecord = useMemo(() => {
    if (!activeTurnSpan) return undefined
    for (let idx = activeTurnSpan.end; idx >= activeTurnSpan.start; idx--) {
      if (items[idx]?.kind === 'assistant') return items[idx]
    }
    return undefined
  }, [activeTurnSpan, items])
  const sliderPercent = items.length > 1 ? (effective / (items.length - 1)) * 100 : 100
  const highlightIndices =
    hover !== null && hover !== effective && items[hover]
      ? [effective, hover]
      : items[effective]
        ? [effective]
        : []
  return (
    <Card
      title={t('activityTimeline')}
      className="ch-activity-timeline"
      aside={
        <div className="ch-tl-aside">
          {matchedIds !== undefined && (
            <span className="ch-tl-filter-badge">
              {t('filteredTimelineHint')} · <b>{matchedIds.size}</b>
            </span>
          )}
          <span className="ch-card-rate">
            {items.length ? `${items.length}` : '—'} {t('count')}
            {turns.length > 0 ? ` · ${turns.length} ${t('turnsCount')}` : ''}
          </span>
        </div>
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
              {LANES.map((lane) => (
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
                onMouseMove={(event) => {
                  const next = indexAt(event)
                  setHover((previous) => (previous === next ? previous : next))
                }}
                onMouseLeave={() => setHover(null)}
              >
                {staticPlot}
                <line
                  x1={xOf(effective)}
                  x2={xOf(effective)}
                  y1="14"
                  y2="118"
                  className="ch-timeline-cursor"
                />
                {highlightIndices.map((index) => {
                  const item = items[index]
                  if (!item) return null
                  const width = Math.min(12, markerWidth + 2)
                  const fill = item.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[item.kind]
                  return (
                    <rect
                      key={`hi-${item.id}`}
                      x={xOf(index) - width / 2}
                      y={laneY(item.kind) - 10}
                      width={width}
                      height={20}
                      rx="2.5"
                      fill={fill}
                      opacity={1}
                    />
                  )
                })}
              </svg>
            </div>
          </div>
          {turns.length >= 2 && turns.length <= 24 && (
            <div className="ch-turn-strip" role="group" aria-label={t('turnsLabel')}>
              {turns.map((turn) => (
                <button
                  key={turn.turn}
                  type="button"
                  className={`ch-turn-pill ${turn.turn === activeTurn ? 'is-active' : ''}`}
                  title={`${t('turnShort')} ${turn.turn}`}
                  onClick={() => {
                    const target = items[turn.end]
                    if (target) onFocus(target.id)
                  }}
                >
                  T{turn.turn}
                </button>
              ))}
            </div>
          )}
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
                  <strong className="ch-sb-turn">
                    {t('turnShort')} {activeTurn} · #{previewIndex + 1} {t('stepOf')} {items.length}
                  </strong>
                  <b data-seq={preview.seq} title={`Seq ${preview.seq}`}>
                    #{preview.seq}
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
                </div>
                <div className="ch-sb-right">
                  {preview.time !== undefined && (
                    <span className="ch-step-brief-time">{fmtTime(preview.time)}</span>
                  )}
                  {previewPair && (
                    <button
                      type="button"
                      className="ch-mini-button ch-pair-jump"
                      onClick={() => onFocus(previewPair.id)}
                    >
                      {previewPair.eventType === 'tool/result'
                        ? `${t('jumpResult')} ↗`
                        : `${t('jumpCall')} ↖`}
                    </button>
                  )}
                </div>
              </div>
              <div className="ch-sb-rows">
                {turnUserRecord && (
                  <button
                    type="button"
                    className="ch-sb-row"
                    onClick={() => onFocus(turnUserRecord.id)}
                  >
                    <span className="ch-sb-tag">{t('stepUser')}</span>
                    <span className="ch-sb-text">
                      {previewLine(turnUserRecord.text, 120) || t('user')}
                    </span>
                  </button>
                )}
                <button type="button" className="ch-sb-row" onClick={() => onFocus(preview.id)}>
                  <span className="ch-sb-tag">{t('stepRecord')}</span>
                  <span className="ch-sb-chip">
                    <span className="ch-sb-chip-tool">{preview.toolName ?? t(preview.kind)}</span>
                    <span className="ch-sb-text">
                      {previewLine(
                        preview.title === 'user' || preview.title === 'assistant'
                          ? preview.text
                          : preview.title,
                        120,
                      ) || t(preview.kind)}
                    </span>
                  </span>
                </button>
                {turnReplyRecord && turnReplyRecord.id !== preview.id && (
                  <button
                    type="button"
                    className="ch-sb-row"
                    onClick={() => onFocus(turnReplyRecord.id)}
                  >
                    <span className="ch-sb-tag">{t('stepReply')}</span>
                    <span className="ch-sb-text">
                      {previewLine(turnReplyRecord.text, 120) || t('assistant')}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
          <p className="ch-note">{t('sequenceNote')}</p>
        </>
      )}
    </Card>
  )
})

function initialsOf(text: string): string {
  const words = text
    .replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return (text.trim().slice(0, 2) || 'CH').toUpperCase()
}

export const SessionNetworkCard = memo(function SessionNetworkCard({
  related,
  currentTitle,
  currentHarness,
  currentUsage,
  onSelect,
  t,
}: {
  related: readonly RelatedSession[]
  currentTitle: string
  currentHarness: string
  currentUsage: Usage | null
  onSelect: (id: string) => void
  t: Translate
}): ReactElement {
  const kindLabels = {
    subagent: 'relationSubagent',
    fork: 'relationFork',
    tree: 'relationTree',
    parent: 'relationParent',
  } as const
  const parents = related.filter((row) => row.role === 'parent')
  const children = related.filter((row) => row.role === 'child')
  const occ = occupancyOf(currentUsage)
  return (
    <Card
      title={t('loadedFamily')}
      className="ch-family-card"
      aside={
        <span className="ch-card-rate">
          <b>{related.length + 1}</b> {t('linkedNodes')}
        </span>
      }
    >
      {related.length === 0 ? (
        <p className="ch-note">{t('noFamily')}</p>
      ) : (
        <div className="ch-net-stage">
          {parents.length > 0 && (
            <>
              <div className="ch-net-tier">
                {parents.map((row) => (
                  <button
                    key={`${row.role}:${row.id}`}
                    type="button"
                    className="ch-net-node ch-family-row"
                    title={row.title || row.id}
                    onClick={() => onSelect(row.id)}
                  >
                    <div className="ch-net-head">
                      <span className="ch-net-av is-parent">{initialsOf(row.title || row.id)}</span>
                      <b className="ch-net-title">{row.title || row.id}</b>
                      <span className="ch-meta-tag">{t(kindLabels[row.kind])}</span>
                    </div>
                    <div className="ch-net-foot">
                      <span>
                        {t('parentConversation')}
                        {row.harness ? ` · ${row.harness}` : ''}
                      </span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </button>
                ))}
              </div>
              <svg className="ch-net-connector" viewBox="0 0 600 22" preserveAspectRatio="none" aria-hidden="true">
                <path d="M300,0 C300,11 300,11 300,22" />
              </svg>
            </>
          )}

          <div className="ch-net-tier">
            <div className="ch-net-node is-current">
              <div className="ch-net-head">
                <span className="ch-net-av is-current">{initialsOf(currentHarness)}</span>
                <b className="ch-net-title" title={currentTitle}>
                  {currentTitle}
                </b>
                <span className="ch-meta-tag is-current">{t('currentSession')}</span>
              </div>
              <div className="ch-net-bar">
                <i style={{ width: `${Math.min(100, occ?.percent ?? 0)}%` }} />
              </div>
              <div className="ch-net-foot">
                <span>
                  {currentHarness}
                  {occ?.used !== undefined && occ.capacity !== undefined
                    ? ` · ${fmt(occ.used)} / ${fmt(occ.capacity)}`
                    : ''}
                </span>
                <b>{occ ? `${occ.percent.toFixed(1)}%` : '—'}</b>
              </div>
            </div>
          </div>

          {children.length > 0 && (
            <>
              <svg className="ch-net-connector" viewBox="0 0 600 22" preserveAspectRatio="none" aria-hidden="true">
                {children.length === 1 ? (
                  <path d="M300,0 C300,11 300,11 300,22" />
                ) : (
                  children.slice(0, 4).map((child, idx, arr) => {
                    const targetX = 120 + (idx / (arr.length - 1)) * 360
                    return (
                      <path
                        key={child.id}
                        d={`M300,0 C300,12 ${targetX.toFixed(0)},10 ${targetX.toFixed(0)},22`}
                      />
                    )
                  })
                )}
              </svg>
              <div className="ch-net-tier">
                {children.map((row) => (
                  <button
                    key={`${row.role}:${row.id}`}
                    type="button"
                    className="ch-net-node ch-family-row is-child"
                    title={row.title || row.id}
                    onClick={() => onSelect(row.id)}
                  >
                    <div className="ch-net-head">
                      <span className="ch-net-av is-child">{initialsOf(row.title || row.id)}</span>
                      <b className="ch-net-title">{row.title || row.id}</b>
                      <span className="ch-meta-tag">{t(kindLabels[row.kind])}</span>
                    </div>
                    <div className="ch-net-foot">
                      <span>{row.harness ?? 'CodexHost'}</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <p className="ch-note">{t('familyScope')}</p>
    </Card>
  )
})

