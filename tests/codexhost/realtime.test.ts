import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isUsageInvalidation, observeUsageChanges } from '../../src/codexhost/realtime.ts'
import { en, translator, zh } from '../../src/codexhost/i18n.ts'

test('usage notifications invalidate snapshots only for their own thread', () => {
  assert.equal(
    isUsageInvalidation(
      { type: 'changed', threadId: 'a', method: 'codexhost/thread/usage/updated' },
      'a',
    ),
    true,
  )
  assert.equal(
    isUsageInvalidation(
      { type: 'changed', threadId: 'b', method: 'thread/tokenUsage/updated' },
      'a',
    ),
    false,
  )
  assert.equal(
    isUsageInvalidation(
      { type: 'connection', threadId: 'a', method: 'thread/tokenUsage/updated' },
      'a',
    ),
    false,
  )
  assert.equal(
    isUsageInvalidation({ type: 'changed', threadId: 'a', method: 'turn/started' }, 'a'),
    false,
  )
  assert.equal(isUsageInvalidation(null, 'a'), false)
})

test('stream handles fragmented NDJSON and cancels its subscription', async () => {
  let source!: ReadableStreamDefaultController<Uint8Array>
  let requestSignal: AbortSignal | null | undefined
  let invalidations = 0
  let arrive!: () => void
  const arrived = new Promise<void>((resolve) => {
    arrive = resolve
  })
  const statuses: boolean[] = []
  const fetcher = (async (url: string | URL | Request, options?: RequestInit) => {
    assert.equal(url, 'api/ch/v1/events')
    assert.equal(options?.credentials, 'same-origin')
    requestSignal = options?.signal
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        source = controller
      },
    })
    options?.signal?.addEventListener('abort', () => source.close(), { once: true })
    return new Response(body)
  }) as typeof fetch
  const stop = observeUsageChanges(
    'a',
    () => {
      invalidations++
      arrive()
    },
    (value) => statuses.push(value),
    fetcher,
  )
  await new Promise<void>((resolve) => queueMicrotask(resolve))
  const encoder = new TextEncoder()
  source.enqueue(
    encoder.encode(
      '\ninvalid-json\n{"type":"changed","threadId":"b","method":"thread/tokenUsage/updated"}\n{"type":"changed","threadId":"a",',
    ),
  )
  source.enqueue(
    encoder.encode(
      '"method":"codexhost/thread/usage/updated"}\n{"type":"changed","threadId":"a","method":"thread/updated"}\n',
    ),
  )
  await arrived
  stop()
  await new Promise<void>((resolve) => setImmediate(resolve))
  assert.equal(invalidations, 2)
  assert.deepEqual(statuses, [true])
  assert.equal(requestSignal?.aborted, true)
})

test('dictionaries have complete keys and unsupported locales fall back to English', () => {
  assert.deepEqual(Object.keys(zh).sort(), Object.keys(en).sort())
  assert.equal(translator('zh-CN')('title'), zh.title)
  assert.equal(translator('fr')('title'), en.title)
})
