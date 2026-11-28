import { memo, useEffect, useState, type ReactElement } from 'react'
import { fmt, fmtDuration } from '../client/format.ts'
import type { SessionRow } from './api.ts'
import { Card } from './components.tsx'
import { formatUsd } from './format.ts'
import type { Translate } from './i18n.ts'
import { occupancyOf, type Usage } from './model.ts'
import {
  buildComparisonMarkdown,
  cheapestExactCostIndices,
  extremumIndices,
} from './overview-export.ts'

export const CompareTray = memo(function CompareTray({
  comparedRows,
  usageById,
  locale,
  onSelect,
  onToggleCompare,
  onClear,
  t,
}: {
  comparedRows: readonly SessionRow[]
  usageById: ReadonlyMap<string, Usage | null>
  locale: string
  onSelect: (id: string) => void
  onToggleCompare: (id: string) => void
  onClear: () => void
  t: Translate
}): ReactElement | null {
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const comparedKey = comparedRows.map((row) => row.id).join(',')
  useEffect(() => {
    setCopied('idle')
  }, [comparedKey])
  if (comparedRows.length === 0) return null
  const occs = comparedRows.map((row) => occupancyOf(usageById.get(row.id) ?? null))
  const cacheRates = comparedRows.map((row) => {
    const u = usageById.get(row.id)
    return u?.cacheHitRatePercent ?? u?.sessionCacheHitRatePercent
  })
  const speeds = comparedRows.map((row) => {
    const u = usageById.get(row.id)
    return u?.outputTokensPerSecond ?? u?.sessionOutputTokensPerSecond
  })
  const maxOccSet = extremumIndices(
    occs.map((occ) => occ?.percent),
    'max',
  )
  const bestCacheSet = extremumIndices(cacheRates, 'max')
  const bestCostSet = cheapestExactCostIndices(comparedRows, usageById)
  const bestSpeedSet = extremumIndices(speeds, 'max')

  const copyTable = (): void => {
    if (!navigator.clipboard?.writeText) {
      setCopied('failed')
      return
    }
    void navigator.clipboard
      .writeText(buildComparisonMarkdown(comparedRows, usageById, locale))
      .then(() => setCopied('done'))
      .catch(() => setCopied('failed'))
  }

  return (
    <Card
      title={`${t('compareTrayTitle')} (${comparedRows.length}/3)`}
      className="ch-compare-tray"
      aside={
        <div className="ch-compare-aside">
          <button type="button" className="ch-mini-button" onClick={copyTable}>
            {t(
              copied === 'done'
                ? 'copied'
                : copied === 'failed'
                  ? 'copyFailed'
                  : 'copyCompareTable',
            )}
          </button>
          <button type="button" className="ch-mini-button" onClick={onClear}>
            {t('clearCompare')}
          </button>
        </div>
      }
    >
      <div className="ch-compare-scroll">
        <table className="ch-compare-table">
          <thead>
            <tr>
              <th className="ch-compare-metric-col">{t('metricLabel')}</th>
              {comparedRows.map((row) => (
                <th key={row.id}>
                  <div className="ch-compare-th">
                    <button type="button" className="ch-link-btn" onClick={() => onSelect(row.id)}>
                      {row.title || row.id}
                    </button>
                    <button
                      type="button"
                      className="ch-mini-button"
                      aria-label={`${t('clearCompare')}: ${row.title || row.id}`}
                      onClick={() => onToggleCompare(row.id)}
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('occupancy')}</td>
              {comparedRows.map((row, idx) => {
                const occ = occs[idx]
                const highlight =
                  maxOccSet.has(idx) && occ
                    ? occ.percent >= 85
                      ? 'is-cmp-danger'
                      : occ.percent >= 65
                        ? 'is-cmp-warn'
                        : ''
                    : ''
                return (
                  <td key={row.id} className={highlight}>
                    <b>{occ ? `${occ.percent.toFixed(1)}%` : '—'}</b>
                    {occ?.used !== undefined && occ.capacity !== undefined
                      ? ` (${fmt(occ.used)}/${fmt(occ.capacity)})`
                      : ''}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td>{t('total')}</td>
              {comparedRows.map((row) => (
                <td key={row.id}>{fmt(usageById.get(row.id)?.totalTokens)}</td>
              ))}
            </tr>
            <tr>
              <td>{t('cacheHit')}</td>
              {comparedRows.map((row, idx) => {
                const rate = cacheRates[idx]
                return (
                  <td key={row.id} className={bestCacheSet.has(idx) ? 'is-cmp-best' : ''}>
                    {rate === undefined ? '—' : `${rate.toFixed(1)}%`}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td>{t('cost')}</td>
              {comparedRows.map((row, idx) => {
                const u = usageById.get(row.id)
                return (
                  <td key={row.id} className={bestCostSet.has(idx) ? 'is-cmp-best' : ''}>
                    {u?.totalCostUsd === undefined
                      ? '—'
                      : `${(u.unpricedModels?.length ?? 0) > 0 ? '≥ ' : ''}${formatUsd(u.totalCostUsd)}`}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td>{t('tps')}</td>
              {comparedRows.map((row, idx) => {
                const speed = speeds[idx]
                return (
                  <td key={row.id} className={bestSpeedSet.has(idx) ? 'is-cmp-best' : ''}>
                    {speed === undefined ? '—' : `${speed.toFixed(1)} tok/s`}
                  </td>
                )
              })}
            </tr>
            <tr>
              <td>{t('ttft')}</td>
              {comparedRows.map((row) => {
                const u = usageById.get(row.id)
                const ttft = u?.latestRequestTimeToFirstOutputMs ?? u?.timeToFirstOutputMs
                return (
                  <td key={row.id}>
                    {ttft === undefined ? '—' : ttft === 0 ? '0ms' : fmtDuration(ttft)}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
})
