import {
  Fragment,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
} from 'react'
import type { HistoryItem } from './api.ts'
import { Card, RecordBadges, RecordNotices } from './components.tsx'
import { RichText } from './RichText.tsx'
import { fmt, fmtTime } from '../client/format.ts'
import { ROLE_COLOR } from './ActivityPanels.tsx'
import type { Translate } from './i18n.ts'
import { previewLine } from './format.ts'
import {
  findTextMatches,
  layoutRecordTreemap,
  parseRecordArguments,
  type TextMatch,
} from './treemap.ts'

export type RecordFilter = 'all' | 'messages' | 'tool' | 'event'

export function filterHistoryRecords(
  items: readonly HistoryItem[],
  filter: RecordFilter,
  query: string,
  errorsOnly: boolean,
  toolByRecord: ReadonlyMap<string, string>,
  t: Translate,
): HistoryItem[] {
  const needle = query.trim().toLocaleLowerCase()
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
}

function labelOf(item: HistoryItem, tool: string | undefined, t: Translate): string {
  if (item.kind === 'user' || item.kind === 'assistant')
    return previewLine(item.text) || t(item.kind)
  if (item.eventType === 'tool/call' && item.arguments) {
    const parsed = parseRecordArguments(item.arguments)
    const primary = parsed?.find(([key]) =>
      ['command', 'cmd', 'path', 'file_path', 'filePath', 'pattern', 'description'].includes(key),
    )
    if (primary) return previewLine(primary[1], 90)
  }
  return tool ?? item.toolName ?? (item.eventType === 'tool/result' ? t('toolOutput') : item.title)
}

function lineCountOf(text: string): number {
  if (!text) return 0
  return text.split(/\r\n|\r|\n/).length
}

function HighlightedSource({
  text,
  matches,
  activeIndex,
}: {
  text: string
  matches: readonly TextMatch[]
  activeIndex: number
}): ReactElement {
  const currentRef = useRef<HTMLElement>(null)
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, matches])
  if (matches.length === 0) return <>{text}</>
  const parts: ReactElement[] = []
  let cursor = 0
  for (let index = 0; index < matches.length; index++) {
    const match = matches[index]
    if (match.start > cursor) {
      parts.push(<Fragment key={`t-${index}`}>{text.slice(cursor, match.start)}</Fragment>)
    }
    const isCurrent = index === activeIndex
    parts.push(
      <mark
        key={`m-${index}`}
        ref={isCurrent ? currentRef : undefined}
        className={`ch-find-mark ${isCurrent ? 'is-current' : ''}`}
      >
        {text.slice(match.start, match.end)}
      </mark>,
    )
    cursor = match.end
  }
  if (cursor < text.length) parts.push(<Fragment key="tail">{text.slice(cursor)}</Fragment>)
  return <>{parts}</>
}

function InlineRecordDetail({
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
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const [findOpen, setFindOpen] = useState(false)
  const [findQuery, setFindQuery] = useState('')
  const [findIndex, setFindIndex] = useState(0)
  const source = item.arguments ?? item.text
  const matches = useMemo(
    () => (findOpen && findQuery.trim() ? findTextMatches(source, findQuery) : []),
    [findOpen, findQuery, source],
  )
  const boundedIndex = matches.length > 0 ? ((findIndex % matches.length) + matches.length) % matches.length : 0
  const callRecord =
    item.eventType === 'tool/call'
      ? item
      : pairedItem?.eventType === 'tool/call'
        ? pairedItem
        : undefined
  const callArgs = useMemo(() => parseRecordArguments(callRecord?.arguments), [callRecord?.arguments])
  const callStatus: 'err' | 'ok' | 'pending' | null =
    item.kind !== 'tool'
      ? null
      : item.isError === true || pairedItem?.isError === true
        ? 'err'
        : item.isError === false || pairedItem?.isError === false
          ? 'ok'
          : 'pending'
  const lineCount = lineCountOf(source)
  const bodyLabel =
    item.eventType === 'tool/result'
      ? t('resultOutput')
      : item.eventType === 'tool/call'
        ? t('argumentsLabel')
        : item.kind === 'user'
          ? t('userMessages')
          : item.kind === 'assistant'
            ? t('assistantMessages')
            : t('event')
  return (
    <section className="ch-record-detail ch-br-inline" aria-label={t('recordDetails')}>
      <div className="ch-record-meta">
        <span>#{item.seq}</span>
        <span title={t('recordTime')}>
          {item.time === undefined ? t('unavailable') : fmtTime(item.time)}
        </span>
        {item.eventType && <span>{item.eventType}</span>}
        {item.callId && <span title={item.callId}>Call ID · {item.callId}</span>}
        <RecordBadges item={item} t={t} />
        {pairedItem && (
          <button
            type="button"
            className="ch-mini-button ch-pair-jump"
            onClick={() => onFocus(pairedItem.id)}
          >
            {pairedItem.eventType === 'tool/result'
              ? `${t('jumpResult')} ↗`
              : `${t('jumpCall')} ↖`}
          </button>
        )}
      </div>
      <RecordNotices item={item} t={t} />
      {callRecord && callArgs && (
        <div className="ch-ts-card">
          <div className="ch-ts-head">
            <span className="ch-ts-call-name" title={title}>
              {item.eventType === 'tool/result' ? '←' : '→'}{' '}
              {callRecord.toolName ?? callRecord.title}
            </span>
            <div className="ch-ts-right">
              <span className="ch-ts-meta">
                #{callRecord.seq}
                {pairedItem && item.eventType === 'tool/call' ? ` → #${pairedItem.seq}` : ''}
              </span>
              {callStatus === 'ok' && (
                <span className="ch-call-state is-ok">
                  <i />
                  {t('statusOk')}
                </span>
              )}
              {callStatus === 'err' && (
                <span className="ch-call-state is-err">
                  <i />
                  {t('failed')}
                </span>
              )}
            </div>
          </div>
          <div className="ch-ts-args">
            {callArgs.map(([key, value]) => (
              <div key={key} className="ch-ts-arg-row">
                <span className="ch-ts-arg-key">{key}</span>
                <span className="ch-ts-arg-val">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="ch-ts-card">
        <div className="ch-ts-head">
          <span>{bodyLabel}</span>
          <div className="ch-ts-right">
            <span className="ch-ts-meta">
              {lineCount} {t('linesUnit')}
            </span>
            <button
              type="button"
              className={`ch-mini-button ch-find-toggle ${findOpen ? 'is-active' : ''}`}
              aria-pressed={findOpen}
              title={t('findInRecord')}
              aria-label={t('findInRecord')}
              onClick={() => {
                const next = !findOpen
                setFindOpen(next)
                if (next) setRich(false)
                else {
                  setFindQuery('')
                  setFindIndex(0)
                }
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7.5" />
                <path d="m20.5 20.5-4.2-4.2" />
              </svg>
            </button>
            <div className="ch-seg" role="group">
              <button
                type="button"
                className={rich ? 'is-active' : ''}
                aria-pressed={rich}
                onClick={() => {
                  setRich(true)
                  setFindOpen(false)
                  setFindQuery('')
                  setFindIndex(0)
                }}
              >
                {t('renderedText')}
              </button>
              <button
                type="button"
                className={!rich ? 'is-active' : ''}
                aria-pressed={!rich}
                onClick={() => setRich(false)}
              >
                {t('sourceText')}
              </button>
            </div>
            <button
              type="button"
              className="ch-mini-button"
              onClick={() => {
                if (!navigator.clipboard?.writeText) {
                  setCopied('failed')
                  return
                }
                void navigator.clipboard
                  .writeText(item.text)
                  .then(() => setCopied('done'))
                  .catch(() => setCopied('failed'))
              }}
            >
              {t(copied === 'done' ? 'copied' : copied === 'failed' ? 'copyFailed' : 'copyRecord')}
            </button>
          </div>
        </div>
        {findOpen && (
          <div className="ch-find-bar">
            <input
              value={findQuery}
              onChange={(event) => {
                setFindQuery(event.target.value)
                setFindIndex(0)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.stopPropagation()
                  event.preventDefault()
                  setFindOpen(false)
                  setFindQuery('')
                  setFindIndex(0)
                }
              }}
              placeholder={t('findPlaceholder')}
              aria-label={t('findPlaceholder')}
              autoFocus
            />
            <span className="ch-find-count">
              {matches.length > 0 ? `${boundedIndex + 1}/${matches.length}` : '0/0'}
            </span>
            <button
              type="button"
              className="ch-mini-button"
              disabled={matches.length === 0}
              aria-label={t('findPrev')}
              onClick={() => setFindIndex((value) => value - 1)}
            >
              ↑
            </button>
            <button
              type="button"
              className="ch-mini-button"
              disabled={matches.length === 0}
              aria-label={t('findNext')}
              onClick={() => setFindIndex((value) => value + 1)}
            >
              ↓
            </button>
            <button
              type="button"
              className="ch-mini-button"
              aria-label={t('closeFind')}
              onClick={() => {
                setFindOpen(false)
                setFindQuery('')
                setFindIndex(0)
              }}
            >
              ×
            </button>
          </div>
        )}
        <div className="ch-record-content">
          {item.text.length === 0 && !item.arguments ? (
            <p className="ch-note">{t('blank')}</p>
          ) : rich ? (
            <RichText text={item.text} t={t} />
          ) : findOpen && findQuery.trim() ? (
            <pre className="ch-source-text">
              <code>
                <HighlightedSource text={source} matches={matches} activeIndex={boundedIndex} />
              </code>
            </pre>
          ) : (
            <pre className="ch-source-text">
              <code>{source || '—'}</code>
            </pre>
          )}
        </div>
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
  searchInputRef,
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
  const rows = useMemo(
    () => filterHistoryRecords(items, filter, deferred, errorsOnly, toolByRecord, t),
    [items, filter, deferred, errorsOnly, toolByRecord, t],
  )
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
  const selectedIndex = rows.findIndex((item) => item.id === selected?.id)
  const renderRow = (item: HistoryItem): ReactElement => {
    const tool = toolByRecord.get(item.id)
    const isSelected = selected?.id === item.id
    const tag = item.toolName ?? tool
    const paired = itemById.get(pairs.get(item.id) ?? '')
    return (
      <div
        key={item.id}
        className={`ch-br-elem ${isSelected ? 'is-selected' : ''} ${item.isError === true ? 'is-error-row' : ''}`}
      >
        <button
          type="button"
          className={`ch-record-item ch-record-${item.kind} ${isSelected ? 'is-selected' : ''} ${item.isError === true ? 'is-error-row' : ''}`}
          aria-expanded={isSelected}
          aria-pressed={isSelected}
          title={labelOf(item, tool, t)}
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
          <span className="ch-record-title">{labelOf(item, tool, t)}</span>
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
            title={labelOf(item, tool, t)}
            pairedItem={paired}
            onFocus={onJumpRecord}
            t={t}
          />
        )}
      </div>
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
              {t(loading ? 'historyLoading' : 'older')}
            </button>
          )}
        </div>
      </footer>
    </Card>
  )
}
