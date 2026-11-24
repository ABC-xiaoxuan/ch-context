import assert from 'node:assert/strict'
import test from 'node:test'
import { summarizeActivity } from '../../src/codexhost/activity.ts'
import type { HistoryItem } from '../../src/codexhost/api.ts'
import {
  buildDiagnosticJson,
  buildDiagnosticMarkdown,
  countTurns,
  safeFileSlug,
} from '../../src/codexhost/report.ts'

const sampleItems: HistoryItem[] = [
  { id: '1', seq: 1, kind: 'user', eventType: 'user/message', title: 'user', text: 'Run checks' },
  {
    id: '2',
    seq: 2,
    kind: 'tool',
    eventType: 'tool/call',
    title: 'bash',
    toolName: 'bash',
    callId: 'c1',
    arguments: '{"command":"npm test"}',
    text: '{"command":"npm test"}',
  },
  {
    id: '3',
    seq: 3,
    kind: 'tool',
    eventType: 'tool/result',
    title: 'tool/result',
    callId: 'c1',
    isError: true,
    text: 'failed',
  },
  {
    id: '4',
    seq: 4,
    kind: 'tool',
    eventType: 'tool/call',
    title: 'read',
    toolName: 'read',
    arguments: '{"path":"src/app.ts"}',
    text: '{"path":"src/app.ts"}',
  },
  {
    id: '5',
    seq: 5,
    kind: 'assistant',
    eventType: 'assistant/message',
    title: 'assistant',
    text: 'Done',
  },
]

test('diagnostic report preserves unknown usage honestly and includes files, commands and errors', () => {
  const input = {
    threadId: '11111111-1111-4111-8111-111111111111',
    title: 'Diagnostic | check',
    harness: 'pi',
    cwd: 'C:/repo/app',
    exportedAt: 1763810000000,
    usage: null,
    summary: summarizeActivity(sampleItems),
    items: sampleItems,
    related: [{ id: '22222222-2222-4222-8222-222222222222', title: 'Child', role: 'child' as const, kind: 'subagent' as const, harness: 'pi', loaded: true }],
  }
  const json = buildDiagnosticJson(input)
  assert.equal(json.schema, 'ch-context/diagnostic-report@1')
  assert.equal(json.usage, null)
  assert.equal(json.occupancy, null)
  assert.equal(countTurns(sampleItems), 1)
  const mdEn = buildDiagnosticMarkdown(input, 'en')
  assert.match(mdEn, /Context Diagnostic Report/)
  assert.match(mdEn, /\| Current context \| — \|/)
  assert.match(mdEn, /src\/app\.ts/)
  assert.match(mdEn, /npm test/)
  assert.match(mdEn, /Error/)
  const mdZh = buildDiagnosticMarkdown(input, 'zh-CN')
  assert.match(mdZh, /上下文诊断报告/)
  assert.match(mdZh, /失败/)
})

test('diagnostic report includes lower-bound prefix when unpriced models exist', () => {
  const md = buildDiagnosticMarkdown(
    {
      threadId: 't-1',
      title: 'Cost test',
      harness: 'codex',
      exportedAt: 1763810000000,
      usage: {
        totalTokens: 12000,
        totalCostUsd: 0.04,
        contextUsedTokens: 4000,
        contextWindowTokens: 100000,
        unpricedModels: ['custom-model'],
      },
      summary: null,
      items: [],
      related: [],
    },
    'en',
  )
  assert.match(md, /≥ \$0\.04/)
  assert.match(md, /4\.0%/)
  assert.equal(safeFileSlug('My Session / #1!', 'fallback'), 'my-session-1')
  assert.equal(safeFileSlug('!!!', 'abcdef123456'), 'abcdef123456')
})
