import assert from 'node:assert/strict'
import test from 'node:test'
import { BoundedLruCache, createBatchQueue, SessionUsageCache } from '../../src/codexhost/cache.ts'

test('BoundedLruCache evicts least recently used entries and respects capacity', () => {
  const cache = new BoundedLruCache<string, number>(2)
  cache.set('a', 1)
  cache.set('b', 2)
  assert.equal(cache.get('a'), 1)
  cache.set('c', 3)
  assert.equal(cache.size, 2)
  assert.equal(cache.get('b'), undefined)
  assert.equal(cache.get('a'), 1)
  assert.equal(cache.get('c'), 3)
  cache.delete('a')
  assert.equal(cache.size, 1)
  cache.clear()
  assert.equal(cache.size, 0)
  const boundary = new BoundedLruCache<string | undefined, number>(Number.NaN)
  boundary.set(undefined, 10)
  boundary.set('k', 20)
  assert.equal(boundary.size, 1)
  assert.equal(boundary.get(undefined), undefined)
  assert.equal(boundary.get('k'), 20)
})

test('SessionUsageCache keys hits by stamp, revision and TTL while preserving null snapshots', () => {
  const cache = new SessionUsageCache(10, 5_000)
  cache.write('s1', 1000, 0, { totalTokens: 500 }, 10_000)
  cache.write('s2', undefined, 0, null, 10_000)
  assert.deepEqual(cache.read('s1', 1000, 0, 14_000), { hit: true, usage: { totalTokens: 500 } })
  assert.deepEqual(cache.read('s2', undefined, 0, 14_000), { hit: true, usage: null })
  assert.deepEqual(cache.read('s1', 1001, 0, 14_000), { hit: false })
  cache.write('s1', 1001, 0, { totalTokens: 700 }, 14_000)
  assert.deepEqual(cache.read('s1', 1001, 1, 14_500), { hit: false })
  cache.write('s1', 1001, 1, { totalTokens: 800 }, 14_500)
  assert.deepEqual(cache.read('s1', 1001, 1, 19_501), { hit: false })
  cache.write('s3', 2000, 0, { totalTokens: 10 }, 20_000)
  assert.deepEqual(cache.read('s3', 2000, 0, 19_999), { hit: false })
})

test('createBatchQueue coalesces updates by batch limit, timer and explicit flush or cancel', async () => {
  const flushes: Array<Array<[string, number]>> = []
  const queue = createBatchQueue<string, number>((batch) => flushes.push([...batch.entries()]), 25, 3)
  queue.push('a', 1)
  queue.push('b', 2)
  assert.equal(flushes.length, 0)
  queue.push('c', 3)
  assert.deepEqual(flushes, [
    [
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ],
  ])
  queue.push('d', 4)
  queue.push('d', 40)
  await new Promise((resolve) => setTimeout(resolve, 45))
  assert.deepEqual(flushes[1], [['d', 40]])
  queue.push('e', 5)
  queue.flushNow()
  assert.deepEqual(flushes[2], [['e', 5]])
  queue.push('f', 6)
  queue.cancel()
  await new Promise((resolve) => setTimeout(resolve, 45))
  assert.equal(flushes.length, 3)
})
