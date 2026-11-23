import assert from 'node:assert/strict'
import { test } from 'node:test'
import { formatCredits, formatUsd } from '../../src/codexhost/format.ts'

test('small native costs retain a nonzero amount and normal currency precision', () => {
  assert.equal(formatUsd(0), '$0.0000')
  assert.equal(formatUsd(0.000001), '$0.0000010')
  assert.equal(formatUsd(0.184), '$0.1840')
  assert.equal(formatUsd(12.345), '$12.35')
})

test('native fractional credits are never displayed as invented zero', () => {
  assert.equal(formatCredits(0), '0')
  assert.equal(formatCredits(0.125), '0.125')
  assert.equal(formatCredits(1.49), '1.49')
  assert.equal(formatCredits(0.000001), '<0.0001')
  assert.equal(formatCredits(1234.56789), '1,234.5679')
})
