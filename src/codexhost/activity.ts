import type { HistoryItem } from './api.ts'

export interface ActivitySummary {
  messages: number
  userMessages: number
  assistantMessages: number
  toolCalls: number
  toolResults: number
  events: number
  records: number
  tools: ToolActivity[]
  commands: CommandActivity[]
  files: FileActivity[]
}

export interface ToolActivity {
  name: string
  count: number
  failed: number
  pending: number
  recordIds: string[]
}

export interface CommandActivity {
  id: string
  seq: number
  tool: string
  command: string
  recordId: string
  resultId?: string
  isError?: boolean
}

export interface FileActivity {
  path: string
  reads: number
  writes: number
  searches: number
  recordIds: string[]
}

type Arguments = Record<string, unknown>
type FileOperation = 'reads' | 'writes' | 'searches'

const COMMAND_TOOLS = new Set([
  'bash',
  'Bash',
  'pwsh',
  'powershell',
  'exec_command',
  'shell',
  'shell_command',
  'run_shell_command',
  'run_command',
])
const READ_TOOLS = new Set(['read', 'Read', 'read_file', 'readFile', 'read_image'])
const WRITE_TOOLS = new Set([
  'write',
  'Write',
  'write_file',
  'writeFile',
  'edit',
  'Edit',
  'edit_file',
  'editFile',
  'multi_edit',
  'MultiEdit',
])
const SEARCH_TOOLS = new Set(['grep', 'Grep', 'glob', 'Glob', 'search_files', 'searchFiles'])
const EDITOR_TOOLS = new Set(['str_replace_editor', 'str_replace_based_edit_tool'])
const EDITOR_WRITES = new Set(['str_replace', 'insert', 'create', 'undo_edit'])

function nonempty(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function toolName(item: HistoryItem): string | undefined {
  if (nonempty(item.toolName)) return item.toolName
  return nonempty(item.title) ? item.title : undefined
}

function knownName(name: string): string {
  return name.startsWith('functions.') ? name.slice('functions.'.length) : name
}

function parseArguments(raw: unknown): Arguments | undefined {
  if (typeof raw !== 'string') return undefined
  try {
    const value: unknown = JSON.parse(raw)
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? (value as Arguments)
      : undefined
  } catch {
    return undefined
  }
}

function commandOf(name: string, args: Arguments): string | undefined {
  if (!COMMAND_TOOLS.has(knownName(name))) return undefined
  if (typeof args.command === 'string') return args.command
  return typeof args.cmd === 'string' ? args.cmd : undefined
}

function fileOperation(name: string, args: Arguments): FileOperation | undefined {
  const tool = knownName(name)
  if (READ_TOOLS.has(tool)) return 'reads'
  if (WRITE_TOOLS.has(tool)) return 'writes'
  if (SEARCH_TOOLS.has(tool)) return 'searches'
  if (EDITOR_TOOLS.has(tool)) {
    if (args.command === 'view') return 'reads'
    if (typeof args.command === 'string' && EDITOR_WRITES.has(args.command)) return 'writes'
  }
  return undefined
}

function pathOf(args: Arguments): string | undefined {
  for (const key of ['path', 'file_path', 'filePath']) {
    const value = args[key]
    if (nonempty(value) && !value.includes('\0')) return value
  }
  return undefined
}

function addByCallId(groups: Map<string, HistoryItem[]>, item: HistoryItem): void {
  if (!nonempty(item.callId)) return
  const group = groups.get(item.callId)
  if (group) group.push(item)
  else groups.set(item.callId, [item])
}

function pairedResults(items: readonly HistoryItem[]): Map<HistoryItem, HistoryItem> {
  const calls = new Map<string, HistoryItem[]>()
  const results = new Map<string, HistoryItem[]>()
  for (const item of items) {
    if (item.eventType === 'tool/call') addByCallId(calls, item)
    else if (item.eventType === 'tool/result') addByCallId(results, item)
  }
  const pairs = new Map<HistoryItem, HistoryItem>()
  for (const [id, group] of calls) {
    const matches = results.get(id)
    if (group.length !== 1 || matches?.length !== 1) continue
    const call = group[0]
    const result = matches[0]
    if (result.seq <= call.seq) continue
    const name = toolName(call)
    if (nonempty(result.toolName) && name !== undefined && result.toolName !== name) continue
    pairs.set(call, result)
  }
  return pairs
}

export function pairedRecordIds(items: readonly HistoryItem[]): Map<string, string> {
  const pairs = pairedResults(items)
  const links = new Map<string, string>()
  for (const [call, result] of pairs) {
    links.set(call.id, result.id)
    links.set(result.id, call.id)
  }
  return links
}

export function commandProgram(command: string): string {
  const trimmed = command.trim()
  if (!trimmed) return 'shell'
  const tokens = trimmed.split(/\s+/)
  for (const token of tokens) {
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(token)) continue
    const cleaned = token.replace(/^['"]|['"]$/g, '')
    const base = cleaned.split(/[\\/]/).at(-1) ?? cleaned
    if (base) return base.slice(0, 28)
  }
  return 'shell'
}

function errorOf(call: HistoryItem, result: HistoryItem | undefined): boolean | undefined {
  if (call.isError === true || result?.isError === true) return true
  if (result?.isError === false || call.isError === false) return false
  return undefined
}

export function summarizeActivity(items: readonly HistoryItem[]): ActivitySummary {
  const summary: ActivitySummary = {
    messages: 0,
    userMessages: 0,
    assistantMessages: 0,
    toolCalls: 0,
    toolResults: 0,
    events: 0,
    records: items.length,
    tools: [],
    commands: [],
    files: [],
  }
  const pairs = pairedResults(items)
  const tools = new Map<string, ToolActivity>()
  const files = new Map<string, FileActivity>()
  const resultTools = new Map<HistoryItem, ToolActivity>()
  for (const item of items) {
    if (
      item.eventType === 'user/message' ||
      (item.eventType === undefined && item.kind === 'user')
    ) {
      summary.userMessages++
    } else if (
      item.eventType === 'assistant/message' ||
      (item.eventType === undefined && item.kind === 'assistant')
    ) {
      summary.assistantMessages++
    } else if (item.eventType === 'tool/result') {
      summary.toolResults++
    } else if (item.eventType === 'tool/call') {
      summary.toolCalls++
      const name = toolName(item)
      if (name === undefined) continue
      let tool = tools.get(name)
      if (tool === undefined) {
        tool = { name, count: 0, failed: 0, pending: 0, recordIds: [] }
        tools.set(name, tool)
      }
      const result = pairs.get(item)
      const isError = errorOf(item, result)
      tool.count++
      if (isError === true) tool.failed++
      if (result === undefined) tool.pending++
      else resultTools.set(result, tool)
      const args = parseArguments(item.arguments)
      if (args === undefined) continue
      const command = commandOf(name, args)
      if (command !== undefined) {
        summary.commands.push({
          id: item.id,
          seq: item.seq,
          tool: name,
          command,
          recordId: item.id,
          ...(result === undefined ? {} : { resultId: result.id }),
          ...(isError === undefined ? {} : { isError }),
        })
      }
      const operation = fileOperation(name, args)
      const path = operation === undefined ? undefined : pathOf(args)
      if (operation === undefined || path === undefined) continue
      let file = files.get(path)
      if (file === undefined) {
        file = { path, reads: 0, writes: 0, searches: 0, recordIds: [] }
        files.set(path, file)
      }
      file[operation]++
      file.recordIds.push(item.id)
    } else {
      summary.events++
    }
  }
  for (const item of items) {
    const tool =
      item.eventType === 'tool/call' ? tools.get(toolName(item) ?? '') : resultTools.get(item)
    tool?.recordIds.push(item.id)
  }
  summary.messages = summary.userMessages + summary.assistantMessages
  summary.tools = [...tools.values()]
  summary.files = [...files.values()]
  return summary
}
