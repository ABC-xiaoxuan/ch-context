import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  appendSample,
  isThreadId,
  occupancyOf,
  samplePath,
  usageOf,
} from '../../src/codexhost/model.ts'

test('only committed Host Thread identities can be inspected', () => {
  assert.equal(isThreadId('11111111-1111-4111-8111-111111111111'), true)
  for (const id of [
    undefined,
    '',
    'draft:pending',
    'session-a',
    '11111111-1111-4111-8111-111111111111/other',
  ])
    assert.equal(isThreadId(id), false)
})

test('unknown and malformed usage never becomes zero or a fake composition', () => {
  for (const input of [
    null,
    {},
    { usage: null },
    { usage: [] },
    { usage: { inputTokens: NaN, outputTokens: -1 } },
  ])
    assert.equal(usageOf(input), null)
  assert.deepEqual(
    usageOf({
      usage: { inputTokens: 0, outputTokens: 12, cachedInputTokens: null, totalCostUsd: 0 },
    }),
    { inputTokens: 0, outputTokens: 12, totalCostUsd: 0 },
  )
})

test('native cost and optional facts are preserved without recomputing buckets', () => {
  assert.deepEqual(
    usageOf({
      usage: {
        inputTokens: 100,
        cachedInputTokens: 70,
        totalTokens: 150,
        totalCostUsd: 0.023,
        costSource: 'native',
        unpricedModels: ['auto', null],
        contextWindowTokens: 0,
      },
    }),
    {
      inputTokens: 100,
      cachedInputTokens: 70,
      totalTokens: 150,
      totalCostUsd: 0.023,
      costSource: 'native',
      unpricedModels: ['auto'],
    },
  )
})

test('occupancy prioritizes confirmed percentages and keeps missing counts unknown', () => {
  assert.equal(occupancyOf({ totalTokens: 900000 }), null)
  assert.deepEqual(occupancyOf({ totalTokens: 900000, contextUsagePercent: 30 }), { percent: 30 })
  assert.deepEqual(
    occupancyOf({ contextUsedTokens: 50, contextWindowTokens: 100, contextUsagePercent: 70 }),
    { used: 50, capacity: 100, percent: 70 },
  )
  assert.equal(occupancyOf({ contextUsedTokens: 0, contextWindowTokens: 0 }), null)
  assert.deepEqual(occupancyOf({ contextUsedTokens: 0, contextWindowTokens: 100 }), {
    used: 0,
    capacity: 100,
    percent: 0,
  })
  assert.deepEqual(occupancyOf({ contextUsedTokens: 120, contextWindowTokens: 100 }), {
    used: 120,
    capacity: 100,
    percent: 120,
  })
})

test('observations deduplicate unchanged facts and bound memory', () => {
  const usage = { contextUsedTokens: 10, contextWindowTokens: 100 }
  const samples = appendSample([], usage, 1)
  assert.deepEqual(appendSample(samples, usage, 2), samples)
  assert.deepEqual(appendSample(samples, null, 2), samples)
  assert.deepEqual(appendSample(samples, usage, NaN), samples)
  let accumulated = samples
  for (let index = 2; index < 200; index++)
    accumulated = appendSample(accumulated, { ...usage, contextUsedTokens: index }, index)
  assert.equal(accumulated.length, 120)
  assert.equal(accumulated[0].time, 80)
})

test('chart geometry handles empty, single and over-capacity observations', () => {
  assert.equal(samplePath([]), '')
  assert.equal(samplePath([{ time: 10, percent: 50 }]), 'M300.00,60.00')
  assert.equal(
    samplePath([
      { time: 10, percent: 0 },
      { time: 20, percent: 200 },
    ]),
    'M0.00,120.00 L600.00,0.00',
  )
})
