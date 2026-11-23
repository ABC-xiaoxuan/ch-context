import { useMemo, useRef, useState, type ReactElement } from 'react'
import type { SessionRow } from './api.ts'
import { summarizeActivity } from './activity.ts'
import { relatedSessions } from './relationships.ts'
import {
  ActivityStats,
  ActivityTimeline,
  CommandActivityCard,
  FamilyCard,
  FileActivityCard,
} from './ActivityPanels.tsx'
import { RecordBrowser, type RecordFilter } from './RecordBrowser.tsx'
import { ContextCard, PerformanceCard, TimelineCard, UsageCard } from './components.tsx'
import type { useHistory, useUsage } from './hooks.ts'
import type { Translate } from './i18n.ts'

export function Inspector({
  usage,
  history,
  rows,
  selected,
  onSelect,
  retry,
  t,
}: {
  usage: ReturnType<typeof useUsage>
  history: ReturnType<typeof useHistory>
  rows: readonly SessionRow[]
  selected: string
  onSelect: (id: string) => void
  retry: () => void
  t: Translate
}): ReactElement {
  const root = useRef<HTMLDivElement>(null)
  const [focus, setFocus] = useState<string | undefined>()
  const [filter, setFilter] = useState<RecordFilter>('all')
  const [query, setQuery] = useState('')
  const summary = useMemo(
    () => (history.page ? summarizeActivity(history.page.items) : null),
    [history.page],
  )
  const related = useMemo(() => relatedSessions(rows, selected), [rows, selected])
  const items = history.page?.items ?? []
  const toolByRecord = useMemo(() => {
    const map = new Map<string, string>()
    for (const tool of summary?.tools ?? []) for (const id of tool.recordIds) map.set(id, tool.name)
    return map
  }, [summary])
  const reveal = (): void => {
    requestAnimationFrame(() =>
      root.current?.querySelector('.ch-browser-card')?.scrollIntoView({ block: 'nearest' }),
    )
  }
  const focusRecord = (id: string, open = true): void => {
    setFocus(id)
    setFilter('all')
    setQuery('')
    if (open) reveal()
  }
  return (
    <div className="ch-inspector" ref={root}>
      <ActivityStats
        summary={summary}
        t={t}
        onTool={(tool) => {
          setFilter('tool')
          setQuery(`tool:${tool}`)
          reveal()
        }}
        onKind={(kind) => {
          setFilter(kind)
          setQuery('')
          reveal()
        }}
      />
      <div className="ch-dashboard">
        <UsageCard usage={usage.usage} t={t} />
        <PerformanceCard usage={usage.usage} t={t} />
      </div>
      <div className="ch-workbench">
        <ContextCard usage={usage.usage} t={t} />
        <ActivityTimeline
          items={items}
          available={history.page !== null}
          loading={history.loading}
          focus={focus}
          onFocus={(id) => focusRecord(id, false)}
          t={t}
        />
        <RecordBrowser
          items={items}
          available={history.page !== null}
          toolByRecord={toolByRecord}
          focus={focus}
          onFocus={setFocus}
          filter={filter}
          onFilter={setFilter}
          query={query}
          onQuery={setQuery}
          loading={history.loading}
          error={history.error}
          hasMore={history.page?.hasMore ?? false}
          older={history.older}
          latest={history.latest}
          isOlder={history.isOlder}
          retry={retry}
          t={t}
        />
        <FileActivityCard summary={summary} onFocus={focusRecord} t={t} />
        <CommandActivityCard summary={summary} onFocus={focusRecord} t={t} />
        <FamilyCard related={related} onSelect={onSelect} t={t} />
        <details className="ch-observations">
          <summary>
            {t('observationsDetail')}
            <span>{usage.samples.length}</span>
          </summary>
          <TimelineCard samples={usage.samples} t={t} />
        </details>
      </div>
      <p className="ch-data-note">ⓘ {t('limitsNote')}</p>
    </div>
  )
}
