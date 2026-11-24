import type { SessionRow } from './api.ts'
import { occupancyOf, tokenParts, type Usage } from './model.ts'

export interface HeatmapCell {
  dateKey: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
  isFuture: boolean
  weekday: number
}

export interface HeatmapWeek {
  monthLabel?: string
  days: HeatmapCell[]
}

export interface DateHeatmap {
  weeks: HeatmapWeek[]
  maxCount: number
  datedCount: number
}

export interface SessionBarItem {
  id: string
  title: string
  tokens: number | null
  occupancyPercent: number | null
}

export interface OverviewTokenSummary {
  mode: 'none' | 'inputOutput' | 'decomposed'
  input: number
  uncachedInput: number
  cacheRead: number
  cacheWrite: number
  output: number
  sum: number
  sessionCount: number
}

export interface OverviewAggregate {
  harnesses: Array<[string, number]>
  workspaces: Array<[string, number]>
  relationCount: number
  highContextCount: number
  peak: { id: string; title: string; percent: number; used?: number; capacity?: number } | null
  totalTokens: number
  hasTokens: boolean
  tokensCount: number
  totalCost: number
  hasCost: boolean
  costCount: number
  hasLowerBound: boolean
  avgCacheHit: number | null
  cacheHitCount: number
  withTelemetry: number
  tokenSummary: OverviewTokenSummary
  topSessions: SessionBarItem[]
}

export function workspaceLabelOf(cwd?: string): string | null {
  if (!cwd) return null
  return cwd.split(/[\\/]/).filter(Boolean).at(-1) ?? null
}

export function hasSessionRelation(row: SessionRow): boolean {
  return Boolean(row.origin === 'subagent' || row.forkParentId || row.treeParentId || row.parentId)
}

export function dateKeyOf(ms: number): string {
  const date = new Date(ms)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function buildDateHeatmap(
  rows: readonly SessionRow[],
  nowMs?: number,
  weekCount = 8,
): DateHeatmap {
  const counts = new Map<string, number>()
  let maxTimestamp = 0
  let datedCount = 0
  for (const row of rows) {
    if (row.updatedAt === undefined || !Number.isFinite(row.updatedAt)) continue
    datedCount += 1
    if (row.updatedAt > maxTimestamp) maxTimestamp = row.updatedAt
    const key = dateKeyOf(row.updatedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  const anchorMs = nowMs ?? (maxTimestamp > 0 ? maxTimestamp : Date.now())
  const anchor = new Date(anchorMs)
  anchor.setHours(0, 0, 0, 0)
  const anchorDayOfWeek = (anchor.getDay() + 6) % 7
  const endOfGrid = new Date(anchor)
  endOfGrid.setDate(anchor.getDate() + (6 - anchorDayOfWeek))
  const startOfGrid = new Date(endOfGrid)
  startOfGrid.setDate(endOfGrid.getDate() - (weekCount * 7 - 1))
  const rawWeeks: Array<{
    monthLabel?: string
    days: Array<{ dateKey: string; count: number; isFuture: boolean; weekday: number }>
  }> = []
  let maxCount = 0
  let previousMonth = -1
  for (let weekIndex = 0; weekIndex < weekCount; weekIndex++) {
    const days: Array<{ dateKey: string; count: number; isFuture: boolean; weekday: number }> = []
    let monthLabel: string | undefined
    for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
      const cellDate = new Date(startOfGrid)
      cellDate.setDate(startOfGrid.getDate() + weekIndex * 7 + dayIndex)
      const isFuture = cellDate.getTime() > anchor.getTime()
      const key = dateKeyOf(cellDate.getTime())
      const count = isFuture ? 0 : (counts.get(key) ?? 0)
      if (count > maxCount) maxCount = count
      const month = cellDate.getMonth()
      if (dayIndex === 0 && month !== previousMonth) {
        monthLabel = `${month + 1}`
        previousMonth = month
      }
      days.push({ dateKey: key, count, isFuture, weekday: dayIndex })
    }
    rawWeeks.push({ ...(monthLabel ? { monthLabel } : {}), days })
  }
  const weeks: HeatmapWeek[] = rawWeeks.map((week) => ({
    ...(week.monthLabel ? { monthLabel: week.monthLabel } : {}),
    days: week.days.map((day) => {
      const level: 0 | 1 | 2 | 3 | 4 =
        day.count <= 0 || maxCount <= 0
          ? 0
          : day.count >= maxCount
            ? 4
            : day.count >= maxCount * 0.66
              ? 3
              : day.count >= maxCount * 0.33
                ? 2
                : 1
      return { ...day, level }
    }),
  }))
  return { weeks, maxCount, datedCount }
}

export function aggregateOverview(
  rows: readonly SessionRow[],
  usageById: ReadonlyMap<string, Usage | null>,
): OverviewAggregate {
  const harnesses = new Map<string, number>()
  const workspaces = new Map<string, number>()
  let relationCount = 0
  let highContextCount = 0
  let peak: OverviewAggregate['peak'] = null
  let totalTokens = 0
  let tokensCount = 0
  let totalCost = 0
  let costCount = 0
  let hasLowerBound = false
  let cacheHitSum = 0
  let cacheHitCount = 0
  let withTelemetry = 0
  let ioSessions = 0
  let decomposedSessions = 0
  let totalInput = 0
  let totalOutput = 0
  let uncachedInput = 0
  let cacheRead = 0
  let cacheWrite = 0
  let decomposedOutput = 0
  const bars: SessionBarItem[] = []
  for (const row of rows) {
    const harness = row.harness ?? 'CodexHost'
    harnesses.set(harness, (harnesses.get(harness) ?? 0) + 1)
    const ws = workspaceLabelOf(row.cwd)
    if (ws) workspaces.set(ws, (workspaces.get(ws) ?? 0) + 1)
    if (hasSessionRelation(row)) relationCount += 1
    const usage = usageById.get(row.id) ?? null
    if (!usage) continue
    withTelemetry += 1
    if (usage.totalTokens !== undefined) {
      totalTokens += usage.totalTokens
      tokensCount += 1
    }
    if (usage.totalCostUsd !== undefined) {
      totalCost += usage.totalCostUsd
      costCount += 1
    }
    if ((usage.unpricedModels?.length ?? 0) > 0) hasLowerBound = true
    const hit = usage.sessionCacheHitRatePercent ?? usage.cacheHitRatePercent
    if (hit !== undefined) {
      cacheHitSum += hit
      cacheHitCount += 1
    }
    const occ = occupancyOf(usage)
    if (occ) {
      if (occ.percent >= 75) highContextCount += 1
      if (!peak || occ.percent > peak.percent) {
        peak = {
          id: row.id,
          title: row.title || row.id,
          percent: occ.percent,
          used: occ.used,
          capacity: occ.capacity,
        }
      }
    }
    const parts = tokenParts(usage)
    if (parts.length === 4) {
      ioSessions += 1
      decomposedSessions += 1
      for (const part of parts) {
        if (part.kind === 'uncachedInput') {
          uncachedInput += part.value
          totalInput += part.value
        } else if (part.kind === 'cacheRead') {
          cacheRead += part.value
          totalInput += part.value
        } else if (part.kind === 'cacheWrite') {
          cacheWrite += part.value
          totalInput += part.value
        } else if (part.kind === 'output') {
          decomposedOutput += part.value
          totalOutput += part.value
        }
      }
    } else if (parts.length === 2) {
      ioSessions += 1
      for (const part of parts) {
        if (part.kind === 'input') totalInput += part.value
        else if (part.kind === 'output') totalOutput += part.value
      }
    }
    if (usage.totalTokens !== undefined || occ !== null) {
      bars.push({
        id: row.id,
        title: row.title || row.id,
        tokens: usage.totalTokens ?? null,
        occupancyPercent: occ ? occ.percent : null,
      })
    }
  }
  const decomposedSum = uncachedInput + cacheRead + cacheWrite + decomposedOutput
  const ioSum = totalInput + totalOutput
  const tokenSummary: OverviewTokenSummary =
    ioSessions > 0 && decomposedSessions === ioSessions && decomposedSum > 0
      ? {
          mode: 'decomposed',
          input: totalInput,
          uncachedInput,
          cacheRead,
          cacheWrite,
          output: decomposedOutput,
          sum: decomposedSum,
          sessionCount: decomposedSessions,
        }
      : ioSessions > 0 && ioSum > 0
        ? {
            mode: 'inputOutput',
            input: totalInput,
            uncachedInput: 0,
            cacheRead: 0,
            cacheWrite: 0,
            output: totalOutput,
            sum: ioSum,
            sessionCount: ioSessions,
          }
        : {
            mode: 'none',
            input: 0,
            uncachedInput: 0,
            cacheRead: 0,
            cacheWrite: 0,
            output: 0,
            sum: 0,
            sessionCount: 0,
          }
  bars.sort(
    (a, b) =>
      (b.tokens ?? -1) - (a.tokens ?? -1) ||
      (b.occupancyPercent ?? -1) - (a.occupancyPercent ?? -1),
  )
  return {
    harnesses: [...harnesses.entries()].sort((a, b) => b[1] - a[1]),
    workspaces: [...workspaces.entries()].sort((a, b) => b[1] - a[1]),
    relationCount,
    highContextCount,
    peak,
    totalTokens,
    hasTokens: tokensCount > 0,
    tokensCount,
    totalCost,
    hasCost: costCount > 0,
    costCount,
    hasLowerBound,
    avgCacheHit: cacheHitCount > 0 ? cacheHitSum / cacheHitCount : null,
    cacheHitCount,
    withTelemetry,
    tokenSummary,
    topSessions: bars.slice(0, 6),
  }
}
