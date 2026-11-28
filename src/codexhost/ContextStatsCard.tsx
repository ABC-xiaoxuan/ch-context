import { memo, useMemo, type ReactElement } from 'react'
import { fmt } from '../client/format.ts'
import { commandProgram, type ActivitySummary } from './activity.ts'
import type { HistoryItem } from './api.ts'
import { Card } from './components.tsx'
import { computeWindowDiagnostics } from './diagnostics.ts'
import type { Translate } from './i18n.ts'
import type { RelatedSession } from './relationships.ts'
import { countTurns } from './report.ts'

const ROLE_DOT: Record<HistoryItem['kind'], string> = {
  user: 'var(--ch-green)',
  assistant: 'var(--ch-blue)',
  tool: 'var(--ch-teal)',
  event: 'var(--ch-purple)',
}

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
  const diagnostics = useMemo(() => computeWindowDiagnostics(items, summary, []), [items, summary])
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
  return (
    <Card
      title={t('hotspotsTitle')}
      className="ch-stats-card"
      aside={
        <span className="ch-card-rate">
          {t('historyWindow')} · <b>{summary ? summary.records : '—'}</b> {t('count')}
        </span>
      }
    >
      <div className="ch-stat-ribbon">
        <button type="button" className="ch-stat-pill" onClick={onJumpTimeline}>
          <b>{summary ? turns : '—'}</b>
          <span>{t('turnsLabel')}</span>
        </button>
        <button type="button" className="ch-stat-pill" onClick={() => onJumpBrowser('tool')}>
          <b>{summary ? summary.toolCalls : '—'}</b>
          <span>{t('toolCalls')}</span>
        </button>
        <button type="button" className="ch-stat-pill" onClick={() => onJumpBrowser('messages')}>
          <b>{summary ? summary.assistantMessages : '—'}</b>
          <span>{t('answersLabel')}</span>
        </button>
        <button
          type="button"
          className={`ch-stat-pill ${errorCount > 0 ? 'is-err' : 'is-dim'}`}
          onClick={onJumpErrors}
        >
          <b>{summary ? errorCount : '—'}</b>
          <span>{t('failed')}</span>
        </button>
        <button type="button" className="ch-stat-pill" onClick={() => onJumpFiles('all')}>
          <b>{summary ? summary.files.length : '—'}</b>
          <span>{t('files')}</span>
        </button>
        <button type="button" className="ch-stat-pill" onClick={onJumpCommands}>
          <b>{summary ? summary.commands.length : '—'}</b>
          <span>{t('commands')}</span>
        </button>
        {related.length > 0 && (
          <button type="button" className="ch-stat-pill" onClick={onJumpNetwork}>
            <b>{related.length}</b>
            <span>{t('loadedFamily')}</span>
          </button>
        )}
      </div>

      <div className="ch-hotspots-box">
        <div className="ch-hotspots-head">
          <span>{t('largestRecords')}</span>
          <span>
            {diagnostics.totalChars > 0 ? `${fmt(diagnostics.totalChars)} ${t('charsUnit')}` : '—'}
          </span>
        </div>
        {diagnostics.topRecords.length === 0 ? (
          <p className="ch-note">{t('noHotspots')}</p>
        ) : (
          <div className="ch-hotspots-list">
            {diagnostics.topRecords.map((spot) => (
              <button
                key={spot.id}
                type="button"
                className={`ch-hotspot-row ${spot.isError ? 'is-err' : ''}`}
                onClick={() => onFocusRecord(spot.id)}
              >
                <i className="ch-hotspot-dot" style={{ background: ROLE_DOT[spot.kind] }} />
                <span className="ch-hotspot-seq">#{spot.seq}</span>
                <span className="ch-hotspot-lbl">{spot.label}</span>
                <span className="ch-hotspot-val">
                  {fmt(spot.chars)} {t('charsUnit')} · {spot.sharePercent.toFixed(0)}%
                </span>
                <i
                  className="ch-hotspot-bar"
                  style={{
                    width: `${Math.min(100, Math.max(4, spot.sharePercent))}%`,
                    background: spot.isError ? 'var(--ch-danger)' : ROLE_DOT[spot.kind],
                  }}
                />
              </button>
            ))}
          </div>
        )}
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

      {(topTools.length > 0 || topPrograms.length > 0) && (
        <div className="ch-compact-chips">
          {topTools.slice(0, 4).map((tool) => (
            <button
              key={`t:${tool.name}`}
              type="button"
              className="ch-l-chip"
              onClick={() => onJumpTool(tool.name)}
            >
              <i style={{ background: 'var(--ch-teal)' }} />
              <span className="ch-l-chip-name">{tool.name}</span>
              <b>{tool.count}</b>
            </button>
          ))}
          {topPrograms.slice(0, 3).map(([prog, count]) => (
            <button
              key={`p:${prog}`}
              type="button"
              className="ch-l-chip"
              onClick={() => onJumpProgram(prog)}
            >
              <i style={{ background: 'var(--ch-accent)' }} />
              <span className="ch-l-chip-name">{prog}</span>
              <b>{count}</b>
            </button>
          ))}
        </div>
      )}
    </Card>
  )
})
