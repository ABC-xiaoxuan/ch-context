import type { ActivitySummary, CommandActivity, FileActivity } from './activity.ts'
import type { HistoryItem } from './api.ts'
import { previewLine } from './format.ts'
import type { Sample } from './model.ts'

export interface VolumeHotspot {
  id: string
  seq: number
  kind: HistoryItem['kind']
  label: string
  chars: number
  sharePercent: number
  isError: boolean
}

export interface WindowDiagnostics {
  totalChars: number
  topRecords: VolumeHotspot[]
  repeatedFiles: FileActivity[]
  failedCommands: CommandActivity[]
  sampleDelta: { from: number; to: number; delta: number; count: number } | null
}

export function computeWindowDiagnostics(
  items: readonly HistoryItem[],
  summary: ActivitySummary | null,
  samples: readonly Sample[],
): WindowDiagnostics {
  let totalChars = 0
  const candidates: Array<{ item: HistoryItem; chars: number }> = []
  for (const item of items) {
    const chars = item.text.length
    totalChars += chars
    if (chars > 0) candidates.push({ item, chars })
  }
  candidates.sort((a, b) => b.chars - a.chars || b.item.seq - a.item.seq)
  const topRecords: VolumeHotspot[] = candidates.slice(0, 3).map(({ item, chars }) => ({
    id: item.id,
    seq: item.seq,
    kind: item.kind,
    label:
      item.toolName ??
      (item.kind === 'user' || item.kind === 'assistant'
        ? previewLine(item.text, 56) || item.title
        : item.title),
    chars,
    sharePercent: totalChars > 0 ? (chars / totalChars) * 100 : 0,
    isError: item.isError === true,
  }))
  const repeatedFiles = (summary?.files ?? [])
    .filter((file) => file.reads >= 3 || file.reads + file.writes + file.searches >= 4)
    .sort(
      (a, b) =>
        b.reads + b.writes + b.searches - (a.reads + a.writes + a.searches) ||
        a.path.localeCompare(b.path),
    )
    .slice(0, 3)
  const failedCommands = (summary?.commands ?? []).filter((command) => command.isError === true)
  const firstSample = samples[0]
  const lastSample = samples.at(-1)
  const sampleDelta =
    firstSample && lastSample && samples.length >= 2
      ? {
          from: firstSample.percent,
          to: lastSample.percent,
          delta: lastSample.percent - firstSample.percent,
          count: samples.length,
        }
      : null
  return {
    totalChars,
    topRecords,
    repeatedFiles,
    failedCommands,
    sampleDelta,
  }
}
