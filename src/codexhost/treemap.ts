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

interface AreaEntry<T> {
  item: T
  area: number
}

function worstRatioStats(sum: number, minArea: number, maxArea: number, side: number): number {
  if (sum <= 0 || minArea <= 0 || side <= 0) return Infinity
  const sideSq = side * side
  const sumSq = sum * sum
  return Math.max((sideSq * maxArea) / sumSq, sumSq / (sideSq * minArea))
}

function packRects<T>(
  entries: readonly WeightedRect<T>[],
  x: number,
  y: number,
  w: number,
  h: number,
): LaidRect<T>[] {
  if (entries.length === 0 || w <= 0 || h <= 0) return []
  const positive = entries.filter((entry) => entry.weight > 0)
  const total = positive.reduce((sum, entry) => sum + entry.weight, 0)
  if (positive.length === 0 || total <= 0) return []
  const sorted = [...positive].sort((a, b) => b.weight - a.weight)
  const scale = (w * h) / total
  const scaled: AreaEntry<T>[] = sorted.map((entry) => ({
    item: entry.item,
    area: entry.weight * scale,
  }))
  const out: LaidRect<T>[] = []
  let cx = x
  let cy = y
  let cw = w
  let ch = h

  const commitRow = (row: readonly AreaEntry<T>[], sum: number): void => {
    if (sum <= 0 || cw <= 0 || ch <= 0) return
    if (cw >= ch) {
      const rw = Math.min(cw, sum / ch)
      let cursorY = cy
      const endY = cy + ch
      for (let i = 0; i < row.length; i++) {
        const entry = row[i]
        const rh =
          i === row.length - 1
            ? Math.max(0, endY - cursorY)
            : Math.min(Math.max(0, endY - cursorY), (entry.area / sum) * ch)
        out.push({ item: entry.item, x: cx, y: cursorY, w: rw, h: rh })
        cursorY += rh
      }
      cx += rw
      cw = Math.max(0, cw - rw)
    } else {
      const rh = Math.min(ch, sum / cw)
      let cursorX = cx
      const endX = cx + cw
      for (let i = 0; i < row.length; i++) {
        const entry = row[i]
        const rw =
          i === row.length - 1
            ? Math.max(0, endX - cursorX)
            : Math.min(Math.max(0, endX - cursorX), (entry.area / sum) * cw)
        out.push({ item: entry.item, x: cursorX, y: cy, w: rw, h: rh })
        cursorX += rw
      }
      cy += rh
      ch = Math.max(0, ch - rh)
    }
  }

  let row: AreaEntry<T>[] = []
  let rowSum = 0
  let rowMin = Infinity
  let rowMax = 0
  for (const entry of scaled) {
    const shortSide = Math.min(cw, ch)
    if (row.length === 0) {
      row = [entry]
      rowSum = entry.area
      rowMin = entry.area
      rowMax = entry.area
      continue
    }
    const currentWorst = worstRatioStats(rowSum, rowMin, rowMax, shortSide)
    const nextSum = rowSum + entry.area
    const nextMin = Math.min(rowMin, entry.area)
    const nextMax = Math.max(rowMax, entry.area)
    const nextWorst = worstRatioStats(nextSum, nextMin, nextMax, shortSide)
    if (nextWorst <= currentWorst) {
      row.push(entry)
      rowSum = nextSum
      rowMin = nextMin
      rowMax = nextMax
    } else {
      commitRow(row, rowSum)
      row = [entry]
      rowSum = entry.area
      rowMin = entry.area
      rowMax = entry.area
    }
  }
  if (row.length > 0) commitRow(row, rowSum)
  return out
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
  const directFolded = text.toLocaleLowerCase()
  if (directFolded.length === text.length) {
    const matches: TextMatch[] = []
    let offset = 0
    while (matches.length < limit) {
      const found = directFolded.indexOf(needle, offset)
      if (found < 0) break
      matches.push({ start: found, end: found + needle.length })
      offset = found + Math.max(1, needle.length)
    }
    return matches
  }
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
