import assert from 'node:assert/strict'
import test from 'node:test'
import type { SessionRow } from '../../src/codexhost/api.ts'
import type { Usage } from '../../src/codexhost/model.ts'
import {
  aggregateOverview,
  buildDateHeatmap,
  dateKeyOf,
} from '../../src/codexhost/overview-model.ts'

test('buildDateHeatmap groups loaded session updatedAt timestamps into calendar weeks', () => {
  const anchor = new Date(2026, 10, 24, 12, 0, 0).getTime()
  const prevDay = new Date(2026, 10, 23, 9, 0, 0).getTime()
  const rows: SessionRow[] = [
    { id: '1', title: 'A', updatedAt: anchor },
    { id: '2', title: 'B', updatedAt: anchor },
    { id: '3', title: 'C', updatedAt: prevDay },
    { id: '4', title: 'D' },
  ]
  const map = buildDateHeatmap(rows, anchor, 4)
  assert.equal(map.datedCount, 3)
  assert.equal(map.maxCount, 2)
  assert.equal(map.weeks.length, 4)
  const allDays = map.weeks.flatMap((week) => week.days)
  const todayCell = allDays.find((cell) => cell.dateKey === dateKeyOf(anchor))
  const yesterdayCell = allDays.find((cell) => cell.dateKey === dateKeyOf(prevDay))
  assert.equal(todayCell?.count, 2)
  assert.equal(todayCell?.level, 4)
  assert.equal(yesterdayCell?.count, 1)
  assert.ok((yesterdayCell?.level ?? 0) >= 1)
})

test('aggregateOverview aggregates inspected telemetry honestly without inventing unknowns', () => {
  const rows: SessionRow[] = [
    { id: 's1', title: 'One', harness: 'pi', cwd: '/work/ch-context' },
    { id: 's2', title: 'Two', harness: 'codex', cwd: '/work/ch-context', origin: 'subagent' },
    { id: 's3', title: 'Three', harness: 'pi', cwd: '/work/web' },
  ]
  const usageById = new Map<string, Usage | null>([
    [
      's1',
      {
        inputTokens: 1000,
        cachedInputTokens: 800,
        cacheWriteInputTokens: 0,
        outputTokens: 200,
        totalTokens: 1200,
        totalCostUsd: 0.05,
        contextUsedTokens: 80000,
        contextWindowTokens: 100000,
        cacheHitRatePercent: 80,
      },
    ],
    ['s2', null],
    [
      's3',
      {
        totalTokens: 300,
        totalCostUsd: 0.01,
        unpricedModels: ['unknown'],
        contextUsagePercent: 25,
        sessionCacheHitRatePercent: 60,
      },
    ],
  ])
  const stats = aggregateOverview(rows, usageById)
  assert.equal(stats.withTelemetry, 2)
  assert.equal(stats.hasTokens, true)
  assert.equal(stats.totalTokens, 1500)
  assert.equal(stats.hasCost, true)
  assert.equal(stats.hasLowerBound, true)
  assert.equal(Math.round((stats.totalCost + Number.EPSILON) * 100) / 100, 0.06)
  assert.equal(stats.avgCacheHit, 70)
  assert.equal(stats.highContextCount, 1)
  assert.equal(stats.relationCount, 1)
  assert.equal(stats.peak?.id, 's1')
  assert.equal(stats.workspaces[0]?.[0], 'ch-context')
  assert.equal(stats.workspaces[0]?.[1], 2)
  assert.equal(stats.tokensCount, 2)
  assert.equal(stats.costCount, 2)
  assert.equal(stats.tokenSummary.mode, 'decomposed')
  assert.equal(stats.tokenSummary.cacheRead, 800)
  assert.equal(stats.tokenSummary.uncachedInput, 200)
  assert.equal(stats.tokenSummary.output, 200)
})

test('aggregateOverview never folds undecomposed input into uncachedInput or invents zero tokens', () => {
  const rows: SessionRow[] = [
    { id: 's1', title: 'Partial cache', harness: 'pi' },
    { id: 's2', title: 'Percent only', harness: 'codex' },
  ]
  const usageById = new Map<string, Usage | null>([
    [
      's1',
      {
        inputTokens: 1000,
        outputTokens: 200,
        cachedInputTokens: 600,
        totalTokens: 1200,
      },
    ],
    [
      's2',
      {
        contextUsagePercent: 45,
      },
    ],
  ])
  const stats = aggregateOverview(rows, usageById)
  assert.equal(stats.tokenSummary.mode, 'inputOutput')
  assert.equal(stats.tokenSummary.input, 1000)
  assert.equal(stats.tokenSummary.output, 200)
  assert.equal(stats.tokenSummary.uncachedInput, 0)
  assert.equal(stats.tokensCount, 1)
  assert.equal(stats.costCount, 0)
  const percentOnlyBar = stats.topSessions.find((item) => item.id === 's2')
  assert.equal(percentOnlyBar?.tokens, null)
  assert.equal(percentOnlyBar?.occupancyPercent, 45)
})

test('buildDateHeatmap anchors older pages to their latest session and scales visible counts', () => {
  const oldDay = new Date(2025, 2, 10, 10, 0, 0).getTime()
  const rows: SessionRow[] = [{ id: 'old', title: 'Old', updatedAt: oldDay }]
  const map = buildDateHeatmap(rows, undefined, 4)
  assert.equal(map.maxCount, 1)
  const match = map.weeks.flatMap((w) => w.days).find((d) => d.dateKey === dateKeyOf(oldDay))
  assert.equal(match?.count, 1)
  assert.equal(match?.level, 4)
})
