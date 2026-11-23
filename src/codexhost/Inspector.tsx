import { useMemo, useRef, useState, type ReactElement } from 'react'
import type { SessionRow } from './api.ts'
import { pairedRecordIds, summarizeActivity } from './activity.ts'
import { relatedSessions } from './relationships.ts'
import { ActivityTimeline, SignalsCard, type SignalTab } from './ActivityPanels.tsx'
import { RecordBrowser, type RecordFilter } from './RecordBrowser.tsx'
import { ContextCard, PerformanceCard, UsageCard } from './components.tsx'
import type { useHistory, useUsage } from './hooks.ts'
import type { Translate } from './i18n.ts'

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
  const [focus, setFocus] = useState<string | undefined>()
  const [filter, setFilter] = useState<RecordFilter>('all')
  const [query, setQuery] = useState('')
  const [errorsOnly, setErrorsOnly] = useState(false)
  const [signalTab, setSignalTab] = useState<SignalTab>('files')
  const summary = useMemo(
    () => (history.page ? summarizeActivity(history.page.items) : null),
    [history.page],
  )
  const related = useMemo(() => relatedSessions(rows, selected), [rows, selected])
  const items = history.page?.items ?? []
  const pairs = useMemo(() => pairedRecordIds(items), [items])
  const errorCount = useMemo(() => items.filter((item) => item.isError === true).length, [items])
  const toolByRecord = useMemo(() => {
    const map = new Map<string, string>()
    for (const tool of summary?.tools ?? []) for (const id of tool.recordIds) map.set(id, tool.name)
    return map
  }, [summary])
  const reveal = (selector: string): void => {
    requestAnimationFrame(() =>
      root.current?.querySelector(selector)?.scrollIntoView({ block: 'nearest' }),
    )
  }
  const focusRecord = (id: string, open = true): void => {
    setFocus(id)
    setFilter('all')
    setQuery('')
    setErrorsOnly(false)
    if (open) reveal('.ch-browser-card')
  }
  return (
    <div className="ch-inspector" ref={root}>
      <div className="ch-hero-grid">
        <ContextCard usage={usage.usage} samples={usage.samples} t={t} />
        <UsageCard usage={usage.usage} t={t} />
        <PerformanceCard
          usage={usage.usage}
          summary={summary}
          errorCount={errorCount}
          onKind={(kind) => {
            setFilter(kind)
            setQuery('')
            setErrorsOnly(false)
            reveal('.ch-browser-card')
          }}
          onSignalTab={(tab) => {
            setSignalTab(tab)
            reveal('.ch-signals-card')
          }}
          onErrors={() => {
            setFilter('all')
            setQuery('')
            setErrorsOnly(true)
            reveal('.ch-browser-card')
          }}
          t={t}
        />
      </div>
      <div className="ch-workbench">
        <div className="ch-workbench-left">
          <ActivityTimeline
            items={items}
            pairs={pairs}
            available={history.page !== null}
            loading={history.loading}
            focus={focus}
            onFocus={(id) => focusRecord(id, false)}
            t={t}
          />
          <SignalsCard
            tab={signalTab}
            onTab={setSignalTab}
            summary={summary}
            related={related}
            currentTitle={currentTitle}
            currentHarness={currentHarness}
            items={items}
            onFocus={focusRecord}
            onSelect={onSelect}
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
          t={t}
        />
      </div>
      <p className="ch-data-note">ⓘ {t('limitsNote')}</p>
    </div>
  )
}
