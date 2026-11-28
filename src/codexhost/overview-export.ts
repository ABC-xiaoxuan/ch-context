import { fmt, fmtDuration } from '../client/format.ts'
import type { SessionRow } from './api.ts'
import { formatUsd } from './format.ts'
import { occupancyOf, type Usage } from './model.ts'
import { dateKeyOf, workspaceLabelOf } from './overview-model.ts'

function csvEscape(value: string): string {
  const safe = /^\s*[=+\-@]|^[\t\r]/.test(value) ? `'${value}` : value
  if (/[",\r\n]/.test(safe)) return `"${safe.replaceAll('"', '""')}"`
  return safe
}

function mdCell(value: string): string {
  return value.replaceAll('\\', '\\\\').replaceAll('|', '\\|').replace(/\r\n|\r|\n/g, ' ')
}

export function buildOverviewCsv(
  rows: readonly SessionRow[],
  usageById: ReadonlyMap<string, Usage | null>,
): string {
  const headers = [
    'session_id',
    'title',
    'harness',
    'workspace',
    'updated_date',
    'context_percent',
    'context_used_tokens',
    'context_window_tokens',
    'total_tokens',
    'cache_hit_percent',
    'cost_usd',
    'cost_is_lower_bound',
    'output_tps',
    'ttft_ms',
  ]
  const lines = [headers.join(',')]
  for (const row of rows) {
    const usage = usageById.get(row.id) ?? null
    const occ = occupancyOf(usage)
    const cacheRate = usage?.cacheHitRatePercent ?? usage?.sessionCacheHitRatePercent
    const tps = usage?.outputTokensPerSecond ?? usage?.sessionOutputTokensPerSecond
    const ttft = usage?.latestRequestTimeToFirstOutputMs ?? usage?.timeToFirstOutputMs
    const lowerBound = (usage?.unpricedModels?.length ?? 0) > 0
    const cols = [
      row.id,
      row.title || row.id,
      row.harness ?? 'CodexHost',
      workspaceLabelOf(row.cwd) ?? '',
      row.updatedAt !== undefined && Number.isFinite(row.updatedAt) ? dateKeyOf(row.updatedAt) : '',
      occ ? occ.percent.toFixed(1) : '',
      occ?.used !== undefined ? String(occ.used) : '',
      occ?.capacity !== undefined ? String(occ.capacity) : '',
      usage?.totalTokens !== undefined ? String(usage.totalTokens) : '',
      cacheRate !== undefined ? cacheRate.toFixed(1) : '',
      usage?.totalCostUsd !== undefined ? usage.totalCostUsd.toFixed(4) : '',
      usage?.totalCostUsd !== undefined ? (lowerBound ? 'true' : 'false') : '',
      tps !== undefined ? tps.toFixed(1) : '',
      ttft !== undefined ? String(ttft) : '',
    ]
    lines.push(cols.map(csvEscape).join(','))
  }
  return lines.join('\n')
}

export function buildOverviewMarkdown(
  rows: readonly SessionRow[],
  usageById: ReadonlyMap<string, Usage | null>,
  locale: string,
): string {
  const isZh = locale.toLowerCase().startsWith('zh')
  const lines = [
    `# ${isZh ? '上下文洞察 · 会话总览汇总' : 'Context Insights · Conversations Summary'}`,
    '',
    `| ${isZh ? '会话' : 'Conversation'} | ${isZh ? '环境' : 'Harness'} | ${isZh ? '工作区' : 'Workspace'} | ${isZh ? '上下文' : 'Context'} | ${isZh ? '总 Token' : 'Total tokens'} | ${isZh ? '缓存命中' : 'Cache hit'} | ${isZh ? '费用' : 'Cost'} |`,
    '| --- | --- | --- | ---: | ---: | ---: | ---: |',
  ]
  for (const row of rows) {
    const usage = usageById.get(row.id) ?? null
    const occ = occupancyOf(usage)
    const cacheRate = usage?.cacheHitRatePercent ?? usage?.sessionCacheHitRatePercent
    const cost =
      usage?.totalCostUsd === undefined
        ? '—'
        : `${(usage.unpricedModels?.length ?? 0) > 0 ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`
    lines.push(
      `| ${mdCell(row.title || row.id)} | ${mdCell(row.harness ?? 'CodexHost')} | ${mdCell(workspaceLabelOf(row.cwd) ?? '—')} | ${occ ? `${occ.percent.toFixed(1)}%` : '—'} | ${fmt(usage?.totalTokens)} | ${cacheRate === undefined ? '—' : `${cacheRate.toFixed(1)}%`} | ${cost} |`,
    )
  }
  return lines.join('\n')
}

export function extremumIndices(
  values: ReadonlyArray<number | undefined>,
  mode: 'max' | 'min',
): ReadonlySet<number> {
  let finiteCount = 0
  let bestVal = mode === 'max' ? -Infinity : Infinity
  let worstVal = mode === 'max' ? Infinity : -Infinity
  for (const val of values) {
    if (val === undefined || !Number.isFinite(val)) continue
    finiteCount += 1
    if (mode === 'max') {
      if (val > bestVal) bestVal = val
      if (val < worstVal) worstVal = val
    } else {
      if (val < bestVal) bestVal = val
      if (val > worstVal) worstVal = val
    }
  }
  const result = new Set<number>()
  if (finiteCount < 2 || bestVal === worstVal) return result
  for (let i = 0; i < values.length; i++) {
    if (values[i] === bestVal) result.add(i)
  }
  return result
}

export function cheapestExactCostIndices(
  rows: readonly SessionRow[],
  usageById: ReadonlyMap<string, Usage | null>,
): ReadonlySet<number> {
  let reportedCount = 0
  let minExact = Infinity
  let maxAny = -Infinity
  let minLowerBound = Infinity
  const exactCosts: Array<number | undefined> = []
  for (const row of rows) {
    const usage = usageById.get(row.id)
    const cost = usage?.totalCostUsd
    if (cost === undefined || !Number.isFinite(cost)) {
      exactCosts.push(undefined)
      continue
    }
    reportedCount += 1
    if (cost > maxAny) maxAny = cost
    const isLowerBound = (usage?.unpricedModels?.length ?? 0) > 0
    if (isLowerBound) {
      if (cost < minLowerBound) minLowerBound = cost
      exactCosts.push(undefined)
    } else {
      if (cost < minExact) minExact = cost
      exactCosts.push(cost)
    }
  }
  const result = new Set<number>()
  if (reportedCount < 2 || !Number.isFinite(minExact)) return result
  if (minExact >= maxAny && minLowerBound === Infinity) return result
  if (minLowerBound <= minExact) return result
  for (let i = 0; i < exactCosts.length; i++) {
    if (exactCosts[i] === minExact) result.add(i)
  }
  return result
}

export function buildComparisonMarkdown(
  rows: readonly SessionRow[],
  usageById: ReadonlyMap<string, Usage | null>,
  locale: string,
): string {
  const isZh = locale.toLowerCase().startsWith('zh')
  const headers = [isZh ? '指标' : 'Metric', ...rows.map((row) => mdCell(row.title || row.id))]
  const align = ['---', ...rows.map(() => '---:')]
  const metricRow = (label: string, fn: (usage: Usage | null) => string): string =>
    `| ${label} | ${rows.map((row) => fn(usageById.get(row.id) ?? null)).join(' | ')} |`
  return [
    `| ${headers.join(' | ')} |`,
    `| ${align.join(' | ')} |`,
    metricRow(isZh ? '上下文占用' : 'Context occupancy', (usage) => {
      const occ = occupancyOf(usage)
      return occ
        ? `${occ.percent.toFixed(1)}%${occ.used !== undefined && occ.capacity !== undefined ? ` (${fmt(occ.used)}/${fmt(occ.capacity)})` : ''}`
        : '—'
    }),
    metricRow(isZh ? '总 Token' : 'Total tokens', (usage) => fmt(usage?.totalTokens)),
    metricRow(isZh ? '缓存命中' : 'Cache hit', (usage) => {
      const rate = usage?.cacheHitRatePercent ?? usage?.sessionCacheHitRatePercent
      return rate === undefined ? '—' : `${rate.toFixed(1)}%`
    }),
    metricRow(isZh ? '会话费用' : 'Session cost', (usage) =>
      usage?.totalCostUsd === undefined
        ? '—'
        : `${(usage.unpricedModels?.length ?? 0) > 0 ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`,
    ),
    metricRow(isZh ? '输出速度' : 'Output speed', (usage) => {
      const speed = usage?.outputTokensPerSecond ?? usage?.sessionOutputTokensPerSecond
      return speed === undefined ? '—' : `${speed.toFixed(1)} tok/s`
    }),
    metricRow(isZh ? '首个输出延迟' : 'TTFT', (usage) => {
      const ttft = usage?.latestRequestTimeToFirstOutputMs ?? usage?.timeToFirstOutputMs
      return ttft === undefined ? '—' : ttft === 0 ? '0ms' : fmtDuration(ttft)
    }),
  ].join('\n')
}
