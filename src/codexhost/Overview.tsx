import { useMemo, useState, type ReactElement } from 'react'
import { fmt } from '../client/format.ts'
import type { SessionRow } from './api.ts'
import { formatUsd } from './format.ts'
import type { Translate } from './i18n.ts'
import { isThreadId, occupancyOf, type Usage } from './model.ts'

type SortKey = 'recent' | 'occupancy' | 'cost'

function workspaceLabel(cwd?: string): string | null {
  if (!cwd) return null
  return cwd.split(/[\\/]/).filter(Boolean).at(-1) ?? null
}

function relationLabel(row: SessionRow, t: Translate): string | null {
  if (row.origin === 'subagent') return t('relationSubagent')
  if (row.forkParentId) return t('relationFork')
  if (row.treeParentId) return t('relationTree')
  return null
}

function MiniRing({ percent }: { percent: number | null }): ReactElement {
  const radius = 21
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
      <svg viewBox="0 0 54 54">
        <circle
          cx="27"
          cy="27"
          r={radius}
          className="ch-mini-ring-track"
          strokeDasharray={percent === null ? '3 3' : undefined}
        />
        {percent !== null && (
          <circle
            cx="27"
            cy="27"
            r={radius}
            className="ch-mini-ring-fill"
            strokeDasharray={`${dash.toFixed(1)} ${circumference.toFixed(1)}`}
          />
        )}
      </svg>
      <span>{percent === null ? '—' : `${Math.round(percent)}%`}</span>
    </div>
  )
}

export function Overview({
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
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('recent')

  const validRows = useMemo(() => rows.filter((row) => isThreadId(row.id)), [rows])

  const workspaces = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of validRows) {
      const name = workspaceLabel(row.cwd)
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1)
    }
    return [...counts.entries()]
  }, [validRows])

  const activeWorkspace =
    workspace !== 'all' && workspaces.some(([name]) => name === workspace) ? workspace : 'all'

  const stats = useMemo(() => {
    const harnesses = new Map<string, number>()
    let peak: { title: string; percent: number; used?: number; capacity?: number } | null = null
    let totalTokens = 0
    let hasTokens = false
    let totalCost = 0
    let hasCost = false
    let hasLowerBound = false
    let withTelemetry = 0
    for (const row of validRows) {
      const h = row.harness ?? 'CodexHost'
      harnesses.set(h, (harnesses.get(h) ?? 0) + 1)
      const usage = usageById.get(row.id) ?? null
      if (usage) {
        withTelemetry += 1
        if (usage.totalTokens !== undefined) {
          totalTokens += usage.totalTokens
          hasTokens = true
        }
        if (usage.totalCostUsd !== undefined) {
          totalCost += usage.totalCostUsd
          hasCost = true
        }
        if ((usage.unpricedModels?.length ?? 0) > 0) hasLowerBound = true
        const occ = occupancyOf(usage)
        if (occ && (!peak || occ.percent > peak.percent)) {
          peak = {
            title: row.title || row.id,
            percent: occ.percent,
            used: occ.used,
            capacity: occ.capacity,
          }
        }
      }
    }
    return {
      harnesses: [...harnesses.entries()],
      peak,
      totalTokens,
      hasTokens,
      totalCost,
      hasCost,
      hasLowerBound,
      withTelemetry,
    }
  }, [validRows, usageById])

  const visible = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    const filtered = validRows.filter((row) => {
      if (activeWorkspace !== 'all' && workspaceLabel(row.cwd) !== activeWorkspace) return false
      if (!needle) return true
      return `${row.title} ${row.harness ?? ''} ${row.cwd ?? ''}`
        .toLocaleLowerCase()
        .includes(needle)
    })
    return [...filtered].sort((a, b) => {
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
  }, [validRows, activeWorkspace, query, sort, usageById])

  const unavailableState = loading || error !== null

  return (
    <div className="ch-overview">
      {!hasSelected && (
        <div className="ch-overview-intro">
          <h2>{t('noSession')}</h2>
          <p>{t('choose')}</p>
        </div>
      )}
      <section className="ch-ov-summary">
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
              ? `${stats.peak.title}${
                  stats.peak.used !== undefined && stats.peak.capacity !== undefined
                    ? ` · ${fmt(stats.peak.used)} / ${fmt(stats.peak.capacity)}`
                    : ''
                }`
              : t('unavailable')}
          </div>
        </div>
        <div className="ch-ov-kpi">
          <small>{t('queriedUsage')}</small>
          <strong>{stats.hasTokens ? fmt(stats.totalTokens) : '—'}</strong>
          <div className="ch-ov-sub">
            {stats.withTelemetry > 0
              ? `${stats.hasCost ? `${stats.hasLowerBound ? '≥ ' : ''}${formatUsd(stats.totalCost)} · ` : ''}${stats.withTelemetry}/${Math.min(validRows.length, 50)} ${t('inspectedCount')}`
              : t('unavailable')}
          </div>
        </div>
        <div className="ch-ov-kpi">
          <small>{t('activeWorkspaces')}</small>
          <strong>{unavailableState ? '—' : workspaces.length}</strong>
          <div className="ch-ov-sub">
            {!unavailableState && workspaces.length
              ? workspaces
                  .map(([name]) => name)
                  .slice(0, 3)
                  .join(' · ')
              : '—'}
          </div>
        </div>
      </section>

      <section className="ch-card ch-ov-gallery">
        <div className="ch-ov-toolbar">
          <div className="ch-chip-group" role="group" aria-label={t('activeWorkspaces')}>
            <button
              className={`ch-chip ${activeWorkspace === 'all' ? 'is-active' : ''}`}
              aria-pressed={activeWorkspace === 'all'}
              onClick={() => setWorkspace('all')}
            >
              {t('allWorkspaces')} {validRows.length}
            </button>
            {workspaces.map(([name, count]) => (
              <button
                key={name}
                className={`ch-chip ${activeWorkspace === name ? 'is-active' : ''}`}
                aria-pressed={activeWorkspace === name}
                onClick={() => setWorkspace(name)}
              >
                {name} {count}
              </button>
            ))}
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
              {(['recent', 'occupancy', 'cost'] as const).map((key) => (
                <button
                  key={key}
                  className={sort === key ? 'is-active' : ''}
                  aria-pressed={sort === key}
                  onClick={() => setSort(key)}
                >
                  {t(key === 'recent' ? 'sortRecent' : key === 'occupancy' ? 'sortOccupancy' : 'sortCost')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error ? (
          <div className="ch-error" role="alert">
            {t('listError')}
            <span>{error}</span>
            <button className="ch-mini-button" onClick={onRetry}>
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
            {visible.map((row) => {
              const usage = usageById.get(row.id) ?? null
              const occ = occupancyOf(usage)
              const ws = workspaceLabel(row.cwd)
              const rel = relationLabel(row, t)
              return (
                <button
                  key={row.id}
                  className={`ch-overview-card ${selected === row.id ? 'is-selected' : ''}`}
                  onClick={() => onSelect(row.id)}
                >
                  <div className="ch-ov-card-top">
                    <MiniRing percent={occ ? occ.percent : null} />
                    <div className="ch-ov-card-meta">
                      <strong title={row.title || row.id}>{row.title || row.id}</strong>
                      <div className="ch-ov-card-tags">
                        <span className="ch-meta-tag">{row.harness ?? 'CodexHost'}</span>
                        {ws && <span className="ch-meta-tag is-muted">{ws}</span>}
                        {rel && (
                          <span className="ch-dot-pill">
                            <i className="is-event" />
                            {rel}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ch-ov-card-stats">
                    <div>
                      <small>{t('context')}</small>
                      <b>
                        {occ?.used !== undefined && occ.capacity !== undefined
                          ? `${fmt(occ.used)}/${fmt(occ.capacity)}`
                          : occ
                            ? `${occ.percent.toFixed(1)}%`
                            : '—'}
                      </b>
                    </div>
                    <div>
                      <small>{t('total')}</small>
                      <b>{fmt(usage?.totalTokens)}</b>
                    </div>
                    <div>
                      <small>{t('cost')}</small>
                      <b>
                        {usage?.totalCostUsd === undefined
                          ? '—'
                          : `${(usage.unpricedModels?.length ?? 0) > 0 ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`}
                      </b>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <div className="ch-pagination">
          <small>{t('overviewScopeNote')}</small>
          <div>
            <button className="ch-mini-button" disabled={pageIndex === 0 || loading} onClick={onPrev}>
              {t('previous')}
            </button>
            <span>
              {t('page')} {pageIndex + 1}
            </span>
            <button className="ch-mini-button" disabled={!hasNext || loading} onClick={onNext}>
              {t('next')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
