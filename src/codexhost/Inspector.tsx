import {
  useCallback,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactElement,
} from 'react'
import type { HistoryItem, SessionRow } from './api.ts'
import { pairedRecordIds, summarizeActivity, type ActivitySummary } from './activity.ts'
import { relatedSessions } from './relationships.ts'
import { ActivityTimeline, SessionNetworkCard } from './ActivityPanels.tsx'
import {
  CommandExecutionsCard,
  FileActivityCard,
  type FileFilter,
} from './ActivityCards.tsx'
import { ContextStatsCard } from './ContextStatsCard.tsx'
import { RecordBrowser } from './RecordBrowser.tsx'
import { buildRecordIndex, filterIndexedRecords, type RecordFilter } from './record-index.ts'
import { ContextCard, PerformanceCard, UsageCard } from './components.tsx'
import type { useHistory, useUsage } from './hooks.ts'
import type { Translate } from './i18n.ts'

const EMPTY_ITEMS: readonly HistoryItem[] = []

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
  summary: providedSummary,
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
  summary?: ActivitySummary | null
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
  const deferredQuery = useDeferredValue(query)
  const fallbackSummary = useMemo(
    () =>
      providedSummary !== undefined
        ? providedSummary
        : history.page
          ? summarizeActivity(history.page.items)
          : null,
    [providedSummary, history.page],
  )
  const summary = providedSummary !== undefined ? providedSummary : fallbackSummary
  const related = useMemo(() => relatedSessions(rows, selected), [rows, selected])
  const items = history.page?.items ?? EMPTY_ITEMS
  const pairs = useMemo(() => pairedRecordIds(items), [items])
  const toolByRecord = useMemo(() => {
    const map = new Map<string, string>()
    for (const tool of summary?.tools ?? []) for (const id of tool.recordIds) map.set(id, tool.name)
    return map
  }, [summary])
  const recordIndex = useMemo(
    () => buildRecordIndex(items, toolByRecord, t),
    [items, toolByRecord, t],
  )
  const filteredItems = useMemo(
    () => filterIndexedRecords(items, recordIndex, filter, deferredQuery, errorsOnly),
    [items, recordIndex, filter, deferredQuery, errorsOnly],
  )
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
  const selectRecord = useCallback((id: string) => focusRecord(id, true), [focusRecord])
  const focusInline = useCallback((id: string) => focusRecord(id, false), [focusRecord])
  const jumpTimeline = useCallback(() => reveal('.ch-activity-timeline'), [reveal])
  const jumpBrowser = useCallback(
    (nextFilter: RecordFilter) => {
      setFilter(nextFilter)
      setQuery('')
      setErrorsOnly(false)
      reveal('.ch-browser-card')
    },
    [reveal],
  )
  const jumpTool = useCallback(
    (toolName: string) => {
      setFilter('tool')
      setQuery(`tool:${toolName}`)
      setErrorsOnly(false)
      reveal('.ch-browser-card')
    },
    [reveal],
  )
  const jumpErrors = useCallback(() => {
    setFilter('all')
    setQuery('')
    setErrorsOnly(true)
    reveal('.ch-browser-card')
  }, [reveal])
  const jumpFiles = useCallback(
    (nextFileFilter: FileFilter = 'all') => {
      setFileFilter(nextFileFilter)
      reveal('.ch-file-card')
    },
    [reveal],
  )
  const jumpCommands = useCallback(() => {
    setCmdProgram(null)
    reveal('.ch-command-card')
  }, [reveal])
  const jumpProgram = useCallback(
    (program: string) => {
      setCmdProgram(program)
      reveal('.ch-command-card')
    },
    [reveal],
  )
  const jumpNetwork = useCallback(() => reveal('.ch-family-card'), [reveal])
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
        onJumpTimeline={jumpTimeline}
        onJumpBrowser={jumpBrowser}
        onJumpTool={jumpTool}
        onJumpErrors={jumpErrors}
        onJumpFiles={jumpFiles}
        onJumpCommands={jumpCommands}
        onJumpProgram={jumpProgram}
        onJumpNetwork={jumpNetwork}
        t={t}
      />

      <div className="ch-pair-grid">
        <UsageCard usage={usage.usage} t={t} />
        <PerformanceCard
          usage={usage.usage}
          items={items}
          onSelectRecord={selectRecord}
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
            onFocus={focusInline}
            t={t}
          />
        </div>
        <RecordBrowser
          items={items}
          filteredRows={filteredItems}
          recordIndex={recordIndex}
          isFiltering={query !== deferredQuery}
          pairs={pairs}
          available={history.page !== null}
          toolByRecord={toolByRecord}
          focus={focus}
          onFocus={setFocus}
          onJumpRecord={focusInline}
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
        onFocus={selectRecord}
        t={t}
      />

      <CommandExecutionsCard
        summary={summary}
        items={items}
        selectedProgram={cmdProgram}
        onSelectProgram={setCmdProgram}
        onFocus={selectRecord}
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
