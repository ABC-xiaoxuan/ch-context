import assert from 'node:assert/strict'
import test from 'node:test'
import type { HistoryItem } from '../../src/codexhost/api.ts'
import { translator } from '../../src/codexhost/i18n.ts'
import { buildRecordIndex, filterIndexedRecords } from '../../src/codexhost/record-index.ts'

const items: HistoryItem[] = [
  {
    id: 'r1',
    seq: 1,
    kind: 'user',
    title: 'user',
    text: 'Inspect cache hit rate',
    eventType: 'user/message',
  },
  {
    id: 'r2',
    seq: 2,
    kind: 'tool',
    title: 'bash',
    toolName: 'bash',
    text: '{"command":"npm run check"}',
    arguments: '{"command":"npm run check","timeout":5000}',
    eventType: 'tool/call',
  },
  {
    id: 'r3',
    seq: 3,
    kind: 'tool',
    title: 'tool/result',
    text: 'Check failed with exit code 1',
    eventType: 'tool/result',
    isError: true,
  },
  {
    id: 'r4',
    seq: 4,
    kind: 'assistant',
    title: 'assistant',
    text: 'Resolved the regression.',
    eventType: 'assistant/message',
  },
  {
    id: 'r5',
    seq: 5,
    kind: 'event',
    title: 'turn/end',
    text: '{"status":"completed"}',
    eventType: 'turn/end',
  },
]

test('buildRecordIndex pre-parses arguments and derives record labels once', () => {
  const t = translator('en')
  const toolByRecord = new Map([
    ['r2', 'bash'],
    ['r3', 'bash'],
  ])
  const index = buildRecordIndex(items, toolByRecord, t)
  assert.equal(index.get('r2')?.label, 'npm run check')
  assert.deepEqual(index.get('r2')?.parsedArgs, [
    ['command', 'npm run check'],
    ['timeout', '5000'],
  ])
  assert.equal(index.get('r3')?.label, 'bash')
  assert.equal(index.get('r1')?.label, 'Inspect cache hit rate')
})

test('filterIndexedRecords filters by category, errors, tool prefix and text query', () => {
  const t = translator('en')
  const toolByRecord = new Map([
    ['r2', 'bash'],
    ['r3', 'bash'],
  ])
  const index = buildRecordIndex(items, toolByRecord, t)
  assert.deepEqual(
    filterIndexedRecords(items, index, 'messages', '', false).map((item) => item.id),
    ['r1', 'r4'],
  )
  assert.deepEqual(
    filterIndexedRecords(items, index, 'all', '', true).map((item) => item.id),
    ['r3'],
  )
  assert.deepEqual(
    filterIndexedRecords(items, index, 'tool', 'tool:BASH', false).map((item) => item.id),
    ['r2', 'r3'],
  )
  assert.deepEqual(
    filterIndexedRecords(items, index, 'all', 'npm run', false).map((item) => item.id),
    ['r2'],
  )
  assert.deepEqual(
    filterIndexedRecords(items, index, 'event', 'completed', false).map((item) => item.id),
    ['r5'],
  )
})
