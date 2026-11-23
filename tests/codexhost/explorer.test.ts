import assert from 'node:assert/strict'
import { test } from 'node:test'
import { decodeText, safeHref } from '../../src/codexhost/markdown.ts'
import { tokenParts } from '../../src/codexhost/model.ts'
import { relatedSessions } from '../../src/codexhost/relationships.ts'

const root = '11111111-1111-4111-8111-111111111111'
const child = '22222222-2222-4222-8222-222222222222'
const fork = '33333333-3333-4333-8333-333333333333'

test('links reject executable and local-file protocols before becoming React anchors', () => {
  for (const href of [
    'javascript:alert(1)',
    ' java\nscript:alert(1)',
    'data:text/html,<script>',
    'file:///C:/secret',
    'vbscript:run',
  ])
    assert.equal(safeHref(href), null)
  assert.equal(safeHref('/guide', 'https://host.example/tools/'), 'https://host.example/guide')
  assert.equal(safeHref('https://example.org/docs'), 'https://example.org/docs')
  assert.equal(safeHref('mailto:user@example.org'), 'mailto:user@example.org')
})

test('escaped Markdown text decodes as text, with invalid Unicode kept safe', () => {
  assert.equal(decodeText('&lt;script&gt;&amp; &#x1f680;'), '<script>& 🚀')
  assert.equal(decodeText('&#0; &#xD800; &#99999999;'), '� � �')
})

test('billed token segments use complete native cache facts without double-counting input', () => {
  assert.deepEqual(
    tokenParts({
      inputTokens: 100,
      outputTokens: 20,
      cachedInputTokens: 60,
      cacheWriteInputTokens: 10,
    }),
    [
      { kind: 'uncachedInput', value: 30 },
      { kind: 'cacheRead', value: 60 },
      { kind: 'cacheWrite', value: 10 },
      { kind: 'output', value: 20 },
    ],
  )
  assert.deepEqual(tokenParts({ inputTokens: 100, outputTokens: 20 }), [
    { kind: 'input', value: 100 },
    { kind: 'output', value: 20 },
  ])
  assert.deepEqual(tokenParts({ outputTokens: 20 }), [])
  assert.deepEqual(
    tokenParts({
      inputTokens: 100,
      outputTokens: 20,
      cachedInputTokens: 200,
      cacheWriteInputTokens: 0,
    }),
    [
      { kind: 'input', value: 100 },
      { kind: 'output', value: 20 },
    ],
  )
})

test('loaded relationships distinguish explicit subagents from unclassified parent links', () => {
  const rows = [
    { id: root, title: 'Root' },
    { id: child, title: 'Child', origin: 'subagent' as const, parentId: root },
    { id: fork, title: 'Fork', parentId: root },
  ]
  assert.deepEqual(relatedSessions(rows, root), [
    { id: child, title: 'Child', role: 'child', kind: 'subagent', loaded: true },
    { id: fork, title: 'Fork', role: 'child', kind: 'parent', loaded: true },
  ])
  assert.deepEqual(relatedSessions(rows, child), [
    { id: root, title: 'Root', role: 'parent', kind: 'subagent', loaded: true },
  ])
})

test('unloaded parents remain unnamed and draft or self relationships are not invented', () => {
  assert.deepEqual(
    relatedSessions([{ id: child, title: 'Child', origin: 'subagent', parentId: root }], child),
    [{ id: root, title: '', role: 'parent', kind: 'subagent', loaded: false }],
  )
  assert.deepEqual(
    relatedSessions(
      [
        { id: root, title: 'Root', origin: 'subagent', parentId: root },
        { id: 'draft:x', title: 'Draft', origin: 'subagent', parentId: root },
      ],
      root,
    ),
    [],
  )
})
