import type { HistoryItem } from './api.ts'
import { eventX } from './event-geometry.ts'

export type TimelineGranularity = 'step' | 'turn'
export type TimelineScaleMode = 'total' | 'delta'
export type TimelineMilestoneKind = 'spike' | 'error'

export interface TimelineMilestone {
  kind: TimelineMilestoneKind
  labelKey: 'milestoneSpike' | 'milestoneError'
  detail: string
  count: number
  targetId: string
  seq: number
}

export interface TimelineDnaRun {
  kind: HistoryItem['kind']
  chars: number
  isError: boolean
}

export interface TimelineTurnSpan {
  turn: number
  startIndex: number
  endIndex: number
  count: number
  totalChars: number
}

export interface TimelineBucket {
  key: string
  index: number
  startIndex: number
  endIndex: number
  turn: number
  seq: number
  recordId: string
  item: HistoryItem
  totalByKind: Record<HistoryItem['kind'], number>
  deltaByKind: Record<HistoryItem['kind'], number>
  totalChars: number
  deltaChars: number
  dnaCumulative: TimelineDnaRun[]
  dnaDelta: TimelineDnaRun[]
  milestone?: TimelineMilestone
}

export interface TimelineModel {
  buckets: TimelineBucket[]
  turns: TimelineTurnSpan[]
  turnByRecordIndex: number[]
  maxTotal: number
  maxDelta: number
  stepFlags: number[]
  totalChars: number
  charsByKind: Record<HistoryItem['kind'], number>
}

export const KIND_ORDER: readonly HistoryItem['kind'][] = ['user', 'assistant', 'tool', 'event']

function emptyKindMap(): Record<HistoryItem['kind'], number> {
  return { user: 0, assistant: 0, tool: 0, event: 0 }
}

function sampleMergedRuns(
  merged: readonly TimelineDnaRun[],
  prefixSums: readonly number[],
  maxStops: number,
): TimelineDnaRun[] {
  const limit = Math.max(1, Math.floor(maxStops))
  if (merged.length === 0) return []
  if (merged.length <= limit) return merged.map((run) => ({ ...run }))
  const total = prefixSums[merged.length - 1] ?? 0
  if (total <= 0) return merged.slice(0, limit).map((run) => ({ ...run }))
  const out: TimelineDnaRun[] = []
  const sliceChars = total / limit
  for (let slot = 0; slot < limit; slot++) {
    const mid = ((slot + 0.5) / limit) * total
    let lo = 0
    let hi = merged.length - 1
    while (lo < hi) {
      const midIdx = (lo + hi) >>> 1
      if (prefixSums[midIdx] <= mid) lo = midIdx + 1
      else hi = midIdx
    }
    const picked = merged[lo]
    const last = out.at(-1)
    if (last && last.kind === picked.kind && last.isError === picked.isError) {
      last.chars += sliceChars
    } else {
      out.push({ kind: picked.kind, chars: sliceChars, isError: picked.isError })
    }
  }
  return out
}

export function capDnaRuns(
  runs: readonly TimelineDnaRun[],
  maxStops = 48,
): TimelineDnaRun[] {
  const limit = Math.max(1, Math.floor(maxStops))
  const merged: TimelineDnaRun[] = []
  const prefixSums: number[] = []
  let acc = 0
  for (const run of runs) {
    const weight = Math.max(1, run.chars)
    const last = merged.at(-1)
    if (last && last.kind === run.kind && last.isError === run.isError) {
      last.chars += weight
      acc += weight
      prefixSums[prefixSums.length - 1] = acc
    } else {
      merged.push({ kind: run.kind, chars: weight, isError: run.isError })
      acc += weight
      prefixSums.push(acc)
    }
  }
  return sampleMergedRuns(merged, prefixSums, limit)
}

export function buildDnaRunsFromItems(
  items: readonly HistoryItem[],
  maxStops = 48,
): TimelineDnaRun[] {
  if (items.length === 0) return []
  return capDnaRuns(
    items.map((item) => ({
      kind: item.kind,
      chars: Math.max(1, item.text.length),
      isError: item.isError === true,
    })),
    maxStops,
  )
}

export function summarizeCharsByKind(items: readonly HistoryItem[]): {
  totalChars: number
  charsByKind: Record<HistoryItem['kind'], number>
} {
  const charsByKind = emptyKindMap()
  let totalChars = 0
  for (const item of items) {
    const chars = item.text.length
    charsByKind[item.kind] += chars
    totalChars += chars
  }
  return { totalChars, charsByKind }
}

export function buildTimelineModel(
  items: readonly HistoryItem[],
  granularity: TimelineGranularity,
  includeDna = false,
): TimelineModel {
  const turns: TimelineTurnSpan[] = []
  const turnByRecordIndex: number[] = []
  const charsByKind = emptyKindMap()
  let totalChars = 0

  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const chars = item.text.length
    charsByKind[item.kind] += chars
    totalChars += chars
    const currentTurn =
      turns.length === 0 ? 1 : item.kind === 'user' ? turns.length + 1 : turns.length
    turnByRecordIndex.push(currentTurn)
    const lastTurn = turns.at(-1)
    if (!lastTurn || lastTurn.turn !== currentTurn) {
      turns.push({
        turn: currentTurn,
        startIndex: index,
        endIndex: index,
        count: 1,
        totalChars: chars,
      })
    } else {
      lastTurn.endIndex = index
      lastTurn.count += 1
      lastTurn.totalChars += chars
    }
  }

  const turnEndIndices =
    includeDna && granularity === 'turn'
      ? new Set(turns.map((span) => span.endIndex))
      : null

  const cumulative = emptyKindMap()
  let cumulativeTotal = 0
  const mergedDna: TimelineDnaRun[] = []
  const prefixDna: number[] = []
  let dnaWeightSum = 0
  const stepBuckets: TimelineBucket[] = []

  for (let index = 0; index < items.length; index++) {
    const item = items[index]
    const chars = item.text.length
    cumulative[item.kind] += chars
    cumulativeTotal += chars
    const isErr = item.isError === true
    if (includeDna) {
      const weight = Math.max(1, chars)
      const lastRun = mergedDna.at(-1)
      if (lastRun && lastRun.kind === item.kind && lastRun.isError === isErr) {
        lastRun.chars += weight
        dnaWeightSum += weight
        prefixDna[prefixDna.length - 1] = dnaWeightSum
      } else {
        mergedDna.push({ kind: item.kind, chars: weight, isError: isErr })
        dnaWeightSum += weight
        prefixDna.push(dnaWeightSum)
      }
    }
    const needStepDna =
      includeDna && (granularity === 'step' || (turnEndIndices !== null && turnEndIndices.has(index)))
    const deltaByKind = emptyKindMap()
    deltaByKind[item.kind] = chars
    stepBuckets.push({
      key: item.id,
      index,
      startIndex: index,
      endIndex: index,
      turn: turnByRecordIndex[index] ?? 1,
      seq: item.seq,
      recordId: item.id,
      item,
      totalByKind: { ...cumulative },
      deltaByKind,
      totalChars: cumulativeTotal,
      deltaChars: chars,
      dnaCumulative: needStepDna ? sampleMergedRuns(mergedDna, prefixDna, 36) : [],
      dnaDelta:
        includeDna && granularity === 'step'
          ? [{ kind: item.kind, chars: Math.max(1, chars), isError: isErr }]
          : [],
    })
  }

  let buckets: TimelineBucket[]
  if (granularity === 'step') {
    buckets = stepBuckets
  } else {
    buckets = turns.map((span, turnIdx) => {
      const slice = stepBuckets.slice(span.startIndex, span.endIndex + 1)
      const last = slice.at(-1)!
      const deltaByKind = emptyKindMap()
      const turnDna: TimelineDnaRun[] = []
      let deltaSum = 0
      for (const bucket of slice) {
        deltaByKind[bucket.item.kind] += bucket.deltaChars
        deltaSum += bucket.deltaChars
        if (includeDna) {
          turnDna.push({
            kind: bucket.item.kind,
            chars: bucket.deltaChars,
            isError: bucket.item.isError === true,
          })
        }
      }
      return {
        key: `turn-${span.turn}`,
        index: turnIdx,
        startIndex: span.startIndex,
        endIndex: span.endIndex,
        turn: span.turn,
        seq: last.seq,
        recordId: last.recordId,
        item: last.item,
        totalByKind: { ...last.totalByKind },
        deltaByKind,
        totalChars: last.totalChars,
        deltaChars: deltaSum,
        dnaCumulative: last.dnaCumulative,
        dnaDelta: includeDna ? capDnaRuns(turnDna, 36) : [],
      }
    })
  }

  const nonZeroDeltas = buckets.map((bucket) => bucket.deltaChars).filter((value) => value > 0)
  const sortedDeltas = [...nonZeroDeltas].sort((a, b) => a - b)
  const midDelta = Math.floor(sortedDeltas.length / 2)
  const medianDelta =
    sortedDeltas.length === 0
      ? 0
      : sortedDeltas.length % 2 === 1
        ? sortedDeltas[midDelta]
        : (sortedDeltas[midDelta - 1] + sortedDeltas[midDelta]) / 2

  let peakBucket: TimelineBucket | null = null
  for (const bucket of buckets) {
    if (bucket.deltaChars <= 0) continue
    if (!peakBucket || bucket.deltaChars > peakBucket.deltaChars) peakBucket = bucket
  }

  const errorBuckets: Array<{ bucket: TimelineBucket; count: number; target: HistoryItem }> = []
  for (const bucket of buckets) {
    const slice = items.slice(bucket.startIndex, bucket.endIndex + 1)
    const errs = slice.filter((entry) => entry.isError === true)
    if (errs.length > 0) {
      errorBuckets.push({ bucket, count: errs.length, target: errs[0] })
    }
  }

  const pinnedErrorBuckets =
    errorBuckets.length <= 4
      ? errorBuckets
      : [
          errorBuckets[0],
          errorBuckets[Math.floor(errorBuckets.length / 3)],
          errorBuckets[Math.floor((errorBuckets.length * 2) / 3)],
          errorBuckets[errorBuckets.length - 1],
        ]

  const milestoneIndices: number[] = []
  for (const entry of pinnedErrorBuckets) {
    entry.bucket.milestone = {
      kind: 'error',
      labelKey: 'milestoneError',
      detail: entry.target.toolName ?? entry.target.title,
      count: entry.count,
      targetId: entry.target.id,
      seq: entry.target.seq,
    }
    milestoneIndices.push(entry.bucket.index)
  }

  if (
    peakBucket &&
    !peakBucket.milestone &&
    nonZeroDeltas.length >= 2 &&
    peakBucket.deltaChars >= Math.max(400, medianDelta * 1.5)
  ) {
    let peakTarget = peakBucket.item
    if (peakBucket.endIndex > peakBucket.startIndex) {
      for (let idx = peakBucket.startIndex; idx <= peakBucket.endIndex; idx++) {
        const candidate = items[idx]
        if (candidate && candidate.text.length > peakTarget.text.length) peakTarget = candidate
      }
    }
    peakBucket.milestone = {
      kind: 'spike',
      labelKey: 'milestoneSpike',
      detail: peakTarget.toolName ?? peakTarget.title,
      count: 1,
      targetId: peakTarget.id,
      seq: peakTarget.seq,
    }
    milestoneIndices.push(peakBucket.index)
  }

  const stepFlags: number[] = []
  if (granularity === 'step' && buckets.length >= 6) {
    const stride = buckets.length <= 40 ? 5 : buckets.length <= 90 ? 10 : 25
    const milestoneXs = milestoneIndices.map((mIdx) => eventX(mIdx, buckets.length))
    for (let idx = stride - 1; idx < buckets.length - 1; idx += stride) {
      const flagX = eventX(idx, buckets.length)
      const nearMilestone = milestoneXs.some((msX) => Math.abs(flagX - msX) < 28)
      if (!nearMilestone) stepFlags.push(idx)
    }
  }

  const maxTotal = buckets.reduce((max, bucket) => Math.max(max, bucket.totalChars), 0)
  const maxDelta = buckets.reduce((max, bucket) => Math.max(max, bucket.deltaChars), 0)

  return {
    buckets,
    turns,
    turnByRecordIndex,
    maxTotal,
    maxDelta,
    stepFlags,
    totalChars,
    charsByKind,
  }
}
