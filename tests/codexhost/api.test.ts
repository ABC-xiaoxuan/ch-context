import assert from 'node:assert/strict'
import test from 'node:test'
import { CodexHostClient } from '../../src/codexhost/api.ts'

type ObjectValue = Record<string, unknown>
type RequestBody = {
  type?: string
  rpcId?: string
  method: string
  params?: ObjectValue
  payload?: { args: ObjectValue }
}
type Call = { path: string; body: RequestBody; init: RequestInit }

function fixture(answer: (call: Call) => unknown | Promise<unknown>) {
  const calls: Call[] = []
  const fetcher: typeof fetch = async (input, init) => {
    assert.ok(init)
    const call = { path: String(input), body: JSON.parse(String(init.body)) as RequestBody, init }
    calls.push(call)
    const value = await answer(call)
    if (value instanceof Response) return value
    return Response.json(
      call.body.type === 'client-request'
        ? { type: 'server-response', rpcId: call.body.rpcId, result: { ok: true, value } }
        : { result: value },
    )
  }
  return { client: new CodexHostClient(fetcher), calls }
}

function signal() {
  return new AbortController().signal
}

function row(sessionId = 'session-a', extra: ObjectValue = {}) {
  return {
    sessionId,
    cwd: '/workspace',
    updatedAt: 1_700_000_000_123,
    parentSessionId: 'parent-a',
    projections: {
      kind: 'cached',
      asOfSeq: 0,
      values: { title: 'A thread', harnessIdentity: { id: 'codex' } },
    },
    ...extra,
  }
}

function event(
  seq: number,
  type = 'user/message',
  data: ObjectValue = {
    role: 'user',
    content: [{ type: 'text', text: `message ${seq}` }],
  },
) {
  return { type: 'event', event: { seq, type, data, time: 1_700_000_000_000 + seq } }
}

function historyFixture(records: unknown[], hasMore = false, asOfSeq = 20) {
  return fixture(({ body }) =>
    body.method === 'session/projections' ? { asOfSeq, values: {} } : { records, hasMore },
  )
}

test('session list uses the authenticated same-origin read protocol and millisecond timestamps', async () => {
  const { client, calls } = fixture(() => ({ items: [row()], nextCursor: 'opaque-cursor' }))
  const abort = signal()
  assert.deepEqual(await client.listSessions(null, abort), {
    items: [
      {
        id: 'session-a',
        title: 'A thread',
        harness: 'codex',
        cwd: '/workspace',
        updatedAt: 1_700_000_000_123,
        parentId: 'parent-a',
      },
    ],
    nextCursor: 'opaque-cursor',
  })
  const call = calls[0]!
  assert.equal(call.path, 'api/session/list')
  assert.deepEqual(call.body, {
    type: 'client-request',
    rpcId: call.body.rpcId,
    method: 'session/list',
    payload: { args: {} },
  })
  assert.equal(typeof call.body.rpcId, 'string')
  assert.equal(call.init.method, 'POST')
  assert.equal(call.init.credentials, 'same-origin')
  assert.equal(call.init.mode, 'same-origin')
  assert.equal(call.init.cache, 'no-store')
  assert.equal(call.init.redirect, 'error')
  assert.equal(call.init.signal, abort)
  assert.deepEqual(call.init.headers, { 'Content-Type': 'application/json' })
})

test('API URLs resolve under a path-prefixed browser deployment', async () => {
  const base = new URL('https://host.example/tools/codexhost/')
  const { client, calls } = fixture(({ body }) => {
    if (body.method === 'session/list') return { items: [row()], nextCursor: null }
    if (body.method === 'codexhost/thread/usage/inspect')
      return { threadId: 'session-a', usage: null }
    if (body.method === 'session/projections') return { asOfSeq: 1, values: {} }
    return { records: [event(1)], hasMore: false }
  })
  await client.listSessions(null, signal())
  await client.inspectUsage('session-a', signal())
  await client.history('session-a', signal())
  assert.deepEqual(
    calls.map((call) => new URL(call.path, base).href),
    [
      'https://host.example/tools/codexhost/api/session/list',
      'https://host.example/tools/codexhost/api/ch/v1/rpc',
      'https://host.example/tools/codexhost/api/session/projections',
      'https://host.example/tools/codexhost/api/session/page',
    ],
  )
  assert.ok(calls.every((call) => call.path.startsWith('api/')))
})

test('session cursors stay opaque, null ends paging, and request identities differ', async () => {
  const { client, calls } = fixture(() => ({ items: [], nextCursor: null }))
  const cursor = '{"officialCursor":"a/+?=&","includeArchived":false}'
  assert.deepEqual(await client.listSessions(cursor, signal()), { items: [], nextCursor: null })
  await client.listSessions(null, signal())
  assert.deepEqual(calls[0]!.body.payload, { args: { cursor } })
  assert.notEqual(calls[0]!.body.rpcId, calls[1]!.body.rpcId)
})

test('nullable session metadata stays absent and drafts have no fabricated title', async () => {
  const { client } = fixture(() => ({
    items: [
      row('draft-a', {
        cwd: null,
        updatedAt: null,
        parentSessionId: null,
        projections: { values: { title: null, harnessIdentity: null } },
      }),
    ],
    nextCursor: null,
  }))
  assert.deepEqual((await client.listSessions(null, signal())).items, [
    { id: 'draft-a', title: '' },
  ])
})

test('session pages reject malformed rows, cursors, and duplicate identities', async () => {
  for (const value of [
    null,
    { items: null, nextCursor: null },
    { items: [] },
    { items: [], nextCursor: 1 },
    { items: [null], nextCursor: null },
    { items: [row('')], nextCursor: null },
    { items: [row('a', { projections: { values: { title: 1 } } })], nextCursor: null },
    { items: [row('a', { updatedAt: 'yesterday' })], nextCursor: null },
    { items: [row('a'), row('a')], nextCursor: null },
  ]) {
    await assert.rejects(fixture(() => value).client.listSessions(null, signal()), /Invalid/)
  }
  await assert.rejects(
    fixture(() => ({ items: [], nextCursor: 'same' })).client.listSessions('same', signal()),
    /did not advance/,
  )
})

test('session result envelopes reject wrong identities, errors, missing values and ambiguous results', async () => {
  const envelopes = [
    () => null,
    (body: RequestBody) => ({
      type: 'server-response',
      rpcId: `${body.rpcId}-wrong`,
      result: { ok: true, value: {} },
    }),
    (body: RequestBody) => ({
      type: 'client-response',
      rpcId: body.rpcId,
      result: { ok: true, value: {} },
    }),
    (body: RequestBody) => ({ type: 'server-response', rpcId: body.rpcId, result: { ok: true } }),
    (body: RequestBody) => ({
      type: 'server-response',
      rpcId: body.rpcId,
      result: { ok: 'true', value: {} },
    }),
    (body: RequestBody) => ({
      type: 'server-response',
      rpcId: body.rpcId,
      result: { ok: true, value: {}, error: {} },
    }),
  ]
  for (const envelope of envelopes) {
    await assert.rejects(
      fixture(({ body }) => Response.json(envelope(body))).client.listSessions(null, signal()),
      /Invalid|invalid|identity/,
    )
  }
  const { client } = fixture(({ body }) =>
    Response.json({
      type: 'server-response',
      rpcId: body.rpcId,
      result: { ok: false, error: { code: 'host/offline', message: 'Host is disconnected' } },
    }),
  )
  await assert.rejects(
    client.listSessions(null, signal()),
    /Host is disconnected \(host\/offline\)/,
  )
})

test('usage returns the actual inspection result including null usage and unknown fields', async () => {
  for (const usage of [null, { contextUsedTokens: 0, totalTokens: 91, futureMetric: 7 }]) {
    const result = {
      threadId: 'thread-a',
      usage,
      accountCreditsSupported: false,
      future: { source: 'host' },
    }
    const { client, calls } = fixture(() => result)
    assert.deepEqual(await client.inspectUsage('thread-a', signal()), result)
    assert.equal(calls[0]!.path, 'api/ch/v1/rpc')
    assert.deepEqual(calls[0]!.body, {
      method: 'codexhost/thread/usage/inspect',
      params: { threadId: 'thread-a' },
    })
  }
})

test('usage rejects missing, mismatched, and malformed inspection envelopes', async () => {
  for (const result of [
    null,
    {},
    { threadId: 'other', usage: null },
    { threadId: 'thread-a' },
    { threadId: 'thread-a', usage: [] },
    { threadId: 'thread-a', usage: 0 },
  ]) {
    await assert.rejects(fixture(() => result).client.inspectUsage('thread-a', signal()), /Invalid/)
  }
  await assert.rejects(
    fixture(() => Response.json({})).client.inspectUsage('thread-a', signal()),
    /Invalid/,
  )
})

test('HTTP, gateway, network, and JSON failures contain useful context', async () => {
  await assert.rejects(
    fixture(() =>
      Response.json({ error: { code: -32090, message: 'CH is reconnecting' } }, { status: 503 }),
    ).client.inspectUsage('a', signal()),
    /HTTP 503: CH is reconnecting \(-32090\)/,
  )
  await assert.rejects(
    fixture(() => Response.json(null, { status: 502 })).client.listSessions(null, signal()),
    /HTTP 502: request rejected/,
  )
  await assert.rejects(
    fixture(() => new Response('login required', { status: 401 })).client.listSessions(
      null,
      signal(),
    ),
    /HTTP 401; invalid JSON/,
  )
  await assert.rejects(
    fixture(() => new Response('<html>Login</html>')).client.listSessions(null, signal()),
    /invalid JSON response/,
  )
  await assert.rejects(
    fixture(() => {
      throw new TypeError('connection refused')
    }).client.listSessions(null, signal()),
    /api\/session\/list: request failed: connection refused/,
  )
  await assert.rejects(
    fixture(() => Response.json({ error: { message: 'permission denied' } })).client.inspectUsage(
      'a',
      signal(),
    ),
    /permission denied/,
  )
})

test('pre-abort and in-flight abort preserve cancellation and avoid follow-up requests', async () => {
  const controller = new AbortController()
  controller.abort()
  const first = fixture(() => ({}))
  await assert.rejects(first.client.listSessions(null, controller.signal), { name: 'AbortError' })
  assert.equal(first.calls.length, 0)
  const during = new AbortController()
  const pending = fixture(
    ({ init }) =>
      new Promise((_resolve, reject) => {
        init.signal!.addEventListener('abort', () => reject(init.signal!.reason), { once: true })
      }),
  )
  const operation = pending.client.inspectUsage('thread-a', during.signal)
  during.abort()
  await assert.rejects(operation, { name: 'AbortError' })
  const between = new AbortController()
  const second = fixture(() => {
    between.abort()
    return { asOfSeq: 10, values: {} }
  })
  await assert.rejects(second.client.history('session-a', between.signal), { name: 'AbortError' })
  assert.equal(second.calls.length, 1)
})

test('abort during response parsing is preserved', async () => {
  const controller = new AbortController()
  const response = Response.json({})
  response.json = async () => {
    controller.abort()
    throw controller.signal.reason
  }
  await assert.rejects(fixture(() => response).client.listSessions(null, controller.signal), {
    name: 'AbortError',
  })
})

test('history obtains the real baseline and sends bounded page requests', async () => {
  const { client, calls } = historyFixture([event(11), event(12)], true, 12)
  const abort = signal()
  const page = await client.history('session-a', abort)
  assert.equal(page.throughSeq, 12)
  assert.equal(page.beforeSeq, 11)
  assert.equal(page.hasMore, true)
  assert.deepEqual(
    calls.map((call) => [call.path, call.body.payload?.args]),
    [
      ['api/session/projections', { sessionId: 'session-a' }],
      [
        'api/session/page',
        { address: { sessionId: 'session-a' }, throughSeq: 12, maxMessages: 50 },
      ],
    ],
  )
  assert.ok(calls.every((call) => call.init.signal === abort))
  assert.deepEqual(page.items[0], {
    id: '["session-a",11]',
    eventType: 'user/message',
    kind: 'user',
    title: 'user',
    text: 'message 11',
    seq: 11,
    time: 1_700_000_000_011,
  })
})

test('history continuations keep their watermark and identities scoped to the requested session', async () => {
  const { client, calls } = historyFixture([event(8), event(9)], false, 100)
  const first = await client.history('a', signal(), 10, 12)
  const repeated = await client.history('a', signal(), 10, 12)
  const other = await client.history('b', signal(), 10, 12)
  assert.deepEqual(first, repeated)
  assert.notEqual(first.items[0]!.id, other.items[0]!.id)
  assert.equal(first.throughSeq, 12)
  assert.equal(first.beforeSeq, 8)
  assert.equal(first.hasMore, false)
  assert.ok(calls.every((call) => call.body.method === 'session/page'))
  assert.deepEqual(calls[0]!.body.payload?.args, {
    address: { sessionId: 'a' },
    throughSeq: 12,
    beforeSeq: 10,
    maxMessages: 50,
  })
})

test('history handles actual assistant, tool call, nested tool result and event shapes', async () => {
  const records = [
    event(1, 'assistant/message', {
      message: {
        content: [
          { type: 'reasoning', text: 'Reason' },
          { type: 'text', text: 'Answer' },
          { type: 'tool-call', name: 'read', arguments: '{"path":"a"}' },
        ],
      },
    }),
    event(2, 'tool/call', { name: 'read', arguments: '{"path":"a"}' }),
    event(3, 'tool/result', {
      message: { role: 'tool', content: [{ type: 'text', text: 'file contents' }] },
    }),
    event(4, 'turn/end', { turn: 1, reason: { kind: 'completed' } }),
  ]
  const { items } = await historyFixture(records).client.history('a', signal())
  assert.deepEqual(
    items.map(({ kind, title, text }) => ({ kind, title, text })),
    [
      { kind: 'assistant', title: 'assistant', text: 'Reason\nAnswer\nread\n{"path":"a"}' },
      { kind: 'tool', title: 'read', text: '{"path":"a"}' },
      { kind: 'tool', title: 'tool/result', text: 'file contents' },
      { kind: 'event', title: 'turn/end', text: '{"turn":1,"reason":{"kind":"completed"}}' },
    ],
  )
})

test('history retains native tool identity, arguments and explicit error state', async () => {
  const records = [
    event(1, 'tool/call', {
      callId: 'read-a',
      name: 'functions.read',
      arguments: '{"path":"a.ts"}',
    }),
    event(2, 'tool/result', {
      message: {
        source: { callId: 'read-a' },
        isError: true,
        content: [{ type: 'text', text: 'failed' }],
      },
    }),
  ]
  const { items } = await historyFixture(records).client.history('session-a', signal())
  assert.equal(items[0].eventType, 'tool/call')
  assert.equal(items[0].callId, 'read-a')
  assert.equal(items[0].toolName, 'functions.read')
  assert.equal(items[0].arguments, '{"path":"a.ts"}')
  assert.equal(items[1].callId, 'read-a')
  assert.equal(items[1].isError, true)
  assert.equal(items[0].isError, undefined)
})

test('session lineage is marked as subagent only when the Host reports it', async () => {
  const { items } = await fixture(() => ({
    items: [row('plain'), row('child', { origin: 'subagent' }), row('fork', { origin: 'fork' })],
    nextCursor: null,
  })).client.listSessions(null, signal())
  assert.equal(items[0].origin, undefined)
  assert.equal(items[1].origin, 'subagent')
  assert.equal(items[2].origin, undefined)
})

test('session summaries preserve nullable tree and fork provenance independently of agent origin', async () => {
  const parent = '11111111-1111-4111-8111-111111111111'
  const { items } = await fixture(() => ({
    items: [
      row('child', {
        projections: {
          values: { title: 'Child', threadTreeParent: parent, archiveForkParent: parent },
        },
      }),
      row('plain', {
        projections: {
          values: { title: 'Plain', threadTreeParent: null, archiveForkParent: null },
        },
      }),
    ],
    nextCursor: null,
  })).client.listSessions(null, signal())
  assert.equal(items[0].treeParentId, parent)
  assert.equal(items[0].forkParentId, parent)
  assert.equal(items[0].origin, undefined)
  assert.equal(items[1].treeParentId, undefined)
  assert.equal(items[1].forkParentId, undefined)
})

test('history flags unavailable image and future blocks while preserving observed text', async () => {
  const record = event(1, 'tool/result', {
    message: {
      content: [
        { type: 'text', text: 'preview' },
        { type: 'image', data: 'abc' },
        { type: 'future-content', text: 'not verified' },
      ],
    },
  })
  const page = await historyFixture([record]).client.history('a', signal())
  assert.equal(page.contentUnavailable, true)
  assert.equal(page.items[0]!.contentUnavailable, true)
  assert.equal(page.items[0]!.text, 'preview')
  assert.equal(page.hasMore, false)
})

test('relay tool output previews are marked incomplete and checked for identity', async () => {
  const preview = (sessionId: string) =>
    event(1, 'tool/result', {
      message: { content: [{ type: 'text', text: 'partial' }] },
      meta: {
        codexhostOutput: [
          {
            reference: {
              sessionId,
              seq: 1,
              epoch: 'epoch-a',
              turn: 1,
              callId: 'call-a',
              part: 0,
              version: 'v',
            },
            length: 90_000,
            bytes: 90_000,
          },
        ],
      },
    })
  const page = await historyFixture([preview('a')]).client.history('a', signal())
  assert.equal(page.clipped, true)
  assert.equal(page.contentUnavailable, true)
  assert.equal(page.items[0]!.clipped, true)
  assert.equal(page.items[0]!.text, 'partial')
  await assert.rejects(
    historyFixture([preview('b')]).client.history('a', signal()),
    /reference: identity mismatch/,
  )
})

test('history bounds event count and text, preserving a usable earlier boundary', async () => {
  const records = Array.from({ length: 205 }, (_, index) => event(index))
  const { client } = historyFixture(records, false, 204)
  const page = await client.history('a', signal())
  assert.equal(page.items.length, 200)
  assert.equal(page.beforeSeq, 5)
  assert.equal(page.hasMore, true)
  assert.equal(page.clipped, true)
  const paginated = fixture(({ body }) => {
    if (body.method === 'session/projections') return { asOfSeq: 204, values: {} }
    const before = body.payload?.args.beforeSeq
    return {
      records: records.filter(
        (record) => before === undefined || record.event.seq < Number(before),
      ),
      hasMore: false,
    }
  })
  const tail = await paginated.client.history('a', signal())
  const head = await paginated.client.history('a', signal(), tail.beforeSeq, tail.throughSeq)
  assert.equal(head.items.length, 5)
  assert.equal(head.beforeSeq, 0)
  assert.equal(head.hasMore, false)
  assert.equal(new Set([...head.items, ...tail.items].map((item) => item.id)).size, 205)
  const long = await historyFixture([
    event(1, 'user/message', { content: [{ type: 'text', text: 'x'.repeat(9_000) }] }),
  ]).client.history('a', signal())
  assert.equal(long.items[0]!.text.length, 8_000)
  assert.equal(long.items[0]!.clipped, true)
  assert.equal(long.clipped, true)
  assert.equal(long.hasMore, false)
})

test('empty history and zero sequence are valid without invented records or timestamps', async () => {
  const empty = await historyFixture([], false, 0).client.history('a', signal())
  assert.deepEqual(empty, { items: [], hasMore: false, throughSeq: 0 })
  const record = { type: 'event', event: { seq: 0, type: 'user/message', data: { content: [] } } }
  const page = await historyFixture([record], false, 0).client.history('a', signal())
  assert.equal(page.beforeSeq, 0)
  assert.equal(page.items[0]!.text, '')
  assert.equal(Object.hasOwn(page.items[0]!, 'time'), false)
})

test('history rejects missing baselines and malformed or nonadvancing pages', async () => {
  for (const baseline of [
    null,
    { values: {} },
    { asOfSeq: null, values: {} },
    { asOfSeq: -1, values: {} },
    { asOfSeq: 1 },
  ]) {
    const { client, calls } = fixture(() => baseline)
    await assert.rejects(client.history('a', signal()), /Invalid/)
    assert.equal(calls.length, 1)
  }
  for (const page of [
    null,
    { records: null, hasMore: false },
    { records: [], hasMore: null },
    { records: [], hasMore: true },
    { records: [event(0)], hasMore: true },
    { records: [event(2), event(1)], hasMore: false },
    { records: [event(1), event(1)], hasMore: false },
    { records: [event(21)], hasMore: false },
    { records: [{ type: 'projection', event: {} }], hasMore: false },
    { records: [event(1, 'tool/result', { message: { content: null } })], hasMore: false },
    {
      records: [event(1, 'tool/result', { content: [{ type: 'text', text: 'wrong nesting' }] })],
      hasMore: false,
    },
    {
      records: [event(1, 'user/message', { content: [{ type: 'text', text: null }] })],
      hasMore: false,
    },
    { records: [event(1, 'tool/call', { name: 'read', arguments: {} })], hasMore: false },
  ]) {
    const { client } = fixture(({ body }) =>
      body.method === 'session/projections' ? { asOfSeq: 20, values: {} } : page,
    )
    await assert.rejects(client.history('a', signal()), /Invalid/)
  }
})

test('history rejects cross-session records, overlapping pages and invalid caller boundaries', async () => {
  const crossSession = event(1)
  Object.assign(crossSession.event, { sessionId: 'other' })
  await assert.rejects(
    historyFixture([crossSession]).client.history('a', signal()),
    /session identity mismatch/,
  )
  await assert.rejects(
    historyFixture([event(10)]).client.history('a', signal(), 10, 20),
    /out-of-window/,
  )
  const { client, calls } = fixture(() => ({}))
  await assert.rejects(client.history('a', signal(), 1), /throughSeq is required/)
  await assert.rejects(client.history('a', signal(), null as unknown as number, 2), /beforeSeq/)
  await assert.rejects(client.history('a', signal(), 4, 2), /boundary/)
  await assert.rejects(client.history('a', signal(), undefined, NaN), /throughSeq/)
  await assert.rejects(client.history('', signal()), /session id/)
  await assert.rejects(client.inspectUsage('', signal()), /thread id/)
  assert.equal(calls.length, 0)
})
