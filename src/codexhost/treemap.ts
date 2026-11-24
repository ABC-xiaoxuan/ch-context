import type { HistoryItem } from './api.ts'

export interface TreemapBlock {
  id: string
  seq: number
  kind: HistoryItem['kind']
  label: string
  chars: number
  isError: boolean
  x: number
  y: number
  w: number
  h: number
}

export interface TreemapCategory {
  kind: HistoryItem['kind']
  count: number
  chars: number
  share: number
  x: number
  y: number
  w: number
  h: number
  blocks: TreemapBlock[]
}

export interface RecordTreemap {
  totalChars: number
  categories: TreemapCategory[]
}

export interface TextMatch {
  start: number
  end: number
}

interface WeightedRect<T> {
  item: T
  weight: number
}

interface LaidRect<T> {
  item: T
  x: number
  y: number
  w: number
  h: number
}

function packRects<T>(
  entries: readonly WeightedRect<T>[],
  x: number,
  y: number,
  w: number,
  h: number,
): LaidRect<T>[] {
  const total = entries.reduce((sum, entry) => sum + entry.weight, 0)
  if (entries.length === 0 || total <= 0 || w <= 0 || h <= 0) return []
  if (entries.length === 1) return [{ item: entries[0].item, x, y, w, h }]
  const sorted = [...entries].sort((a, b) => b.weight - a.weight)
  let acc = 0
  let split = 1
  const half = total / 2
  for (let index = 0; index < sorted.length - 1; index++) {
    acc += sorted[index].weight
    split = index + 1
    if (acc >= half) break
  }
  const first = sorted.slice(0, split)
  const rest = sorted.slice(split)
  const ratio = acc / total
  if (w >= h) {
    const w1 = w * ratio
    return [
      ...packRects(first, x, y, w1, h),
      ...packRects(rest, x + w1, y, w - w1, h),
    ]
  }
  const h1 = h * ratio
  return [
    ...packRects(first, x, y, w, h1),
    ...packRects(rest, x, y + h1, w, h - h1),
  ]
}

export function layoutRecordTreemap(items: readonly HistoryItem[]): RecordTreemap {
  const kinds: readonly HistoryItem['kind'][] = ['user', 'assistant', 'tool', 'event']
  const totalChars = items.reduce((sum, item) => sum + item.text.length, 0)
  const grouped = kinds
    .map((kind) => {
      const list = items.filter((item) => item.kind === kind)
      const chars = list.reduce((sum, item) => sum + item.text.length, 0)
      const weight = list.reduce((sum, item) => sum + Math.max(1, item.text.length), 0)
      return { kind, list, chars, weight }
    })
    .filter((entry) => entry.list.length > 0)
  const catRects = packRects(
    grouped.map((entry) => ({ item: entry, weight: entry.weight })),
    0,
    0,
    100,
    100,
  )
  const categories: TreemapCategory[] = catRects.map((rect) => {
    const { kind, list, chars } = rect.item
    const innerBlocks = packRects(
      list.map((item) => ({ item, weight: Math.max(1, item.text.length) })),
      0,
      0,
      100,
      100,
    ).map((block) => ({
      id: block.item.id,
      seq: block.item.seq,
      kind: block.item.kind,
      label: block.item.toolName ?? block.item.title,
      chars: block.item.text.length,
      isError: block.item.isError === true,
      x: block.x,
      y: block.y,
      w: block.w,
      h: block.h,
    }))
    return {
      kind,
      count: list.length,
      chars,
      share: totalChars > 0 ? (chars / totalChars) * 100 : 0,
      x: rect.x,
      y: rect.y,
      w: rect.w,
      h: rect.h,
      blocks: innerBlocks,
    }
  })
  return { totalChars, categories }
}

export function findTextMatches(text: string, query: string, limit = 500): TextMatch[] {
  const needle = query.trim().toLocaleLowerCase()
  if (!needle || !text) return []
  let folded = ''
  const origStarts: number[] = []
  const origEnds: number[] = []
  for (let i = 0; i < text.length; ) {
    const code = text.codePointAt(i)!
    const step = code > 0xffff ? 2 : 1
    const lower = text.slice(i, i + step).toLocaleLowerCase()
    for (let j = 0; j < lower.length; j++) {
      origStarts.push(i)
      origEnds.push(i + step)
    }
    folded += lower
    i += step
  }
  const matches: TextMatch[] = []
  let offset = 0
  while (matches.length < limit) {
    const found = folded.indexOf(needle, offset)
    if (found < 0) break
    const endIdx = found + needle.length - 1
    const start = origStarts[found]
    const end = origEnds[endIdx]
    if (start !== undefined && end !== undefined) matches.push({ start, end })
    offset = found + Math.max(1, needle.length)
  }
  return matches
}

export function parseRecordArguments(raw: string | undefined): Array<[string, string]> | null {
  if (typeof raw !== 'string' || raw.trim().length === 0) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    const entries = Object.entries(parsed as Record<string, unknown>)
    if (entries.length === 0) return null
    return entries.map(([key, value]) => [
      key,
      typeof value === 'string' ? value : value === undefined ? '' : JSON.stringify(value, null, 2),
    ])
  } catch {
    return null
  }
}
