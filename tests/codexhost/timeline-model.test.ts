import assert from 'node:assert/strict'
import test from 'node:test'
import type { HistoryItem } from '../../src/codexhost/api.ts'
import { eventX } from '../../src/codexhost/event-geometry.ts'
import {
  buildDnaRunsFromItems,
  buildTimelineModel,
  capDnaRuns,
  summarizeCharsByKind,
} from '../../src/codexhost/timeline-model.ts'

function item(
  seq: number,
  kind: HistoryItem['kind'],
  text: string,
  extra: Partial<HistoryItem> = {},
): HistoryItem {
  return {
    id: `r-${seq}`,
    seq,
    kind,
    title: extra.toolName ?? kind,
    text,
    ...extra,
  }
}

test('buildTimelineModel computes cumulative, delta, turns and milestones in step mode', () => {
  const items: HistoryItem[] = [
    item(1, 'user', 'u'.repeat(120)),
    item(2, 'tool', 't'.repeat(240), { toolName: 'read' }),
    item(3, 'tool', 'e'.repeat(180), { toolName: 'bash', isError: true }),
    item(4, 'assistant', 'a'.repeat(300)),
    item(5, 'user', 'u'.repeat(100)),
    item(6, 'tool', 'x'.repeat(2600), { toolName: 'exec_command' }),
    item(7, 'assistant', 'r'.repeat(400)),
  ]
  const model = buildTimelineModel(items, 'step')
  assert.equal(model.buckets.length, 7)
  assert.equal(model.turns.length, 2)
  assert.deepEqual(model.turnByRecordIndex, [1, 1, 1, 1, 2, 2, 2])
  assert.equal(model.totalChars, 3940)
  assert.equal(model.maxTotal, 3940)
  assert.equal(model.maxDelta, 2600)
  assert.equal(model.buckets[2].milestone?.kind, 'error')
  assert.equal(model.buckets[2].milestone?.seq, 3)
  assert.equal(model.buckets[5].milestone?.kind, 'spike')
  assert.equal(model.buckets[5].milestone?.seq, 6)
  assert.equal(model.buckets[6].totalByKind.tool, 3020)
  assert.equal(model.buckets[5].deltaByKind.tool, 2600)
  assert.equal(model.buckets[6].dnaCumulative.length, 0)

  const withDna = buildTimelineModel(items, 'step', true)
  assert.ok(withDna.buckets[6].dnaCumulative.length > 0)
})

test('buildTimelineModel aggregates turns and targets peak record within turn spike', () => {
  const items: HistoryItem[] = [
    item(1, 'user', 'a'.repeat(100)),
    item(2, 'assistant', 'b'.repeat(250)),
    item(3, 'user', 'c'.repeat(80)),
    item(4, 'tool', 'd'.repeat(900), { toolName: 'read' }),
    item(5, 'assistant', 'e'.repeat(200)),
  ]
  const model = buildTimelineModel(items, 'turn', true)
  assert.equal(model.buckets.length, 2)
  assert.equal(model.buckets[0].turn, 1)
  assert.equal(model.buckets[0].deltaChars, 350)
  assert.equal(model.buckets[0].totalChars, 350)
  assert.equal(model.buckets[1].turn, 2)
  assert.equal(model.buckets[1].deltaChars, 1180)
  assert.equal(model.buckets[1].totalChars, 1530)
  assert.equal(model.buckets[1].milestone?.kind, 'spike')
  assert.equal(model.buckets[1].milestone?.seq, 4)
  assert.equal(model.buckets[1].milestone?.targetId, 'r-4')
  assert.equal(model.buckets[1].milestone?.detail, 'read')
  assert.ok(model.buckets[1].dnaCumulative.length > 0)
  assert.ok(model.buckets[1].dnaDelta.length > 0)
})

test('buildTimelineModel avoids step flag collisions in plot-pixel space on dense windows', () => {
  const items: HistoryItem[] = Array.from({ length: 200 }, (_, idx) =>
    item(idx + 1, idx % 10 === 0 ? 'user' : 'tool', 'x'.repeat(idx === 49 ? 3600 : 120), {
      isError: idx === 99,
    }),
  )
  const model = buildTimelineModel(items, 'step')
  assert.equal(model.buckets[49].milestone?.kind, 'spike')
  assert.equal(model.buckets[99].milestone?.kind, 'error')
  const spikeX = eventX(49, 200)
  const errX = eventX(99, 200)
  for (const flagIdx of model.stepFlags) {
    const fx = eventX(flagIdx, 200)
    assert.ok(Math.abs(fx - spikeX) >= 28)
    assert.ok(Math.abs(fx - errX) >= 28)
  }
})

test('capDnaRuns and buildDnaRunsFromItems merge adjacent runs and clamp maxStops', () => {
  const runs = Array.from({ length: 120 }, (_, idx) => ({
    kind: (idx % 2 === 0 ? 'tool' : 'assistant') as HistoryItem['kind'],
    chars: 50,
    isError: false,
  }))
  const capped = capDnaRuns(runs, 32)
  assert.ok(capped.length <= 32)
  assert.equal(capDnaRuns(runs, 0).length, 1)
  const merged = capDnaRuns(
    [
      { kind: 'user', chars: 10, isError: false },
      { kind: 'user', chars: 20, isError: false },
      { kind: 'tool', chars: 30, isError: true },
    ],
    16,
  )
  assert.deepEqual(merged, [
    { kind: 'user', chars: 30, isError: false },
    { kind: 'tool', chars: 30, isError: true },
  ])
  const itemRuns = buildDnaRunsFromItems([
    item(1, 'user', 'hello'),
    item(2, 'user', 'world'),
    item(3, 'tool', 'err', { isError: true }),
  ])
  assert.equal(itemRuns.length, 2)
  assert.equal(itemRuns[1].isError, true)
})

test('summarizeCharsByKind and buildTimelineModel handle empty windows', () => {
  assert.deepEqual(summarizeCharsByKind([]), {
    totalChars: 0,
    charsByKind: { user: 0, assistant: 0, tool: 0, event: 0 },
  })
  const empty = buildTimelineModel([], 'step')
  assert.equal(empty.buckets.length, 0)
  assert.equal(empty.totalChars, 0)
  assert.equal(empty.maxTotal, 0)
  assert.equal(empty.maxDelta, 0)
  assert.deepEqual(buildDnaRunsFromItems([]), [])
})
