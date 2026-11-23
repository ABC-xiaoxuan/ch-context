export interface Usage {
  inputTokens?: number
  cachedInputTokens?: number
  cacheWriteInputTokens?: number
  outputTokens?: number
  totalTokens?: number
  reasoningOutputTokens?: number
  totalCostUsd?: number
  totalCredits?: number
  contextUsedTokens?: number
  contextWindowTokens?: number
  contextUsagePercent?: number
  cacheHitRatePercent?: number
  sessionCacheHitRatePercent?: number
  outputTokensPerSecond?: number
  sessionOutputTokensPerSecond?: number
  timeToFirstOutputMs?: number
  latestRequestTimeToFirstOutputMs?: number
  costSource?: 'publicPrice' | 'native'
  unpricedModels?: string[]
}

export interface Sample {
  time: number
  percent: number
  used?: number
  capacity?: number
}

export function isThreadId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
  )
}

export function recordOf(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

export function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined
}

const NUMERIC_FIELDS = [
  'inputTokens',
  'cachedInputTokens',
  'cacheWriteInputTokens',
  'outputTokens',
  'totalTokens',
  'reasoningOutputTokens',
  'totalCostUsd',
  'totalCredits',
  'contextUsedTokens',
  'contextWindowTokens',
  'contextUsagePercent',
  'cacheHitRatePercent',
  'sessionCacheHitRatePercent',
  'outputTokensPerSecond',
  'sessionOutputTokensPerSecond',
  'timeToFirstOutputMs',
  'latestRequestTimeToFirstOutputMs',
] as const

export function usageOf(value: unknown): Usage | null {
  const envelope = recordOf(value)
  const raw = recordOf(envelope?.usage)
  if (raw === null) return null
  const usage: Usage = {}
  for (const field of NUMERIC_FIELDS) {
    const number = finiteNumber(raw[field])
    if (number !== undefined) usage[field] = number
  }
  if (usage.contextWindowTokens === 0) delete usage.contextWindowTokens
  if (raw.costSource === 'publicPrice' || raw.costSource === 'native')
    usage.costSource = raw.costSource
  if (Array.isArray(raw.unpricedModels))
    usage.unpricedModels = raw.unpricedModels
      .filter((name): name is string => typeof name === 'string')
      .slice(0, 100)
  return NUMERIC_FIELDS.some((field) => usage[field] !== undefined) ? usage : null
}

export function occupancyOf(
  usage: Usage | null,
): { used?: number; capacity?: number; percent: number } | null {
  const used = finiteNumber(usage?.contextUsedTokens)
  const rawCapacity = finiteNumber(usage?.contextWindowTokens)
  const capacity = rawCapacity === 0 ? undefined : rawCapacity
  const percent =
    finiteNumber(usage?.contextUsagePercent) ??
    (used !== undefined && capacity !== undefined ? (used / capacity) * 100 : undefined)
  if (percent === undefined) return null
  return {
    percent,
    ...(used === undefined ? {} : { used }),
    ...(capacity === undefined ? {} : { capacity }),
  }
}

export function appendSample(
  samples: readonly Sample[],
  usage: Usage | null,
  time: number,
): Sample[] {
  const occupancy = occupancyOf(usage)
  if (occupancy === null || !Number.isFinite(time)) return [...samples]
  const previous = samples.at(-1)
  if (
    previous?.percent === occupancy.percent &&
    previous.used === occupancy.used &&
    previous.capacity === occupancy.capacity
  )
    return [...samples]
  return [...samples, { time, ...occupancy }].slice(-120)
}

export function samplePath(samples: readonly Sample[], width = 600, height = 120): string {
  const first = samples[0]
  if (first === undefined) return ''
  const duration = Math.max(1, (samples.at(-1)?.time ?? first.time) - first.time)
  return samples
    .map((sample, index) => {
      const x = samples.length === 1 ? width / 2 : ((sample.time - first.time) / duration) * width
      const y = height - (Math.min(100, sample.percent) / 100) * height
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')
}
