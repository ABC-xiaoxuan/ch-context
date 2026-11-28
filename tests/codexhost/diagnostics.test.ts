import assert from 'node:assert/strict'
import test from 'node:test'
import { summarizeActivity } from '../../src/codexhost/activity.ts'
import type { HistoryItem } from '../../src/codexhost/api.ts'
import { computeWindowDiagnostics } from '../../src/codexhost/diagnostics.ts'

test('computeWindowDiagnostics ranks top 3 records strictly by character volume', () => {
  const items: HistoryItem[] = [
    { id: 'r1', seq: 1, kind: 'user', title: 'user', text: 'short' },
    { id: 'r2', seq: 2, kind: 'assistant', title: 'assistant', text: 'a'.repeat(500) },
    { id: 'r3', seq: 3, kind: 'tool', title: 'read', toolName: 'read', text: 'b'.repeat(200) },
    { id: 'r4', seq: 4, kind: 'tool', title: 'bash', toolName: 'bash', text: 'c'.repeat(300), isError: true },
    { id: 'r5', seq: 5, kind: 'event', title: 'status', text: '' },
  ]
  const diag = computeWindowDiagnostics(items, summarizeActivity(items), [
    { time: 1000, percent: 40, used: 80000, capacity: 200000 },
    { time: 2000, percent: 55, used: 110000, capacity: 200000 },
  ])
  assert.equal(diag.totalChars, 1005)
  assert.deepEqual(
    diag.topRecords.map((spot) => ({ id: spot.id, chars: spot.chars, isError: spot.isError })),
    [
      { id: 'r2', chars: 500, isError: false },
      { id: 'r4', chars: 300, isError: true },
      { id: 'r3', chars: 200, isError: false },
    ],
  )
  assert.ok(Math.abs(diag.topRecords[0].sharePercent - (500 / 1005) * 100) < 0.01)
  assert.deepEqual(diag.sampleDelta, { from: 40, to: 55, delta: 15, count: 2 })
})

test('computeWindowDiagnostics flags repeated file access and failed commands honestly', () => {
  const items: HistoryItem[] = [
    {
      id: 'f1',
      seq: 1,
      kind: 'tool',
      eventType: 'tool/call',
      title: 'read',
      toolName: 'read',
      arguments: '{"path":"src/hot.ts"}',
      text: '{"path":"src/hot.ts"}',
    },
    {
      id: 'f2',
      seq: 2,
      kind: 'tool',
      eventType: 'tool/call',
      title: 'read',
      toolName: 'read',
      arguments: '{"path":"src/hot.ts"}',
      text: '{"path":"src/hot.ts"}',
    },
    {
      id: 'f3',
      seq: 3,
      kind: 'tool',
      eventType: 'tool/call',
      title: 'read',
      toolName: 'read',
      arguments: '{"path":"src/hot.ts"}',
      text: '{"path":"src/hot.ts"}',
    },
    {
      id: 'f4',
      seq: 4,
      kind: 'tool',
      eventType: 'tool/call',
      title: 'read',
      toolName: 'read',
      arguments: '{"path":"src/once.ts"}',
      text: '{"path":"src/once.ts"}',
    },
    {
      id: 'c1',
      seq: 5,
      kind: 'tool',
      eventType: 'tool/call',
      callId: 'call-1',
      title: 'bash',
      toolName: 'bash',
      arguments: '{"command":"npm test"}',
      text: '{"command":"npm test"}',
    },
    {
      id: 'c2',
      seq: 6,
      kind: 'tool',
      eventType: 'tool/result',
      callId: 'call-1',
      title: 'bash',
      toolName: 'bash',
      text: 'failed',
      isError: true,
    },
  ]
  const summary = summarizeActivity(items)
  const diag = computeWindowDiagnostics(items, summary, [])
  assert.deepEqual(
    diag.repeatedFiles.map((file) => ({ path: file.path, reads: file.reads })),
    [{ path: 'src/hot.ts', reads: 3 }],
  )
  assert.equal(diag.failedCommands.length, 1)
  assert.equal(diag.failedCommands[0].command, 'npm test')
  assert.equal(diag.sampleDelta, null)
})

test('computeWindowDiagnostics handles empty windows cleanly', () => {
  const diag = computeWindowDiagnostics([], null, [])
  assert.equal(diag.totalChars, 0)
  assert.deepEqual(diag.topRecords, [])
  assert.deepEqual(diag.repeatedFiles, [])
  assert.deepEqual(diag.failedCommands, [])
  assert.equal(diag.sampleDelta, null)
})
