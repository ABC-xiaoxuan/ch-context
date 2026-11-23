import { useState, type ReactElement, type ReactNode } from 'react'
import { Donut } from '../client/components/donut.tsx'
import { fmt, fmtDuration, fmtTime } from '../client/format.ts'
import type { ActivitySummary } from './activity.ts'
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

function Sparkline({
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
  const minP = samples.length
    ? Math.max(0, Math.min(...samples.map((sample) => Math.min(100, sample.percent))) - 6)
    : 0
  const maxP = samples.length
    ? Math.min(100, Math.max(...samples.map((sample) => Math.min(100, sample.percent))) + 6)
    : 100
  const spanP = Math.max(12, maxP - minP)
  const points = samples.map((sample, index) => {
    const x = samples.length === 1 ? 210 : 12 + (index / (samples.length - 1)) * 396
    const clamped = Math.min(100, Math.max(0, sample.percent))
    const y = 42 - ((clamped - minP) / spanP) * 34
    return { x, y, sample }
  })
  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(' ')
  const areaPath =
    points.length > 1
      ? `${linePath} L${points[points.length - 1].x.toFixed(1)},47 L${points[0].x.toFixed(1)},47 Z`
      : ''
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
      <svg
        className="ch-spark-svg"
        viewBox="0 0 420 50"
        role="img"
        aria-label={t('sampled')}
      >
        <line x1="0" y1="10" x2="420" y2="10" className="ch-chart-grid" />
        <line x1="0" y1="28" x2="420" y2="28" className="ch-chart-grid" />
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
}

export function ContextCard({
  usage,
  samples,
  t,
}: {
  usage: Usage | null
  samples: readonly Sample[]
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
  return (
    <Card
      title={t('context')}
      className={`ch-context-card is-${tone}`}
      aside={
        <span className="ch-scope" title={t('limitsNote')}>
          {t('source')} ⓘ
        </span>
      }
    >
      <div className="ch-context-line">
        <div className="ch-occupancy-number">
          <strong>{ratio === undefined ? '—' : `${ratio.toFixed(1)}%`}</strong>
        </div>
        <div className="ch-context-tokens">
          <p>
            <b>{fmt(usage?.contextUsedTokens)}</b>
            <span> / {fmt(usage?.contextWindowTokens)} tokens</span>
          </p>
          <span className="ch-remain-pill">
            {remaining === undefined
              ? t('capacityUnknown')
              : `${t('remainingShort')} ${fmt(remaining)}`}
          </span>
        </div>
      </div>
      <div className="ch-gauge-wrap">
        <div
          className={`ch-capacity-bar ${tone === 'danger' ? 'is-danger' : tone === 'warn' ? 'is-high' : ''}`}
          role="img"
          aria-label={`${t('occupancy')}: ${ratio === undefined ? t('unavailable') : ratio.toFixed(1) + '%'}`}
        >
          <span style={{ width: `${Math.min(100, ratio ?? 0)}%` }} />
          <i className="ch-gauge-tick" style={{ left: '75%' }} aria-hidden="true" />
          <i className="ch-gauge-tick" style={{ left: '90%' }} aria-hidden="true" />
        </div>
        <div className="ch-context-values">
          <span>
            {t('used')}: {fmt(usage?.contextUsedTokens)}
          </span>
          <span>
            {t('capacity')}: {fmt(usage?.contextWindowTokens)}
          </span>
        </div>
      </div>
      <Sparkline samples={samples} tone={tone} t={t} />
    </Card>
  )
}

const PART_COLORS = {
  input: 'var(--ch-blue)',
  uncachedInput: 'var(--ch-blue)',
  cacheRead: 'var(--ch-teal)',
  cacheWrite: 'var(--ch-amber)',
  output: 'var(--ch-purple)',
}

export function UsageCard({ usage, t }: { usage: Usage | null; t: Translate }): ReactElement {
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
  return (
    <Card
      title={t('cumulative')}
      className="ch-token-card"
      aside={
        <span className="ch-cost-badge" title={lowerBound ? t('partialPrice') : costLabel}>
          <b>
            {usage?.totalCostUsd === undefined
              ? '—'
              : `${lowerBound ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`}
          </b>
          <small>{costLabel}</small>
        </span>
      }
    >
      <div className="ch-token-layout">
        <Donut
          size={108}
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
        <div className="ch-token-legend">
          {parts.length ? (
            parts.map((part) => (
              <button
                key={part.kind}
                className={hover === part.kind ? 'is-hi' : ''}
                title={`${t(part.kind)}: ${part.value}`}
                onMouseEnter={() => setHover(part.kind)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(part.kind)}
                onBlur={() => setHover(null)}
              >
                <span className="ch-swatch" style={{ background: PART_COLORS[part.kind] }} />
                <span>{t(part.kind)}</span>
                <b>{fmt(part.value)}</b>
                <small>{sum > 0 ? `${((part.value / sum) * 100).toFixed(1)}%` : '—'}</small>
              </button>
            ))
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
      {lowerBound && <p className="ch-note">{t('partialPrice')}</p>}
    </Card>
  )
}

function CacheBar({ label, value }: { label: string; value?: number }): ReactElement {
  return (
    <div className="ch-cache-row">
      <span>{label}</span>
      <div className="ch-cache-track">
        <i style={{ width: `${Math.min(100, value ?? 0)}%` }} />
      </div>
      <b>{value === undefined ? '—' : `${value.toFixed(1)}%`}</b>
    </div>
  )
}

export function PerformanceCard({
  usage,
  summary,
  errorCount,
  onKind,
  onSignalTab,
  onErrors,
  t,
}: {
  usage: Usage | null
  summary: ActivitySummary | null
  errorCount: number
  onKind: (kind: 'messages' | 'tool' | 'event') => void
  onSignalTab: (tab: 'files' | 'commands') => void
  onErrors: () => void
  t: Translate
}): ReactElement {
  return (
    <Card
      title={t('performance')}
      className="ch-performance-card"
      aside={
        <span className="ch-scope">
          {usage?.cacheHitRatePercent === undefined
            ? t('unavailable')
            : `${t('cacheHit')} ${usage.cacheHitRatePercent.toFixed(1)}%`}
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
        <CacheBar label={t('cacheHit')} value={usage?.cacheHitRatePercent} />
        <CacheBar label={t('avgCache')} value={usage?.sessionCacheHitRatePercent} />
      </div>
      <div className="ch-pulse-ribbon">
        <button className="ch-pulse-pill" onClick={() => onKind('messages')}>
          <i className="is-user" />
          {t('messages')} <b>{summary?.messages ?? '—'}</b>
        </button>
        <button className="ch-pulse-pill" onClick={() => onKind('tool')}>
          <i className="is-tool" />
          {t('tools')} <b>{summary ? summary.toolCalls + summary.toolResults : '—'}</b>
        </button>
        <button className="ch-pulse-pill" onClick={() => onSignalTab('files')}>
          <i className="is-assistant" />
          {t('files')} <b>{summary?.files.length ?? '—'}</b>
        </button>
        <button className="ch-pulse-pill" onClick={() => onSignalTab('commands')}>
          <i className="is-event" />
          {t('commands')} <b>{summary?.commands.length ?? '—'}</b>
        </button>
        {errorCount > 0 && (
          <button className="ch-pulse-pill is-err" onClick={onErrors}>
            ! {t('failed')} <b>{errorCount}</b>
          </button>
        )}
      </div>
    </Card>
  )
}

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
