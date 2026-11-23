import assert from 'node:assert/strict'
import test from 'node:test'
import type { HistoryItem } from '../../src/codexhost/api.ts'
import { summarizeActivity } from '../../src/codexhost/activity.ts'

function record(seq: number, eventType?: string, extra: Partial<HistoryItem> = {}): HistoryItem {
  return {
    id: `record-${seq}`,
    seq,
    kind: 'event',
    title: eventType ?? 'event',
    text: '',
    ...(eventType === undefined ? {} : { eventType }),
    ...extra,
  }
}

function call(
  seq: number,
  name: string,
  args: unknown = {},
  extra: Partial<HistoryItem> = {},
): HistoryItem {
  return record(seq, 'tool/call', {
    kind: 'tool',
    title: name,
    toolName: name,
    arguments: JSON.stringify(args),
    ...extra,
  })
}

function result(seq: number, callId?: string, extra: Partial<HistoryItem> = {}): HistoryItem {
  return record(seq, 'tool/result', {
    kind: 'tool',
    ...(callId === undefined ? {} : { callId }),
    ...extra,
  })
}

test('empty history has no invented activity', () => {
  assert.deepEqual(summarizeActivity([]), {
    messages: 0,
    userMessages: 0,
    assistantMessages: 0,
    toolCalls: 0,
    toolResults: 0,
    events: 0,
    records: 0,
    tools: [],
    commands: [],
    files: [],
  })
})

test('counts cover supplied records regardless of sequence gaps or unavailable content', () => {
  const summary = summarizeActivity([
    record(100, 'turn/start'),
    record(110, 'user/message', { kind: 'user', clipped: true }),
    record(300, 'assistant/message', { kind: 'assistant', text: 'bash\n{}' }),
    call(500, 'bash', { command: 'pwd' }),
    result(700, 'unloaded-call', { contentUnavailable: true, hostPreview: true }),
    record(800, 'turn/end'),
    record(900, 'future/event'),
  ])
  assert.deepEqual(
    {
      messages: summary.messages,
      userMessages: summary.userMessages,
      assistantMessages: summary.assistantMessages,
      toolCalls: summary.toolCalls,
      toolResults: summary.toolResults,
      events: summary.events,
      records: summary.records,
    },
    {
      messages: 2,
      userMessages: 1,
      assistantMessages: 1,
      toolCalls: 1,
      toolResults: 1,
      events: 3,
      records: 7,
    },
  )
  assert.equal(summary.tools[0]!.pending, 1)
  assert.equal(summary.commands.length, 1)
  assert.equal(summary.commands[0]!.resultId, undefined)
})

test('message kinds support older metadata while tool classification requires event types', () => {
  const summary = summarizeActivity([
    record(1, undefined, { kind: 'user' }),
    record(2, undefined, { kind: 'assistant' }),
    record(3, undefined, { kind: 'tool', title: 'bash', text: '{"command":"pwd"}' }),
    record(4, undefined, { kind: 'tool', title: 'tool/result' }),
    record(5, 'future/event', { kind: 'user' }),
    record(6, 'assistant/message', { kind: 'event' }),
  ])
  assert.equal(summary.messages, 3)
  assert.equal(summary.userMessages, 1)
  assert.equal(summary.assistantMessages, 2)
  assert.equal(summary.events, 3)
  assert.equal(summary.toolCalls, 0)
  assert.equal(summary.toolResults, 0)
  assert.deepEqual(summary.tools, [])
  assert.deepEqual(summary.commands, [])
})

test('unique call IDs pair interleaved results and preserve observed record identities', () => {
  const summary = summarizeActivity([
    call(1, 'bash', { command: 'first' }, { callId: 'a' }),
    call(2, 'bash', { cmd: 'second' }, { callId: 'b' }),
    result(3, 'b', { isError: true }),
    result(4, 'a', { isError: false }),
  ])
  assert.deepEqual(summary.tools, [
    {
      name: 'bash',
      count: 2,
      failed: 1,
      pending: 0,
      recordIds: ['record-1', 'record-2', 'record-3', 'record-4'],
    },
  ])
  assert.deepEqual(summary.commands, [
    {
      id: 'record-1',
      seq: 1,
      tool: 'bash',
      command: 'first',
      recordId: 'record-1',
      resultId: 'record-4',
      isError: false,
    },
    {
      id: 'record-2',
      seq: 2,
      tool: 'bash',
      command: 'second',
      recordId: 'record-2',
      resultId: 'record-3',
      isError: true,
    },
  ])
})

test('pairing uses sequence and call identity independently of array order and replay time', () => {
  const summary = summarizeActivity([
    result(20, 'a', { time: 10 }),
    call(10, 'exec_command', { cmd: 'pwd' }, { callId: 'a', time: 100_000 }),
  ])
  assert.equal(summary.commands[0]!.resultId, 'record-20')
  assert.equal(summary.tools[0]!.pending, 0)
  assert.deepEqual(Object.keys(summary.commands[0]!).sort(), [
    'command',
    'id',
    'recordId',
    'resultId',
    'seq',
    'tool',
  ])
})

test('missing calls and missing results do not create counterparts or guess a tool', () => {
  const summary = summarizeActivity([
    result(1, 'before-window', { toolName: 'bash', isError: true }),
    call(2, 'bash', { command: 'pwd' }, { callId: 'after-window' }),
  ])
  assert.equal(summary.toolCalls, 1)
  assert.equal(summary.toolResults, 1)
  assert.deepEqual(summary.tools, [
    {
      name: 'bash',
      count: 1,
      failed: 0,
      pending: 1,
      recordIds: ['record-2'],
    },
  ])
  assert.deepEqual(summary.commands, [
    {
      id: 'record-2',
      seq: 2,
      tool: 'bash',
      command: 'pwd',
      recordId: 'record-2',
    },
  ])
  const orphan = summarizeActivity([result(1, 'unknown', { toolName: 'read', isError: true })])
  assert.deepEqual(orphan.tools, [])
  assert.deepEqual(orphan.files, [])
  assert.deepEqual(orphan.commands, [])
})

test('missing or blank call IDs never match by adjacency, name or arguments', () => {
  for (const callId of [undefined, '', '  ']) {
    const summary = summarizeActivity([
      call(1, 'bash', { command: 'pwd' }, { callId }),
      result(2, callId, { toolName: 'bash', isError: true }),
    ])
    assert.equal(summary.commands[0]!.resultId, undefined)
    assert.equal(summary.commands[0]!.isError, undefined)
    assert.equal(summary.tools[0]!.pending, 1)
    assert.equal(summary.tools[0]!.failed, 0)
  }
})

test('call IDs retain exact identity without whitespace normalization', () => {
  const summary = summarizeActivity([
    call(1, 'bash', { command: 'pwd' }, { callId: 'a' }),
    result(2, ' a ', { isError: true }),
  ])
  assert.equal(summary.commands[0]!.resultId, undefined)
  assert.equal(summary.tools[0]!.pending, 1)
})

test('reused call IDs remain ambiguous even when calls and results appear sequential', () => {
  const summary = summarizeActivity([
    call(1, 'bash', { command: 'one' }, { callId: 'reused' }),
    result(2, 'reused', { isError: false }),
    call(3, 'bash', { command: 'two' }, { callId: 'reused' }),
    result(4, 'reused', { isError: true }),
  ])
  assert.equal(summary.toolCalls, 2)
  assert.equal(summary.toolResults, 2)
  assert.deepEqual(summary.tools, [
    {
      name: 'bash',
      count: 2,
      failed: 0,
      pending: 2,
      recordIds: ['record-1', 'record-3'],
    },
  ])
  assert.ok(summary.commands.every((command) => !Object.hasOwn(command, 'resultId')))
  assert.ok(summary.commands.every((command) => !Object.hasOwn(command, 'isError')))
})

test('multiple calls with one result and one call with multiple results cannot pair', () => {
  for (const items of [
    [
      call(1, 'bash', { command: 'one' }, { callId: 'a' }),
      call(2, 'read', { path: 'a.ts' }, { callId: 'a' }),
      result(3, 'a', { toolName: 'bash', isError: true }),
    ],
    [
      call(1, 'bash', { command: 'one' }, { callId: 'a' }),
      result(2, 'a', { isError: false }),
      result(3, 'a', { isError: true }),
    ],
  ]) {
    const summary = summarizeActivity(items)
    assert.equal(summary.commands[0]!.resultId, undefined)
    assert.ok(summary.tools.every((tool) => tool.failed === 0 && tool.pending === tool.count))
  }
})

test('results preceding a call or carrying a contradictory tool name do not pair', () => {
  for (const items of [
    [result(1, 'a', { isError: true }), call(2, 'bash', { command: 'pwd' }, { callId: 'a' })],
    [call(1, 'bash', { command: 'pwd' }, { callId: 'a' }), result(1, 'a', { isError: true })],
    [
      call(1, 'bash', { command: 'pwd' }, { callId: 'a' }),
      result(2, 'a', { toolName: 'read', isError: true }),
    ],
  ]) {
    const summary = summarizeActivity(items)
    assert.equal(summary.commands[0]!.resultId, undefined)
    assert.equal(summary.tools[0]!.pending, 1)
    assert.equal(summary.tools[0]!.failed, 0)
  }
})

test('errors require explicit metadata and unknown outcomes remain absent', () => {
  const summary = summarizeActivity([
    call(1, 'bash', { command: 'unknown' }, { callId: 'a' }),
    result(2, 'a', { text: 'Error: failed\n[exit code: 1]' }),
    call(3, 'bash', { command: 'failed' }, { callId: 'b', isError: true }),
    result(4, 'b', { isError: false }),
    call(5, 'bash', { command: 'succeeded' }, { callId: 'c' }),
    result(6, 'c', { isError: false, text: 'error' }),
  ])
  assert.equal(summary.tools[0]!.failed, 1)
  assert.equal(summary.tools[0]!.pending, 0)
  assert.equal(Object.hasOwn(summary.commands[0]!, 'isError'), false)
  assert.equal(summary.commands[1]!.isError, true)
  assert.equal(summary.commands[2]!.isError, false)
})

test('unmatched calls retain explicit errors and are still unmatched in this window', () => {
  const summary = summarizeActivity([call(1, 'bash', { command: 'failed' }, { isError: true })])
  assert.equal(summary.tools[0]!.failed, 1)
  assert.equal(summary.tools[0]!.pending, 1)
  assert.equal(summary.commands[0]!.isError, true)
})

test('exact shell tool aliases extract validated command or cmd strings', () => {
  const names = [
    'bash',
    'Bash',
    'pwsh',
    'powershell',
    'exec_command',
    'shell',
    'shell_command',
    'run_shell_command',
    'run_command',
    'functions.bash',
    'functions.pwsh',
    'functions.exec_command',
  ]
  const summary = summarizeActivity(
    names.map((name, index) =>
      call(
        index,
        name,
        index % 2 === 0 ? { command: `command ${index}` } : { cmd: `command ${index}` },
      ),
    ),
  )
  assert.equal(summary.tools.length, names.length)
  assert.deepEqual(
    summary.commands.map((command) => command.tool),
    names,
  )
  assert.deepEqual(
    summary.commands.map((command) => command.command),
    names.map((_name, index) => `command ${index}`),
  )
})

test('unknown and code tools remain tool rows without guessed shell commands or files', () => {
  const names = [
    'rebash',
    'bash.extra',
    'tools.bash',
    'mcp__server__bash',
    'run_code',
    'execute',
    'custom_read',
    'read_remote',
    'web_search',
    'toString',
    '__proto__',
  ]
  const summary = summarizeActivity(
    names.map((name, index) =>
      call(index, name, { command: 'pwd', cmd: 'pwd', code: 'pwd', path: '/file' }),
    ),
  )
  assert.equal(summary.toolCalls, names.length)
  assert.deepEqual(
    summary.tools.map((tool) => tool.name),
    names,
  )
  assert.deepEqual(summary.commands, [])
  assert.deepEqual(summary.files, [])
})

test('command extraction validates each candidate and preserves empty string values', () => {
  const summary = summarizeActivity([
    call(1, 'bash', { command: ['pwd'], cmd: 'valid fallback' }),
    call(2, 'pwsh', { command: null, cmd: 12 }),
    call(3, 'exec_command', { command: 'primary', cmd: 'secondary' }),
    call(4, 'bash', { command: '' }),
    call(5, 'bash', { script: 'pwd', code: 'pwd' }),
    call(6, 'bash', {}, { arguments: undefined, text: '{"command":"not metadata"}' }),
  ])
  assert.deepEqual(
    summary.commands.map((command) => command.command),
    ['valid fallback', 'primary', ''],
  )
  assert.equal(
    summary.tools.reduce((count, tool) => count + tool.count, 0),
    6,
  )
})

test('invalid JSON and unsupported argument shapes preserve observed calls', () => {
  const rawValues: unknown[] = [
    '',
    '{',
    '{"command":"clipped',
    'null',
    '[]',
    '[{"command":"pwd"}]',
    '"pwd"',
    'true',
    '4',
    undefined,
    { command: 'pwd' },
  ]
  const items = rawValues.flatMap((raw, index) => [
    call(index * 2, 'bash', {}, { arguments: raw as string }),
    call(index * 2 + 1, 'read', {}, { arguments: raw as string }),
  ])
  items.push(call(100, 'bash', { command: 'valid' }))
  items.push(call(101, 'read', { path: 'valid.ts' }))
  const summary = summarizeActivity(items)
  assert.equal(summary.toolCalls, items.length)
  assert.equal(summary.tools[0]!.count, rawValues.length + 1)
  assert.equal(summary.tools[1]!.count, rawValues.length + 1)
  assert.equal(summary.commands.length, 1)
  assert.equal(summary.commands[0]!.command, 'valid')
  assert.deepEqual(summary.files, [
    {
      path: 'valid.ts',
      reads: 1,
      writes: 0,
      searches: 0,
      recordIds: ['record-101'],
    },
  ])
})

test('known file tools aggregate actual calls by the exact supplied path', () => {
  const summary = summarizeActivity([
    call(1, 'read', { path: 'src/a.ts' }, { callId: 'a' }),
    result(2, 'a', { isError: false }),
    call(3, 'write_file', { file_path: 'src/a.ts' }),
    call(4, 'functions.edit', { filePath: 'src/a.ts' }),
    call(5, 'grep', { path: 'src/a.ts', pattern: 'needle' }),
    call(6, 'glob', { path: 'src', pattern: '*.ts' }),
    call(7, 'read_image', { path: 'image.png' }),
    call(8, 'bash', { command: 'cat src/a.ts', path: 'src/a.ts' }),
    result(9, 'unloaded', { toolName: 'read', arguments: '{"path":"unloaded.ts"}' }),
  ])
  assert.deepEqual(summary.files, [
    {
      path: 'src/a.ts',
      reads: 1,
      writes: 2,
      searches: 1,
      recordIds: ['record-1', 'record-3', 'record-4', 'record-5'],
    },
    { path: 'src', reads: 0, writes: 0, searches: 1, recordIds: ['record-6'] },
    { path: 'image.png', reads: 1, writes: 0, searches: 0, recordIds: ['record-7'] },
  ])
  assert.deepEqual(summary.tools[0]!.recordIds, ['record-1', 'record-2'])
})

test('common file aliases are classified through exact names', () => {
  const reads = ['Read', 'read_file', 'readFile', 'functions.read']
  const writes = [
    'write',
    'Write',
    'writeFile',
    'edit',
    'Edit',
    'edit_file',
    'editFile',
    'multi_edit',
    'MultiEdit',
  ]
  const searches = ['Grep', 'Glob', 'search_files', 'searchFiles', 'functions.grep']
  const names = [...reads, ...writes, ...searches]
  const summary = summarizeActivity(names.map((name, index) => call(index, name, { path: 'a' })))
  assert.deepEqual(summary.files, [
    {
      path: 'a',
      reads: reads.length,
      writes: writes.length,
      searches: searches.length,
      recordIds: names.map((_name, index) => `record-${index}`),
    },
  ])
})

test('editor tools classify only known operations', () => {
  const operations = ['view', 'str_replace', 'insert', 'create', 'undo_edit', 'future', '']
  const summary = summarizeActivity(
    operations.flatMap((command, index) => [
      call(index * 2, 'str_replace_editor', { command, path: 'a' }),
      call(index * 2 + 1, 'str_replace_based_edit_tool', { command, path: 'a' }),
    ]),
  )
  assert.equal(summary.toolCalls, 14)
  assert.equal(summary.files[0]!.reads, 2)
  assert.equal(summary.files[0]!.writes, 8)
  assert.equal(summary.files[0]!.recordIds.length, 10)
  assert.deepEqual(summary.commands, [])
})

test('file extraction accepts valid path aliases and never guesses from search patterns or patches', () => {
  const summary = summarizeActivity([
    call(1, 'read', { path: null, file_path: 'a' }),
    call(2, 'edit', { path: 4, filePath: 'a' }),
    call(3, 'write', { path: ' ', file_path: 'b' }),
    call(4, 'read', { path: ['a'] }),
    call(5, 'read', { path: '' }),
    call(6, 'read', { path: '\0bad' }),
    call(7, 'grep', { pattern: 'src/*.ts' }),
    call(8, 'glob', { pattern: 'src/*.ts', cwd: 'src' }),
    call(9, 'apply_patch', { patch: '*** Add File: a', path: 'a' }),
    call(10, 'read', { filename: 'a', files: ['a'], args: { path: 'a' } }),
  ])
  assert.deepEqual(summary.files, [
    { path: 'a', reads: 1, writes: 1, searches: 0, recordIds: ['record-1', 'record-2'] },
    { path: 'b', reads: 0, writes: 1, searches: 0, recordIds: ['record-3'] },
  ])
  assert.equal(summary.toolCalls, 10)
})

test('failed file calls remain observed operations without claiming successful changes', () => {
  const summary = summarizeActivity([
    call(1, 'write', { path: 'a' }, { callId: 'a' }),
    result(2, 'a', { isError: true }),
  ])
  assert.deepEqual(summary.files, [
    {
      path: 'a',
      reads: 0,
      writes: 1,
      searches: 0,
      recordIds: ['record-1'],
    },
  ])
  assert.deepEqual(summary.tools, [
    {
      name: 'write',
      count: 1,
      failed: 1,
      pending: 0,
      recordIds: ['record-1', 'record-2'],
    },
  ])
})

test('valid rows retain full metadata strings and do not normalize paths or mutate inputs', () => {
  const command = `  printf 'hello'\n${'x'.repeat(6_000)}  `
  const path = `  C:\\workspace\\${'a'.repeat(2_000)}.ts  `
  const items = [
    call(1, 'functions.exec_command', { cmd: command }, { clipped: true, text: 'preview' }),
    call(2, 'read', { file_path: path }),
    call(3, 'read', { path: './a.ts' }),
    call(4, 'read', { path: 'a.ts' }),
    call(5, 'read', { path: 'A.ts' }),
    call(6, 'custom-tool', {}, { toolName: 'custom-tool', title: 'Different display title' }),
    call(7, 'bash', { command: 'title fallback' }, { toolName: undefined }),
  ]
  const before = structuredClone(items)
  for (const item of items) Object.freeze(item)
  Object.freeze(items)
  const summary = summarizeActivity(items)
  assert.deepEqual(items, before)
  assert.equal(summary.commands[0]!.command, command)
  assert.equal(summary.commands[0]!.tool, 'functions.exec_command')
  assert.equal(summary.commands[1]!.command, 'title fallback')
  assert.deepEqual(
    summary.files.map((file) => file.path),
    [path, './a.ts', 'a.ts', 'A.ts'],
  )
  assert.equal(summary.tools[2]!.name, 'custom-tool')
  summary.tools[0]!.recordIds.push('external-change')
  assert.deepEqual(summarizeActivity(items).tools[0]!.recordIds, ['record-1'])
})
