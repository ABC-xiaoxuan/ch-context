import { useState, type MouseEvent, type ReactElement } from 'react'
import type { ActivitySummary } from './activity.ts'
import type { HistoryItem } from './api.ts'
import type { RelatedSession } from './relationships.ts'
import type { Translate } from './i18n.ts'
import { Card } from './components.tsx'
import { previewLine } from './format.ts'
import { eventIndexAt, eventX } from './event-geometry.ts'

export const ROLE_COLOR = {
  user: 'var(--ch-green)',
  assistant: 'var(--ch-blue)',
  tool: 'var(--ch-teal)',
  event: 'var(--ch-purple)',
}

export function ActivityStats({
  summary,
  t,
  onTool,
  onKind,
}: {
  summary: ActivitySummary | null
  t: Translate
  onTool: (tool: string) => void
  onKind: (kind: 'messages' | 'tool' | 'event') => void
}): ReactElement {
  return (
    <Card
      title={t('activityStats')}
      className="ch-activity-stats"
      aside={
        <span className="ch-scope">
          {t('historyWindow')} · {summary?.records ?? '—'} {t('count')}
        </span>
      }
    >
      <div className="ch-stat-tiles">
        {(['userMessages', 'assistantMessages', 'toolCalls', 'toolResults'] as const).map(
          (key, index) => (
            <button
              key={key}
              className={`ch-stat-tile ch-tile-${index}`}
              onClick={() => onKind(index < 2 ? 'messages' : 'tool')}
            >
              <strong>{summary?.[key] ?? '—'}</strong>
              <span>{t(key)}</span>
            </button>
          ),
        )}
      </div>
      <div className="ch-activity-bottom">
        <div>
          <span>{t('toolUse')}</span>
          <div className="ch-tool-chips">
            {summary?.tools.slice(0, 8).map((tool) => (
              <button
                key={tool.name}
                title={`${tool.name}: ${tool.count}${tool.failed ? ` · ${t('failed')}: ${tool.failed}` : ''}`}
                onClick={() => onTool(tool.name)}
              >
                <i style={{ background: ROLE_COLOR.tool }} />
                {tool.name} <b>{tool.count}</b>
                {tool.failed > 0 && <em>{tool.failed} !</em>}
              </button>
            ))}
            {(summary?.tools.length ?? 0) > 8 && (
              <button onClick={() => onKind('tool')}>+{summary!.tools.length - 8}</button>
            )}
            {summary && summary.tools.length === 0 && <span className="ch-note">—</span>}
          </div>
        </div>
        <div className="ch-window-counts">
          <button
            onClick={(event) =>
              event.currentTarget
                .closest('.ch-inspector')
                ?.querySelector('.ch-command-card')
                ?.scrollIntoView({ block: 'nearest' })
            }
          >
            {t('commands')} <b>{summary?.commands.length ?? '—'}</b>
          </button>
          <button
            onClick={(event) =>
              event.currentTarget
                .closest('.ch-inspector')
                ?.querySelector('.ch-file-card')
                ?.scrollIntoView({ block: 'nearest' })
            }
          >
            {t('files')} <b>{summary?.files.length ?? '—'}</b>
          </button>
          <button onClick={() => onKind('event')}>
            {t('events')} <b>{summary?.events ?? '—'}</b>
          </button>
        </div>
      </div>
    </Card>
  )
}

export function ActivityTimeline({
  items,
  available,
  loading,
  focus,
  onFocus,
  t,
}: {
  items: readonly HistoryItem[]
  available: boolean
  loading: boolean
  focus?: string
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const [hover, setHover] = useState<number | null>(null)
  const selected = items.findIndex((item) => item.id === focus)
  const effective = selected < 0 ? Math.max(0, items.length - 1) : selected
  const indexAt = (event: MouseEvent<SVGSVGElement>): number | null => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return bounds.width > 0
      ? eventIndexAt((event.clientX - bounds.left) / bounds.width, items.length)
      : null
  }
  const pick = (event: MouseEvent<SVGSVGElement>): void => {
    const index = indexAt(event)
    if (index !== null && items[index]) onFocus(items[index].id)
  }
  const lanes = ['user', 'assistant', 'tool', 'event'] as const
  const xOf = (index: number) => eventX(index, items.length)
  const markerWidth = Math.max(3, Math.min(10, 600 / Math.max(1, items.length)))
  const preview = items[hover !== null && items[hover] ? hover : effective]
  return (
    <Card
      title={t('activityTimeline')}
      className="ch-activity-timeline"
      aside={
        <span className="ch-count">
          {t('historyWindow')} · {items.length ? `1–${items.length}` : '—'}
        </span>
      }
    >
      {items.length === 0 ? (
        <p className="ch-note">
          {t(available ? 'noHistory' : loading ? 'historyLoading' : 'unavailable')}
        </p>
      ) : (
        <>
          <div className="ch-activity-chart">
            <div className="ch-lane-labels">
              {lanes.map((lane) => (
                <span key={lane} style={{ color: ROLE_COLOR[lane] }}>
                  {t(lane)}
                </span>
              ))}
            </div>
            <svg
              viewBox="0 0 720 112"
              preserveAspectRatio="none"
              role="img"
              aria-label={t('activitySequence')}
              onClick={pick}
              onMouseMove={(event) => setHover(indexAt(event))}
              onMouseLeave={() => setHover(null)}
            >
              {lanes.map((lane, index) => (
                <line
                  key={lane}
                  x1="0"
                  x2="720"
                  y1={20 + index * 24}
                  y2={20 + index * 24}
                  className="ch-lane-line"
                />
              ))}
              {items.map((item, index) => (
                <rect
                  key={item.id}
                  x={xOf(index) - markerWidth / 2}
                  y={10 + lanes.indexOf(item.kind) * 24}
                  width={markerWidth}
                  height="19"
                  rx="2"
                  fill={ROLE_COLOR[item.kind]}
                  opacity={index === effective || hover === index ? 1 : 0.65}
                />
              ))}
              <line
                x1={xOf(effective)}
                x2={xOf(effective)}
                y1="0"
                y2="110"
                className="ch-timeline-cursor"
              />
            </svg>
          </div>
          <input
            className="ch-sequence-slider"
            type="range"
            min="0"
            max={Math.max(0, items.length - 1)}
            value={effective}
            onChange={(event) => {
              const item = items[Number(event.target.value)]
              if (item) onFocus(item.id)
            }}
            aria-label={t('activitySequence')}
          />
          <div className="ch-sequence-preview">
            {preview && (
              <>
                <b data-seq={preview.seq} title={`Seq ${preview.seq}`}>
                  #{(hover !== null && items[hover] ? hover : effective) + 1}
                </b>
                <span style={{ color: ROLE_COLOR[preview.kind] }}>{t(preview.kind)}</span>
                <span>
                  {previewLine(
                    preview.title === 'user' || preview.title === 'assistant'
                      ? preview.text
                      : preview.title,
                    120,
                  )}
                </span>
              </>
            )}
          </div>
          <p className="ch-note">{t('sequenceNote')}</p>
        </>
      )}
    </Card>
  )
}

export function FileActivityCard({
  summary,
  onFocus,
  t,
}: {
  summary: ActivitySummary | null
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  return (
    <Card
      title={t('files')}
      className="ch-file-card"
      aside={
        <span className="ch-scope">
          {t('historyWindow')} · {summary?.files.length ?? '—'}
        </span>
      }
    >
      {!summary || summary.files.length === 0 ? (
        <p className="ch-note">{t(summary ? 'noFiles' : 'unavailable')}</p>
      ) : (
        <div className="ch-file-list">
          {summary.files.map((file) => (
            <button
              key={file.path}
              className="ch-file-row"
              title={file.path}
              onClick={() => onFocus(file.recordIds[0])}
            >
              <div>
                <strong>{file.path.split(/[\\/]/).at(-1)}</strong>
                <small>{file.path}</small>
              </div>
              <span>
                <i>
                  {t('reads')} {file.reads}
                </i>
                <i>
                  {t('writes')} {file.writes}
                </i>
                <i>
                  {t('searches')} {file.searches}
                </i>
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  )
}

export function CommandActivityCard({
  summary,
  onFocus,
  t,
}: {
  summary: ActivitySummary | null
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  return (
    <Card
      title={t('commands')}
      className="ch-command-card"
      aside={
        <span className="ch-scope">
          {t('historyWindow')} · {summary?.commands.length ?? '—'}
        </span>
      }
    >
      {!summary || summary.commands.length === 0 ? (
        <p className="ch-note">{t(summary ? 'noCommands' : 'unavailable')}</p>
      ) : (
        <div className="ch-command-list">
          {summary.commands.map((command) => (
            <div key={command.id} className="ch-command-row">
              <button className="ch-command-main" onClick={() => onFocus(command.recordId)}>
                <span className="ch-command-seq">#{command.seq}</span>
                <code>{command.command}</code>
                <span
                  className={
                    command.isError
                      ? 'ch-result-error'
                      : command.resultId && command.isError === false
                        ? 'ch-result-known'
                        : 'ch-result-state'
                  }
                  title={t(command.isError ? 'failed' : command.resultId ? 'completed' : 'pending')}
                >
                  {command.isError
                    ? '!'
                    : command.resultId
                      ? command.isError === false
                        ? '✓'
                        : '↳'
                      : '…'}
                </span>
              </button>
              {command.resultId && (
                <button className="ch-command-result" onClick={() => onFocus(command.resultId!)}>
                  {t('toolOutput')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export function FamilyCard({
  related,
  onSelect,
  t,
}: {
  related: readonly RelatedSession[]
  onSelect: (id: string) => void
  t: Translate
}): ReactElement | null {
  if (!related.length) return null
  const kindLabels = {
    subagent: 'relationSubagent',
    fork: 'relationFork',
    tree: 'relationTree',
    parent: 'relationParent',
  } as const
  return (
    <Card
      title={t('loadedFamily')}
      className="ch-family-card"
      aside={<span className="ch-count">{related.length}</span>}
    >
      <div className="ch-family-list">
        {related.map((row) => (
          <button
            key={`${row.role}:${row.id}`}
            className="ch-family-row"
            title={row.title || row.id}
            onClick={() => onSelect(row.id)}
          >
            <span className="ch-family-branch" aria-hidden="true">
              {row.role === 'parent' ? '↰' : '↳'}
            </span>
            <span>
              <small>
                {t(row.role === 'parent' ? 'parentConversation' : 'childConversations')} ·{' '}
                {t(kindLabels[row.kind])}
                {row.harness ? ` · ${row.harness}` : ''}
              </small>
              <b>{row.title || row.id}</b>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      <p className="ch-note">{t('familyScope')}</p>
    </Card>
  )
}
