import {
  memo,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react'
import { Donut } from '../client/components/donut.tsx'
import { fmt, fmtDuration, fmtTime } from '../client/format.ts'
import type { HistoryItem } from './api.ts'
import { occupancyOf, tokenParts, type Sample, type Usage } from './model.ts'
import type { Translate } from './i18n.ts'
import { formatCredits, formatUsd } from './format.ts'

export function Icon({ size = 20 }: { size?: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 18V11M12 18V6M19 18V3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export function Metric({
  label,
  value,
  suffix,
  format,
}: {
  label: string
  value: number | undefined
  suffix?: string
  format?: (value: number) => string
}): ReactElement {
  const text =
    value === undefined
      ? '—'
      : format
        ? format(value)
        : suffix === '%'
          ? `${value.toFixed(1)}%`
          : suffix === 'ms'
            ? value === 0
              ? '0ms'
              : fmtDuration(value)
            : suffix === 'tok/s'
              ? `${value.toFixed(1)} ${suffix}`
              : fmt(value)
  return (
    <div className="ch-metric">
      <dt>{label}</dt>
      <dd title={value === undefined ? undefined : String(value)}>{text}</dd>
    </div>
  )
}

export function Card({
  title,
  aside,
  children,
  className = '',
}: {
  title: string
  aside?: ReactNode
  children: ReactNode
  className?: string
}): ReactElement {
  return (
    <section className={`ch-card ${className}`}>
      <header className="ch-card-heading">
        <h2>{title}</h2>
        {aside}
      </header>
      {children}
    </section>
  )
}

const Sparkline = memo(function Sparkline({
  samples,
  tone,
  t,
}: {
  samples: readonly Sample[]
  tone: 'normal' | 'warn' | 'danger'
  t: Translate
}): ReactElement {
  const first = samples[0]
  const last = samples.at(-1)
  const delta = first && last && samples.length > 1 ? last.percent - first.percent : null
  const { points, linePath, areaPath } = useMemo(() => {
    const minP = samples.length
      ? Math.max(0, Math.min(...samples.map((sample) => Math.min(100, sample.percent))) - 6)
      : 0
    const maxP = samples.length
      ? Math.min(100, Math.max(...samples.map((sample) => Math.min(100, sample.percent))) + 6)
      : 100
    const spanP = Math.max(12, maxP - minP)
    const nextPoints = samples.map((sample, index) => {
      const x = samples.length === 1 ? 210 : 12 + (index / (samples.length - 1)) * 396
      const clamped = Math.min(100, Math.max(0, sample.percent))
      const y = 38 - ((clamped - minP) / spanP) * 30
      return { x, y, sample }
    })
    const nextLine = nextPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(' ')
    const nextArea =
      nextPoints.length > 1
        ? `${nextLine} L${nextPoints[nextPoints.length - 1].x.toFixed(1)},43 L${nextPoints[0].x.toFixed(1)},43 Z`
        : ''
    return { points: nextPoints, linePath: nextLine, areaPath: nextArea }
  }, [samples])
  return (
    <div className={`ch-spark-box is-${tone}`} title={t('timelineNote')}>
      <div className="ch-spark-head">
        <span>{t('timeline')}</span>
        <strong>
          {samples.length === 0
            ? t('noObservations')
            : samples.length === 1 && first
              ? `1 ${t('points')} · ${first.percent.toFixed(1)}%`
              : `${samples.length} ${t('points')} · ${first!.percent.toFixed(1)}% → ${last!.percent.toFixed(1)}% (${delta !== null && delta >= 0 ? '+' : ''}${delta?.toFixed(1)}%)`}
        </strong>
      </div>
      <svg className="ch-spark-svg" viewBox="0 0 420 46" role="img" aria-label={t('sampled')}>
        <line x1="0" y1="10" x2="420" y2="10" className="ch-chart-grid" />
        <line x1="0" y1="26" x2="420" y2="26" className="ch-chart-grid" />
        {areaPath && <path d={areaPath} className="ch-spark-area" />}
        {linePath && <path d={linePath} className="ch-chart-line" />}
        {points.map((point, index) => (
          <circle
            key={`${point.sample.time}-${index}`}
            cx={point.x.toFixed(1)}
            cy={point.y.toFixed(1)}
            r={index === points.length - 1 ? 3.8 : 2.5}
            className={`ch-chart-dot ${index === points.length - 1 ? 'is-latest' : ''}`}
          >
            <title>
              {fmtTime(point.sample.time)} · {point.sample.percent.toFixed(1)}%
            </title>
          </circle>
        ))}
      </svg>
    </div>
  )
})

export const ContextCard = memo(function ContextCard({
  usage,
  samples,
  harness,
  t,
}: {
  usage: Usage | null
  samples: readonly Sample[]
  harness: string
  t: Translate
}): ReactElement {
  const occupancy = occupancyOf(usage)
  const ratio = occupancy?.percent
  const tone: 'normal' | 'warn' | 'danger' =
    ratio !== undefined && ratio >= 85
      ? 'danger'
      : ratio !== undefined && ratio >= 65
        ? 'warn'
        : 'normal'
  const remaining =
    usage?.contextUsedTokens !== undefined && usage?.contextWindowTokens !== undefined
      ? Math.max(0, usage.contextWindowTokens - usage.contextUsedTokens)
      : undefined
  const remainingPct = ratio !== undefined ? Math.max(0, 100 - ratio) : undefined
  return (
    <Card
      title={t('context')}
      className={`ch-context-card is-${tone}`}
      aside={
        <span className="ch-card-rate" title={t('limitsNote')}>
          {t('source')} · <b>{harness}</b>
        </span>
      }
    >
      <div className="ch-ctx-hero">
        <div className="ch-ctx-hero-left">
          <b>{fmt(usage?.contextUsedTokens)}</b>
          <span>/ {fmt(usage?.contextWindowTokens)} tokens</span>
        </div>
        <div className="ch-ctx-hero-right ch-occupancy-number">
          <strong>{ratio === undefined ? '—' : `${ratio.toFixed(1)}%`}</strong>
          <span>{t('ofContextUsed')}</span>
        </div>
      </div>
      <div className="ch-gauge-wrap">
        <div
          className={`ch-capacity-bar ${tone === 'danger' ? 'is-danger' : tone === 'warn' ? 'is-high' : ''}`}
          role="img"
          aria-label={`${t('occupancy')}: ${ratio === undefined ? t('unavailable') : ratio.toFixed(1) + '%'}`}
        >
          <span style={{ width: `${Math.min(100, ratio ?? 0)}%` }} />
          <i className="ch-reserve-zone" aria-hidden="true" title={t('cautionZone')} />
        </div>
        <div className="ch-ctx-legend ch-context-values">
          <span className="ch-ctx-leg">
            <i className="is-used" />
            <b>{t('usedShort')}</b>
            <em>
              {fmt(usage?.contextUsedTokens)}
              {ratio === undefined ? '' : ` · ${ratio.toFixed(1)}%`}
            </em>
          </span>
          <span className="ch-ctx-leg">
            <i className="is-rem" />
            <b>{t('remainingShort')}</b>
            <em>
              {remaining === undefined
                ? '—'
                : `${fmt(remaining)}${remainingPct === undefined ? '' : ` · ${remainingPct.toFixed(1)}%`}`}
            </em>
          </span>
          <span className="ch-ctx-leg">
            <i className="is-cap" />
            <b>{t('capacity')}</b>
            <em>{fmt(usage?.contextWindowTokens)}</em>
          </span>
          <span className="ch-ctx-leg">
            <i className="is-hatch" />
            <em>{t('cautionZone')}</em>
          </span>
        </div>
      </div>
      <Sparkline samples={samples} tone={tone} t={t} />
    </Card>
  )
})

const PART_COLORS = {
  input: 'var(--ch-blue)',
  uncachedInput: 'var(--ch-blue)',
  cacheRead: 'var(--ch-teal)',
  cacheWrite: 'var(--ch-amber)',
  output: 'var(--ch-purple)',
}

export const UsageCard = memo(function UsageCard({ usage, t }: { usage: Usage | null; t: Translate }): ReactElement {
  const [hover, setHover] = useState<string | null>(null)
  const parts = tokenParts(usage)
  const sum = parts.reduce((total, part) => total + part.value, 0)
  const lowerBound = (usage?.unpricedModels?.length ?? 0) > 0
  const costLabel =
    usage?.totalCostUsd === undefined
      ? t('unavailable')
      : usage.costSource === 'native'
        ? t('costNative')
        : usage.costSource === 'publicPrice'
          ? t('costEstimate')
          : t('source')
  const cacheRate = usage?.cacheHitRatePercent ?? usage?.sessionCacheHitRatePercent
  const cacheRateLabel = usage?.cacheHitRatePercent !== undefined ? t('cacheHit') : t('avgCache')
  return (
    <Card
      title={t('cumulative')}
      className="ch-token-card"
      aside={
        <span className="ch-card-rate">
          {cacheRateLabel}{' '}
          <b>{cacheRate === undefined ? '—' : `${cacheRate.toFixed(1)}%`}</b>
        </span>
      }
    >
      <div className="ch-token-layout">
        <Donut
          size={106}
          segments={parts.map((part) => ({
            key: part.kind,
            value: part.value,
            color: PART_COLORS[part.kind],
          }))}
          centerTop={fmt(parts.length ? sum : usage?.totalTokens)}
          centerSub={parts.length ? t('inputOutput') : t('total')}
          hoverKey={hover}
          onHoverKey={setHover}
        />
        <div className="ch-token-body">
          {parts.length ? (
            <div className="ch-sl-grid">
              {parts.map((part) => (
                <button
                  key={part.kind}
                  type="button"
                  className={`ch-sl-item ${hover === part.kind ? 'is-hi' : ''}`}
                  title={`${t(part.kind)}: ${part.value}`}
                  onMouseEnter={() => setHover(part.kind)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(part.kind)}
                  onBlur={() => setHover(null)}
                >
                  <span className="ch-sl-top">
                    <span className="ch-swatch" style={{ background: PART_COLORS[part.kind] }} />
                    <span className="ch-sl-label">{t(part.kind)}</span>
                    <b className="ch-sl-pct">
                      {sum > 0 ? `${((part.value / sum) * 100).toFixed(1)}%` : '—'}
                    </b>
                  </span>
                  <span className="ch-sl-sub">{fmt(part.value)}</span>
                </button>
              ))}
            </div>
          ) : (
            <dl className="ch-metrics">
              <Metric label={t('input')} value={usage?.inputTokens} />
              <Metric label={t('output')} value={usage?.outputTokens} />
              <Metric label={t('cacheRead')} value={usage?.cachedInputTokens} />
              <Metric label={t('cacheWrite')} value={usage?.cacheWriteInputTokens} />
            </dl>
          )}
          {parts.length === 2 && (
            <dl className="ch-independent-cache">
              <Metric label={t('cacheRead')} value={usage?.cachedInputTokens} />
              <Metric label={t('cacheWrite')} value={usage?.cacheWriteInputTokens} />
            </dl>
          )}
        </div>
      </div>
      <div className="ch-token-footer">
        <span title={lowerBound ? t('partialPrice') : costLabel}>
          {t('cost')}{' '}
          <b>
            {usage?.totalCostUsd === undefined
              ? '—'
              : `${lowerBound ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`}
          </b>
          {usage?.totalCostUsd !== undefined && <small className="ch-foot-sub"> · {costLabel}</small>}
        </span>
        <div className="ch-token-foot-right">
          <span title={t('inputIncludesCache')}>
            {t('total')} <b>{fmt(usage?.totalTokens)}</b>
          </span>
          {usage?.reasoningOutputTokens !== undefined && (
            <span className="ch-dot-pill">
              <i className="is-event" />
              {t('reasoningOutput')} {fmt(usage.reasoningOutputTokens)}
            </span>
          )}
        </div>
      </div>
      {lowerBound && <p className="ch-note">{t('partialPrice')}</p>}
    </Card>
  )
})

function CacheBar({
  label,
  value,
  tone = 'teal',
}: {
  label: string
  value?: number
  tone?: 'teal' | 'blue'
}): ReactElement {
  return (
    <div className="ch-cache-row">
      <span>{label}</span>
      <div className="ch-cache-track">
        <i className={`is-${tone}`} style={{ width: `${Math.min(100, value ?? 0)}%` }} />
      </div>
      <b>{value === undefined ? '—' : `${value.toFixed(1)}%`}</b>
    </div>
  )
}

const STRIP_COLOR = {
  user: 'var(--ch-green)',
  assistant: 'var(--ch-blue)',
  tool: 'var(--ch-teal)',
  event: 'var(--ch-purple)',
}

export const PerformanceCard = memo(function PerformanceCard({
  usage,
  items,
  onSelectRecord,
  t,
}: {
  usage: Usage | null
  items: readonly HistoryItem[]
  onSelectRecord: (id: string) => void
  t: Translate
}): ReactElement {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null)
  const tps = usage?.outputTokensPerSecond ?? usage?.sessionOutputTokensPerSecond
  const tpsLabel = usage?.outputTokensPerSecond !== undefined ? t('tps') : t('avgTps')
  const midIndex = Math.floor(items.length / 2)
  const stripRects = useMemo(() => {
    const count = items.length
    if (count === 0) return null
    const step = 600 / count
    const gap = count > 60 ? 0 : Math.min(1.5, step * 0.14)
    const width = Math.max(0.6, step - gap)
    return items.map((item, index) => (
      <rect
        key={item.id}
        x={index * step}
        y={0}
        width={width}
        height={11}
        fill={item.isError === true ? 'var(--ch-danger)' : STRIP_COLOR[item.kind]}
      />
    ))
  }, [items])
  const indexAt = (event: MouseEvent<SVGSVGElement>): number | null => {
    if (items.length === 0) return null
    const bounds = event.currentTarget.getBoundingClientRect()
    if (bounds.width <= 0) return null
    const ratio = (event.clientX - bounds.left) / bounds.width
    return Math.min(items.length - 1, Math.max(0, Math.floor(ratio * items.length)))
  }
  const rawActiveIdx = hoverIdx ?? focusedIdx
  const activeIdx =
    rawActiveIdx !== null && rawActiveIdx >= 0 && rawActiveIdx < items.length ? rawActiveIdx : null
  const activeItem = activeIdx !== null ? items[activeIdx] : undefined
  const activeLabel = activeItem
    ? `#${activeItem.seq} · ${activeItem.toolName ?? t(activeItem.kind)}`
    : undefined
  const handleStripKeyDown = (event: KeyboardEvent<SVGSVGElement>): void => {
    if (items.length === 0) return
    const base =
      focusedIdx !== null && focusedIdx < items.length ? focusedIdx : items.length - 1
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      setFocusedIdx(Math.max(0, base - 1))
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      setFocusedIdx(Math.min(items.length - 1, base + 1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      setFocusedIdx(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      setFocusedIdx(items.length - 1)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (items[base]) onSelectRecord(items[base].id)
    }
  }
  return (
    <Card
      title={t('performance')}
      className="ch-performance-card"
      aside={
        <span className="ch-card-rate">
          {tpsLabel} <b>{tps === undefined ? '—' : `${tps.toFixed(1)} tok/s`}</b>
        </span>
      }
    >
      <dl className="ch-performance">
        <Metric label={t('tps')} value={usage?.outputTokensPerSecond} suffix="tok/s" />
        <Metric label={t('avgTps')} value={usage?.sessionOutputTokensPerSecond} suffix="tok/s" />
        <Metric
          label={t('ttft')}
          value={usage?.latestRequestTimeToFirstOutputMs ?? usage?.timeToFirstOutputMs}
          suffix="ms"
        />
        {usage?.totalCredits !== undefined && (
          <Metric label={t('credits')} value={usage.totalCredits} format={formatCredits} />
        )}
      </dl>
      <div className="ch-cache-bars">
        <CacheBar label={t('cacheHit')} value={usage?.cacheHitRatePercent} tone="teal" />
        <CacheBar label={t('avgCache')} value={usage?.sessionCacheHitRatePercent} tone="blue" />
      </div>
      <div className="ch-tstrip">
        <div className="ch-tstrip-head">
          <span>{t('windowActivityStrip')}</span>
          <span>
            {activeLabel
              ? activeLabel
              : items.length > 0
                ? `#${items[0].seq} → #${items.at(-1)!.seq}`
                : t('unavailable')}
          </span>
        </div>
        <div className={`ch-tstrip-bar ${items.length > 60 ? 'is-dense' : ''}`}>
          {items.length === 0 ? (
            <div className="ch-tstrip-empty" />
          ) : (
            <svg
              className="ch-tstrip-svg"
              viewBox="0 0 600 11"
              preserveAspectRatio="none"
              tabIndex={0}
              role="slider"
              aria-label={t('windowActivityStrip')}
              aria-valuemin={1}
              aria-valuemax={items.length}
              aria-valuenow={(activeIdx ?? items.length - 1) + 1}
              aria-valuetext={activeLabel}
              onClick={(event) => {
                const idx = indexAt(event)
                if (idx !== null && items[idx]) onSelectRecord(items[idx].id)
              }}
              onMouseMove={(event) => {
                const idx = indexAt(event)
                setHoverIdx((prev) => (prev === idx ? prev : idx))
              }}
              onMouseLeave={() => setHoverIdx(null)}
              onFocus={() =>
                setFocusedIdx((prev) =>
                  prev !== null && prev < items.length ? prev : items.length - 1,
                )
              }
              onBlur={() => setFocusedIdx(null)}
              onKeyDown={handleStripKeyDown}
            >
              {activeLabel && <title>{activeLabel}</title>}
              {stripRects}
              {activeItem && activeIdx !== null && (
                <rect
                  x={(activeIdx / items.length) * 600}
                  y={0}
                  width={Math.max(2, 600 / items.length)}
                  height={11}
                  fill="var(--ch-ink)"
                  opacity={0.28}
                />
              )}
            </svg>
          )}
        </div>
        {items.length > 0 && (
          <div className="ch-tstrip-axis">
            <span>#{items[0].seq}</span>
            {items.length > 2 && <span>#{items[midIndex].seq}</span>}
            <span>#{items.at(-1)!.seq}</span>
          </div>
        )}
      </div>
    </Card>
  )
})

export function RecordBadges({
  item,
  t,
}: {
  item: HistoryItem
  t: Translate
}): ReactElement | null {
  if (!item.clipped && !item.contentUnavailable && item.isError !== true) return null
  return (
    <>
      {item.isError === true && (
        <span className="ch-record-badge ch-error-badge">{t('failed')}</span>
      )}
      {(item.clipped || item.contentUnavailable) && (
        <span className="ch-record-badge">{t(item.clipped ? 'previewShort' : 'partialShort')}</span>
      )}
    </>
  )
}

export function RecordNotices({ item, t }: { item: HistoryItem; t: Translate }): ReactElement {
  return (
    <>
      {item.isError === true && (
        <p className="ch-note ch-record-notice is-error">{t('toolError')}</p>
      )}
      {item.hostPreview && <p className="ch-note ch-record-notice">{t('hostPreview')}</p>}
      {item.textTruncated && <p className="ch-note ch-record-notice">{t('textTruncated')}</p>}
      {item.contentUnavailable && (
        <p className="ch-note ch-record-notice">{t('contentUnavailable')}</p>
      )}
    </>
  )
}
