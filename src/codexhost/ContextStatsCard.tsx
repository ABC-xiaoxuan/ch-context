import { memo, useMemo, type ReactElement } from 'react'
import { fmt } from '../client/format.ts'
import { commandProgram, type ActivitySummary } from './activity.ts'
import type { HistoryItem } from './api.ts'
import { Card } from './components.tsx'
import { computeWindowDiagnostics } from './diagnostics.ts'
import type { Translate } from './i18n.ts'
import type { RelatedSession } from './relationships.ts'
import { countTurns } from './report.ts'

const PROG_COLORS = [
  'var(--ch-green)',
  'var(--ch-blue)',
  'var(--ch-purple)',
  'var(--ch-amber)',
  'var(--ch-teal)',
]

export const ContextStatsCard = memo(function ContextStatsCard({
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
  onFocusRecord,
  t,
}: {
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
  onFocusRecord: (id: string) => void
  t: Translate
}): ReactElement {
  const turns = useMemo(() => countTurns(items), [items])
  const errorCount = useMemo(() => items.filter((item) => item.isError === true).length, [items])
  const heavyCount = useMemo(() => items.filter((item) => item.text.length >= 2000).length, [items])
  const diagnostics = useMemo(() => computeWindowDiagnostics(items, summary, []), [items, summary])
  const topTools = useMemo(
    () => [...(summary?.tools ?? [])].sort((a, b) => b.count - a.count),
    [summary],
  )
  const fileOps = useMemo(() => {
    let reads = 0
    let writes = 0
    let searches = 0
    for (const file of summary?.files ?? []) {
      reads += file.reads
      writes += file.writes
      searches += file.searches
    }
    return { reads, writes, searches }
  }, [summary])
  const topPrograms = useMemo(() => {
    const counts = new Map<string, number>()
    for (const command of summary?.commands ?? []) {
      const prog = commandProgram(command.command)
      counts.set(prog, (counts.get(prog) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [summary])

  const ioTotal = summary
    ? summary.userMessages + fileOps.reads + fileOps.writes + fileOps.searches
    : 0
  const hiddenTools = Math.max(0, topTools.length - 4)
  const hiddenPrograms = Math.max(0, topPrograms.length - 4)
  const topHotspotId = diagnostics.topRecords[0]?.id

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
      <div className="ch-core-tiles">
        <button type="button" className="ch-kv-tile is-teal" onClick={onJumpTimeline}>
          <b>{summary ? turns : '—'}</b>
          <span>{t('turnsLabel')}</span>
        </button>
        <button type="button" className="ch-kv-tile is-blue" onClick={() => onJumpBrowser('all')}>
          <b>{summary ? summary.records : '—'}</b>
          <span>{t('recordsLabel')}</span>
        </button>
        <button type="button" className="ch-kv-tile is-purple" onClick={() => onJumpBrowser('tool')}>
          <b>{summary ? summary.toolCalls : '—'}</b>
          <span>{t('toolCalls')}</span>
        </button>
        <button
          type="button"
          className="ch-kv-tile is-green"
          onClick={() => onJumpBrowser('messages')}
        >
          <b>{summary ? summary.assistantMessages : '—'}</b>
          <span>{t('answersLabel')}</span>
        </button>
        <div className="ch-kv-tile is-events">
          <span>{t('windowCluesLabel')}</span>
          <div className="ch-kv-event-pills">
            <button
              type="button"
              className={`ch-ev-pill is-err ${errorCount === 0 ? 'is-dim' : ''}`}
              onClick={onJumpErrors}
            >
              {t('failed')} <b>{summary ? errorCount : '—'}</b>
            </button>
            <span className="ch-ev-sep" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              className={`ch-ev-pill is-amber ${heavyCount === 0 ? 'is-dim' : ''}`}
              onClick={() => {
                if (topHotspotId) onFocusRecord(topHotspotId)
                else onJumpBrowser('all')
              }}
            >
              {t('heavyClue')} <b>{summary ? heavyCount : '—'}</b>
            </button>
            <span className="ch-ev-sep" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              className={`ch-ev-pill is-purple ${(summary?.events ?? 0) === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpBrowser('event')}
            >
              {t('events')} <b>{summary ? summary.events : '—'}</b>
            </button>
          </div>
        </div>
      </div>

      <div className="ch-ledger-grid">
        <div className="ch-ledger-sec">
          <div className="ch-ledger-head">
            <span>{t('inputAndFiles')}</span>
            <b>{summary ? fmt(ioTotal) : '—'}</b>
          </div>
          <div className="ch-chip-lane">
            <button
              type="button"
              className={`ch-l-chip ${(summary?.userMessages ?? 0) === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpBrowser('messages')}
            >
              <i style={{ background: 'var(--ch-green)' }} />
              <span className="ch-l-chip-name">{t('user')}</span>
              <b>{summary ? summary.userMessages : '—'}</b>
            </button>
            <button
              type="button"
              className={`ch-l-chip ${fileOps.reads === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpFiles('reads')}
            >
              <i style={{ background: 'var(--ch-blue)' }} />
              <span className="ch-l-chip-name">{t('reads')}</span>
              <b>{summary ? fileOps.reads : '—'}</b>
            </button>
            <button
              type="button"
              className={`ch-l-chip ${fileOps.writes === 0 ? 'is-dim' : ''}`}
              onClick={() => onJumpFiles('writes')}
            >
              <i style={{ background: 'var(--ch-teal)' }} />
              <span className="ch-l-chip-name">{t('writes')}</span>
              <b>{summary ? fileOps.writes : '—'}</b>
            </button>
            {fileOps.searches > 0 && (
              <button
                type="button"
                className="ch-l-chip"
                onClick={() => onJumpFiles('searches')}
              >
                <i style={{ background: 'var(--ch-amber)' }} />
                <span className="ch-l-chip-name">{t('searches')}</span>
                <b>{fileOps.searches}</b>
              </button>
            )}
          </div>
        </div>

        <div className="ch-ledger-sec">
          <div className="ch-ledger-head">
            <span>{t('toolCalls')}</span>
            <b>{summary ? fmt(summary.toolCalls) : '—'}</b>
          </div>
          <div className="ch-chip-lane">
            {topTools.length === 0 ? (
              <span className="ch-l-chip is-dim">—</span>
            ) : (
              <>
                {topTools.slice(0, 4).map((tool, index) => (
                  <button
                    key={tool.name}
                    type="button"
                    className="ch-l-chip"
                    onClick={() => onJumpTool(tool.name)}
                  >
                    <i
                      style={{
                        background: `color-mix(in srgb, var(--ch-teal) ${Math.max(42, 100 - index * 18)}%, transparent)`,
                      }}
                    />
                    <span className="ch-l-chip-name">{tool.name}</span>
                    <b>{tool.count}</b>
                  </button>
                ))}
                {hiddenTools > 0 && (
                  <button
                    type="button"
                    className="ch-l-chip is-more"
                    onClick={() => onJumpBrowser('tool')}
                  >
                    +{hiddenTools} {t('moreItems')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ch-ledger-sec">
          <div className="ch-ledger-head">
            <span>{t('commands')}</span>
            <b>{summary ? fmt(summary.commands.length) : '—'}</b>
          </div>
          <div className="ch-chip-lane">
            {topPrograms.length === 0 ? (
              <span className="ch-l-chip is-dim">—</span>
            ) : (
              <>
                {topPrograms.slice(0, 4).map(([prog, count], index) => (
                  <button
                    key={prog}
                    type="button"
                    className="ch-l-chip"
                    onClick={() => onJumpProgram(prog)}
                  >
                    <i style={{ background: PROG_COLORS[index % PROG_COLORS.length] }} />
                    <span className="ch-l-chip-name">{prog}</span>
                    <b>{count}</b>
                  </button>
                ))}
                {hiddenPrograms > 0 && (
                  <button type="button" className="ch-l-chip is-more" onClick={onJumpCommands}>
                    +{hiddenPrograms} {t('moreItems')}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="ch-ledger-sec">
          <div className="ch-ledger-head">
            <span>{t('windowSummaryLabel')}</span>
            <b>
              {diagnostics.totalChars > 0
                ? `${fmt(diagnostics.totalChars)} ${t('charsUnit')}`
                : '—'}
            </b>
          </div>
          <div className="ch-ledger-kv-list">
            <button
              type="button"
              className="ch-ledger-kv-row"
              onClick={() => onJumpFiles('all')}
            >
              <span>{t('files')}</span>
              <b>
                {summary ? summary.files.length : '—'} {t('filesUnit')}
              </b>
            </button>
            <button type="button" className="ch-ledger-kv-row" onClick={onJumpNetwork}>
              <span>{t('relatedSessionsLabel')}</span>
              <b>{related.length}</b>
            </button>
          </div>
        </div>
      </div>

      {(diagnostics.repeatedFiles.length > 0 || diagnostics.failedCommands.length > 0) && (
        <div className="ch-clues-row">
          {diagnostics.failedCommands.length > 0 && (
            <button type="button" className="ch-clue-pill is-err" onClick={onJumpCommands}>
              <span>{t('failedCommandsAlert')}</span>
              <b>×{diagnostics.failedCommands.length}</b>
            </button>
          )}
          {diagnostics.repeatedFiles.map((file) => {
            const base = file.path.split(/[\\/]/).filter(Boolean).at(-1) ?? file.path
            const total = file.reads + file.writes + file.searches
            const targetId = file.recordIds[0]
            return (
              <button
                key={file.path}
                type="button"
                className="ch-clue-pill"
                title={file.path}
                onClick={() => {
                  if (targetId) onFocusRecord(targetId)
                }}
              >
                <span>
                  {t('repeatedReadsLabel')}: {base}
                </span>
                <b>×{total}</b>
              </button>
            )
          })}
        </div>
      )}
    </Card>
  )
})
