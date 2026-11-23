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
  pairedItem,
  onFocus,
  t,
}: {
  item: HistoryItem
  title: string
  pairedItem?: HistoryItem
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const [rich, setRich] = useState(item.kind === 'user' || item.kind === 'assistant')
  const [copied, setCopied] = useState(false)
  const source = item.arguments ?? item.text
  return (
    <section className="ch-record-detail" aria-label={t('recordDetails')}>
      <header>
        <div className="ch-detail-title-row">
          <span
            className={`ch-record-kind ch-dot-pill ${item.isError === true ? 'is-err' : ''}`}
          >
            <i
              style={{
                background: item.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[item.kind],
              }}
            />
            {t(item.kind)}
          </span>
          <strong title={title}>{title}</strong>
          <RecordBadges item={item} t={t} />
        </div>
        <div className="ch-detail-controls">
          {pairedItem && (
            <button
              className="ch-mini-button ch-pair-jump"
              onClick={() => onFocus(pairedItem.id)}
            >
              {pairedItem.eventType === 'tool/result'
                ? `${t('jumpResult')} ↗`
                : `${t('jumpCall')} ↖`}
            </button>
          )}
          <div className="ch-seg" role="group">
            <button
              className={rich ? 'is-active' : ''}
              aria-pressed={rich}
              onClick={() => setRich(true)}
            >
              {t('renderedText')}
            </button>
            <button
              className={!rich ? 'is-active' : ''}
              aria-pressed={!rich}
              onClick={() => setRich(false)}
            >
              {t('sourceText')}
            </button>
          </div>
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
        {item.eventType && <span>{item.eventType}</span>}
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
  pairs,
  available,
  toolByRecord,
  focus,
  onFocus,
  onJumpRecord,
  filter,
  onFilter,
  query,
  onQuery,
  errorsOnly,
  onErrorsOnly,
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
  pairs: ReadonlyMap<string, string>
  available: boolean
  toolByRecord: ReadonlyMap<string, string>
  focus?: string
  onFocus: (id: string) => void
  onJumpRecord: (id: string) => void
  filter: RecordFilter
  onFilter: (filter: RecordFilter) => void
  query: string
  onQuery: (query: string) => void
  errorsOnly: boolean
  onErrorsOnly: (value: boolean) => void
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
  const itemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items])
  const errorCount = useMemo(() => items.filter((item) => item.isError === true).length, [items])
  const counts = useMemo(() => {
    let messages = 0
    let tool = 0
    let event = 0
    for (const item of items) {
      if (item.kind === 'user' || item.kind === 'assistant') messages += 1
      else if (item.kind === 'tool') tool += 1
      else event += 1
    }
    return { all: items.length, messages, tool, event }
  }, [items])
  const rows = useMemo(() => {
    const needle = deferred.trim().toLocaleLowerCase()
    return items.filter((item) => {
      if (errorsOnly && item.isError !== true) return false
      if (
        filter === 'messages'
          ? item.kind !== 'user' && item.kind !== 'assistant'
          : filter !== 'all' && item.kind !== filter
      )
        return false
      if (!needle) return true
      if (needle.startsWith('tool:'))
        return toolByRecord.get(item.id)?.toLocaleLowerCase() === needle.slice(5)
      return `${labelOf(item, toolByRecord.get(item.id), t)} ${item.text}`
        .toLocaleLowerCase()
        .includes(needle)
    })
  }, [items, filter, deferred, errorsOnly, toolByRecord, t])
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
  const renderRow = (item: HistoryItem): ReactElement => {
    const tool = toolByRecord.get(item.id)
    const badgeText = item.toolName ?? tool ?? t(item.kind)
    return (
      <button
        key={item.id}
        className={`ch-record-item ch-record-${item.kind} ${selected?.id === item.id ? 'is-selected' : ''} ${item.isError === true ? 'is-error-row' : ''}`}
        aria-pressed={selected?.id === item.id}
        title={labelOf(item, tool, t)}
        onClick={() => onFocus(item.id)}
      >
        <span className="ch-record-seq" title={`Seq ${item.seq}`}>
          #{positions.get(item.id)}
        </span>
        <span className={`ch-dot-pill ch-row-role ${item.isError === true ? 'is-err' : ''}`}>
          <i
            style={{
              background: item.isError === true ? 'var(--ch-danger)' : ROLE_COLOR[item.kind],
            }}
          />
          {badgeText}
        </span>
        <span className="ch-record-title">{labelOf(item, tool, t)}</span>
        <RecordBadges item={item} t={t} />
        <span className="ch-record-time">
          {item.time === undefined ? '' : fmtTime(item.time)}
        </span>
      </button>
    )
  }
  const groupLabels = {
    user: 'userMessages',
    assistant: 'assistantMessages',
    tool: 'tools',
    event: 'events',
  } as const
  const pairedForSelected = selected ? itemById.get(pairs.get(selected.id) ?? '') : undefined
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
          {(['all', 'messages', 'tool', 'event'] as const).map((key) => {
            const label = t(key === 'tool' ? 'tools' : key === 'event' ? 'events' : key)
            return (
              <button
                key={key}
                className={filter === key ? 'is-active' : ''}
                aria-label={label}
                aria-pressed={filter === key}
                onClick={() => onFilter(key)}
              >
                {label}
                <span className="ch-filter-count">{available ? counts[key] : '—'}</span>
              </button>
            )
          })}
        </div>
        <div className="ch-seg" role="group">
          <button
            className={grouped ? 'is-active' : ''}
            aria-pressed={grouped}
            onClick={() => setGrouped(true)}
          >
            {t('categories')}
          </button>
          <button
            className={!grouped ? 'is-active' : ''}
            aria-pressed={!grouped}
            onClick={() => setGrouped(false)}
          >
            {t('chronological')}
          </button>
        </div>
      </div>
      <div className="ch-browser-search">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
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
        {(errorCount > 0 || errorsOnly) && (
          <button
            className={`ch-chip ch-err-toggle ${errorsOnly ? 'is-active' : ''}`}
            aria-pressed={errorsOnly}
            onClick={() => onErrorsOnly(!errorsOnly)}
          >
            {t('errorsOnly')}
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
            {t(!available ? 'unavailable' : query || errorsOnly ? 'noMatches' : 'noHistory')}
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
                  <span aria-hidden="true">{expanded.has(kind) ? '▾' : '▸'}</span>
                  <b>{t(groupLabels[kind])}</b>
                  <span className="ch-tab-count">{group.length}</span>
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
          pairedItem={pairedForSelected}
          onFocus={onJumpRecord}
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
