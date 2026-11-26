import assert from 'node:assert/strict'
import test from 'node:test'
import type { HistoryItem } from '../../src/codexhost/api.ts'
import {
  findTextMatches,
  layoutRecordTreemap,
  parseRecordArguments,
} from '../../src/codexhost/treemap.ts'

function makeItem(seq: number, kind: HistoryItem['kind'], text: string): HistoryItem {
  return {
    id: `rec-${seq}`,
    seq,
    kind,
    title: kind,
    text,
  }
}

test('layoutRecordTreemap packs categories and blocks strictly by character volume', () => {
  const map = layoutRecordTreemap([
    makeItem(1, 'user', 'a'.repeat(100)),
    makeItem(2, 'assistant', 'b'.repeat(300)),
    makeItem(3, 'tool', 'c'.repeat(600)),
    makeItem(4, 'tool', ''),
  ])
  assert.equal(map.totalChars, 1000)
  assert.equal(map.categories.length, 3)
  const toolCat = map.categories.find((cat) => cat.kind === 'tool')
  assert.ok(toolCat)
  assert.equal(toolCat.count, 2)
  assert.equal(toolCat.chars, 600)
  assert.equal(Math.round(toolCat.share), 60)
  for (const cat of map.categories) {
    assert.ok(cat.x >= -0.01 && cat.y >= -0.01 && cat.x + cat.w <= 100.01 && cat.y + cat.h <= 100.01)
    assert.ok(cat.w > 0 && cat.h > 0)
    for (const block of cat.blocks) {
      assert.ok(block.w > 0 && block.h > 0)
    }
  }
})

test('layoutRecordTreemap handles empty items cleanly', () => {
  assert.deepEqual(layoutRecordTreemap([]), { totalChars: 0, categories: [] })
})

test('findTextMatches finds non-overlapping case-insensitive literal matches and caps limit', () => {
  assert.deepEqual(findTextMatches('Alpha beta ALPHA alpha', 'alpha'), [
    { start: 0, end: 5 },
    { start: 11, end: 16 },
    { start: 17, end: 22 },
  ])
  assert.deepEqual(findTextMatches('abc', ''), [])
  assert.deepEqual(findTextMatches('', 'a'), [])
  assert.equal(findTextMatches('a '.repeat(40), 'a', 10).length, 10)
  const dotted = '\u0130stanbul alpha'
  const dottedMatches = findTextMatches(dotted, 'alpha')
  assert.equal(dottedMatches.length, 1)
  assert.equal(dotted.slice(dottedMatches[0]!.start, dottedMatches[0]!.end), 'alpha')
  const dense = 'prefix TOKEN middle token '.repeat(250)
  const denseMatches = findTextMatches(dense, 'token', 500)
  assert.equal(denseMatches.length, 500)
  assert.equal(dense.slice(denseMatches[0]!.start, denseMatches[0]!.end), 'TOKEN')
  assert.equal(dense.slice(denseMatches[1]!.start, denseMatches[1]!.end), 'token')
})

test('parseRecordArguments accepts plain JSON objects and rejects arrays or invalid JSON', () => {
  assert.deepEqual(parseRecordArguments('{"command":"npm test","count":2}'), [
    ['command', 'npm test'],
    ['count', '2'],
  ])
  assert.equal(parseRecordArguments('[]'), null)
  assert.equal(parseRecordArguments('{}'), null)
  assert.equal(parseRecordArguments('{broken'), null)
  assert.equal(parseRecordArguments(undefined), null)
})
