import { useCallback, useMemo, useRef, useState, type KeyboardEvent, type ReactElement } from 'react'
import type { SessionRow } from './api.ts'
import { pairedRecordIds, summarizeActivity } from './activity.ts'
import { relatedSessions } from './relationships.ts'
import { ActivityTimeline, SessionNetworkCard } from './ActivityPanels.tsx'
import {
  CommandExecutionsCard,
  FileActivityCard,
  type FileFilter,
} from './ActivityCards.tsx'
import { ContextStatsCard } from './ContextStatsCard.tsx'
import { filterHistoryRecords, RecordBrowser, type RecordFilter } from './RecordBrowser.tsx'
import { ContextCard, PerformanceCard, UsageCard } from './components.tsx'
import type { useHistory, useUsage } from './hooks.ts'
import type { Translate } from './i18n.ts'

function isEditableTarget(event: KeyboardEvent<HTMLDivElement>): boolean {
  const path = event.nativeEvent.composedPath?.() ?? [event.target]
  for (const node of path) {
    if (!(node instanceof HTMLElement)) continue
    const tag = node.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || node.isContentEditable)
      return true
  }
  return false
}

export function Inspector({
  usage,
  history,
  rows,
  selected,
  currentTitle,
  currentHarness,
  onSelect,
  retry,
  t,
}: {
  usage: ReturnType<typeof useUsage>
  history: ReturnType<typeof useHistory>
  rows: readonly SessionRow[]
  selected: string
  currentTitle: string
  currentHarness: string
  onSelect: (id: string) => void
  retry: () => void
  t: Translate
}): ReactElement {
  const root = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [focus, setFocus] = useState<string | undefined>()
  const [filter, setFilter] = useState<RecordFilter>('all')
  const [query, setQuery] = useState('')
  const [errorsOnly, setErrorsOnly] = useState(false)
  const [fileFilter, setFileFilter] = useState<FileFilter>('all')
  const [cmdProgram, setCmdProgram] = useState<string | null>(null)
  const summary = useMemo(
    () => (history.page ? summarizeActivity(history.page.items) : null),
    [history.page],
  )
  const related = useMemo(() => relatedSessions(rows, selected), [rows, selected])
  const items = history.page?.items ?? []
  const pairs = useMemo(() => pairedRecordIds(items), [items])
  const toolByRecord = useMemo(() => {
    const map = new Map<string, string>()
    for (const tool of summary?.tools ?? []) for (const id of tool.recordIds) map.set(id, tool.name)
    return map
  }, [summary])
  const reveal = useCallback((selector: string): void => {
    requestAnimationFrame(() =>
      root.current?.querySelector(selector)?.scrollIntoView({ block: 'nearest' }),
    )
  }, [])
  const focusRecord = useCallback(
    (id: string, open = true): void => {
      setFocus(id)
      setFilter('all')
      setQuery('')
      setErrorsOnly(false)
      if (open) reveal('.ch-browser-card')
    },
    [reveal],
  )
  const filteredItems = useMemo(
    () => filterHistoryRecords(items, filter, query, errorsOnly, toolByRecord, t),
    [items, filter, query, errorsOnly, toolByRecord, t],
  )
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const editable = isEditableTarget(event)
    if (event.key === 'Escape') {
      const fromBrowserSearch = event.target === searchInputRef.current
      if ((!editable || fromBrowserSearch) && (query || errorsOnly || filter !== 'all')) {
        event.preventDefault()
        setQuery('')
        setErrorsOnly(false)
        setFilter('all')
      }
      return
    }
    if (editable) return
    if (event.key === '/') {
      event.preventDefault()
      searchInputRef.current?.focus()
      reveal('.ch-browser-card')
      return
    }
    if ((event.key === '[' || event.key === ']') && filteredItems.length > 0) {
      event.preventDefault()
      const currentIndex = filteredItems.findIndex((item) => item.id === focus)
      const base = currentIndex < 0 ? filteredItems.length - 1 : currentIndex
      const next =
        event.key === '[' ? Math.max(0, base - 1) : Math.min(filteredItems.length - 1, base + 1)
      if (filteredItems[next]) setFocus(filteredItems[next].id)
    }
  }
  return (
    <div className="ch-inspector" ref={root} tabIndex={-1} onKeyDown={handleKeyDown}>
      <ContextStatsCard
        usage={usage.usage}
        summary={summary}
        items={items}
        related={related}
        onJumpTimeline={() => reveal('.ch-activity-timeline')}
        onJumpBrowser={(nextFilter) => {
          setFilter(nextFilter)
          setQuery('')
          setErrorsOnly(false)
          reveal('.ch-browser-card')
        }}
        onJumpTool={(toolName) => {
          setFilter('tool')
          setQuery(`tool:${toolName}`)
          setErrorsOnly(false)
          reveal('.ch-browser-card')
        }}
        onJumpErrors={() => {
          setFilter('all')
          setQuery('')
          setErrorsOnly(true)
          reveal('.ch-browser-card')
        }}
        onJumpFiles={(nextFileFilter = 'all') => {
          setFileFilter(nextFileFilter)
          reveal('.ch-file-card')
        }}
        onJumpCommands={() => {
          setCmdProgram(null)
          reveal('.ch-command-card')
        }}
        onJumpProgram={(program) => {
          setCmdProgram(program)
          reveal('.ch-command-card')
        }}
        onJumpNetwork={() => reveal('.ch-family-card')}
        t={t}
      />

      <div className="ch-pair-grid">
        <UsageCard usage={usage.usage} t={t} />
        <PerformanceCard
          usage={usage.usage}
          items={items}
          onSelectRecord={(id) => focusRecord(id, true)}
          t={t}
        />
      </div>

      <div className="ch-workbench">
        <div className="ch-workbench-left">
          <ContextCard
            usage={usage.usage}
            samples={usage.samples}
            harness={currentHarness}
            t={t}
          />
          <ActivityTimeline
            items={items}
            pairs={pairs}
            available={history.page !== null}
            loading={history.loading}
            focus={focus}
            onFocus={(id) => focusRecord(id, false)}
            t={t}
          />
        </div>
        <RecordBrowser
          items={items}
          pairs={pairs}
          available={history.page !== null}
          toolByRecord={toolByRecord}
          focus={focus}
          onFocus={setFocus}
          onJumpRecord={(id) => focusRecord(id, false)}
          filter={filter}
          onFilter={setFilter}
          query={query}
          onQuery={setQuery}
          errorsOnly={errorsOnly}
          onErrorsOnly={setErrorsOnly}
          loading={history.loading}
          error={history.error}
          hasMore={history.page?.hasMore ?? false}
          older={history.older}
          latest={history.latest}
          isOlder={history.isOlder}
          retry={retry}
          searchInputRef={searchInputRef}
          t={t}
        />
      </div>

      <FileActivityCard
        summary={summary}
        items={items}
        filter={fileFilter}
        onFilter={setFileFilter}
        onFocus={focusRecord}
        t={t}
      />

      <CommandExecutionsCard
        summary={summary}
        items={items}
        selectedProgram={cmdProgram}
        onSelectProgram={setCmdProgram}
        onFocus={focusRecord}
        t={t}
      />

      <SessionNetworkCard
        related={related}
        currentTitle={currentTitle}
        currentHarness={currentHarness}
        currentUsage={usage.usage}
        onSelect={onSelect}
        t={t}
      />

      <p className="ch-data-note">ⓘ {t('limitsNote')}</p>
    </div>
  )
}
