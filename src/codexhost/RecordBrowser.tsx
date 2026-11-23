import { useDeferredValue, useEffect, useMemo, useState, type ReactElement } from 'react'
import type { HistoryItem } from './api.ts'
import { Card, RecordBadges, RecordNotices } from './components.tsx'
import { RichText } from './RichText.tsx'
import { fmtTime } from '../client/format.ts'
import { ROLE_COLOR } from './ActivityPanels.tsx'
import type { Translate } from './i18n.ts'
import { previewLine } from './format.ts'

export type RecordFilter = 'all' | 'messages' | 'tool' | 'event'

function labelOf(item: HistoryItem, tool: string | undefined, t: Translate): string {
  if (item.kind === 'user' || item.kind === 'assistant')
    return previewLine(item.text) || t(item.kind)
  return tool ?? item.toolName ?? (item.eventType === 'tool/result' ? t('toolOutput') : item.title)
}

function RecordDetail({
  item,
  title,
  t,
}: {
  item: HistoryItem
  title: string
  t: Translate
}): ReactElement {
  const [rich, setRich] = useState(item.kind === 'user' || item.kind === 'assistant')
  const [copied, setCopied] = useState(false)
  const source = item.arguments ?? item.text
  return (
    <section className="ch-record-detail" aria-label={t('recordDetails')}>
      <header>
        <div>
          <span className="ch-record-kind" style={{ color: ROLE_COLOR[item.kind] }}>
            {t(item.kind)}
          </span>
          <strong title={title}>{title}</strong>
          <RecordBadges item={item} t={t} />
        </div>
        <div className="ch-detail-controls">
          <button
            className={`ch-mini-button ${rich ? 'is-active' : ''}`}
            aria-pressed={rich}
            onClick={() => setRich(true)}
          >
            {t('renderedText')}
          </button>
          <button
            className={`ch-mini-button ${!rich ? 'is-active' : ''}`}
            aria-pressed={!rich}
            onClick={() => setRich(false)}
          >
            {t('sourceText')}
          </button>
          <button
            className="ch-mini-button"
            onClick={() => {
              void navigator.clipboard
                .writeText(item.text)
                .then(() => setCopied(true))
                .catch(() => setCopied(false))
            }}
          >
            {t(copied ? 'copied' : 'copyRecord')}
          </button>
        </div>
      </header>
      <div className="ch-record-meta">
        <span>#{item.seq}</span>
        <span title={t('recordTime')}>
          {item.time === undefined ? t('unavailable') : fmtTime(item.time)}
        </span>
        {item.callId && <span title={item.callId}>Call ID · {item.callId}</span>}
      </div>
      <RecordNotices item={item} t={t} />
      <div className="ch-record-content">
        {item.text.length === 0 ? (
          <p className="ch-note">{t('blank')}</p>
        ) : rich ? (
          <RichText text={item.text} t={t} />
        ) : (
          <pre className="ch-source-text">
            <code>{source || '—'}</code>
          </pre>
        )}
      </div>
    </section>
  )
}

export function RecordBrowser({
  items,
  available,
  toolByRecord,
  focus,
  onFocus,
  filter,
  onFilter,
  query,
  onQuery,
  loading,
  error,
  hasMore,
  older,
  latest,
  isOlder,
  retry,
  t,
}: {
  items: readonly HistoryItem[]
  available: boolean
  toolByRecord: ReadonlyMap<string, string>
  focus?: string
  onFocus: (id: string) => void
  filter: RecordFilter
  onFilter: (filter: RecordFilter) => void
  query: string
  onQuery: (query: string) => void
  loading: boolean
  error: string | null
  hasMore: boolean
  older: () => void
  latest: () => void
  isOlder: boolean
  retry: () => void
  t: Translate
}): ReactElement {
  const deferred = useDeferredValue(query)
  const [grouped, setGrouped] = useState(true)
  const [expanded, setExpanded] = useState<Set<HistoryItem['kind']>>(
    () => new Set(['user', 'assistant']),
  )
  const rows = useMemo(() => {
    const needle = deferred.trim().toLocaleLowerCase()
    return items.filter((item) => {
      if (
        filter === 'messages'
          ? item.kind !== 'user' && item.kind !== 'assistant'
          : filter !== 'all' && item.kind !== filter
      )
        return false
      if (needle.startsWith('tool:'))
        return toolByRecord.get(item.id)?.toLocaleLowerCase() === needle.slice(5)
      return `${labelOf(item, toolByRecord.get(item.id), t)} ${item.text}`
        .toLocaleLowerCase()
        .includes(needle)
    })
  }, [items, filter, deferred, toolByRecord, t])
  const selected =
    rows.find((item) => item.id === focus) ??
    rows.findLast((item) => item.kind === 'assistant' || item.kind === 'user') ??
    rows.at(-1)
  useEffect(() => {
    if (query !== deferred || !selected) return
    if (selected.id !== focus) onFocus(selected.id)
    setExpanded((previous) =>
      previous.has(selected.kind) ? previous : new Set([...previous, selected.kind]),
    )
  }, [selected?.id, focus, query, deferred, onFocus])
  const positions = useMemo(
    () => new Map(items.map((item, index) => [item.id, index + 1])),
    [items],
  )
  const selectedIndex = rows.findIndex((item) => item.id === selected?.id)
  const renderRow = (item: HistoryItem): ReactElement => (
    <button
      key={item.id}
      className={`ch-record-item ch-record-${item.kind} ${selected?.id === item.id ? 'is-selected' : ''}`}
      aria-pressed={selected?.id === item.id}
      title={labelOf(item, toolByRecord.get(item.id), t)}
      onClick={() => onFocus(item.id)}
    >
      <span className="ch-record-seq" title={`Seq ${item.seq}`}>
        #{positions.get(item.id)}
      </span>
      <span className="ch-record-title">{labelOf(item, toolByRecord.get(item.id), t)}</span>
      <RecordBadges item={item} t={t} />
      <span className="ch-record-time">{item.time === undefined ? '' : fmtTime(item.time)}</span>
    </button>
  )
  const groupLabels = {
    user: 'userMessages',
    assistant: 'assistantMessages',
    tool: 'tools',
    event: 'events',
  } as const
  return (
    <Card
      title={t('browserTitle')}
      className="ch-browser-card"
      aside={
        <span className="ch-scope">
          {t('browserScope')} · {available ? items.length : '—'}
        </span>
      }
    >
      <div className="ch-browser-toolbar">
        <div className="ch-filter" role="group" aria-label={t('history')}>
          {(['all', 'messages', 'tool', 'event'] as const).map((key) => (
            <button
              key={key}
              className={filter === key ? 'is-active' : ''}
              aria-pressed={filter === key}
              onClick={() => onFilter(key)}
            >
              {t(key === 'tool' ? 'tools' : key === 'event' ? 'events' : key)}
            </button>
          ))}
        </div>
        <button
          className="ch-mini-button"
          aria-pressed={grouped}
          onClick={() => setGrouped((value) => !value)}
        >
          {t(grouped ? 'categories' : 'chronological')}
        </button>
      </div>
      <div className="ch-browser-search">
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={t('searchRecords')}
          aria-label={t('searchRecords')}
        />
        {query && (
          <button className="ch-mini-button" onClick={() => onQuery('')} aria-label={t('all')}>
            ×
          </button>
        )}
        <span>
          {available ? rows.length : '—'}/{available ? items.length : '—'}
        </span>
      </div>
      {error && (
        <div className="ch-error" role="alert">
          <span>
            {t('historyError')} {error}
          </span>
          <button className="ch-mini-button" onClick={retry}>
            {t('retry')}
          </button>
        </div>
      )}
      <div className="ch-browser-records" aria-busy={loading || deferred !== query}>
        {loading && items.length === 0 ? (
          <p className="ch-note">{t('historyLoading')}</p>
        ) : rows.length === 0 ? (
          <p className="ch-note">
            {t(!available ? 'unavailable' : query ? 'noMatches' : 'noHistory')}
          </p>
        ) : grouped ? (
          (['user', 'assistant', 'tool', 'event'] as const).map((kind) => {
            const group = rows.filter((item) => item.kind === kind)
            if (
              (filter === 'messages' && kind !== 'user' && kind !== 'assistant') ||
              (filter !== 'messages' && filter !== 'all' && filter !== kind)
            )
              return null
            return (
              <section key={kind} className={`ch-record-group ch-group-${kind}`}>
                <button
                  className="ch-group-heading"
                  aria-expanded={expanded.has(kind)}
                  disabled={group.length === 0}
                  onClick={() =>
                    setExpanded((previous) => {
                      const next = new Set(previous)
                      if (next.has(kind)) next.delete(kind)
                      else next.add(kind)
                      return next
                    })
                  }
                >
                  <span aria-hidden="true">{expanded.has(kind) ? '⌄' : '›'}</span>
                  <i style={{ background: ROLE_COLOR[kind] }} />
                  <b>{t(groupLabels[kind])}</b>
                  <span>{group.length}</span>
                </button>
                {expanded.has(kind) && group.map(renderRow)}
              </section>
            )
          })
        ) : (
          rows.map(renderRow)
        )}
      </div>
      <div className="ch-record-navigation">
        <span className="ch-note">{t('historyWindow')}</span>
        <div>
          <button
            className="ch-mini-button"
            disabled={selectedIndex <= 0}
            onClick={() => onFocus(rows[selectedIndex - 1].id)}
          >
            {t('prevRecord')}
          </button>
          <span>
            {available ? (selectedIndex < 0 ? 0 : selectedIndex + 1) : '—'}/
            {available ? rows.length : '—'}
          </span>
          <button
            className="ch-mini-button"
            disabled={selectedIndex < 0 || selectedIndex === rows.length - 1}
            onClick={() => onFocus(rows[selectedIndex + 1].id)}
          >
            {t('nextRecord')}
          </button>
        </div>
      </div>
      {selected && (
        <RecordDetail
          key={selected.id}
          item={selected}
          title={labelOf(selected, toolByRecord.get(selected.id), t)}
          t={t}
        />
      )}
      <footer className="ch-browser-footer">
        <p className="ch-note">{t('historyNote')}</p>
        <div>
          {isOlder && (
            <button className="ch-mini-button" disabled={loading} onClick={latest}>
              {t('latestWindow')}
            </button>
          )}
          {hasMore && (
            <button className="ch-button" disabled={loading} onClick={older}>
              {t(loading ? 'historyLoading' : 'older')}
            </button>
          )}
        </div>
      </footer>
    </Card>
  )
}
