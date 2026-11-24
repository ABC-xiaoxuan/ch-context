import { fmt, fmtDuration } from '../client/format.ts'
import { commandProgram, type ActivitySummary } from './activity.ts'
import type { HistoryItem } from './api.ts'
import { formatCredits, formatUsd } from './format.ts'
import { occupancyOf, type Usage } from './model.ts'
import type { RelatedSession } from './relationships.ts'

export interface DiagnosticReportInput {
  threadId: string
  title: string
  harness: string
  cwd?: string
  exportedAt: number
  usage: Usage | null
  summary: ActivitySummary | null
  items: readonly HistoryItem[]
  related: readonly RelatedSession[]
}

function escapeCell(value: string): string {
  return value.replaceAll('|', '\\|').replace(/\r?\n/g, ' ')
}

export function countTurns(items: readonly HistoryItem[]): number {
  let turns = 0
  for (const item of items) {
    if (item.kind === 'user' || turns === 0) turns += 1
  }
  return turns
}

export function buildDiagnosticJson(input: DiagnosticReportInput): Record<string, unknown> {
  const occupancy = occupancyOf(input.usage)
  const programs = new Map<string, number>()
  for (const command of input.summary?.commands ?? []) {
    const prog = commandProgram(command.command)
    programs.set(prog, (programs.get(prog) ?? 0) + 1)
  }
  return {
    schema: 'ch-context/diagnostic-report@1',
    exportedAt: new Date(input.exportedAt).toISOString(),
    session: {
      threadId: input.threadId,
      title: input.title,
      harness: input.harness,
      ...(input.cwd ? { cwd: input.cwd } : {}),
    },
    usage: input.usage,
    occupancy: occupancy
      ? {
          percent: occupancy.percent,
          ...(occupancy.used === undefined ? {} : { usedTokens: occupancy.used }),
          ...(occupancy.capacity === undefined ? {} : { windowTokens: occupancy.capacity }),
        }
      : null,
    loadedWindow: input.summary
      ? {
          turns: countTurns(input.items),
          records: input.summary.records,
          userMessages: input.summary.userMessages,
          assistantMessages: input.summary.assistantMessages,
          toolCalls: input.summary.toolCalls,
          toolResults: input.summary.toolResults,
          events: input.summary.events,
          errors: input.items.filter((item) => item.isError === true).length,
          tools: input.summary.tools.map((tool) => ({
            name: tool.name,
            count: tool.count,
            failed: tool.failed,
            pending: tool.pending,
          })),
          files: input.summary.files.map((file) => ({
            path: file.path,
            reads: file.reads,
            writes: file.writes,
            searches: file.searches,
          })),
          commandPrograms: Object.fromEntries(programs),
          commands: input.summary.commands.map((command) => ({
            seq: command.seq,
            tool: command.tool,
            program: commandProgram(command.command),
            command: command.command,
            status:
              command.isError === true
                ? 'error'
                : command.isError === false
                  ? 'ok'
                  : command.resultId
                    ? 'recorded'
                    : 'pending',
          })),
        }
      : null,
    relatedSessions: input.related.map((row) => ({
      id: row.id,
      title: row.title,
      role: row.role,
      kind: row.kind,
      ...(row.harness ? { harness: row.harness } : {}),
    })),
  }
}

export function buildDiagnosticMarkdown(input: DiagnosticReportInput, locale: string): string {
  const isZh = locale.toLowerCase().startsWith('zh')
  const occupancy = occupancyOf(input.usage)
  const usage = input.usage
  const summary = input.summary
  const errors = input.items.filter((item) => item.isError === true).length
  const lowerBound = (usage?.unpricedModels?.length ?? 0) > 0
  const ttft = usage?.latestRequestTimeToFirstOutputMs ?? usage?.timeToFirstOutputMs
  const lines: string[] = [
    `# ${isZh ? '上下文诊断报告' : 'Context Diagnostic Report'} · ${input.title}`,
    '',
    `- **${isZh ? '会话 ID' : 'Thread ID'}**: \`${input.threadId}\``,
    `- **${isZh ? '运行环境' : 'Harness'}**: \`${input.harness}\``,
    ...(input.cwd ? [`- **${isZh ? '工作区' : 'Workspace'}**: \`${input.cwd}\``] : []),
    `- **${isZh ? '导出时间' : 'Exported at'}**: ${new Date(input.exportedAt).toISOString()}`,
    '',
    `## ${isZh ? '用量快照（由 CodexHost 上报）' : 'Usage Snapshot (Reported by CodexHost)'}`,
    '',
    `| ${isZh ? '指标' : 'Metric'} | ${isZh ? '数值' : 'Value'} |`,
    '| --- | --- |',
    `| ${isZh ? '当前上下文占用' : 'Current context'} | ${occupancy ? `${occupancy.percent.toFixed(1)}%${occupancy.used !== undefined && occupancy.capacity !== undefined ? ` (${fmt(occupancy.used)} / ${fmt(occupancy.capacity)})` : ''}` : '—'} |`,
    `| ${isZh ? '累计总 Token' : 'Total tokens'} | ${fmt(usage?.totalTokens)} |`,
    `| ${isZh ? '输入 / 输出 Token' : 'Input / Output tokens'} | ${fmt(usage?.inputTokens)} / ${fmt(usage?.outputTokens)} |`,
    `| ${isZh ? '缓存读取 / 写入' : 'Cache read / write'} | ${fmt(usage?.cachedInputTokens)} / ${fmt(usage?.cacheWriteInputTokens)} |`,
    `| ${isZh ? '最近 / 平均缓存命中' : 'Latest / Avg cache hit'} | ${usage?.cacheHitRatePercent === undefined ? '—' : `${usage.cacheHitRatePercent.toFixed(1)}%`} / ${usage?.sessionCacheHitRatePercent === undefined ? '—' : `${usage.sessionCacheHitRatePercent.toFixed(1)}%`} |`,
    `| ${isZh ? '会话费用' : 'Session cost'} | ${usage?.totalCostUsd === undefined ? '—' : `${lowerBound ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`} |`,
    ...(usage?.totalCredits !== undefined
      ? [`| AI Credits | ${formatCredits(usage.totalCredits)} |`]
      : []),
    `| ${isZh ? '最近 / 平均输出速度' : 'Latest / Avg output speed'} | ${usage?.outputTokensPerSecond === undefined ? '—' : `${usage.outputTokensPerSecond.toFixed(1)} tok/s`} / ${usage?.sessionOutputTokensPerSecond === undefined ? '—' : `${usage.sessionOutputTokensPerSecond.toFixed(1)} tok/s`} |`,
    `| ${isZh ? '首个输出延迟' : 'Time to first output'} | ${ttft === undefined ? '—' : ttft === 0 ? '0ms' : fmtDuration(ttft)} |`,
  ]
  if (summary) {
    lines.push(
      '',
      `## ${isZh ? '当前历史窗口统计' : 'Loaded History Window'}`,
      '',
      `- ${isZh ? '轮次' : 'Turns'}: ${countTurns(input.items)} · ${isZh ? '记录数' : 'Records'}: ${summary.records} · ${isZh ? '用户' : 'User'}: ${summary.userMessages} · ${isZh ? '助手' : 'Assistant'}: ${summary.assistantMessages} · ${isZh ? '工具调用' : 'Tool calls'}: ${summary.toolCalls} · ${isZh ? '事件' : 'Events'}: ${summary.events} · ${isZh ? '错误' : 'Errors'}: ${errors}`,
    )
    if (summary.files.length > 0) {
      lines.push(
        '',
        `### ${isZh ? '文件活动' : 'File Activity'} (${summary.files.length})`,
        '',
        `| ${isZh ? '路径' : 'Path'} | ${isZh ? '读' : 'Read'} | ${isZh ? '写' : 'Write'} | ${isZh ? '搜' : 'Search'} |`,
        '| --- | ---: | ---: | ---: |',
      )
      for (const file of summary.files) {
        lines.push(`| \`${escapeCell(file.path)}\` | ${file.reads} | ${file.writes} | ${file.searches} |`)
      }
    }
    if (summary.commands.length > 0) {
      lines.push(
        '',
        `### ${isZh ? '命令执行' : 'Command Executions'} (${summary.commands.length})`,
        '',
        `| # | ${isZh ? '状态' : 'Status'} | ${isZh ? '程序' : 'Program'} | ${isZh ? '命令' : 'Command'} |`,
        '| ---: | --- | --- | --- |',
      )
      for (const command of summary.commands) {
        const status =
          command.isError === true
            ? isZh
              ? '失败'
              : 'Error'
            : command.isError === false
              ? 'OK'
              : command.resultId
                ? isZh
                  ? '已记录'
                  : 'Recorded'
                : isZh
                  ? '待定'
                  : 'Pending'
        lines.push(
          `| #${command.seq} | ${status} | \`${escapeCell(commandProgram(command.command))}\` | \`${escapeCell(command.command.slice(0, 160))}\` |`,
        )
      }
    }
  }
  if (input.related.length > 0) {
    lines.push('', `## ${isZh ? '关联会话（当前页）' : 'Related Sessions (Loaded Page)'}`, '')
    for (const row of input.related) {
      lines.push(`- [${row.role}/${row.kind}] ${row.title || row.id}${row.harness ? ` (\`${row.harness}\`)` : ''}`)
    }
  }
  lines.push(
    '',
    `> ${isZh ? '本报告由 ch-context 只读生成，仅包含 CodexHost 上报的快照与当前已加载历史窗口，未估算未上报字段。' : 'Generated read-only by ch-context from reported CodexHost snapshots and the loaded history window without estimating unavailable fields.'}`,
  )
  return lines.join('\n')
}

export function safeFileSlug(title: string, fallback: string): string {
  const cleaned = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
  return cleaned || fallback.slice(0, 16)
}

export function downloadTextFile(filename: string, content: string, mime: string): boolean {
  if (
    typeof document === 'undefined' ||
    !document.body ||
    typeof Blob === 'undefined' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function'
  )
    return false
  let url: string | undefined
  let anchor: HTMLAnchorElement | undefined
  try {
    const blob = new Blob([content], { type: mime })
    url = URL.createObjectURL(blob)
    anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.rel = 'noopener'
    anchor.style.display = 'none'
    document.body.append(anchor)
    anchor.click()
    return true
  } catch {
    return false
  } finally {
    anchor?.remove()
    if (url !== undefined) {
      const revoke = url
      setTimeout(() => {
        try {
          URL.revokeObjectURL(revoke)
        } catch {}
      }, 1000)
    }
  }
}
