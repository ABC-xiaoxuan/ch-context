import { useMemo, type ReactElement } from 'react'
import { fmt } from '../client/format.ts'
import { commandProgram, type ActivitySummary } from './activity.ts'
import type { HistoryItem } from './api.ts'
import { Card } from './components.tsx'
import { formatUsd } from './format.ts'
import type { Translate } from './i18n.ts'
import type { Usage } from './model.ts'
import type { RelatedSession } from './relationships.ts'
import { countTurns } from './report.ts'

const CHIP_PALETTE = [
  'var(--ch-teal)',
  'var(--ch-blue)',
  'var(--ch-indigo)',
  'var(--ch-purple)',
  'var(--ch-amber)',
  'var(--ch-green)',
]

export function ContextStatsCard({
  usage,
  summary,
  items,
  related,
  onJumpTimeline,
  onJumpBrowser,
  onJumpTool,
  onJumpErrors,
  onJumpFiles,
  onJumpCommands,
  onJumpProgram,
  onJumpNetwork,
  t,
}: {
  usage: Usage | null
  summary: ActivitySummary | null
  items: readonly HistoryItem[]
  related: readonly RelatedSession[]
  onJumpTimeline: () => void
  onJumpBrowser: (filter: 'all' | 'messages' | 'tool' | 'event') => void
  onJumpTool: (toolName: string) => void
  onJumpErrors: () => void
  onJumpFiles: (filter?: 'all' | 'reads' | 'writes' | 'searches') => void
  onJumpCommands: () => void
  onJumpProgram: (program: string) => void
  onJumpNetwork: () => void
  t: Translate
}): ReactElement {
  const turns = useMemo(() => countTurns(items), [items])
  const errorCount = useMemo(() => items.filter((item) => item.isError === true).length, [items])
  const completedTools = useMemo(() => {
    if (!summary) return 0
    return summary.tools.reduce((sum, tool) => sum + Math.max(0, tool.count - tool.pending - tool.failed), 0)
  }, [summary])
  const fileTotals = useMemo(() => {
    let reads = 0
    let writes = 0
    let searches = 0
    for (const file of summary?.files ?? []) {
      reads += file.reads
      writes += file.writes
      searches += file.searches
    }
    return { reads, writes, searches, ioTotal: (summary?.userMessages ?? 0) + reads + writes + searches }
  }, [summary])
  const topTools = useMemo(
    () => [...(summary?.tools ?? [])].sort((a, b) => b.count - a.count),
    [summary],
  )
  const topPrograms = useMemo(() => {
    const counts = new Map<string, number>()
    for (const command of summary?.commands ?? []) {
      const prog = commandProgram(command.command)
      counts.set(prog, (counts.get(prog) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [summary])
  const lowerBound = (usage?.unpricedModels?.length ?? 0) > 0
  const costText =
    usage?.totalCostUsd === undefined
      ? '—'
      : `${lowerBound ? '≥ ' : ''}${formatUsd(usage.totalCostUsd)}`
  const tokenText = fmt(usage?.totalTokens)
  const parentCount = related.filter((row) => row.role === 'parent').length
  const childCount = related.filter((row) => row.role === 'child').length
  return (
    <Card
      title={t('activityStats')}
      className="ch-stats-card"
      aside={
        <span className="ch-card-rate">
          {t('historyWindow')} · <b>{summary ? summary.records : '—'}</b> {t('count')}
        </span>
      }
    >
      <div className="ch-core-wells">
        <button type="button" className="ch-well ch-well-teal" onClick={onJumpTimeline}>
          <b>{summary ? turns : '—'}</b>
          <span>{t('turnsLabel')}</span>
        </button>
        <button type="button" className="ch-well ch-well-blue" onClick={() => onJumpBrowser('all')}>
          <b>{summary ? summary.records : '—'}</b>
          <span>{t('recordsLabel')}</span>
        </button>
        <button type="button" className="ch-well ch-well-purple" onClick={() => onJumpBrowser('tool')}>
          <b>{summary ? summary.toolCalls : '—'}</b>
          <span>{t('toolCalls')}</span>
        </button>
        <button type="button" className="ch-well ch-well-green" onClick={() => onJumpBrowser('messages')}>
          <b>{summary ? summary.assistantMessages : '—'}</b>
          <span>{t('answersLabel')}</span>
        </button>
        <div className="ch-well ch-well-events">
          <span className="ch-well-ev-head">{t('windowEvents')}</span>
          <div className="ch-well-ev-list">
            <button
              type="button"
              className="ch-ev-chip is-ok"
              onClick={() => onJumpBrowser('tool')}
            >
              {t('completedShort')} <b>{summary ? completedTools : '—'}</b>
            </button>
            <span className="ch-ev-sep">/</span>
            <button
              type="button"
              className={`ch-ev-chip is-err ${errorCount === 0 ? 'is-dim' : ''}`}
              onClick={onJumpErrors}
            >
              {t('failed')} <b>{summary ? errorCount : '—'}</b>
            </button>
            <span className="ch-ev-sep">/</span>
            <button
              type="button"
              className={`ch-ev-chip is-ev ${(summary?.events ?? 0) === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpBrowser('event')}
            >
              {t('events')} <b>{summary ? summary.events : '—'}</b>
            </button>
          </div>
        </div>
      </div>

      <div className="ch-ledger">
        <div className="ch-ledger-group">
          <div className="ch-ledger-head">
            <span>{t('inputAndFiles')}</span>
            <b>{summary ? fileTotals.ioTotal : '—'}</b>
          </div>
          <div className="ch-ledger-chips">
            <button type="button" className="ch-l-chip" onClick={() => onJumpBrowser('messages')}>
              <i style={{ background: 'var(--ch-green)' }} />
              {t('user')} <b>{summary ? summary.userMessages : '—'}</b>
            </button>
            <button
              type="button"
              className={`ch-l-chip ${fileTotals.reads === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpFiles('reads')}
            >
              <i style={{ background: 'var(--ch-ink)' }} />
              {t('reads')} <b>{summary ? fileTotals.reads : '—'}</b>
            </button>
            <button
              type="button"
              className={`ch-l-chip ${fileTotals.writes === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpFiles('writes')}
            >
              <i style={{ background: 'var(--ch-green)' }} />
              {t('writes')} <b>{summary ? fileTotals.writes : '—'}</b>
            </button>
            <button
              type="button"
              className={`ch-l-chip ${fileTotals.searches === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpFiles('searches')}
            >
              <i style={{ background: 'var(--ch-amber)' }} />
              {t('searches')} <b>{summary ? fileTotals.searches : '—'}</b>
            </button>
          </div>
        </div>

        <div className="ch-ledger-group">
          <div className="ch-ledger-head">
            <span>{t('toolCalls')}</span>
            <b>{summary ? summary.toolCalls : '—'}</b>
          </div>
          <div className="ch-ledger-chips">
            {topTools.length === 0 ? (
              <span className="ch-note">—</span>
            ) : (
              <>
                {topTools.slice(0, 5).map((tool, index) => (
                  <button
                    key={tool.name}
                    type="button"
                    className="ch-l-chip"
                    onClick={() => onJumpTool(tool.name)}
                  >
                    <i style={{ background: CHIP_PALETTE[index % CHIP_PALETTE.length] }} />
                    <span className="ch-l-chip-name">{tool.name}</span>
                    <b>{tool.count}</b>
                  </button>
                ))}
                {topTools.length > 5 && (
                  <button
                    type="button"
                    className="ch-l-chip is-dim"
                    onClick={() => onJumpBrowser('tool')}
                  >
                    +{topTools.length - 5} {t('moreItems')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ch-ledger-group">
          <div className="ch-ledger-head">
            <span>{t('commands')}</span>
            <b>{summary ? summary.commands.length : '—'}</b>
          </div>
          <div className="ch-ledger-chips">
            {topPrograms.length === 0 ? (
              <span className="ch-note">—</span>
            ) : (
              <>
                {topPrograms.slice(0, 4).map(([prog, count], index) => (
                  <button
                    key={prog}
                    type="button"
                    className="ch-l-chip"
                    onClick={() => onJumpProgram(prog)}
                  >
                    <i style={{ background: CHIP_PALETTE[(index + 1) % CHIP_PALETTE.length] }} />
                    <span className="ch-l-chip-name">{prog}</span>
                    <b>{count}</b>
                  </button>
                ))}
                {topPrograms.length > 4 && (
                  <button type="button" className="ch-l-chip is-dim" onClick={onJumpCommands}>
                    +{topPrograms.length - 4} {t('moreItems')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ch-ledger-group">
          <div className="ch-ledger-head">
            <span>{t('sessionAndRelations')}</span>
            <b>
              {tokenText} <small>/</small> {costText}
            </b>
          </div>
          <div className="ch-rel-summary">
            <div className="ch-rel-line">
              <span>{t('currentSession')}</span>
              <b>
                {tokenText} / {costText}
              </b>
            </div>
            <div className="ch-rel-line">
              <span>
                {t('relatedSessionsLabel')} × {related.length}
              </span>
              <button type="button" className="ch-link-btn" onClick={onJumpNetwork}>
                {related.length === 0
                  ? '—'
                  : `${t('parentConversation')} ${parentCount} · ${t('childConversations')} ${childCount} ↗`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
