import { useState, type ReactElement, type ReactNode } from 'react'
import { Donut } from '../client/components/donut.tsx'
import { fmt, fmtDuration, fmtTime } from '../client/format.ts'
import type { HistoryItem } from './api.ts'
import { occupancyOf, samplePath, type Sample, type Usage } from './model.ts'
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
  detail,
  format,
}: {
  label: string
  value: number | undefined
  suffix?: string
  detail?: string
  format?: (value: number) => string
}): ReactElement {
  return (
    <div className="ch-metric">
      <dt>{label}</dt>
      <dd title={value === undefined ? undefined : String(value)}>
        {value === undefined
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
                  : fmt(value)}
      </dd>
      {detail && <small>{detail}</small>}
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
  const ratio = occupancy?.percent ?? 0
  return (
    <Card
      title={t('context')}
      className="ch-context-card"
      aside={<span className="ch-eyebrow">{t('source')}</span>}
    >
      <div className="ch-occupancy-layout">
        <div className="ch-occupancy-number">
          <div className="ch-eyebrow">{t('occupancy')}</div>
          <strong>
            {occupancy ? ratio.toFixed(1) : '—'}
            {occupancy && <span>%</span>}
          </strong>
          <p>
            {occupancy
              ? `${fmt(occupancy.used)} / ${fmt(occupancy.capacity)} tokens`
              : t('unavailable')}
          </p>
        </div>
        <Donut
          size={136}
          centerTop={occupancy ? `${Math.max(0, 100 - ratio).toFixed(0)}%` : '—'}
          centerSub={t('remaining')}
          segments={
            occupancy
              ? [
                  {
                    key: 'used',
                    value: Math.min(100, ratio),
                    color: ratio >= 85 ? 'var(--ch-warning)' : 'var(--ch-accent)',
                  },
                  { key: 'free', value: Math.max(0, 100 - ratio), color: 'var(--ch-track)' },
                ]
              : []
          }
        />
      </div>
      <dl className="ch-context-values">
        <Metric label={t('used')} value={occupancy?.used} />
        <Metric label={t('capacity')} value={occupancy?.capacity} />
      </dl>
    </Card>
  )
}

export function UsageCard({ usage, t }: { usage: Usage | null; t: Translate }): ReactElement {
  const lowerBound = (usage?.unpricedModels?.length ?? 0) > 0
  return (
    <Card title={t('cumulative')}>
      <dl className="ch-metrics">
        <Metric label={t('input')} value={usage?.inputTokens} />
        <Metric label={t('output')} value={usage?.outputTokens} />
        <Metric label={t('cacheRead')} value={usage?.cachedInputTokens} />
        <Metric label={t('cacheWrite')} value={usage?.cacheWriteInputTokens} />
      </dl>
      <div className="ch-cost">
        <div>
          <span>{t('cost')}</span>
          <strong>
            {usage?.totalCostUsd === undefined
              ? '—'
              : `${lowerBound ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`}
          </strong>
          <small>
            {usage?.totalCostUsd === undefined
              ? t('unavailable')
              : t(
                  usage.costSource === 'native'
                    ? 'costNative'
                    : usage.costSource === 'publicPrice'
                      ? 'costEstimate'
                      : 'source',
                )}
          </small>
        </div>
        <div>
          <span>{t('total')}</span>
          <strong title={usage?.totalTokens === undefined ? undefined : String(usage.totalTokens)}>
            {fmt(usage?.totalTokens)}
          </strong>
          <small>tokens</small>
        </div>
      </div>
      {lowerBound && <p className="ch-note">{t('partialPrice')}</p>}
    </Card>
  )
}

export function PerformanceCard({ usage, t }: { usage: Usage | null; t: Translate }): ReactElement {
  return (
    <Card title={t('performance')}>
      <dl className="ch-performance">
        <Metric label={t('tps')} value={usage?.outputTokensPerSecond} suffix="tok/s" />
        <Metric label={t('avgTps')} value={usage?.sessionOutputTokensPerSecond} suffix="tok/s" />
        <Metric
          label={t('ttft')}
          value={usage?.latestRequestTimeToFirstOutputMs ?? usage?.timeToFirstOutputMs}
          suffix="ms"
        />
        <Metric label={t('cacheHit')} value={usage?.cacheHitRatePercent} suffix="%" />
        <Metric label={t('avgCache')} value={usage?.sessionCacheHitRatePercent} suffix="%" />
        <Metric label={t('credits')} value={usage?.totalCredits} format={formatCredits} />
      </dl>
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
  const path = samplePath(samples)
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
          {samples.length > 0 && <path d={path} className="ch-chart-line" />}
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

export function HistoryRows({
  items,
  t,
}: {
  items: readonly HistoryItem[]
  t: Translate
}): ReactElement {
  const [filter, setFilter] = useState<'all' | 'messages' | 'tool' | 'event'>('all')
  const rows = items.filter(
    (item) =>
      filter === 'all' ||
      (filter === 'messages'
        ? item.kind === 'user' || item.kind === 'assistant'
        : item.kind === filter),
  )
  return (
    <>
      <div className="ch-filter" role="group" aria-label={t('history')}>
        {(['all', 'messages', 'tool', 'event'] as const).map((key) => (
          <button
            key={key}
            className={filter === key ? 'is-active' : ''}
            aria-pressed={filter === key}
            onClick={() => setFilter(key)}
          >
            {t(key === 'tool' ? 'tools' : key === 'event' ? 'events' : key)}
          </button>
        ))}
        <span className="ch-count">
          {rows.length} {t('count')}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="ch-note ch-empty-inline">{t('noHistory')}</p>
      ) : (
        <div className="ch-history">
          {rows.map((item) => (
            <details key={item.id} className={`ch-record ch-record-${item.kind}`}>
              <summary>
                <span className="ch-role">{t(item.kind)}</span>
                <span className="ch-record-title">
                  {item.kind === 'user' || item.kind === 'assistant'
                    ? item.text.replace(/\s+/g, ' ').slice(0, 180) || t(item.kind)
                    : item.title || t(item.kind)}
                </span>
                {(item.clipped || item.contentUnavailable) && (
                  <span className="ch-record-badge">
                    {t(item.clipped ? 'previewShort' : 'partialShort')}
                  </span>
                )}
                <span className="ch-record-time">
                  {item.time ? fmtTime(item.time) : `#${item.seq}`}
                </span>
              </summary>
              {item.hostPreview && <p className="ch-note ch-record-notice">{t('hostPreview')}</p>}
              {item.textTruncated && (
                <p className="ch-note ch-record-notice">{t('textTruncated')}</p>
              )}
              {item.contentUnavailable && (
                <p className="ch-note ch-record-notice">{t('contentUnavailable')}</p>
              )}
              {item.text && <pre>{item.text}</pre>}
            </details>
          ))}
        </div>
      )}
    </>
  )
}
