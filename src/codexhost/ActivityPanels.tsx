import { memo, useMemo, useState, type MouseEvent, type ReactElement } from 'react'
import { fmt, fmtTime } from '../client/format.ts'
import type { HistoryItem } from './api.ts'
import { Card } from './components.tsx'
import { eventIndexAt, eventX } from './event-geometry.ts'
import { previewLine } from './format.ts'
import type { Translate } from './i18n.ts'
import { occupancyOf, type Usage } from './model.ts'
import type { RelatedSession } from './relationships.ts'
import {
  buildTimelineModel,
  KIND_ORDER,
  type TimelineGranularity,
  type TimelineMilestoneKind,
  type TimelineScaleMode,
} from './timeline-model.ts'

export const ROLE_COLOR: Record<HistoryItem['kind'], string> = {
  user: 'var(--ch-green)',
  assistant: 'var(--ch-blue)',
  tool: 'var(--ch-teal)',
  event: 'var(--ch-purple)',
}

const PLOT_TOP = 10
const PLOT_BOTTOM = 136
const PLOT_SPAN = PLOT_BOTTOM - PLOT_TOP

function MilestoneGlyph({ kind }: { kind: TimelineMilestoneKind }): ReactElement {
  if (kind === 'error') {
    return (
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.1" aria-hidden="true">
        <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 11l4-4 3 3 4-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 5h4v4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export const ActivityTimeline = memo(function ActivityTimeline({
  items,
  pairs,
  matchedIds,
  available,
  loading,
  focus,
  onFocus,
  onRevealBrowser,
  t,
}: {
  items: readonly HistoryItem[]
  pairs: ReadonlyMap<string, string>
  matchedIds?: ReadonlySet<string>
  available: boolean
  loading: boolean
  focus?: string
  onFocus: (id: string) => void
  onRevealBrowser?: (id: string) => void
  t: Translate
}): ReactElement {
  const [hoverBucketIdx, setHoverBucketIdx] = useState<number | null>(null)
  const [dnaMode, setDnaMode] = useState(false)
  const [granularity, setGranularity] = useState<TimelineGranularity>('step')
  const [scaleMode, setScaleMode] = useState<TimelineScaleMode>('total')
  const [activeTurnFilter, setActiveTurnFilter] = useState<number | null>(null)
  const [hoverKind, setHoverKind] = useState<HistoryItem['kind'] | null>(null)

  const indexById = useMemo(() => new Map(items.map((item, idx) => [item.id, idx])), [items])
  const model = useMemo(
    () => buildTimelineModel(items, granularity, dnaMode),
    [items, granularity, dnaMode],
  )
  const buckets = model.buckets
  const isDelta = scaleMode === 'delta'
  const maxVal = Math.max(1, isDelta ? model.maxDelta : model.maxTotal)

  const selectedRecordIdx = focus !== undefined ? (indexById.get(focus) ?? -1) : -1
  const effectiveRecordIdx = selectedRecordIdx < 0 ? Math.max(0, items.length - 1) : selectedRecordIdx

  const effectiveBucketIdx = useMemo(() => {
    if (buckets.length === 0) return 0
    if (granularity === 'step') return Math.min(buckets.length - 1, Math.max(0, effectiveRecordIdx))
    const found = buckets.findIndex(
      (bucket) => effectiveRecordIdx >= bucket.startIndex && effectiveRecordIdx <= bucket.endIndex,
    )
    return found < 0 ? buckets.length - 1 : found
  }, [buckets, granularity, effectiveRecordIdx])

  const validHoverIdx =
    hoverBucketIdx !== null && hoverBucketIdx >= 0 && hoverBucketIdx < buckets.length
      ? hoverBucketIdx
      : null
  const previewBucketIdx = validHoverIdx ?? effectiveBucketIdx
  const previewBucket = buckets[previewBucketIdx]
  const preview =
    granularity === 'step'
      ? items[previewBucketIdx]
      : (previewBucket?.item ?? items[effectiveRecordIdx])
  const previewRecordIdx = preview ? (indexById.get(preview.id) ?? effectiveRecordIdx) : effectiveRecordIdx

  const bucketIndexAt = (event: MouseEvent<SVGSVGElement>): number | null => {
    if (buckets.length === 0) return null
    const bounds = event.currentTarget.getBoundingClientRect()
    return bounds.width > 0
      ? eventIndexAt((event.clientX - bounds.left) / bounds.width, buckets.length)
      : null
  }
  const pick = (event: MouseEvent<SVGSVGElement>): void => {
    const idx = bucketIndexAt(event)
    const bucket = idx !== null ? buckets[idx] : undefined
    if (bucket) onFocus(bucket.recordId)
  }

  const xOf = (idx: number): number => eventX(idx, buckets.length)
  const barWidth = Math.max(2.6, Math.min(13.5, (690 / Math.max(1, buckets.length)) * 0.78))

  const activeTurn = previewBucket?.turn ?? model.turnByRecordIndex[previewRecordIdx] ?? 1
  const showTurnRibbon = model.turns.length >= 2 && model.turns.length <= 24
  const turnFilterValid =
    showTurnRibbon &&
    activeTurnFilter !== null &&
    model.turns.some((span) => span.turn === activeTurnFilter)
      ? activeTurnFilter
      : null
  const activeTurnSpan = useMemo(
    () => model.turns.find((span) => span.turn === activeTurn),
    [model.turns, activeTurn],
  )
  const turnUserRecord = useMemo(() => {
    if (!activeTurnSpan) return undefined
    for (let idx = activeTurnSpan.startIndex; idx <= activeTurnSpan.endIndex; idx++) {
      if (items[idx]?.kind === 'user') return items[idx]
    }
    return undefined
  }, [activeTurnSpan, items])
  const turnReplyRecord = useMemo(() => {
    if (!activeTurnSpan) return undefined
    for (let idx = activeTurnSpan.endIndex; idx >= activeTurnSpan.startIndex; idx--) {
      if (items[idx]?.kind === 'assistant') return items[idx]
    }
    return undefined
  }, [activeTurnSpan, items])

  const previewPairId = preview ? pairs.get(preview.id) : undefined
  const previewPair = previewPairId ? items[indexById.get(previewPairId) ?? -1] : undefined
  const sliderPercent = items.length > 1 ? (effectiveRecordIdx / (items.length - 1)) * 100 : 100

  const yTicks = useMemo(
    () =>
      [1, 0.75, 0.5, 0.25, 0].map((fraction, idx) => {
        const value = Math.round(maxVal * fraction)
        const text = value === 0 ? '0' : `${isDelta ? '+' : ''}${fmt(value)}`
        return { key: idx, topPct: ((PLOT_TOP + idx * (PLOT_SPAN / 4)) / 140) * 100, text }
      }),
    [maxVal, isDelta],
  )

  const previewBreakdown = previewBucket
    ? isDelta
      ? previewBucket.deltaByKind
      : previewBucket.totalByKind
    : null
  const previewBreakdownSum = previewBreakdown
    ? Object.values(previewBreakdown).reduce((sum, v) => sum + v, 0)
    : 0
  const activeHoverKind = hoverKind !== null && previewBreakdownSum > 0 ? hoverKind : null

  const barsSvg = useMemo(() => {
    return (
      <>
        {[0, 1, 2, 3, 4].map((idx) => {
          const y = PLOT_TOP + idx * (PLOT_SPAN / 4)
          return (
            <line
              key={idx}
              x1="0"
              x2="720"
              y1={y}
              y2={y}
              className={idx === 4 ? 'ch-tl-zero-line' : 'ch-lane-line'}
            />
          )
        })}
        {model.turns.map((turn, turnIndex) => {
          if (turnIndex % 2 !== 1 || buckets.length === 0) return null
          const startB = granularity === 'step' ? turn.startIndex : turnIndex
          const endB = granularity === 'step' ? turn.endIndex : turnIndex
          const x1 =
            startB === 0 ? 0 : (eventX(startB - 1, buckets.length) + eventX(startB, buckets.length)) / 2
          const x2 =
            endB === buckets.length - 1
              ? 720
              : (eventX(endB, buckets.length) + eventX(endB + 1, buckets.length)) / 2
          return (
            <rect
              key={`band-${turn.turn}`}
              x={x1}
              y={PLOT_TOP}
              width={Math.max(0, x2 - x1)}
              height={PLOT_SPAN}
              rx={3}
              className="ch-turn-band"
            />
          )
        })}
        {buckets.map((bucket) => {
          const cx = eventX(bucket.index, buckets.length)
          const value = isDelta ? bucket.deltaChars : bucket.totalChars
          const baseY = PLOT_BOTTOM
          const inTurn = turnFilterValid === null || bucket.turn === turnFilterValid
          const matchesFilter =
            matchedIds === undefined ||
            (granularity === 'step'
              ? matchedIds.has(bucket.recordId)
              : items
                  .slice(bucket.startIndex, bucket.endIndex + 1)
                  .some((entry) => matchedIds.has(entry.id)))
          const groupOpacity = !inTurn || !matchesFilter ? 0.2 : 1
          const x = cx - barWidth / 2

          if (value <= 0) {
            return (
              <rect
                key={bucket.key}
                x={x}
                y={baseY - 3}
                width={barWidth}
                height={3}
                rx={1}
                fill={bucket.item.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[bucket.item.kind]}
                opacity={groupOpacity * 0.55}
              />
            )
          }

          const barH = Math.min(PLOT_SPAN, Math.max(4, (value / maxVal) * PLOT_SPAN))
          const barTop = baseY - barH

          if (dnaMode) {
            const runs = isDelta ? bucket.dnaDelta : bucket.dnaCumulative
            const runSum = runs.reduce((sum, run) => sum + run.chars, 0) || 1
            let acc = 0
            let prevY = baseY
            return (
              <g key={bucket.key} opacity={groupOpacity}>
                {runs.map((run, runIdx) => {
                  acc += run.chars
                  const nextY =
                    runIdx === runs.length - 1
                      ? barTop
                      : Math.max(barTop, barTop + ((runSum - acc) / runSum) * barH)
                  const drawH = Math.max(0, prevY - nextY)
                  prevY = nextY
                  if (drawH <= 0) return null
                  const dimmed = activeHoverKind !== null && run.kind !== activeHoverKind
                  return (
                    <rect
                      key={runIdx}
                      x={x}
                      y={nextY}
                      width={barWidth}
                      height={Math.min(drawH + 0.2, baseY - nextY)}
                      fill={run.isError ? 'var(--ch-danger)' : ROLE_COLOR[run.kind]}
                      opacity={dimmed ? 0.24 : 0.94}
                    />
                  )
                })}
              </g>
            )
          }

          const byKind = isDelta ? bucket.deltaByKind : bucket.totalByKind
          const sum = Object.values(byKind).reduce((acc, v) => acc + v, 0) || 1
          const activeKinds = KIND_ORDER.filter((kind) => byKind[kind] > 0)
          let acc = 0
          let prevY = baseY
          return (
            <g key={bucket.key} opacity={groupOpacity}>
              {activeKinds.map((kind, kindIdx) => {
                acc += byKind[kind]
                const nextY =
                  kindIdx === activeKinds.length - 1
                    ? barTop
                    : Math.max(barTop, barTop + ((sum - acc) / sum) * barH)
                const drawH = Math.max(0, prevY - nextY)
                prevY = nextY
                if (drawH <= 0) return null
                const dimmed = activeHoverKind !== null && kind !== activeHoverKind
                const isErrBar = isDelta && granularity === 'step' && bucket.item.isError === true
                return (
                  <rect
                    key={kind}
                    x={x}
                    y={nextY}
                    width={barWidth}
                    height={Math.min(drawH + 0.2, baseY - nextY)}
                    rx={barWidth > 7 ? 1 : 0}
                    fill={isErrBar ? 'var(--ch-danger)' : ROLE_COLOR[kind]}
                    opacity={dimmed ? 0.24 : 0.92}
                  />
                )
              })}
            </g>
          )
        })}
      </>
    )
  }, [
    buckets,
    model.turns,
    granularity,
    isDelta,
    maxVal,
    turnFilterValid,
    matchedIds,
    items,
    barWidth,
    dnaMode,
    activeHoverKind,
  ])

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
          <button
            type="button"
            className={`ch-mini-button ch-tl-dna-btn ${dnaMode ? 'is-active' : ''}`}
            aria-pressed={dnaMode}
            onClick={() => setDnaMode((value) => !value)}
          >
            {t('dnaMode')}
          </button>
          <div className="ch-seg" role="group" aria-label={t('turnsLabel')}>
            <button
              type="button"
              className={granularity === 'step' ? 'is-active' : ''}
              aria-pressed={granularity === 'step'}
              onClick={() => setGranularity('step')}
            >
              {t('granStep')}
            </button>
            <button
              type="button"
              className={granularity === 'turn' ? 'is-active' : ''}
              aria-pressed={granularity === 'turn'}
              onClick={() => setGranularity('turn')}
            >
              {t('granTurn')}
            </button>
          </div>
          <div className="ch-seg" role="group" aria-label={t('scaleModeLabel')}>
            <button
              type="button"
              className={scaleMode === 'total' ? 'is-active' : ''}
              aria-pressed={scaleMode === 'total'}
              onClick={() => setScaleMode('total')}
            >
              {t('modeTotal')}
            </button>
            <button
              type="button"
              className={scaleMode === 'delta' ? 'is-active' : ''}
              aria-pressed={scaleMode === 'delta'}
              onClick={() => setScaleMode('delta')}
            >
              {t('modeDelta')}
            </button>
          </div>
          <span className="ch-card-rate">
            {items.length ? `${items.length}` : '—'} {t('count')}
            {model.turns.length > 0 ? ` · ${model.turns.length} ${t('turnsCount')}` : ''}
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
          <div className="ch-activity-chart ch-tl-v3-chart">
            <div className="ch-tl-yaxis" aria-hidden="true">
              {yTicks.map((tick) => (
                <span key={tick.key} style={{ top: `${tick.topPct.toFixed(1)}%` }}>
                  {tick.text}
                </span>
              ))}
            </div>
            <div className="ch-activity-plot">
              <div className="ch-tl-overlay-band">
                {model.stepFlags.map((flagIdx) => {
                  const bucket = buckets[flagIdx]
                  if (!bucket) return null
                  const leftPct = (xOf(flagIdx) / 720) * 100
                  return (
                    <span
                      key={`flag-${bucket.seq}`}
                      className="ch-tl-flag"
                      style={{ left: `${leftPct.toFixed(2)}%` }}
                      aria-hidden="true"
                    >
                      <i>#{bucket.seq}</i>
                    </span>
                  )
                })}
                {buckets.map((bucket) => {
                  if (!bucket.milestone) return null
                  const ms = bucket.milestone
                  const leftPct = (xOf(bucket.index) / 720) * 100
                  const isActivePin = previewBucket?.index === bucket.index
                  const countSuffix = ms.count > 1 ? ` ×${ms.count}` : ''
                  const pinLabel = `${t(ms.labelKey)}${countSuffix} · #${ms.seq} ${ms.detail}`
                  return (
                    <div
                      key={`ms-${bucket.key}`}
                      className={`ch-ms-pin is-${ms.kind} ${isActivePin ? 'is-active' : ''}`}
                      style={{ left: `${leftPct.toFixed(2)}%` }}
                    >
                      <button
                        type="button"
                        className="ch-ms-head"
                        title={pinLabel}
                        aria-label={pinLabel}
                        onClick={() => onFocus(ms.targetId)}
                      >
                        <span className="ch-ms-badge">
                          <MilestoneGlyph kind={ms.kind} />
                        </span>
                      </button>
                      <span className="ch-ms-pole" aria-hidden="true" />
                    </div>
                  )
                })}
                {validHoverIdx !== null && previewBucket && (() => {
                  const xPct = (xOf(validHoverIdx) / 720) * 100
                  const tooltipStyle =
                    xPct < 22
                      ? { left: '0%', transform: 'none' }
                      : xPct > 78
                        ? { right: '0%', left: 'auto', transform: 'none' }
                        : { left: `${xPct.toFixed(1)}%` }
                  const turnRecords = previewBucket.endIndex - previewBucket.startIndex + 1
                  const msBadge = previewBucket.milestone
                    ? `[${t(previewBucket.milestone.labelKey)}${previewBucket.milestone.count > 1 ? ` ×${previewBucket.milestone.count}` : ''}] `
                    : ''
                  return (
                    <div className="ch-tl-tooltip" style={tooltipStyle}>
                      <strong>
                        {t('turnShort')} {previewBucket.turn} ·{' '}
                        {granularity === 'turn'
                          ? `${turnRecords} ${t('count')}`
                          : `#${previewBucket.seq}`}{' '}
                        · {isDelta ? '+' : ''}
                        {fmt(isDelta ? previewBucket.deltaChars : previewBucket.totalChars)}{' '}
                        {t('charsUnit')}
                      </strong>
                      <span>
                        {msBadge}
                        {previewBucket.item.toolName ?? previewLine(previewBucket.item.title, 48)}
                      </span>
                    </div>
                  )
                })()}
              </div>

              <svg
                viewBox="0 0 720 140"
                preserveAspectRatio="none"
                role="img"
                aria-label={t('activitySequence')}
                onClick={pick}
                onMouseMove={(event) => {
                  const next = bucketIndexAt(event)
                  setHoverBucketIdx((previous) => (previous === next ? previous : next))
                }}
                onMouseLeave={() => setHoverBucketIdx(null)}
              >
                {barsSvg}
                {buckets[effectiveBucketIdx] && (
                  <line
                    x1={xOf(effectiveBucketIdx)}
                    x2={xOf(effectiveBucketIdx)}
                    y1={PLOT_TOP}
                    y2={PLOT_BOTTOM}
                    className="ch-timeline-cursor"
                  />
                )}
                {buckets[previewBucketIdx] && (
                  <rect
                    x={xOf(previewBucketIdx) - barWidth / 2 - 1}
                    y={PLOT_TOP}
                    width={barWidth + 2}
                    height={PLOT_SPAN}
                    rx={barWidth > 7 ? 2 : 0}
                    className="ch-tl-active-frame"
                  />
                )}
              </svg>

              {showTurnRibbon && (
                <div className="ch-turn-strip ch-turn-ribbon" role="group" aria-label={t('turnsLabel')}>
                  {model.turns.map((turn) => {
                    const isPinned = turnFilterValid === turn.turn
                    const isTurnActive =
                      turnFilterValid !== null
                        ? isPinned
                        : turn.turn === activeTurn
                    return (
                      <button
                        key={turn.turn}
                        type="button"
                        className={`ch-turn-pill ${isTurnActive ? 'is-active' : ''} ${isPinned ? 'is-pinned' : ''}`}
                        aria-pressed={isPinned}
                        style={{ flex: `${Math.max(1, turn.count)} 1 0` }}
                        title={`${t('turnShort')} ${turn.turn} · ${turn.count} ${t('count')}`}
                        onClick={() => {
                          if (isPinned) {
                            setActiveTurnFilter(null)
                          } else {
                            setActiveTurnFilter(turn.turn)
                            const target = items[turn.endIndex]
                            if (target) onFocus(target.id)
                          }
                        }}
                      >
                        T{turn.turn}
                        {model.turns.length <= 10 ? ` · ${turn.count}` : ''}
                      </button>
                    )
                  })}
                  {turnFilterValid !== null && (
                    <button
                      type="button"
                      className="ch-mini-button"
                      onClick={() => setActiveTurnFilter(null)}
                    >
                      {t('clearTurnFilter')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="ch-scrubber-row">
            <input
              className="ch-sequence-slider"
              type="range"
              min="0"
              max={Math.max(0, items.length - 1)}
              value={effectiveRecordIdx}
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
              #{effectiveRecordIdx + 1} / {items.length}
            </span>
          </div>

          {preview && previewBucket && (
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
                    {t('turnShort')} {activeTurn} · #{previewRecordIdx + 1} {t('stepOf')}{' '}
                    {items.length}
                  </strong>
                  <b data-seq={preview.seq} title={`Seq ${preview.seq}`}>
                    #{preview.seq}
                  </b>
                  <span className="ch-step-metric">
                    {t('cumulativeCharsLabel')} {fmt(previewBucket.totalChars)} {t('charsUnit')}
                  </span>
                  <span className="ch-step-metric is-delta">
                    {t(granularity === 'turn' ? 'turnDeltaLabel' : 'stepDeltaLabel')} +
                    {fmt(previewBucket.deltaChars)} {t('charsUnit')}
                  </span>
                  <span className={`ch-dot-pill ${preview.isError === true ? 'is-err' : ''}`}>
                    <i
                      style={{
                        background:
                          preview.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[preview.kind],
                      }}
                    />
                    {preview.isError === true ? t('failed') : t(preview.kind)}
                  </span>
                  {previewBucket.milestone && (
                    <span
                      className={`ch-step-metric ${previewBucket.milestone.kind === 'error' ? 'is-err' : 'is-amber'}`}
                    >
                      {t(previewBucket.milestone.labelKey)}
                      {previewBucket.milestone.count > 1 ? ` ×${previewBucket.milestone.count}` : ''}
                    </span>
                  )}
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
                  {onRevealBrowser && (
                    <button
                      type="button"
                      className="ch-mini-button is-active"
                      onClick={() => onRevealBrowser(preview.id)}
                    >
                      {t('jumpToBrowserShort')} ↗
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

              {previewBreakdown && previewBreakdownSum > 0 && (
                <div className="ch-step-comp">
                  <div className="ch-step-comp-bar" aria-hidden="true">
                    {KIND_ORDER.map((kind) => {
                      const val = previewBreakdown[kind]
                      if (val <= 0) return null
                      return (
                        <div
                          key={kind}
                          style={{
                            width: `${((val / previewBreakdownSum) * 100).toFixed(2)}%`,
                            background: ROLE_COLOR[kind],
                          }}
                        />
                      )
                    })}
                  </div>
                  <div className="ch-step-comp-leg">
                    {KIND_ORDER.map((kind) => {
                      const val = previewBreakdown[kind]
                      const pct = Math.round((val / previewBreakdownSum) * 100)
                      return (
                        <button
                          key={kind}
                          type="button"
                          className={`ch-step-leg-btn ${activeHoverKind === kind ? 'is-active' : ''}`}
                          aria-pressed={activeHoverKind === kind}
                          onMouseEnter={() => setHoverKind(kind)}
                          onMouseLeave={() => setHoverKind(null)}
                          onFocus={() => setHoverKind(kind)}
                          onBlur={() => setHoverKind(null)}
                          onClick={() => setHoverKind((cur) => (cur === kind ? null : kind))}
                        >
                          <i style={{ background: ROLE_COLOR[kind] }} />
                          <span>{t(kind)}</span>
                          <b>{fmt(val)}</b>
                          <em>{pct}%</em>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          <p className="ch-note">{t('timelineCharsNote')}</p>
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
              <svg
                className="ch-net-connector"
                viewBox="0 0 600 22"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
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
              <svg
                className="ch-net-connector"
                viewBox="0 0 600 22"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
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
