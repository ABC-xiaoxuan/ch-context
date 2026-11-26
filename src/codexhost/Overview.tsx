import { memo, useCallback, useEffect, useMemo, useState, type ReactElement } from 'react'
import { Donut } from '../client/components/donut.tsx'
import { fmt, fmtDuration } from '../client/format.ts'
import type { SessionRow } from './api.ts'
import { Card } from './components.tsx'
import { formatUsd } from './format.ts'
import type { Translate } from './i18n.ts'
import { isThreadId, occupancyOf, type Usage } from './model.ts'
import {
  aggregateOverview,
  buildDateHeatmap,
  dateKeyOf,
  hasSessionRelation,
  workspaceLabelOf,
} from './overview-model.ts'

type SortKey = 'recent' | 'tokens' | 'occupancy' | 'cost'

const TALLY_COLORS = [
  'var(--ch-blue)',
  'var(--ch-teal)',
  'var(--ch-indigo)',
  'var(--ch-green)',
  'var(--ch-purple)',
  'var(--ch-amber)',
]

function relationLabel(row: SessionRow, t: Translate): string | null {
  if (row.origin === 'subagent') return t('relationSubagent')
  if (row.forkParentId) return t('relationFork')
  if (row.treeParentId) return t('relationTree')
  return null
}

function formatDateShort(ms?: number): string {
  if (ms === undefined || !Number.isFinite(ms)) return ''
  return dateKeyOf(ms)
}

function MiniRing({
  percent,
  used,
  noLabel,
}: {
  percent: number | null
  used?: number
  noLabel: string
}): ReactElement {
  const radius = 23
  const circumference = 2 * Math.PI * radius
  const clamped = percent === null ? 0 : Math.min(100, Math.max(0, percent))
  const dash = (clamped / 100) * circumference
  const tone =
    percent === null
      ? 'is-none'
      : percent >= 85
        ? 'is-danger'
        : percent >= 65
          ? 'is-warn'
          : 'is-normal'
  return (
    <div className={`ch-mini-ring ${tone}`} aria-hidden="true">
      <svg viewBox="0 0 60 60">
        <circle
          cx="30"
          cy="30"
          r={radius}
          className="ch-mini-ring-track"
          strokeDasharray={percent === null ? '3 3' : undefined}
        />
        {percent !== null && (
          <circle
            cx="30"
            cy="30"
            r={radius}
            className="ch-mini-ring-fill"
            strokeDasharray={`${dash.toFixed(1)} ${circumference.toFixed(1)}`}
          />
        )}
      </svg>
      <div className="ch-mini-ring-center">
        <b>{used !== undefined ? fmt(used) : percent === null ? '—' : `${Math.round(percent)}%`}</b>
        <span>{percent === null ? noLabel : `${percent.toFixed(1)}%`}</span>
      </div>
    </div>
  )
}

const OverviewSessionCard = memo(function OverviewSessionCard({
  row,
  usage,
  isSelected,
  isCompared,
  onSelect,
  onToggleCompare,
  t,
}: {
  row: SessionRow
  usage: Usage | null
  isSelected: boolean
  isCompared: boolean
  onSelect: (id: string) => void
  onToggleCompare: (id: string) => void
  t: Translate
}): ReactElement {
  const occ = occupancyOf(usage)
  const ws = workspaceLabelOf(row.cwd)
  const rel = relationLabel(row, t)
  const cacheRate = usage?.cacheHitRatePercent ?? usage?.sessionCacheHitRatePercent
  return (
    <article
      className={`ch-overview-card ${isSelected ? 'is-selected' : ''} ${isCompared ? 'is-compared' : ''}`}
    >
      <div className="ch-ov-card-head">
        <button
          type="button"
          className="ch-ov-card-title-btn"
          title={row.title || row.id}
          onClick={() => onSelect(row.id)}
        >
          <strong>{row.title || row.id}</strong>
        </button>
        <div className="ch-ov-card-right">
          {row.updatedAt !== undefined && (
            <span className="ch-ov-card-date">{formatDateShort(row.updatedAt)}</span>
          )}
          <button
            type="button"
            className={`ch-compare-pin ${isCompared ? 'is-active' : ''}`}
            aria-pressed={isCompared}
            title={t('compareHint')}
            onClick={() => onToggleCompare(row.id)}
          >
            {t(isCompared ? 'compareSelected' : 'compareToggle')}
          </button>
        </div>
      </div>
      <div className="ch-ov-card-tags">
        {ws && <span className="ch-meta-tag is-ws">{ws}</span>}
        <span className="ch-meta-tag">{row.harness ?? 'CodexHost'}</span>
        {isSelected && <span className="ch-meta-tag is-current">{t('currentSession')}</span>}
        {rel && (
          <span className="ch-dot-pill">
            <i className="is-event" />
            {rel}
          </span>
        )}
      </div>
      <button type="button" className="ch-ov-card-body" onClick={() => onSelect(row.id)}>
        <MiniRing percent={occ ? occ.percent : null} used={occ?.used} noLabel={t('noTelemetryYet')} />
        <div className="ch-ov-kv">
          <div className="ch-ov-kv-row">
            <span>{t('context')}</span>
            <b>
              {occ?.used !== undefined && occ.capacity !== undefined
                ? `${fmt(occ.used)} / ${fmt(occ.capacity)}`
                : occ
                  ? `${occ.percent.toFixed(1)}%`
                  : '—'}
            </b>
          </div>
          <div className="ch-ov-kv-row">
            <span>{t('total')}</span>
            <b>{fmt(usage?.totalTokens)}</b>
          </div>
          <div className="ch-ov-kv-row">
            <span>{t('cost')}</span>
            <b>
              {usage?.totalCostUsd === undefined
                ? '—'
                : `${(usage.unpricedModels?.length ?? 0) > 0 ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`}
            </b>
          </div>
          <div className="ch-ov-kv-row">
            <span>{usage?.cacheHitRatePercent !== undefined ? t('cacheHit') : t('avgCache')}</span>
            <b>{cacheRate === undefined ? '—' : `${cacheRate.toFixed(1)}%`}</b>
          </div>
        </div>
      </button>
    </article>
  )
})

export const Overview = memo(function Overview({
  rows,
  usageById,
  loading,
  error,
  selected,
  hasSelected,
  pageIndex,
  hasNext,
  onPrev,
  onNext,
  onSelect,
  onRetry,
  t,
}: {
  rows: readonly SessionRow[]
  usageById: ReadonlyMap<string, Usage | null>
  loading: boolean
  error: string | null
  selected?: string
  hasSelected: boolean
  pageIndex: number
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
  onSelect: (id: string) => void
  onRetry: () => void
  t: Translate
}): ReactElement {
  const [workspace, setWorkspace] = useState<string>('all')
  const [harnessFilter, setHarnessFilter] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [highOnly, setHighOnly] = useState(false)
  const [relationsOnly, setRelationsOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('recent')
  const [compareIds, setCompareIds] = useState<string[]>([])

  const validRows = useMemo(() => rows.filter((row) => isThreadId(row.id)), [rows])
  const stats = useMemo(() => aggregateOverview(validRows, usageById), [validRows, usageById])
  const heatmap = useMemo(() => buildDateHeatmap(validRows), [validRows])

  const activeWorkspace =
    workspace !== 'all' && stats.workspaces.some(([name]) => name === workspace)
      ? workspace
      : 'all'
  const activeHarness =
    harnessFilter !== null && stats.harnesses.some(([name]) => name === harnessFilter)
      ? harnessFilter
      : null
  const validDates = useMemo(() => {
    const dates = new Set<string>()
    for (const row of validRows) {
      if (row.updatedAt !== undefined && Number.isFinite(row.updatedAt))
        dates.add(dateKeyOf(row.updatedAt))
    }
    return dates
  }, [validRows])
  const activeDate =
    selectedDate !== null && validDates.has(selectedDate) ? selectedDate : null
  const validRowById = useMemo(
    () => new Map(validRows.map((row) => [row.id, row])),
    [validRows],
  )
  const activeCompareIds = useMemo(
    () => compareIds.filter((id) => validRowById.has(id)),
    [compareIds, validRowById],
  )
  const activeCompareSet = useMemo(() => new Set(activeCompareIds), [activeCompareIds])
  const comparedRows = useMemo(
    () =>
      activeCompareIds
        .map((id) => validRowById.get(id))
        .filter((row): row is SessionRow => row !== undefined),
    [activeCompareIds, validRowById],
  )
  useEffect(() => {
    setWorkspace('all')
    setHarnessFilter(null)
    setSelectedDate(null)
    setHighOnly(false)
    setRelationsOnly(false)
    setCompareIds([])
  }, [pageIndex])

  const toggleCompare = useCallback(
    (id: string): void => {
      setCompareIds((previous) => {
        const scoped = previous.filter((entry) => validRowById.has(entry))
        if (scoped.includes(id)) return scoped.filter((entry) => entry !== id)
        if (scoped.length >= 3) return [...scoped.slice(1), id]
        return [...scoped, id]
      })
    },
    [validRowById],
  )

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const filtered = validRows.filter((row) => {
      if (activeWorkspace !== 'all' && workspaceLabelOf(row.cwd) !== activeWorkspace) return false
      if (activeHarness !== null && (row.harness ?? 'CodexHost') !== activeHarness) return false
      if (activeDate !== null) {
        if (row.updatedAt === undefined || dateKeyOf(row.updatedAt) !== activeDate) return false
      }
      if (highOnly) {
        const occ = occupancyOf(usageById.get(row.id) ?? null)
        if (!occ || occ.percent < 75) return false
      }
      if (relationsOnly && !hasSessionRelation(row)) return false
      if (!needle) return true
      return `${row.title} ${row.harness ?? ''} ${row.cwd ?? ''}`
        .toLocaleLowerCase()
        .includes(needle)
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'tokens') {
        const at = usageById.get(a.id)?.totalTokens ?? -1
        const bt = usageById.get(b.id)?.totalTokens ?? -1
        return bt - at
      }
      if (sort === 'occupancy') {
        const ao = occupancyOf(usageById.get(a.id) ?? null)?.percent ?? -1
        const bo = occupancyOf(usageById.get(b.id) ?? null)?.percent ?? -1
        return bo - ao
      }
      if (sort === 'cost') {
        const ac = usageById.get(a.id)?.totalCostUsd ?? -1
        const bc = usageById.get(b.id)?.totalCostUsd ?? -1
        return bc - ac
      }
      return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
    })
  }, [
    validRows,
    activeWorkspace,
    activeHarness,
    activeDate,
    highOnly,
    relationsOnly,
    query,
    sort,
    usageById,
  ])

  const unavailableState = loading || error !== null
  const maxBarTokens = Math.max(1, ...stats.topSessions.map((item) => item.tokens ?? 0))
  const tokenSegments = useMemo(() => {
    const s = stats.tokenSummary
    if (s.mode === 'decomposed') {
      return [
        { key: 'cacheRead', label: t('cacheRead'), value: s.cacheRead, color: 'var(--ch-teal)' },
        {
          key: 'uncachedInput',
          label: t('uncachedInput'),
          value: s.uncachedInput,
          color: 'var(--ch-blue)',
        },
        { key: 'output', label: t('output'), value: s.output, color: 'var(--ch-purple)' },
        { key: 'cacheWrite', label: t('cacheWrite'), value: s.cacheWrite, color: 'var(--ch-amber)' },
      ]
    }
    if (s.mode === 'inputOutput') {
      return [
        { key: 'input', label: t('input'), value: s.input, color: 'var(--ch-blue)' },
        { key: 'output', label: t('output'), value: s.output, color: 'var(--ch-purple)' },
      ]
    }
    return []
  }, [stats.tokenSummary, t])

  return (
    <div className="ch-overview">
      {!hasSelected && (
        <div className="ch-overview-intro">
          <h2>{t('noSession')}</h2>
          <p>{t('choose')}</p>
        </div>
      )}

      <section className="ch-ov-top">
        <div className="ch-ov-kpis">
          <div className="ch-ov-kpi">
            <small>
              {t('loadedSessions')} ({t('page')} {pageIndex + 1})
            </small>
            <strong>{unavailableState ? '—' : validRows.length}</strong>
            <div className="ch-ov-sub">
              {!unavailableState && stats.harnesses.length
                ? stats.harnesses.map(([name, count]) => `${name} ${count}`).join(' · ')
                : '—'}
            </div>
          </div>
          <div className="ch-ov-kpi">
            <small>{t('queriedUsage')}</small>
            <strong>{stats.hasTokens ? fmt(stats.totalTokens) : '—'}</strong>
            <div className="ch-ov-sub">
              {stats.tokensCount > 0
                ? `${stats.tokensCount}/${Math.min(validRows.length, 50)} ${t('inspectedCount')}`
                : t('unavailable')}
            </div>
          </div>
          <div className="ch-ov-kpi">
            <small>{t('inspectedCost')}</small>
            <strong>
              {stats.hasCost
                ? `${stats.hasLowerBound ? '≥ ' : ''}${formatUsd(stats.totalCost)}`
                : '—'}
            </strong>
            <div className="ch-ov-sub">
              {stats.hasCost
                ? stats.hasLowerBound
                  ? `${stats.costCount}/${Math.min(validRows.length, 50)} · ${t('partialPrice')}`
                  : `${stats.costCount}/${Math.min(validRows.length, 50)} ${t('inspectedCount')}`
                : t('unavailable')}
            </div>
          </div>
          <div className="ch-ov-kpi">
            <small>{t('avgCacheHitLabel')}</small>
            <strong>{stats.avgCacheHit === null ? '—' : `${stats.avgCacheHit.toFixed(1)}%`}</strong>
            <div className="ch-ov-sub">
              {stats.cacheHitCount > 0 ? `${stats.cacheHitCount} ${t('inspectedCount')}` : t('unavailable')}
            </div>
          </div>
          <div className="ch-ov-kpi">
            <small>{t('highestOccupancy')}</small>
            <strong
              className={
                stats.peak
                  ? stats.peak.percent >= 85
                    ? 'is-danger'
                    : stats.peak.percent >= 65
                      ? 'is-warn'
                      : ''
                  : ''
              }
            >
              {stats.peak ? `${stats.peak.percent.toFixed(1)}%` : '—'}
            </strong>
            <div className="ch-ov-sub" title={stats.peak?.title}>
              {stats.peak
                ? stats.peak.used !== undefined && stats.peak.capacity !== undefined
                  ? `${fmt(stats.peak.used)} / ${fmt(stats.peak.capacity)}`
                  : stats.peak.title
                : t('unavailable')}
            </div>
          </div>
          <div className="ch-ov-kpi">
            <small>{t('activeWorkspaces')}</small>
            <strong>{unavailableState ? '—' : stats.workspaces.length}</strong>
            <div className="ch-ov-sub">
              {!unavailableState && stats.workspaces.length
                ? stats.workspaces
                    .map(([name]) => name)
                    .slice(0, 3)
                    .join(' · ')
                : '—'}
            </div>
          </div>
        </div>

        <Card
          title={t('inspectedSessionsChart')}
          className="ch-ov-bars-card"
          aside={
            <span className="ch-card-rate">
              {t('sortTokens')} · {t('sortOccupancy')}
            </span>
          }
        >
          {stats.topSessions.length === 0 ? (
            <p className="ch-note ch-ov-empty-center">{t('unavailable')}</p>
          ) : (
            <>
              <div className="ch-ov-bars-plot">
                {stats.topSessions.map((item) => {
                  const tokenHeight =
                    item.tokens !== null && item.tokens > 0
                      ? Math.max(8, (item.tokens / maxBarTokens) * 100)
                      : 0
                  const occHeight =
                    item.occupancyPercent !== null
                      ? Math.max(8, Math.min(100, item.occupancyPercent))
                      : 0
                  const occTone =
                    item.occupancyPercent !== null && item.occupancyPercent >= 85
                      ? 'is-danger'
                      : item.occupancyPercent !== null && item.occupancyPercent >= 65
                        ? 'is-warn'
                        : 'is-ok'
                  const tokenLabel = item.tokens === null ? '—' : fmt(item.tokens)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className="ch-ov-bcol"
                      title={`${item.title}: ${tokenLabel} · ${item.occupancyPercent === null ? '—' : `${item.occupancyPercent.toFixed(1)}%`}`}
                      onClick={() => onSelect(item.id)}
                    >
                      <div className="ch-ov-bpair">
                        {tokenHeight > 0 && item.tokens !== null && (
                          <div className="ch-ov-bar is-tok" style={{ height: `${tokenHeight}%` }}>
                            <span>{fmt(item.tokens)}</span>
                          </div>
                        )}
                        {occHeight > 0 && (
                          <div
                            className={`ch-ov-bar ${occTone}`}
                            style={{ height: `${occHeight}%` }}
                          />
                        )}
                      </div>
                      <span className="ch-ov-blbl">{item.title}</span>
                    </button>
                  )
                })}
              </div>
              <div className="ch-ov-bars-key">
                <span>
                  <i style={{ background: 'var(--ch-blue)' }} />
                  {t('sortTokens')}
                </span>
                <span>
                  <i style={{ background: 'var(--ch-green)' }} />
                  {t('sortOccupancy')}
                </span>
              </div>
            </>
          )}
        </Card>
      </section>

      <section className="ch-ov-mid">
        <Card
          title={t('tokenDistribution')}
          className="ch-ov-dist-card"
          aside={
            <span className="ch-card-rate">
              {t('avgCacheHitLabel')}{' '}
              <b>{stats.avgCacheHit === null ? '—' : `${stats.avgCacheHit.toFixed(1)}%`}</b>
            </span>
          }
        >
          {stats.tokenSummary.mode === 'none' ? (
            <p className="ch-note ch-ov-empty-center">{t('unavailable')}</p>
          ) : (
            <div className="ch-token-layout">
              <Donut
                size={84}
                segments={tokenSegments}
                centerTop={fmt(stats.tokenSummary.sum)}
                centerSub={t('inputOutput')}
              />
              <div className="ch-sl-grid">
                {tokenSegments.map((seg) => (
                  <div key={seg.key} className="ch-sl-item is-static">
                    <span className="ch-sl-top">
                      <span className="ch-swatch" style={{ background: seg.color }} />
                      <span className="ch-sl-label">{seg.label}</span>
                      <b className="ch-sl-pct">
                        {stats.tokenSummary.sum > 0
                          ? `${((seg.value / stats.tokenSummary.sum) * 100).toFixed(1)}%`
                          : '—'}
                      </b>
                    </span>
                    <span className="ch-sl-sub">{fmt(seg.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card
          title={t('activityHeatmap')}
          className="ch-ov-heat-card"
          aside={<span className="ch-card-rate">{t('heatmapScope')}</span>}
        >
          {heatmap.datedCount === 0 ? (
            <p className="ch-note ch-ov-empty-center">{t('unavailable')}</p>
          ) : (
            <div className="ch-heat-wrap">
              <div className="ch-heat-cols">
                {heatmap.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="ch-heat-col">
                    <span className="ch-heat-mon">{week.monthLabel ?? ''}</span>
                    {week.days.map((day) =>
                      day.isFuture ? (
                        <span key={day.dateKey} className="ch-heat-cell is-future" />
                      ) : (
                        <button
                          key={day.dateKey}
                          type="button"
                          className={`ch-heat-cell is-lv${day.level} ${activeDate === day.dateKey ? 'is-on' : ''}`}
                          disabled={day.count === 0}
                          title={`${day.dateKey}: ${day.count}`}
                          aria-label={`${day.dateKey}: ${day.count}`}
                          onClick={() =>
                            setSelectedDate((prev) => (prev === day.dateKey ? null : day.dateKey))
                          }
                        />
                      ),
                    )}
                  </div>
                ))}
              </div>
              <div className="ch-heat-legend">
                <span>{t('lessLabel')}</span>
                {([0, 1, 2, 3, 4] as const).map((lv) => (
                  <i key={lv} className={`ch-heat-cell is-lv${lv}`} />
                ))}
                <span>{t('moreLabel')}</span>
              </div>
            </div>
          )}
        </Card>

        <Card
          title={t('workspaceBreakdown')}
          className="ch-ov-tally-card"
          aside={
            <span className="ch-card-rate">{unavailableState ? '—' : stats.workspaces.length}</span>
          }
        >
          {stats.workspaces.length === 0 ? (
            <p className="ch-note ch-ov-empty-center">—</p>
          ) : (
            <div className="ch-prog-list">
              {stats.workspaces.slice(0, 6).map(([name, count], index) => {
                const pct = Math.round((count / Math.max(1, validRows.length)) * 100)
                const color = TALLY_COLORS[index % TALLY_COLORS.length]
                return (
                  <button
                    key={name}
                    type="button"
                    className={`ch-prog-row ${activeWorkspace === name ? 'is-active' : ''}`}
                    onClick={() => setWorkspace((prev) => (prev === name ? 'all' : name))}
                  >
                    <i className="ch-prog-dot" style={{ background: color }} />
                    <span className="ch-prog-name">{name}</span>
                    <span className="ch-prog-cnt">×{count}</span>
                    <span className="ch-prog-pct">{pct}%</span>
                    <i className="ch-prog-bar" style={{ width: `${pct}%`, background: color }} />
                  </button>
                )
              })}
            </div>
          )}
        </Card>

        <Card
          title={t('harnessBreakdown')}
          className="ch-ov-tally-card"
          aside={<span className="ch-card-rate">{unavailableState ? '—' : validRows.length}</span>}
        >
          {stats.harnesses.length === 0 ? (
            <p className="ch-note ch-ov-empty-center">—</p>
          ) : (
            <div className="ch-prog-list">
              {stats.harnesses.map(([name, count], index) => {
                const pct = Math.round((count / Math.max(1, validRows.length)) * 100)
                const color = TALLY_COLORS[(index + 2) % TALLY_COLORS.length]
                return (
                  <button
                    key={name}
                    type="button"
                    className={`ch-prog-row ${activeHarness === name ? 'is-active' : ''}`}
                    onClick={() => setHarnessFilter((prev) => (prev === name ? null : name))}
                  >
                    <i className="ch-prog-dot" style={{ background: color }} />
                    <span className="ch-prog-name">{name}</span>
                    <span className="ch-prog-cnt">×{count}</span>
                    <span className="ch-prog-pct">{pct}%</span>
                    <i className="ch-prog-bar" style={{ width: `${pct}%`, background: color }} />
                  </button>
                )
              })}
              {stats.relationCount > 0 && (
                <button
                  type="button"
                  className={`ch-prog-row ${relationsOnly ? 'is-active' : ''}`}
                  onClick={() => setRelationsOnly((prev) => !prev)}
                >
                  <i className="ch-prog-dot" style={{ background: 'var(--ch-purple)' }} />
                  <span className="ch-prog-name">{t('subagentOrFork')}</span>
                  <span className="ch-prog-cnt">×{stats.relationCount}</span>
                  <span className="ch-prog-pct">
                    {Math.round((stats.relationCount / Math.max(1, validRows.length)) * 100)}%
                  </span>
                  <i
                    className="ch-prog-bar"
                    style={{
                      width: `${Math.round((stats.relationCount / Math.max(1, validRows.length)) * 100)}%`,
                      background: 'var(--ch-purple)',
                    }}
                  />
                </button>
              )}
            </div>
          )}
        </Card>
      </section>

      {comparedRows.length > 0 && (
        <Card
          title={`${t('compareTrayTitle')} (${comparedRows.length}/3)`}
          className="ch-compare-tray"
          aside={
            <button type="button" className="ch-mini-button" onClick={() => setCompareIds([])}>
              {t('clearCompare')}
            </button>
          }
        >
          <div className="ch-compare-scroll">
            <table className="ch-compare-table">
              <thead>
                <tr>
                  <th>{t('metricLabel')}</th>
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
                          onClick={() => toggleCompare(row.id)}
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
                  {comparedRows.map((row) => {
                    const occ = occupancyOf(usageById.get(row.id) ?? null)
                    return (
                      <td key={row.id}>
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
                  {comparedRows.map((row) => {
                    const u = usageById.get(row.id)
                    const rate = u?.cacheHitRatePercent ?? u?.sessionCacheHitRatePercent
                    return <td key={row.id}>{rate === undefined ? '—' : `${rate.toFixed(1)}%`}</td>
                  })}
                </tr>
                <tr>
                  <td>{t('cost')}</td>
                  {comparedRows.map((row) => {
                    const u = usageById.get(row.id)
                    return (
                      <td key={row.id}>
                        {u?.totalCostUsd === undefined
                          ? '—'
                          : `${(u.unpricedModels?.length ?? 0) > 0 ? '≥ ' : ''}${formatUsd(u.totalCostUsd)}`}
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <td>{t('tps')}</td>
                  {comparedRows.map((row) => {
                    const u = usageById.get(row.id)
                    const speed = u?.outputTokensPerSecond ?? u?.sessionOutputTokensPerSecond
                    return <td key={row.id}>{speed === undefined ? '—' : `${speed.toFixed(1)} tok/s`}</td>
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
      )}

      <section className="ch-card ch-ov-gallery">
        <div className="ch-ov-toolbar">
          <div className="ch-ov-gallery-title">
            <h2>{t('sessions')}</h2>
            <span className="ch-count">{visible.length}</span>
            {activeDate && (
              <button
                type="button"
                className="ch-ov-day-chip"
                onClick={() => setSelectedDate(null)}
              >
                {t('updatedOnDate')} {activeDate} ×
              </button>
            )}
            {activeHarness && (
              <button
                type="button"
                className="ch-ov-day-chip"
                onClick={() => setHarnessFilter(null)}
              >
                {activeHarness} ×
              </button>
            )}
          </div>
          <div className="ch-ov-controls">
            <input
              className="ch-mini-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('search')}
              aria-label={t('search')}
            />
            <div className="ch-seg" role="group">
              {(['recent', 'tokens', 'occupancy', 'cost'] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={sort === key ? 'is-active' : ''}
                  aria-pressed={sort === key}
                  onClick={() => setSort(key)}
                >
                  {t(
                    key === 'recent'
                      ? 'sortRecent'
                      : key === 'tokens'
                        ? 'sortTokens'
                        : key === 'occupancy'
                          ? 'sortOccupancy'
                          : 'sortCost',
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ch-ov-filter-strip">
          <div className="ch-chip-group" role="group" aria-label={t('activeWorkspaces')}>
            <button
              type="button"
              className={`ch-ov-chip ${activeWorkspace === 'all' ? 'is-active' : ''}`}
              aria-pressed={activeWorkspace === 'all'}
              onClick={() => setWorkspace('all')}
            >
              {t('allWorkspaces')} <span>{validRows.length}</span>
            </button>
            {stats.workspaces.map(([name, count]) => (
              <button
                key={name}
                type="button"
                className={`ch-ov-chip ${activeWorkspace === name ? 'is-active' : ''}`}
                aria-pressed={activeWorkspace === name}
                onClick={() => setWorkspace(name)}
              >
                {name} <span>{count}</span>
              </button>
            ))}
          </div>
          <div className="ch-chip-group">
            <button
              type="button"
              className={`ch-ov-chip ${highOnly ? 'is-active' : ''}`}
              aria-pressed={highOnly}
              onClick={() => setHighOnly((prev) => !prev)}
            >
              {t('filterHighContext')} <span>{stats.highContextCount}</span>
            </button>
            <button
              type="button"
              className={`ch-ov-chip ${relationsOnly ? 'is-active' : ''}`}
              aria-pressed={relationsOnly}
              onClick={() => setRelationsOnly((prev) => !prev)}
            >
              {t('filterRelations')} <span>{stats.relationCount}</span>
            </button>
          </div>
        </div>

        {error ? (
          <div className="ch-error" role="alert">
            {t('listError')}
            <span>{error}</span>
            <button type="button" className="ch-mini-button" onClick={onRetry}>
              {t('retry')}
            </button>
          </div>
        ) : loading && validRows.length === 0 ? (
          <div className="ch-ov-grid">
            <div className="ch-skeleton ch-ov-skeleton" />
            <div className="ch-skeleton ch-ov-skeleton" />
            <div className="ch-skeleton ch-ov-skeleton" />
          </div>
        ) : visible.length === 0 ? (
          <p className="ch-note">{t('emptyList')}</p>
        ) : (
          <div className="ch-ov-grid">
            {visible.map((row) => (
              <OverviewSessionCard
                key={row.id}
                row={row}
                usage={usageById.get(row.id) ?? null}
                isSelected={selected === row.id}
                isCompared={activeCompareSet.has(row.id)}
                onSelect={onSelect}
                onToggleCompare={toggleCompare}
                t={t}
              />
            ))}
          </div>
        )}

        <div className="ch-pagination">
          <small>{t('overviewScopeNote')}</small>
          <div>
            <button
              type="button"
              className="ch-mini-button"
              disabled={pageIndex === 0 || loading}
              onClick={onPrev}
            >
              {t('previous')}
            </button>
            <span>
              {t('page')} {pageIndex + 1}
            </span>
            <button
              type="button"
              className="ch-mini-button"
              disabled={!hasNext || loading}
              onClick={onNext}
            >
              {t('next')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
})
