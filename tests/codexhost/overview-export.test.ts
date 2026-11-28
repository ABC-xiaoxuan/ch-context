import assert from 'node:assert/strict'
import test from 'node:test'
import type { SessionRow } from '../../src/codexhost/api.ts'
import type { Usage } from '../../src/codexhost/model.ts'
import {
  buildComparisonMarkdown,
  buildOverviewCsv,
  buildOverviewMarkdown,
  cheapestExactCostIndices,
  extremumIndices,
} from '../../src/codexhost/overview-export.ts'

test('buildOverviewCsv escapes formula payloads and keeps unavailable telemetry blank', () => {
  const rows: SessionRow[] = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      title: '=SUM(A1:A2), "quoted"',
      harness: 'pi',
      cwd: '/work/alpha',
      updatedAt: Date.UTC(2026, 4, 2, 12, 0, 0),
    },
    {
      id: '22222222-2222-4222-8222-222222222222',
      title: '  +cmd|calc',
      harness: 'codex',
    },
  ]
  const usageById = new Map<string, Usage | null>([
    [
      rows[0].id,
      {
        contextUsedTokens: 100000,
        contextWindowTokens: 200000,
        totalTokens: 250000,
        cacheHitRatePercent: 80,
        totalCostUsd: 0.1234,
        unpricedModels: ['custom/model'],
        outputTokensPerSecond: 64.5,
        latestRequestTimeToFirstOutputMs: 420,
      },
    ],
    [rows[1].id, null],
  ])
  const csv = buildOverviewCsv(rows, usageById)
  const lines = csv.split('\n')
  assert.equal(lines.length, 3)
  assert.ok(lines[1].includes('"\'=SUM(A1:A2), ""quoted"""'))
  assert.ok(lines[1].includes(',50.0,100000,200000,250000,80.0,0.1234,true,64.5,420'))
  assert.ok(lines[2].includes(",'  +cmd|calc,codex,,,,,,,,,,,"))
})

test('buildOverviewMarkdown and buildComparisonMarkdown preserve honest dashes and lower-bound costs', () => {
  const rows: SessionRow[] = [
    {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Alpha \\| One\rLine',
      harness: 'pi',
      cwd: '/repo/a',
    },
    { id: '22222222-2222-4222-8222-222222222222', title: 'Beta', harness: 'codex' },
  ]
  const usageById = new Map<string, Usage | null>([
    [
      rows[0].id,
      {
        contextUsedTokens: 50000,
        contextWindowTokens: 100000,
        totalTokens: 120000,
        cacheHitRatePercent: 75,
        totalCostUsd: 0.05,
        unpricedModels: ['unknown/x'],
        outputTokensPerSecond: 40,
        timeToFirstOutputMs: 0,
      },
    ],
    [rows[1].id, null],
  ])
  const overviewMd = buildOverviewMarkdown(rows, usageById, 'en')
  assert.match(overviewMd, /Alpha \\\\\\| One Line/)
  assert.match(overviewMd, /≥ \$0\.0500/)
  assert.match(overviewMd, /\| Beta \| codex \| — \| — \| — \| — \| — \|/)

  const compareMd = buildComparisonMarkdown(rows, usageById, 'zh-CN')
  assert.match(compareMd, /\| 指标 \| Alpha \\\\\\| One Line \| Beta \|/)
  assert.match(compareMd, /\| 上下文占用 \| 50\.0% \(50\.0k\/100\.0k\) \| — \|/)
  assert.match(compareMd, /\| 首个输出延迟 \| 0ms \| — \|/)
})

test('compare tray extremum helpers handle ties and never rank lower-bound costs as cheapest', () => {
  assert.deepEqual([...extremumIndices([80, 80], 'max')], [])
  assert.deepEqual([...extremumIndices([90, 90, 50], 'max')], [0, 1])
  assert.deepEqual([...extremumIndices([undefined, 40], 'min')], [])

  const rows: SessionRow[] = [
    { id: '11111111-1111-4111-8111-111111111111', title: 'LowerBound' },
    { id: '22222222-2222-4222-8222-222222222222', title: 'ExactHigher' },
    { id: '33333333-3333-4333-8333-333333333333', title: 'ExactCheapest' },
  ]
  const lowerBoundCheaper = new Map<string, Usage | null>([
    [rows[0].id, { totalCostUsd: 0.05, unpricedModels: ['unknown'] }],
    [rows[1].id, { totalCostUsd: 0.08 }],
  ])
  assert.deepEqual([...cheapestExactCostIndices(rows.slice(0, 2), lowerBoundCheaper)], [])

  const exactProvenCheapest = new Map<string, Usage | null>([
    [rows[0].id, { totalCostUsd: 0.05, unpricedModels: ['unknown'] }],
    [rows[1].id, { totalCostUsd: 0.08 }],
    [rows[2].id, { totalCostUsd: 0.04 }],
  ])
  assert.deepEqual([...cheapestExactCostIndices(rows, exactProvenCheapest)], [2])
})
