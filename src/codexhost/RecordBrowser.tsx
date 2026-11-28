import {
  memo,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
} from 'react'
import { fmt, fmtTime } from '../client/format.ts'
import { ROLE_COLOR } from './ActivityPanels.tsx'
import type { HistoryItem } from './api.ts'
import { Card, RecordBadges } from './components.tsx'
import type { Translate } from './i18n.ts'
import { InlineRecordDetail } from './RecordDetail.tsx'
import {
  buildRecordIndex,
  filterIndexedRecords,
  type IndexedHistoryItem,
  type RecordFilter,
} from './record-index.ts'
import { buildDnaRunsFromItems } from './timeline-model.ts'
import { layoutRecordTreemap } from './treemap.ts'

export type { RecordFilter } from './record-index.ts'
type BrowserLayout = 'categories' | 'sequence' | 'split'

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
  inlineDetail,
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
  inlineDetail: boolean
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
        aria-expanded={inlineDetail ? isSelected : undefined}
        aria-pressed={isSelected}
        title={label}
        onClick={() => onFocus(item.id)}
      >
        {inlineDetail ? (
          <span className="ch-br-chev" aria-hidden="true">
            {isSelected ? '▾' : '▸'}
          </span>
        ) : (
          <i className="ch-cat-sq" style={{ background: ROLE_COLOR[item.kind] }} aria-hidden="true" />
        )}
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
        {item.text.length > 0 && (
          <span className="ch-record-chars">{fmt(item.text.length)}</span>
        )}
        <span className="ch-record-time">
          {item.time === undefined ? '' : fmtTime(item.time)}
        </span>
        <span className="ch-record-seq" title={`Seq ${item.seq}`}>
          #{item.seq}
        </span>
      </button>
      {inlineDetail && isSelected && (
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
  const [layout, setLayout] = useState<BrowserLayout>('categories')
  const [showMap, setShowMap] = useState(false)
  const [dnaBar, setDnaBar] = useState(false)
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
  const { counts, charsByKind, totalChars } = useMemo(() => {
    let user = 0
    let assistant = 0
    let tool = 0
    let event = 0
    const chars: Record<HistoryItem['kind'], number> = {
      user: 0,
      assistant: 0,
      tool: 0,
      event: 0,
    }
    let sumChars = 0
    for (const item of items) {
      chars[item.kind] += item.text.length
      sumChars += item.text.length
      if (item.kind === 'user') user += 1
      else if (item.kind === 'assistant') assistant += 1
      else if (item.kind === 'tool') tool += 1
      else event += 1
    }
    return {
      counts: { all: items.length, messages: user + assistant, user, assistant, tool, event },
      charsByKind: chars,
      totalChars: sumChars,
    }
  }, [items])
  const treemap = useMemo(() => (showMap ? layoutRecordTreemap(items) : null), [showMap, items])
  const dnaRuns = useMemo(() => (dnaBar ? buildDnaRunsFromItems(items, 48) : []), [dnaBar, items])
  const dnaTotal = useMemo(() => dnaRuns.reduce((sum, run) => sum + run.chars, 0), [dnaRuns])
  const splitLeftRef = useRef<HTMLDivElement>(null)
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
  useEffect(() => {
    if (layout !== 'split' || !selected) return
    const target = splitLeftRef.current?.querySelector('.ch-record-item.is-selected')
    if (target && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'nearest' })
    }
  }, [layout, selected?.id])
  const selectedIndex = rows.findIndex((item) => item.id === selected?.id)

  const detailPropsOf = (item: HistoryItem) => {
    const indexed = recordIndex.get(item.id)
    const tool = indexed?.tool ?? toolByRecord.get(item.id)
    const label = indexed?.label ?? item.title
    const tag = item.toolName ?? tool
    const paired = itemById.get(pairs.get(item.id) ?? '')
    const callArgs =
      item.eventType === 'tool/call'
        ? (indexed?.parsedArgs ?? null)
        : paired?.eventType === 'tool/call'
          ? (recordIndex.get(paired.id)?.parsedArgs ?? null)
          : null
    return { label, tag, paired, callArgs }
  }

  const renderRow = (item: HistoryItem, inlineDetail: boolean): ReactElement => {
    const { label, tag, paired, callArgs } = detailPropsOf(item)
    return (
      <RecordRow
        key={item.id}
        item={item}
        label={label}
        tag={tag}
        isSelected={selected?.id === item.id}
        inlineDetail={inlineDetail}
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

  const selectedDetail = selected ? detailPropsOf(selected) : null

  return (
    <Card
      title={t('browserTitle')}
      className="ch-browser-card"
      aside={
        <div className="ch-br-head-right">
          <button
            type="button"
            className={`ch-mini-button ch-tl-dna-btn ${dnaBar ? 'is-active' : ''}`}
            aria-pressed={dnaBar}
            onClick={() => setDnaBar((value) => !value)}
          >
            {t('dnaSplit')}
          </button>
          <div className="ch-seg" role="group" aria-label={t('browserTitle')}>
            <button
              type="button"
              className={layout === 'categories' ? 'is-active' : ''}
              aria-pressed={layout === 'categories'}
              onClick={() => setLayout('categories')}
            >
              {t('categories')}
            </button>
            <button
              type="button"
              className={layout === 'sequence' ? 'is-active' : ''}
              aria-pressed={layout === 'sequence'}
              onClick={() => setLayout('sequence')}
            >
              {t('chronological')}
            </button>
            <button
              type="button"
              className={layout === 'split' ? 'is-active' : ''}
              aria-pressed={layout === 'split'}
              onClick={() => setLayout('split')}
            >
              {t('splitView')}
            </button>
          </div>
          <span className="ch-scope">
            {t('browserScope')} · {available ? items.length : '—'}
          </span>
        </div>
      }
    >
      <div className="ch-br-bar-row">
        <div className="ch-br-bar-main">
          <div className="ch-br-summary">
            <b>
              {t('historyWindow')} · {available ? items.length : '—'} {t('count')}
            </b>
            <span>
              {totalChars > 0 ? `${fmt(totalChars)} ${t('charsUnit')} · ` : ''}
              {t('payloadCharsNote')}
            </span>
          </div>
          <div
            className={`ch-br-propbar ${dnaBar ? 'is-dna' : ''}`}
            role="group"
            aria-label={t('payloadVolume')}
          >
            {dnaBar
              ? dnaRuns.map((run, idx) => {
                  const share = dnaTotal > 0 ? (run.chars / dnaTotal) * 100 : 0
                  if (share <= 0) return null
                  const label = `${t(groupLabels[run.kind])}${run.isError ? ` · ${t('failed')}` : ''} (${share.toFixed(1)}%)`
                  return (
                    <button
                      key={`dna-${idx}`}
                      type="button"
                      style={{
                        width: `${share}%`,
                        background: run.isError ? 'var(--ch-danger)' : ROLE_COLOR[run.kind],
                      }}
                      title={label}
                      aria-label={label}
                      onClick={() => {
                        setLayout('categories')
                        setExpanded(new Set([run.kind]))
                      }}
                    />
                  )
                })
              : (['tool', 'assistant', 'user', 'event'] as const).map((kind) => {
                  const weight = totalChars > 0 ? charsByKind[kind] : counts[kind]
                  const denom = totalChars > 0 ? totalChars : Math.max(1, items.length)
                  const share = items.length > 0 ? (weight / denom) * 100 : 0
                  if (share <= 0) return null
                  const detail =
                    totalChars > 0
                      ? `${fmt(charsByKind[kind])} ${t('charsUnit')}`
                      : `${counts[kind]} ${t('count')}`
                  const label = `${t(groupLabels[kind])}: ${detail} (${share.toFixed(1)}%)`
                  return (
                    <button
                      key={kind}
                      type="button"
                      style={{ width: `${share}%`, background: ROLE_COLOR[kind] }}
                      title={label}
                      aria-label={label}
                      onClick={() => {
                        setLayout('categories')
                        setExpanded(new Set([kind]))
                      }}
                    />
                  )
                })}
          </div>
        </div>
        <button
          type="button"
          className={`ch-map-btn ${showMap ? 'is-active' : ''}`}
          aria-pressed={showMap}
          aria-label={t('treemapToggle')}
          title={t('treemapToggle')}
          onClick={() => setShowMap((value) => !value)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            aria-hidden="true"
          >
            <rect x="1.5" y="1.5" width="7.2" height="5.8" rx="1.1" />
            <rect x="10.2" y="1.5" width="4.3" height="5.8" rx="1.1" />
            <rect x="1.5" y="8.8" width="4.8" height="5.7" rx="1.1" />
            <rect x="7.8" y="8.8" width="6.7" height="5.7" rx="1.1" />
          </svg>
        </button>
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
                  {cat.h >= 15 && cat.w >= 8 && (
                    <button
                      type="button"
                      className="ch-map-cat-head"
                      onClick={() => {
                        const first = cat.blocks[0]
                        if (first) onJumpRecord(first.id)
                      }}
                    >
                      <span>{t(groupLabels[cat.kind])}</span>
                      {cat.w >= 14 && <b>{Math.round(cat.share)}%</b>}
                    </button>
                  )}
                  <div className="ch-map-cat-body">
                    {cat.blocks.map((block) => {
                      const showLabel = block.w * cat.w >= 480 && block.h * cat.h >= 420
                      const showNum = block.w * cat.w >= 640 && block.h * cat.h >= 850
                      return (
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
                          aria-label={`#${block.seq} ${block.label} · ${fmt(block.chars)} ${t('charsUnit')}`}
                          onClick={() => onJumpRecord(block.id)}
                        >
                          {showLabel && (
                            <span className="ch-map-lbl">
                              #{block.seq} {block.label}
                            </span>
                          )}
                          {showNum && (
                            <span className="ch-map-num">
                              {fmt(block.chars)} {t('charsUnit')}
                            </span>
                          )}
                        </button>
                      )
                    })}
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

      {layout === 'split' ? (
        <div className="ch-split-browser" aria-busy={loading || filteringPending}>
          <div className="ch-split-left" ref={splitLeftRef}>
            {loading && items.length === 0 ? (
              <p className="ch-note">{t('historyLoading')}</p>
            ) : rows.length === 0 ? (
              <p className="ch-note">
                {t(!available ? 'unavailable' : query || errorsOnly ? 'noMatches' : 'noHistory')}
              </p>
            ) : (
              rows.map((row) => renderRow(row, false))
            )}
          </div>
          <div className="ch-split-right">
            {selected && selectedDetail ? (
              <InlineRecordDetail
                key={selected.id}
                item={selected}
                title={selectedDetail.label}
                pairedItem={selectedDetail.paired}
                callArgs={selectedDetail.callArgs}
                onFocus={onJumpRecord}
                t={t}
              />
            ) : (
              <p className="ch-note">{t('noHistory')}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="ch-browser-records" aria-busy={loading || filteringPending}>
          {loading && items.length === 0 ? (
            <p className="ch-note">{t('historyLoading')}</p>
          ) : rows.length === 0 ? (
            <p className="ch-note">
              {t(!available ? 'unavailable' : query || errorsOnly ? 'noMatches' : 'noHistory')}
            </p>
          ) : layout === 'categories' ? (
            (['tool', 'assistant', 'user', 'event'] as const).map((kind) => {
              const group = groupsByKind[kind]
              if (
                (filter === 'messages' && kind !== 'user' && kind !== 'assistant') ||
                (filter !== 'messages' && filter !== 'all' && filter !== kind)
              )
                return null
              const groupChars = group.reduce((sum, entry) => sum + entry.text.length, 0)
              const share =
                totalChars > 0
                  ? Math.round((groupChars / totalChars) * 100)
                  : items.length > 0
                    ? Math.round((group.length / items.length) * 100)
                    : 0
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
                    {groupChars > 0 && (
                      <span className="ch-group-chars">
                        {fmt(groupChars)} {t('charsUnit')}
                      </span>
                    )}
                    <span className="ch-group-pct">{share}%</span>
                  </button>
                  {expanded.has(kind) && group.length > 0 && (
                    <div className="ch-group-body">{group.map((row) => renderRow(row, true))}</div>
                  )}
                </section>
              )
            })
          ) : (
            <div className="ch-group-body">{rows.map((row) => renderRow(row, true))}</div>
          )}
        </div>
      )}

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
