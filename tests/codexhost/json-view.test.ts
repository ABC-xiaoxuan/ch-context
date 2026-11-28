import assert from 'node:assert/strict'
import test from 'node:test'
import { parseLosslessJson } from '../../src/codexhost/json-view.ts'

test('parseLosslessJson preserves exact large integer literals and duplicate object keys', () => {
  const node = parseLosslessJson(' {"id":9007199254740993,"dup":1,"dup":2,"sci":-1.5e+20} ')
  assert.deepEqual(node, {
    type: 'object',
    entries: [
      { key: 'id', value: { type: 'number', raw: '9007199254740993' } },
      { key: 'dup', value: { type: 'number', raw: '1' } },
      { key: 'dup', value: { type: 'number', raw: '2' } },
      { key: 'sci', value: { type: 'number', raw: '-1.5e+20' } },
    ],
  })
})

test('parseLosslessJson parses nested arrays, booleans, null and escaped strings', () => {
  const node = parseLosslessJson('[true, false, null, "line\\nquote\\"", {"k": []}]')
  assert.deepEqual(node, {
    type: 'array',
    items: [
      { type: 'boolean', value: true },
      { type: 'boolean', value: false },
      { type: 'null' },
      { type: 'string', value: 'line\nquote"' },
      { type: 'object', entries: [{ key: 'k', value: { type: 'array', items: [] } }] },
    ],
  })
})

test('parseLosslessJson rejects primitives, trailing content, malformed tokens and extreme nesting', () => {
  assert.equal(parseLosslessJson(''), null)
  assert.equal(parseLosslessJson('123'), null)
  assert.equal(parseLosslessJson('"plain"'), null)
  assert.equal(parseLosslessJson('{"a": 1} trailing'), null)
  assert.equal(parseLosslessJson('{"a": 01}'), null)
  assert.equal(parseLosslessJson('{"a": "unterminated\\'), null)
  assert.equal(parseLosslessJson(`${'['.repeat(30)}${']'.repeat(30)}`), null)
  assert.equal(parseLosslessJson(`[${Array.from({ length: 1600 }, () => '1').join(',')}]`), null)
})
