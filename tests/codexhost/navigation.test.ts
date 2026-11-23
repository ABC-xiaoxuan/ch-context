import assert from 'node:assert/strict'
import { test } from 'node:test'
import { eventIndexAt, eventX, EVENT_PLOT_WIDTH } from '../../src/codexhost/event-geometry.ts'
import { relatedSessions } from '../../src/codexhost/relationships.ts'

const root = '11111111-1111-4111-8111-111111111111'
const child = '22222222-2222-4222-8222-222222222222'
const fork = '33333333-3333-4333-8333-333333333333'

test('dense timeline coordinates round-trip every record including inset endpoints', () => {
  for (const count of [1, 2, 5, 200]) {
    for (let index = 0; index < count; index++)
      assert.equal(eventIndexAt(eventX(index, count) / EVENT_PLOT_WIDTH, count), index)
  }
  assert.equal(eventIndexAt(-1, 200), 0)
  assert.equal(eventIndexAt(2, 200), 199)
  assert.equal(eventIndexAt(NaN, 200), 0)
  assert.equal(eventIndexAt(0.5, 0), 0)
})

test('reported fork and tree edges remain generic unless subagent origin is explicit', () => {
  const rows = [
    { id: root, title: 'Root' },
    { id: child, title: 'Tree child', treeParentId: root },
    { id: fork, title: 'Fork child', forkParentId: root, treeParentId: root },
  ]
  assert.deepEqual(relatedSessions(rows, root), [
    { id: child, title: 'Tree child', role: 'child', kind: 'tree', loaded: true },
    { id: fork, title: 'Fork child', role: 'child', kind: 'fork', loaded: true },
  ])
  assert.deepEqual(relatedSessions(rows, fork), [
    { id: root, title: 'Root', role: 'parent', kind: 'fork', loaded: true },
  ])
})

test('overlapping relation sources deduplicate and retain the most specific provenance', () => {
  const rows = [
    { id: root, title: 'Root' },
    {
      id: child,
      title: 'Child',
      parentId: root,
      origin: 'subagent' as const,
      treeParentId: root,
      forkParentId: root,
    },
  ]
  assert.deepEqual(relatedSessions(rows, root), [
    { id: child, title: 'Child', role: 'child', kind: 'subagent', loaded: true },
  ])
  assert.deepEqual(relatedSessions(rows, child), [
    { id: root, title: 'Root', role: 'parent', kind: 'subagent', loaded: true },
  ])
  assert.deepEqual(relatedSessions(rows, 'draft:pending'), [])
})
