import type { HistoryItem } from './api.ts'
import { previewLine } from './format.ts'
import type { Translate } from './i18n.ts'
import { parseRecordArguments } from './treemap.ts'

export type RecordFilter = 'all' | 'messages' | 'tool' | 'event'

const PRIMARY_ARG_KEYS = new Set([
  'command',
  'cmd',
  'path',
  'file_path',
  'filePath',
  'pattern',
  'description',
])

export interface IndexedHistoryItem {
  item: HistoryItem
  tool: string | undefined
  toolLower: string | undefined
  label: string
  parsedArgs: Array<[string, string]> | null
  searchHaystack: string
}

export function deriveRecordLabel(
  item: HistoryItem,
  tool: string | undefined,
  parsedArgs: Array<[string, string]> | null,
  t: Translate,
): string {
  if (item.kind === 'user' || item.kind === 'assistant')
    return previewLine(item.text) || t(item.kind)
  if (item.eventType === 'tool/call' && parsedArgs) {
    const primary = parsedArgs.find(([key]) => PRIMARY_ARG_KEYS.has(key))
    if (primary) return previewLine(primary[1], 90)
  }
  return tool ?? item.toolName ?? (item.eventType === 'tool/result' ? t('toolOutput') : item.title)
}

export function buildRecordIndex(
  items: readonly HistoryItem[],
  toolByRecord: ReadonlyMap<string, string>,
  t: Translate,
): Map<string, IndexedHistoryItem> {
  const index = new Map<string, IndexedHistoryItem>()
  for (const item of items) {
    const tool = toolByRecord.get(item.id)
    const parsedArgs = item.arguments ? parseRecordArguments(item.arguments) : null
    const label = deriveRecordLabel(item, tool, parsedArgs, t)
    index.set(item.id, {
      item,
      tool,
      toolLower: tool?.toLocaleLowerCase(),
      label,
      parsedArgs,
      searchHaystack: `${label} ${item.text}`.toLocaleLowerCase(),
    })
  }
  return index
}

export function filterIndexedRecords(
  items: readonly HistoryItem[],
  index: ReadonlyMap<string, IndexedHistoryItem>,
  filter: RecordFilter,
  query: string,
  errorsOnly: boolean,
): HistoryItem[] {
  const needle = query.trim().toLocaleLowerCase()
  const toolNeedle = needle.startsWith('tool:') ? needle.slice(5) : null
  return items.filter((item) => {
    if (errorsOnly && item.isError !== true) return false
    if (
      filter === 'messages'
        ? item.kind !== 'user' && item.kind !== 'assistant'
        : filter !== 'all' && item.kind !== filter
    )
      return false
    if (!needle) return true
    const entry = index.get(item.id)
    if (toolNeedle !== null) return entry?.toolLower === toolNeedle
    if (entry) return entry.searchHaystack.includes(needle)
    return item.text.toLocaleLowerCase().includes(needle)
  })
}
