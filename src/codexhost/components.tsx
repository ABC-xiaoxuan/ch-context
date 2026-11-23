import { useState, type ReactElement, type ReactNode } from 'react'
import { Donut } from '../client/components/donut.tsx'
import { fmt, fmtDuration, fmtTime } from '../client/format.ts'
import type { HistoryItem } from './api.ts'
import { occupancyOf, samplePath, tokenParts, type Sample, type Usage } from './model.ts'
import type { Translate } from './i18n.ts'
import { formatCredits, formatUsd } from './format.ts'

export function Icon({ size = 20 }: { size?: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 18V11M12 18V6M19 18V3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M3 21h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

export function ContextCard({ usage, t }: { usage: Usage | null; t: Translate }): ReactElement {
  const occupancy = occupancyOf(usage)
  const ratio = occupancy?.percent
  return (
    <Card
      title={t('context')}
      className="ch-context-card"
      aside={
        <span className="ch-eyebrow" title={t('limitsNote')}>
          {t('source')} ⓘ
        </span>
      }
    >
      <div className="ch-context-line">
        <p>
          <b>{fmt(usage?.contextUsedTokens)}</b>
          <span> / {fmt(usage?.contextWindowTokens)} tokens</span>
        </p>
        <div className="ch-occupancy-number">
          <strong>{ratio === undefined ? '—' : `${ratio.toFixed(1)}%`}</strong>
          <small>{t('occupancy')}</small>
        </div>
      </div>
      <div
        className={`ch-capacity-bar ${ratio !== undefined && ratio > 85 ? 'is-high' : ''}`}
        role="img"
        aria-label={`${t('occupancy')}: ${ratio === undefined ? t('unavailable') : ratio.toFixed(1) + '%'}`}
      >
        <span style={{ width: `${Math.min(100, ratio ?? 0)}%` }} />
      </div>
      <div className="ch-context-values">
        <span>
          {t('used')}: {fmt(usage?.contextUsedTokens)}
        </span>
        <span>
          {t('capacity')}: {fmt(usage?.contextWindowTokens)}
        </span>
      </div>
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
  return (
    <Card
      title={t('cumulative')}
      className="ch-token-card"
      aside={
        usage?.cacheHitRatePercent !== undefined && (
          <span className="ch-eyebrow">
            {t('cacheHit')} <b>{usage.cacheHitRatePercent.toFixed(1)}%</b>
          </span>
        )
      }
    >
      <div className="ch-token-layout">
        <Donut
          size={102}
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
                title={`${t(part.kind)}: ${part.value}`}
                onMouseEnter={() => setHover(part.kind)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(part.kind)}
                onBlur={() => setHover(null)}
              >
                <span className="ch-swatch" style={{ background: PART_COLORS[part.kind] }} />
                <span>{t(part.kind)}</span>
                <b>{fmt(part.value)}</b>
                <small>{sum > 0 ? `${((part.value / sum) * 100).toFixed(1)}%` : '0%'}</small>
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
        <span
          title={
            lowerBound
              ? t('partialPrice')
              : usage?.totalCostUsd === undefined
                ? t('unavailable')
                : usage.costSource === 'native'
                  ? t('costNative')
                  : usage.costSource === 'publicPrice'
                    ? t('costEstimate')
                    : t('source')
          }
        >
          {t('cost')}{' '}
          <b>
            {usage?.totalCostUsd === undefined
              ? '—'
              : `${lowerBound ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`}
          </b>
        </span>
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

export function PerformanceCard({ usage, t }: { usage: Usage | null; t: Translate }): ReactElement {
  return (
    <Card title={t('performance')} className="ch-performance-card">
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
    </Card>
  )
}

export function TimelineCard({
  samples,
  t,
}: {
  samples: readonly Sample[]
  t: Translate
}): ReactElement {
  return (
    <Card
      title={t('timeline')}
      aside={
        <span className="ch-count">
          {t('observed')} · {samples.length}
        </span>
      }
    >
      <div className="ch-chart" role="img" aria-label={t('sampled')}>
        <div className="ch-chart-axis">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <svg viewBox="0 0 600 120" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0H600 M0 60H600 M0 120H600" className="ch-chart-grid" />
          {samples.length > 0 && <path d={samplePath(samples)} className="ch-chart-line" />}
          {samples.length === 1 && (
            <circle
              cx="300"
              cy={120 - (Math.min(100, samples[0].percent) / 100) * 120}
              r="3"
              className="ch-chart-dot"
            />
          )}
        </svg>
      </div>
      <div className="ch-chart-times">
        <span>{samples[0] ? fmtTime(samples[0].time) : '—'}</span>
        <span>
          {samples.length < 2 ? t('needSamples') : fmtTime(samples[samples.length - 1].time)}
        </span>
      </div>
      <p className="ch-note">
        {t('timelineNote')} <span title={t('retained')}>ⓘ</span>
      </p>
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
      {item.isError === true && <p className="ch-note ch-record-notice">{t('toolError')}</p>}
      {item.hostPreview && <p className="ch-note ch-record-notice">{t('hostPreview')}</p>}
      {item.textTruncated && <p className="ch-note ch-record-notice">{t('textTruncated')}</p>}
      {item.contentUnavailable && (
        <p className="ch-note ch-record-notice">{t('contentUnavailable')}</p>
      )}
    </>
  )
}
