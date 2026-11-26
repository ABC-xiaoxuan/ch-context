export interface SessionRow {
  id: string
  title: string
  harness?: string
  cwd?: string
  updatedAt?: number
  parentId?: string
  origin?: 'subagent'
  treeParentId?: string
  forkParentId?: string
}

export interface SessionPage {
  items: SessionRow[]
  nextCursor: string | null
}

export interface HistoryItem {
  id: string
  kind: 'user' | 'assistant' | 'tool' | 'event'
  title: string
  text: string
  time?: number
  seq: number
  eventType?: string
  callId?: string
  toolName?: string
  arguments?: string
  isError?: boolean
  clipped?: boolean
  hostPreview?: boolean
  textTruncated?: boolean
  contentUnavailable?: boolean
}

export interface HistoryPage {
  items: HistoryItem[]
  beforeSeq?: number
  hasMore: boolean
  throughSeq: number
  clipped?: boolean
  contentUnavailable?: boolean
}

type ObjectValue = Record<string, unknown>

const MAX_ITEMS = 200
const MAX_TEXT = 8_000
let requestSequence = 0

function object(value: unknown, label: string): ObjectValue {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid ${label}: expected an object`)
  }
  return value as ObjectValue
}

function string(value: unknown, label: string): string {
  if (typeof value !== 'string') throw new Error(`Invalid ${label}: expected a string`)
  return value
}

function identity(value: unknown, label: string): string {
  const result = string(value, label)
  if (!result.trim()) throw new Error(`Invalid ${label}: expected a nonempty identity`)
  return result
}

function sequence(value: unknown, label: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid ${label}: expected a nonnegative safe integer`)
  }
  return value
}

function optionalString(value: unknown, label: string): string | undefined {
  return value == null ? undefined : string(value, label)
}

function optionalNumber(value: unknown, label: string): number | undefined {
  if (value == null) return undefined
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid ${label}: expected a finite number`)
  }
  return value
}

function remoteError(value: unknown): string | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  const error = value as ObjectValue
  const code =
    typeof error.code === 'string' || typeof error.code === 'number'
      ? ` (${String(error.code).slice(0, 120)})`
      : ''
  return typeof error.message === 'string' ? `${error.message.slice(0, 500)}${code}` : undefined
}

function sessionRow(value: unknown): SessionRow {
  const row = object(value, 'session row')
  const projections = object(row.projections, 'session projections')
  const values = object(projections.values, 'session projection values')
  const harness =
    values.harnessIdentity == null
      ? undefined
      : optionalString(object(values.harnessIdentity, 'harness identity').id, 'harness id')
  const cwd = optionalString(row.cwd, 'session cwd')
  const updatedAt = optionalNumber(row.updatedAt, 'session updatedAt')
  const parentId = optionalString(row.parentSessionId, 'parent session id')
  const treeParentId = optionalString(values.threadTreeParent, 'thread tree parent')
  const forkParentId = optionalString(values.archiveForkParent, 'fork parent')
  return {
    id: identity(row.sessionId, 'session id'),
    title: optionalString(values.title, 'session title') ?? '',
    ...(harness === undefined ? {} : { harness }),
    ...(cwd === undefined ? {} : { cwd }),
    ...(updatedAt === undefined ? {} : { updatedAt }),
    ...(parentId === undefined ? {} : { parentId }),
    ...(treeParentId === undefined ? {} : { treeParentId }),
    ...(forkParentId === undefined ? {} : { forkParentId }),
    ...(row.origin === 'subagent' ? { origin: 'subagent' as const } : {}),
  }
}

function historyItem(value: unknown, sessionId: string): HistoryItem {
  const record = object(value, 'history record')
  if (record.type !== 'event') throw new Error('Invalid history record: expected an event')
  const event = object(record.event, 'history event')
  if (event.sessionId !== undefined && event.sessionId !== sessionId) {
    throw new Error('Invalid history event: session identity mismatch')
  }
  const seq = sequence(event.seq, 'history sequence')
  const type = identity(event.type, 'history event type')
  const data = object(event.data, 'history event data')
  const time = optionalNumber(event.time, 'history time')
  let kind: HistoryItem['kind'] = 'event'
  let title = type
  let text = ''
  let clipped = false
  let hostPreview = false
  let textTruncated = false
  let contentUnavailable = false
  let callId: string | undefined
  let toolName: string | undefined
  let argumentsText: string | undefined
  let isError: boolean | undefined
  const metadataId = (value: unknown): string | undefined =>
    typeof value === 'string' && value.length > 0 && value.length <= 512 ? value : undefined
  if (type === 'tool/result' && data.meta != null) {
    const meta = object(data.meta, 'tool result metadata')
    if (meta.codexhostOutput !== undefined) {
      if (!Array.isArray(meta.codexhostOutput)) throw new Error('Invalid tool output previews')
      for (const value of meta.codexhostOutput) {
        const preview = object(value, 'tool output preview')
        const reference = object(preview.reference, 'tool output reference')
        if (reference.sessionId !== sessionId || reference.seq !== seq) {
          throw new Error('Invalid tool output reference: identity mismatch')
        }
        clipped = true
        hostPreview = true
        contentUnavailable = true
      }
    }
  }
  const append = (part: string) => {
    const separator = text.length > 0 ? '\n' : ''
    const remaining = MAX_TEXT - text.length
    const next = separator + part
    if (next.length > remaining) {
      clipped = true
      textTruncated = true
    }
    text += next.slice(0, remaining)
  }
  if (type === 'user/message' || type === 'assistant/message' || type === 'tool/result') {
    kind = type === 'user/message' ? 'user' : type === 'assistant/message' ? 'assistant' : 'tool'
    const message = type === 'user/message' ? data : object(data.message, 'history message')
    if (type === 'tool/result') {
      const source =
        message.source && typeof message.source === 'object' && !Array.isArray(message.source)
          ? (message.source as ObjectValue)
          : undefined
      callId = metadataId(source?.callId)
      toolName = metadataId(source?.name)
      if (typeof message.isError === 'boolean') isError = message.isError
    }
    title = type === 'tool/result' ? 'tool/result' : kind
    if (!Array.isArray(message.content)) {
      throw new Error('Invalid history message: expected content blocks')
    }
    for (const value of message.content) {
      const block = object(value, 'history content block')
      const blockType = identity(block.type, 'history content type')
      if (blockType === 'text' || blockType === 'reasoning') {
        append(string(block.text, 'history content text'))
      } else if (blockType === 'tool-call') {
        append(`${identity(block.name, 'tool name')}\n${string(block.arguments, 'tool arguments')}`)
      } else {
        contentUnavailable = true
      }
    }
  } else if (type === 'tool/call') {
    kind = 'tool'
    title = identity(data.name, 'tool name')
    toolName = title
    callId = metadataId(data.callId)
    const rawArguments = string(data.arguments, 'tool arguments')
    argumentsText = rawArguments.slice(0, MAX_TEXT)
    append(rawArguments)
  } else {
    append(JSON.stringify(data))
  }
  return {
    id: JSON.stringify([sessionId, seq]),
    kind,
    title,
    text,
    seq,
    eventType: type,
    ...(callId === undefined ? {} : { callId }),
    ...(toolName === undefined ? {} : { toolName }),
    ...(argumentsText === undefined ? {} : { arguments: argumentsText }),
    ...(isError === undefined ? {} : { isError }),
    ...(time === undefined ? {} : { time }),
    ...(clipped ? { clipped: true } : {}),
    ...(hostPreview ? { hostPreview: true } : {}),
    ...(textTruncated ? { textTruncated: true } : {}),
    ...(contentUnavailable ? { contentUnavailable: true } : {}),
  }
}

export class CodexHostClient {
  private readonly fetcher: typeof fetch

  constructor(fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {
    this.fetcher = fetcher
  }

  private async post(path: string, body: ObjectValue, signal: AbortSignal): Promise<ObjectValue> {
    signal.throwIfAborted()
    let response: Response
    try {
      response = await this.fetcher(path, {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
      })
    } catch (error) {
      signal.throwIfAborted()
      if (error instanceof Error && error.name === 'AbortError') throw error
      throw new Error(
        `${path}: request failed: ${error instanceof Error ? error.message : 'network unavailable'}`,
      )
    }
    signal.throwIfAborted()
    let value: unknown
    try {
      value = await response.json()
    } catch (error) {
      signal.throwIfAborted()
      if (error instanceof Error && error.name === 'AbortError') throw error
      throw new Error(
        `${path}: ${response.ok ? '' : `HTTP ${response.status}; `}invalid JSON response`,
      )
    }
    signal.throwIfAborted()
    if (!response.ok) {
      const error =
        value !== null && typeof value === 'object' && !Array.isArray(value)
          ? remoteError((value as ObjectValue).error)
          : undefined
      throw new Error(`${path}: HTTP ${response.status}: ${error ?? 'request rejected'}`)
    }
    const envelope = object(value, `${path} response envelope`)
    if (Object.hasOwn(envelope, 'error')) {
      throw new Error(`${path}: ${remoteError(envelope.error) ?? 'request rejected'}`)
    }
    return envelope
  }

  private async sessionRpc(
    method: string,
    request: ObjectValue,
    signal: AbortSignal,
  ): Promise<unknown> {
    const rpcId = `ch-context-${++requestSequence}`
    const envelope = await this.post(
      `api/${method}`,
      {
        type: 'client-request',
        rpcId,
        method,
        payload: { args: request },
      },
      signal,
    )
    return this.sessionResult(envelope, rpcId, method)
  }

  async listSessions(cursor: string | null, signal: AbortSignal): Promise<SessionPage> {
    if (cursor !== null) string(cursor, 'session cursor')
    const page = object(
      await this.sessionRpc('session/list', cursor === null ? {} : { cursor }, signal),
      'session page',
    )
    if (!Array.isArray(page.items)) throw new Error('Invalid session page: expected items')
    if (page.nextCursor !== null && typeof page.nextCursor !== 'string') {
      throw new Error('Invalid session page: expected a string or null nextCursor')
    }
    if (cursor !== null && page.nextCursor === cursor) {
      throw new Error('Invalid session page: cursor did not advance')
    }
    const items = page.items.map(sessionRow)
    if (new Set(items.map((item) => item.id)).size !== items.length) {
      throw new Error('Invalid session page: repeated session identity')
    }
    return { items, nextCursor: page.nextCursor }
  }

  private sessionResult(envelope: ObjectValue, rpcId: string, method: string): unknown {
    if (envelope.type !== 'server-response' || envelope.rpcId !== rpcId) {
      throw new Error(`${method}: response identity mismatch`)
    }
    const result = object(envelope.result, `${method} result`)
    if (result.ok === false)
      throw new Error(`${method}: ${remoteError(result.error) ?? 'request rejected'}`)
    if (result.ok !== true || !Object.hasOwn(result, 'value') || Object.hasOwn(result, 'error')) {
      throw new Error(`${method}: invalid result envelope`)
    }
    return result.value
  }

  async inspectUsage(threadId: string, signal: AbortSignal): Promise<unknown> {
    identity(threadId, 'thread id')
    const envelope = await this.post(
      'api/ch/v1/rpc',
      {
        method: 'codexhost/thread/usage/inspect',
        params: { threadId },
      },
      signal,
    )
    const result = object(envelope.result, 'usage result')
    if (result.threadId !== threadId)
      throw new Error('Invalid usage result: thread identity mismatch')
    if (
      !Object.hasOwn(result, 'usage') ||
      (result.usage !== null && (typeof result.usage !== 'object' || Array.isArray(result.usage)))
    ) {
      throw new Error('Invalid usage result: expected a usage snapshot or null')
    }
    return result
  }

  async historySince(
    sessionId: string,
    signal: AbortSignal,
    knownThroughSeq: number,
  ): Promise<HistoryPage | null> {
    identity(sessionId, 'session id')
    sequence(knownThroughSeq, 'throughSeq')
    const baseline = object(
      await this.sessionRpc('session/projections', { sessionId }, signal),
      'projection baseline',
    )
    object(baseline.values, 'projection baseline values')
    const asOfSeq = sequence(baseline.asOfSeq, 'projection baseline asOfSeq')
    if (asOfSeq === knownThroughSeq) return null
    return this.history(sessionId, signal, undefined, asOfSeq)
  }

  async history(
    sessionId: string,
    signal: AbortSignal,
    beforeSeq?: number,
    throughSeq?: number,
  ): Promise<HistoryPage> {
    identity(sessionId, 'session id')
    if (beforeSeq !== undefined) {
      sequence(beforeSeq, 'beforeSeq')
      if (throughSeq === undefined)
        throw new Error('throughSeq is required when beforeSeq is provided')
    }
    if (throughSeq === undefined) {
      const baseline = object(
        await this.sessionRpc('session/projections', { sessionId }, signal),
        'projection baseline',
      )
      object(baseline.values, 'projection baseline values')
      throughSeq = sequence(baseline.asOfSeq, 'projection baseline asOfSeq')
    } else {
      sequence(throughSeq, 'throughSeq')
    }
    if (beforeSeq !== undefined && beforeSeq > throughSeq + 1) {
      throw new Error('Invalid history boundary: beforeSeq exceeds throughSeq')
    }
    const page = object(
      await this.sessionRpc(
        'session/page',
        {
          address: { sessionId },
          throughSeq,
          maxMessages: 50,
          ...(beforeSeq === undefined ? {} : { beforeSeq }),
        },
        signal,
      ),
      'history page',
    )
    if (!Array.isArray(page.records) || typeof page.hasMore !== 'boolean') {
      throw new Error('Invalid history page: expected records and hasMore')
    }
    let previous = -1
    for (const value of page.records) {
      const record = object(value, 'history record')
      if (record.type !== 'event') throw new Error('Invalid history record: expected an event')
      const event = object(record.event, 'history event')
      const seq = sequence(event.seq, 'history sequence')
      if (seq <= previous || seq > throughSeq || (beforeSeq !== undefined && seq >= beforeSeq)) {
        throw new Error('Invalid history page: unordered, repeated or out-of-window sequence')
      }
      previous = seq
    }
    if (page.hasMore && (page.records.length === 0 || previous === 0)) {
      throw new Error('Invalid history page: pagination did not advance')
    }
    const dropped = page.records.length > MAX_ITEMS
    const items = page.records.slice(-MAX_ITEMS).map((record) => historyItem(record, sessionId))
    const hasMore = page.hasMore || dropped
    const first = items[0]
    if (hasMore && (!first || first.seq === 0)) {
      throw new Error('Invalid history page: no earlier sequence is available')
    }
    return {
      items,
      ...(first === undefined ? {} : { beforeSeq: first.seq }),
      hasMore,
      throughSeq,
      ...(dropped || items.some((item) => item.clipped) ? { clipped: true } : {}),
      ...(items.some((item) => item.contentUnavailable) ? { contentUnavailable: true } : {}),
    }
  }
}
