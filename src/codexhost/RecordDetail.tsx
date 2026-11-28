import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import { createPortal } from 'react-dom'
import { fmtTime } from '../client/format.ts'
import type { HistoryItem } from './api.ts'
import { RecordBadges, RecordNotices } from './components.tsx'
import type { Translate } from './i18n.ts'
import { parseLosslessJson } from './json-view.ts'
import { JsonViewer } from './JsonViewer.tsx'
import { RichText } from './RichText.tsx'
import { findTextMatches, type TextMatch } from './treemap.ts'

type ViewMode = 'rich' | 'raw' | 'json'

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

export function InlineRecordDetail({
  item,
  title,
  pairedItem,
  callArgs,
  onFocus,
  t,
}: {
  item: HistoryItem
  title: string
  pairedItem?: HistoryItem
  callArgs: Array<[string, string]> | null
  onFocus: (id: string) => void
  t: Translate
}): ReactElement {
  const [viewMode, setViewMode] = useState<ViewMode>(
    item.kind === 'user' || item.kind === 'assistant' ? 'rich' : 'raw',
  )
  const [copied, setCopied] = useState<'idle' | 'done' | 'failed'>('idle')
  const [findOpen, setFindOpen] = useState(false)
  const [findQuery, setFindQuery] = useState('')
  const [findIndex, setFindIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const source = item.arguments ?? item.text
  const parsedJson = useMemo(() => parseLosslessJson(source), [source])
  const effectiveMode: ViewMode = viewMode === 'json' && !parsedJson ? 'raw' : viewMode
  const matches = useMemo(
    () => (findOpen && findQuery.trim() ? findTextMatches(source, findQuery) : []),
    [findOpen, findQuery, source],
  )
  const boundedIndex =
    matches.length > 0 ? ((findIndex % matches.length) + matches.length) % matches.length : 0
  const callRecord =
    item.eventType === 'tool/call'
      ? item
      : pairedItem?.eventType === 'tool/call'
        ? pairedItem
        : undefined
  const callStatus: 'err' | 'ok' | 'pending' | null =
    item.kind !== 'tool'
      ? null
      : item.isError === true || pairedItem?.isError === true
        ? 'err'
        : item.isError === false || pairedItem?.isError === false
          ? 'ok'
          : 'pending'
  const lineCount = useMemo(() => lineCountOf(source), [source])
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

  const closeFind = (): void => {
    setFindOpen(false)
    setFindQuery('')
    setFindIndex(0)
    if (modalOpen) dialogRef.current?.focus()
  }

  const closeModal = (): void => {
    setModalOpen(false)
    requestAnimationFrame(() => expandButtonRef.current?.focus())
  }

  useEffect(() => {
    if (!modalOpen) return
    const doc = sectionRef.current?.ownerDocument ?? document
    const onDocKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      event.preventDefault()
      if (findOpen) {
        setFindOpen(false)
        setFindQuery('')
        setFindIndex(0)
        dialogRef.current?.focus()
      } else {
        setModalOpen(false)
        requestAnimationFrame(() => expandButtonRef.current?.focus())
      }
    }
    doc.addEventListener('keydown', onDocKeyDown, true)
    return () => doc.removeEventListener('keydown', onDocKeyDown, true)
  }, [modalOpen, findOpen])

  const copySource = (): void => {
    if (!navigator.clipboard?.writeText) {
      setCopied('failed')
      return
    }
    void navigator.clipboard
      .writeText(source)
      .then(() => setCopied('done'))
      .catch(() => setCopied('failed'))
  }

  const toggleFind = (): void => {
    if (findOpen) closeFind()
    else {
      setFindOpen(true)
      setViewMode('raw')
    }
  }

  const renderModeBar = (): ReactElement => (
    <div className="ch-seg" role="group">
      <button
        type="button"
        className={effectiveMode === 'rich' ? 'is-active' : ''}
        aria-pressed={effectiveMode === 'rich'}
        onClick={() => {
          setViewMode('rich')
          setFindOpen(false)
          setFindQuery('')
          setFindIndex(0)
        }}
      >
        {t('renderedText')}
      </button>
      <button
        type="button"
        className={effectiveMode === 'raw' ? 'is-active' : ''}
        aria-pressed={effectiveMode === 'raw'}
        onClick={() => setViewMode('raw')}
      >
        {t('sourceText')}
      </button>
      {parsedJson && (
        <button
          type="button"
          className={effectiveMode === 'json' ? 'is-active' : ''}
          aria-pressed={effectiveMode === 'json'}
          onClick={() => {
            setViewMode('json')
            setFindOpen(false)
            setFindQuery('')
            setFindIndex(0)
          }}
        >
          {t('jsonView')}
        </button>
      )}
    </div>
  )

  const renderFindBar = (): ReactElement | null =>
    findOpen ? (
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
              closeFind()
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
          onClick={closeFind}
        >
          ×
        </button>
      </div>
    ) : null

  const renderBody = (): ReactElement => {
    if (item.text.length === 0 && !item.arguments) return <p className="ch-note">{t('blank')}</p>
    if (effectiveMode === 'rich') return <RichText text={item.text} t={t} />
    if (effectiveMode === 'json' && parsedJson) {
      return (
        <>
          <JsonViewer node={parsedJson} />
          <p className="ch-note ch-json-note">{t('jsonLosslessNote')}</p>
        </>
      )
    }
    if (findOpen && findQuery.trim()) {
      return (
        <pre className="ch-source-text">
          <code>
            <HighlightedSource text={source} matches={matches} activeIndex={boundedIndex} />
          </code>
        </pre>
      )
    }
    return (
      <pre className="ch-source-text">
        <code>{source || '—'}</code>
      </pre>
    )
  }

  const portalTarget = modalOpen ? sectionRef.current?.closest('.ch-context') ?? null : null
  const readerDialog = modalOpen ? (
    <div
      className="ch-reader-backdrop"
      onClick={(event) => {
        if (event.target === event.currentTarget) closeModal()
      }}
      onKeyDown={(event) => {
        event.stopPropagation()
        if (event.key === 'Escape') {
          event.preventDefault()
          if (findOpen) closeFind()
          else closeModal()
        }
      }}
    >
      <div
        ref={dialogRef}
        className="ch-reader-dialog"
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        aria-label={`${title} · #${item.seq}`}
      >
        <header className="ch-reader-head">
          <div className="ch-reader-title">
            <b>#{item.seq}</b>
            <span>{title}</span>
            {item.eventType && <small>{item.eventType}</small>}
          </div>
          <div className="ch-ts-right">
            <button
              type="button"
              className={`ch-mini-button ch-find-toggle ${findOpen ? 'is-active' : ''}`}
              aria-pressed={findOpen}
              aria-label={t('findInRecord')}
              onClick={toggleFind}
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
            {renderModeBar()}
            <button type="button" className="ch-mini-button" onClick={copySource}>
              {t(
                copied === 'done'
                  ? 'copied'
                  : copied === 'failed'
                    ? 'copyFailed'
                    : 'copyRecord',
              )}
            </button>
            <button
              type="button"
              className="ch-mini-button"
              aria-label={t('closeReader')}
              autoFocus
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </header>
        {renderFindBar()}
        <div className="ch-reader-body">{renderBody()}</div>
      </div>
    </div>
  ) : null

  return (
    <section
      ref={sectionRef}
      className="ch-record-detail ch-br-inline"
      aria-label={t('recordDetails')}
    >
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
              onClick={toggleFind}
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
            <button
              ref={expandButtonRef}
              type="button"
              className="ch-mini-button ch-expand-toggle"
              title={t('expandReader')}
              aria-label={t('expandReader')}
              onClick={() => setModalOpen(true)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                aria-hidden="true"
              >
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>
            {renderModeBar()}
            <button type="button" className="ch-mini-button" onClick={copySource}>
              {t(copied === 'done' ? 'copied' : copied === 'failed' ? 'copyFailed' : 'copyRecord')}
            </button>
          </div>
        </div>
        {!modalOpen && renderFindBar()}
        <div className="ch-record-content">{!modalOpen && renderBody()}</div>
      </div>

      {readerDialog && (portalTarget ? createPortal(readerDialog, portalTarget) : readerDialog)}
    </section>
  )
}
