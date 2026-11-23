import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as JSXRuntime from 'react/jsx-runtime'
import { createRoot } from 'react-dom/client'

const id = '11111111-1111-4111-8111-111111111111'
const second = '22222222-2222-4222-8222-222222222222'
const childId = '33333333-3333-4333-8333-333333333333'
const emptyProjection = { usage: null }
const openedSessions: string[] = []
let locale = new URLSearchParams(location.search).get('lang') ?? 'en'
const localeListeners = new Set<() => void>()
const currentListeners = new Set<() => void>()
const projectionListeners = new Set<() => void>()
const cleanups: (() => void)[] = []
const slots = new Map<
  string,
  { options: Record<string, unknown>; component: React.ComponentType<Record<string, unknown>> }
>()
let usage: Record<string, unknown> = {
  inputTokens: 284000,
  outputTokens: 18600,
  cachedInputTokens: 242000,
  cacheWriteInputTokens: 0,
  totalTokens: 302600,
  totalCostUsd: 0.184,
  contextUsedTokens: 76480,
  contextWindowTokens: 200000,
  outputTokensPerSecond: 82.4,
  sessionOutputTokensPerSecond: 68.2,
  timeToFirstOutputMs: 830,
  cacheHitRatePercent: 92.6,
  sessionCacheHitRatePercent: 85.2,
  costSource: 'publicPrice',
}
let projection = { usage }
let eventController: ReadableStreamDefaultController<Uint8Array> | undefined
let eventCancelled = 0
let failChildHistory = false
let failNextHistory = false
let delayNextUsage = false
let pendingUsage: ((fail?: boolean) => void) | undefined
let currentKey: string | undefined = id
const root = createRoot(document.getElementById('app')!)
const requests: { path: string; args: unknown }[] = []
const errors: string[] = []
const originalFetch = globalThis.fetch
const realNow = Date.now

const snapshot = {
  getSnapshot: () => ({ key: currentKey }),
  subscribe: (listener: () => void) => {
    currentListeners.add(listener)
    return () => currentListeners.delete(listener)
  },
}
const ctx = {
  get(name: string) {
    return name === 'uiSession'
      ? { adapter: { current: snapshot } }
      : name === 'uiWorkspace'
        ? {
            openSession(sessionId: string) {
              openedSessions.push(sessionId)
              currentKey = sessionId
              currentListeners.forEach((listener) => listener())
              projectionListeners.forEach((listener) => listener())
              mount('conversation.view')
            },
          }
        : name === 'layout'
          ? { selectPanel: () => mount('main') }
          : undefined
  },
  locale: {
    getLocale: () => ({ active: locale }),
    subscribe: (listener: () => void) => {
      localeListeners.add(listener)
      return () => localeListeners.delete(listener)
    },
    register: () => () => undefined,
    bind: () => (key: string) => key,
  },
  slots: {
    inject(_name: string, factory: () => unknown) {
      return factory()
    },
    register(
      options: Record<string, unknown>,
      component: React.ComponentType<Record<string, unknown>>,
    ) {
      const name = String(options.name)
      slots.set(name, { options, component })
      return () => slots.delete(name)
    },
  },
  effect(factory: () => (() => void) | void) {
    const cleanup = factory()
    if (cleanup) cleanups.push(cleanup)
  },
}

function event(seq: number, type: string, data: Record<string, unknown>) {
  return { type: 'event', event: { seq, type, time: 1763810000000 + seq * 1000, data } }
}
const richReply =
  '# Context review\n\nThe panel now connects **statistics**, the activity timeline and readable records.\n\n- Confirmed native context and usage\n- File and command navigation\n- Missing data stays unknown\n\n| Metric | Source |\n| --- | --- |\n| Context | CodexHost snapshot |\n| Activity | Loaded history window |\n\n```ts\nconst contextWindow = 200_000\nconst readOnly = true\n```\n\n![Reference image](https://example.invalid/preview.png)\n'
const records = [
  event(1, 'user/message', {
    content: [
      { type: 'text', text: 'Explain the context and tool activity in this conversation.' },
      { type: 'image', attachment: { id: 'fixture-image' } },
    ],
  }),
  event(2, 'tool/call', { callId: 'read-a', name: 'read', arguments: '{"path":"src/context.ts"}' }),
  event(3, 'tool/result', {
    meta: { codexhostOutput: [{ reference: { sessionId: id, seq: 3 } }] },
    message: {
      source: { callId: 'read-a' },
      isError: false,
      content: [
        {
          type: 'text',
          text: 'export const contextWindow = 200000\n<img src=x onerror="window.injected=true">',
        },
      ],
    },
  }),
  event(4, 'assistant/message', {
    message: {
      content: [
        {
          type: 'text',
          text: richReply,
        },
      ],
    },
  }),
  event(5, 'context/compacted', {
    summary: 'Earlier conversation summarized by the native Harness.',
  }),
  event(6, 'user/message', {
    content: [{ type: 'text', text: 'Show a read-only context panel.' }],
  }),
  event(7, 'tool/call', { callId: 'shell-a', name: 'bash', arguments: '{"command":"npm test"}' }),
  event(8, 'tool/result', {
    message: {
      source: { callId: 'shell-a' },
      isError: false,
      content: [{ type: 'text', text: ' {"id":9007199254740993,"dup":1,"dup":2} ' }],
    },
  }),
  event(9, 'assistant/message', {
    message: {
      content: [
        {
          type: 'text',
          text: 'Context is separate from cumulative usage. '.repeat(220),
        },
      ],
    },
  }),
  event(10, 'turn/end', { status: 'completed' }),
]

globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  const path = String(input)
  if (!path.includes('api/')) return originalFetch(input, init)
  const body = init?.body ? JSON.parse(String(init.body)) : {}
  const args = body.payload?.args ?? body.params ?? {}
  requests.push({ path, args })
  if (path.endsWith('api/ch/v1/events'))
    return new Response(
      new ReadableStream<Uint8Array>({
        start(controller) {
          eventController = controller
          init?.signal?.addEventListener(
            'abort',
            () => {
              eventCancelled++
              if (eventController === controller) eventController = undefined
              controller.close()
            },
            { once: true },
          )
        },
      }),
    )
  const wrap = (value: unknown) =>
    Response.json({ type: 'server-response', rpcId: body.rpcId, result: { ok: true, value } })
  if (path.endsWith('api/session/list'))
    return wrap({
      items: [
        {
          sessionId: id,
          cwd: 'C:/workspace/design-system',
          updatedAt: 1763810000000,
          projections: {
            values: {
              title: 'Design system · implementation review',
              harnessIdentity: { id: 'pi' },
            },
          },
        },
        {
          sessionId: second,
          cwd: 'C:/workspace/web-app',
          updatedAt: 1763800000000,
          projections: {
            values: {
              title: 'Long conversation with unavailable telemetry',
              harnessIdentity: { id: 'codex' },
            },
          },
        },
        {
          sessionId: childId,
          parentSessionId: id,
          origin: 'subagent',
          cwd: 'C:/workspace/design-system',
          updatedAt: 1763810100000,
          projections: {
            values: { title: 'Research · context data audit', harnessIdentity: { id: 'pi' } },
          },
        },
      ],
      nextCursor: null,
    })
  if (path.endsWith('api/ch/v1/rpc')) {
    const result = { threadId: args.threadId, usage: args.threadId === id ? usage : null }
    if (delayNextUsage) {
      delayNextUsage = false
      return new Promise<Response>((resolve, reject) => {
        const release = (fail = false) => {
          if (pendingUsage === release) pendingUsage = undefined
          resolve(
            fail
              ? Response.json({ error: { message: 'Delayed request failed' } }, { status: 503 })
              : Response.json({ result }),
          )
        }
        pendingUsage = release
        init?.signal?.addEventListener(
          'abort',
          () => {
            if (pendingUsage === release) pendingUsage = undefined
            reject(init.signal?.reason)
          },
          { once: true },
        )
      })
    }
    return Response.json({ result })
  }
  if (path.endsWith('api/session/projections'))
    return wrap({ asOfSeq: args.sessionId === id ? records.at(-1)!.event.seq : 0, values: {} })
  if (path.endsWith('api/session/page') && failNextHistory) {
    failNextHistory = false
    return Response.json({ error: { message: 'Retry this history window' } }, { status: 503 })
  }
  if (path.endsWith('api/session/page') && args.address.sessionId === childId && failChildHistory)
    return Response.json({ error: { message: 'History unavailable' } }, { status: 503 })
  if (path.endsWith('api/session/page'))
    return wrap({
      records:
        args.address.sessionId === id
          ? records.filter(
              (record) =>
                record.event.seq <= args.throughSeq &&
                (args.beforeSeq ? record.event.seq < args.beforeSeq : record.event.seq > 5),
            )
          : [],
      hasMore: args.address.sessionId === id && !args.beforeSeq,
    })
  throw new Error(`Unexpected fixture request: ${path}`)
}) as typeof fetch

function useProjection(): unknown {
  return React.useSyncExternalStore(
    (listener) => {
      projectionListeners.add(listener)
      return () => projectionListeners.delete(listener)
    },
    () => (currentKey === id ? projection : emptyProjection),
  )
}
function mount(kind: 'main' | 'conversation.view') {
  const entry = slots.get(kind)
  if (!entry) throw new Error(`Missing slot ${kind}`)
  root.render(
    React.createElement(
      entry.component,
      kind === 'main' ? {} : { sessionId: currentKey ?? id, useProjection },
    ),
  )
}

function publishUsage(value: Record<string, unknown>) {
  usage = value
  projection = { usage }
  projectionListeners.forEach((listener) => listener())
  eventController?.enqueue(
    new TextEncoder().encode(
      JSON.stringify({ type: 'changed', threadId: id, method: 'codexhost/thread/usage/updated' }) +
        '\n',
    ),
  )
}

Object.assign(window, {
  __ModuleLoader__: {
    load(value: {
      id: string
      factory: (require: (name: string) => unknown) => { apply(ctx: unknown): void }
    }) {
      if (value.id !== 'ch-context') throw new Error('Wrong package identity')
      const descriptor = value.factory(
        (name) => ({ react: React, 'react-dom': ReactDOM, 'react/jsx-runtime': JSXRuntime })[name],
      )
      descriptor.apply(ctx)
      mount('main')
    },
  },
  chFixture: {
    mount,
    setLocale(value: string) {
      locale = value
      localeListeners.forEach((listener) => listener())
    },
    updateContext(value: number) {
      publishUsage({ ...usage, contextUsedTokens: value })
    },
    setUsage(value: Record<string, unknown>) {
      publishUsage(value)
    },
    delayNextUsage() {
      delayNextUsage = true
    },
    get hasPendingUsage() {
      return pendingUsage !== undefined
    },
    releaseUsage(fail = false) {
      pendingUsage?.(fail)
    },
    appendActivity() {
      if (records.at(-1)!.event.seq > 10) return
      records.push(
        event(11, 'tool/call', {
          callId: 'read-b',
          name: 'read',
          arguments: '{"path":"src/context.ts"}',
        }),
        event(12, 'tool/result', {
          message: {
            source: { callId: 'read-b' },
            isError: false,
            content: [
              { type: 'text', text: 'The context adapter uses authoritative Host snapshots.' },
            ],
          },
        }),
        event(13, 'assistant/message', {
          message: { content: [{ type: 'text', text: richReply }] },
        }),
      )
    },
    failNextHistoryRead() {
      failNextHistory = true
    },
    setChildHistoryFailure(value: boolean) {
      failChildHistory = value
    },
    appendLiveReply() {
      if (records.at(-1)!.event.seq !== 13) return
      records.push(
        event(14, 'assistant/message', {
          message: {
            content: [{ type: 'text', text: 'Live incremental update from the observed history.' }],
          },
        }),
        event(15, 'tool/result', {
          message: {
            source: { callId: 'unmatched-native-call' },
            isError: true,
            content: [{ type: 'text', text: 'Request handled.' }],
          },
        }),
      )
    },
    freezeClock(value: boolean) {
      const captured = realNow()
      Date.now = value ? () => captured : realNow
    },
    appendClockReply() {
      if (records.at(-1)!.event.seq === 15)
        records.push(
          event(16, 'user/message', {
            content: [{ type: 'text', text: 'Frozen-clock history update.' }],
          }),
        )
    },
    denseHistory() {
      records.splice(
        5,
        records.length - 5,
        ...Array.from({ length: 200 }, (_, index) =>
          event(
            index + 6,
            index % 2 ? 'assistant/message' : 'user/message',
            index % 2
              ? { message: { content: [{ type: 'text', text: `Dense record ${index + 6}` }] } }
              : { content: [{ type: 'text', text: `Dense record ${index + 6}` }] },
          ),
        ),
      )
      publishUsage({ ...usage })
    },
    openedSessions,
    setDraft() {
      currentKey = 'draft:pending'
      currentListeners.forEach((listener) => listener())
    },
    unmount() {
      root.unmount()
      cleanups.splice(0).forEach((cleanup) => cleanup())
    },
    requests,
    errors,
    get eventCancelled() {
      return eventCancelled
    },
  },
})
window.addEventListener('error', (event) => errors.push(event.message))
