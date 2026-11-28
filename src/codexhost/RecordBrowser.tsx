import {
  memo,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type RefObject,
} from 'react'
import type { HistoryItem } from './api.ts'
import { Card, RecordBadges } from './components.tsx'
import { fmt, fmtTime } from '../client/format.ts'
import { ROLE_COLOR } from './ActivityPanels.tsx'
import type { Translate } from './i18n.ts'
import { InlineRecordDetail } from './RecordDetail.tsx'
import {
  buildRecordIndex,
  filterIndexedRecords,
  type IndexedHistoryItem,
  type RecordFilter,
} from './record-index.ts'
import { layoutRecordTreemap } from './treemap.ts'

export type { RecordFilter } from './record-index.ts'

export function filterHistoryRecords(
  items: readonly HistoryItem[],
  filter: RecordFilter,
  query: string,
  errorsOnly: boolean,
  toolByRecord: ReadonlyMap<string, string>,
  t: Translate,
): HistoryItem[] {
  return filterIndexedRecords(
    items,
    buildRecordIndex(items, toolByRecord, t),
    filter,
    query,
    errorsOnly,
  )
}

const RecordRow = memo(function RecordRow({
  item,
  label,
  tag,
  isSelected,
  paired,
  callArgs,
  onFocus,
  onJumpRecord,
  t,
}: {
  item: HistoryItem
  label: string
  tag?: string
  isSelected: boolean
  paired?: HistoryItem
  callArgs: Array<[string, string]> | null
  onFocus: (id: string) => void
  onJumpRecord: (id: string) => void
  t: Translate
}): ReactElement {
  return (
    <div
      className={`ch-br-elem ${isSelected ? 'is-selected' : ''} ${item.isError === true ? 'is-error-row' : ''}`}
    >
      <button
        type="button"
        className={`ch-record-item ch-record-${item.kind} ${isSelected ? 'is-selected' : ''} ${item.isError === true ? 'is-error-row' : ''}`}
        aria-expanded={isSelected}
        aria-pressed={isSelected}
        title={label}
        onClick={() => onFocus(item.id)}
      >
        <span className="ch-br-chev" aria-hidden="true">
          {isSelected ? '▾' : '▸'}
        </span>
        {item.isError === true && <i className="ch-br-err-dot" aria-hidden="true" />}
        {tag ? (
          <span className="ch-br-tag">{tag}</span>
        ) : (
          <span className="ch-br-tag is-role">
            <i style={{ background: ROLE_COLOR[item.kind] }} />
            {t(item.kind)}
          </span>
        )}
        <span className="ch-record-title">{label}</span>
        <RecordBadges item={item} t={t} />
        <span className="ch-record-time">
          {item.time === undefined ? '' : fmtTime(item.time)}
        </span>
        <span className="ch-record-seq" title={`Seq ${item.seq}`}>
          #{item.seq}
        </span>
      </button>
      {isSelected && (
        <InlineRecordDetail
          key={item.id}
          item={item}
          title={label}
          pairedItem={paired}
          callArgs={callArgs}
          onFocus={onJumpRecord}
          t={t}
        />
      )}
    </div>
  )
})

export const RecordBrowser = memo(function RecordBrowser({
  items,
  filteredRows,
  recordIndex: providedIndex,
  isFiltering,
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
  searchInputRef,
  t,
}: {
  items: readonly HistoryItem[]
  filteredRows?: readonly HistoryItem[]
  recordIndex?: ReadonlyMap<string, IndexedHistoryItem>
  isFiltering?: boolean
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
  searchInputRef?: RefObject<HTMLInputElement>
  t: Translate
}): ReactElement {
  const deferred = useDeferredValue(query)
  const [grouped, setGrouped] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [expanded, setExpanded] = useState<Set<HistoryItem['kind']>>(
    () => new Set(['user', 'assistant', 'tool']),
  )
  const itemById = useMemo(() => new Map(items.map((item) => [item.id, item])), [items])
  const fallbackIndex = useMemo(
    () => (providedIndex ? null : buildRecordIndex(items, toolByRecord, t)),
    [providedIndex, items, toolByRecord, t],
  )
  const recordIndex = providedIndex ?? fallbackIndex!
  const errorCount = useMemo(() => items.filter((item) => item.isError === true).length, [items])
  const counts = useMemo(() => {
    let user = 0
    let assistant = 0
    let tool = 0
    let event = 0
    for (const item of items) {
      if (item.kind === 'user') user += 1
      else if (item.kind === 'assistant') assistant += 1
      else if (item.kind === 'tool') tool += 1
      else event += 1
    }
    return { all: items.length, messages: user + assistant, user, assistant, tool, event }
  }, [items])
  const treemap = useMemo(() => (showMap ? layoutRecordTreemap(items) : null), [showMap, items])
  const fallbackRows = useMemo(
    () =>
      filteredRows
        ? null
        : filterIndexedRecords(items, recordIndex, filter, deferred, errorsOnly),
    [filteredRows, items, recordIndex, filter, deferred, errorsOnly],
  )
  const rows = filteredRows ?? fallbackRows!
  const filteringPending = isFiltering ?? query !== deferred
  const groupsByKind = useMemo(() => {
    const groups: Record<HistoryItem['kind'], HistoryItem[]> = {
      user: [],
      assistant: [],
      tool: [],
      event: [],
    }
    for (const item of rows) groups[item.kind].push(item)
    return groups
  }, [rows])
  const selected =
    rows.find((item) => item.id === focus) ??
    rows.findLast((item) => item.kind === 'assistant' || item.kind === 'user') ??
    rows.at(-1)
  useEffect(() => {
    if (filteringPending || !selected) return
    if (selected.id !== focus) onFocus(selected.id)
    setExpanded((previous) =>
      previous.has(selected.kind) ? previous : new Set([...previous, selected.kind]),
    )
  }, [selected?.id, focus, filteringPending, onFocus])
  const selectedIndex = rows.findIndex((item) => item.id === selected?.id)
  const renderRow = (item: HistoryItem): ReactElement => {
    const indexed = recordIndex.get(item.id)
    const tool = indexed?.tool ?? toolByRecord.get(item.id)
    const label = indexed?.label ?? item.title
    const isSelected = selected?.id === item.id
    const tag = item.toolName ?? tool
    const paired = itemById.get(pairs.get(item.id) ?? '')
    const callArgs =
      item.eventType === 'tool/call'
        ? (indexed?.parsedArgs ?? null)
        : paired?.eventType === 'tool/call'
          ? (recordIndex.get(paired.id)?.parsedArgs ?? null)
          : null
    return (
      <RecordRow
        key={item.id}
        item={item}
        label={label}
        tag={tag}
        isSelected={isSelected}
        paired={paired}
        callArgs={callArgs}
        onFocus={onFocus}
        onJumpRecord={onJumpRecord}
        t={t}
      />
    )
  }
  const groupLabels = {
    user: 'userMessages',
    assistant: 'assistantMessages',
    tool: 'tools',
    event: 'events',
  } as const
  const totalCount = Math.max(1, items.length)
  return (
    <Card
      title={t('browserTitle')}
      className="ch-browser-card"
      aside={
        <div className="ch-br-head-right">
          <div className="ch-seg" role="group">
            <button
              type="button"
              className={grouped ? 'is-active' : ''}
              aria-pressed={grouped}
              onClick={() => setGrouped(true)}
            >
              {t('categories')}
            </button>
            <button
              type="button"
              className={!grouped ? 'is-active' : ''}
              aria-pressed={!grouped}
              onClick={() => setGrouped(false)}
            >
              {t('chronological')}
            </button>
          </div>
          <button
            type="button"
            className={`ch-map-btn ${showMap ? 'is-active' : ''}`}
            aria-pressed={showMap}
            aria-label={t('treemapToggle')}
            title={t('treemapToggle')}
            onClick={() => setShowMap((value) => !value)}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3">
              <rect x="1.5" y="1.5" width="7" height="8" rx="1.2" />
              <rect x="10.5" y="1.5" width="4" height="5" rx="1.2" />
              <rect x="10.5" y="8.5" width="4" height="6" rx="1.2" />
              <rect x="1.5" y="11.5" width="7" height="3" rx="1.2" />
            </svg>
          </button>
          <span className="ch-scope">
            {t('browserScope')} · {available ? items.length : '—'}
          </span>
        </div>
      }
    >
      <div className="ch-br-summary">
        <b>
          {t('historyWindow')} · {available ? items.length : '—'} {t('count')}
        </b>
        <span>{t('byRecordCount')}</span>
      </div>
      <div className="ch-br-propbar" aria-hidden="true">
        {(['user', 'assistant', 'tool', 'event'] as const).map((kind) => {
          const share = items.length > 0 ? (counts[kind] / totalCount) * 100 : 0
          return share > 0 ? (
            <div key={kind} style={{ width: `${share}%`, background: ROLE_COLOR[kind] }} />
          ) : null
        })}
      </div>

      {showMap && treemap && (
        <div className="ch-treemap-panel">
          <div className="ch-treemap-head">
            <b>{t('treemapTitle')}</b>
            <span>
              {fmt(treemap.totalChars)} {t('charsUnit')}
            </span>
          </div>
          {treemap.categories.length === 0 ? (
            <p className="ch-note">{t('noHistory')}</p>
          ) : (
            <div className="ch-treemap-stage">
              {treemap.categories.map((cat) => (
                <div
                  key={cat.kind}
                  className={`ch-map-cat ch-map-${cat.kind}`}
                  style={{
                    left: `${cat.x}%`,
                    top: `${cat.y}%`,
                    width: `${cat.w}%`,
                    height: `${cat.h}%`,
                  }}
                >
                  {cat.h >= 15 && (
                    <button
                      type="button"
                      className="ch-map-cat-head"
                      onClick={() => {
                        const first = cat.blocks[0]
                        if (first) onJumpRecord(first.id)
                      }}
                    >
                      <span>{t(groupLabels[cat.kind])}</span>
                      <b>{Math.round(cat.share)}%</b>
                    </button>
                  )}
                  <div className="ch-map-cat-body">
                    {cat.blocks.map((block) => (
                      <button
                        key={block.id}
                        type="button"
                        className={`ch-map-block ${selected?.id === block.id ? 'is-selected' : ''} ${block.isError ? 'is-err' : ''}`}
                        style={{
                          left: `${block.x}%`,
                          top: `${block.y}%`,
                          width: `${block.w}%`,
                          height: `${block.h}%`,
                        }}
                        title={`#${block.seq} ${block.label} · ${fmt(block.chars)} ${t('charsUnit')}`}
                        onClick={() => onJumpRecord(block.id)}
                      >
                        <span className="ch-map-lbl">#{block.seq}</span>
                        <span className="ch-map-num">{fmt(block.chars)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="ch-note">{t('treemapNote')}</p>
        </div>
      )}

      <div className="ch-browser-toolbar">
        <div className="ch-filter" role="group" aria-label={t('history')}>
          {(['all', 'messages', 'tool', 'event'] as const).map((key) => {
            const label = t(key === 'tool' ? 'tools' : key === 'event' ? 'events' : key)
            return (
              <button
                key={key}
                type="button"
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
        {(errorCount > 0 || errorsOnly) && (
          <button
            type="button"
            className={`ch-chip ch-err-toggle ${errorsOnly ? 'is-active' : ''}`}
            aria-pressed={errorsOnly}
            onClick={() => onErrorsOnly(!errorsOnly)}
          >
            {t('errorsOnly')} ({errorCount})
          </button>
        )}
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
          ref={searchInputRef}
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={t('searchRecords')}
          aria-label={t('searchRecords')}
        />
        {query && (
          <button
            type="button"
            className="ch-mini-button"
            onClick={() => onQuery('')}
            aria-label={t('all')}
          >
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
          <button type="button" className="ch-mini-button" onClick={retry}>
            {t('retry')}
          </button>
        </div>
      )}
      <div className="ch-browser-records" aria-busy={loading || filteringPending}>
        {loading && items.length === 0 ? (
          <p className="ch-note">{t('historyLoading')}</p>
        ) : rows.length === 0 ? (
          <p className="ch-note">
            {t(!available ? 'unavailable' : query || errorsOnly ? 'noMatches' : 'noHistory')}
          </p>
        ) : grouped ? (
          (['user', 'assistant', 'tool', 'event'] as const).map((kind) => {
            const group = groupsByKind[kind]
            if (
              (filter === 'messages' && kind !== 'user' && kind !== 'assistant') ||
              (filter !== 'messages' && filter !== 'all' && filter !== kind)
            )
              return null
            const share = items.length > 0 ? Math.round((group.length / totalCount) * 100) : 0
            return (
              <section key={kind} className={`ch-record-group ch-group-${kind}`}>
                <button
                  type="button"
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
                  <span className="ch-br-chev" aria-hidden="true">
                    {expanded.has(kind) ? '▾' : '▸'}
                  </span>
                  <i className="ch-cat-sq" style={{ background: ROLE_COLOR[kind] }} />
                  <b>{t(groupLabels[kind])}</b>
                  <span className="ch-group-cnt">
                    {group.length} {t('count')}
                  </span>
                  <span className="ch-group-pct">{share}%</span>
                </button>
                {expanded.has(kind) && group.length > 0 && (
                  <div className="ch-group-body">{group.map(renderRow)}</div>
                )}
              </section>
            )
          })
        ) : (
          <div className="ch-group-body">{rows.map(renderRow)}</div>
        )}
      </div>
      <div className="ch-record-navigation">
        <span className="ch-note">{t('shortcutsHint')}</span>
        <div>
          <button
            type="button"
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
            type="button"
            className="ch-mini-button"
            disabled={selectedIndex < 0 || selectedIndex === rows.length - 1}
            onClick={() => onFocus(rows[selectedIndex + 1].id)}
          >
            {t('nextRecord')}
          </button>
        </div>
      </div>
      <footer className="ch-browser-footer">
        <p className="ch-note">{t('historyNote')}</p>
        <div>
          {isOlder && (
            <button type="button" className="ch-mini-button" disabled={loading} onClick={latest}>
              {t('latestWindow')}
            </button>
          )}
          {hasMore && (
            <button type="button" className="ch-button" disabled={loading} onClick={older}>
              {t('older')}
            </button>
          )}
        </div>
      </footer>
    </Card>
  )
})
