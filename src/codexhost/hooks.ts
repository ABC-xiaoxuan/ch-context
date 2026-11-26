import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { CodexHostClient, type HistoryPage, type SessionPage, type SessionRow } from './api.ts'
import { BoundedLruCache, createBatchQueue, SessionUsageCache } from './cache.ts'
import { appendSample, isThreadId, recordOf, usageOf, type Sample, type Usage } from './model.ts'
import { observeUsageChanges } from './realtime.ts'

export interface Observable<T> {
  getSnapshot(): T
  subscribe(callback: () => void): () => void
}

export interface ViewContext {
  get(name: string): unknown
  locale: {
    getLocale?(): { active: string }
    subscribe?(callback: () => void): () => void
  }
}

export interface ClientContext extends ViewContext {
  locale: ViewContext['locale'] & {
    register(name: string, dictionaries: Record<string, Record<string, string>>): () => void
    bind(name: string): (key: string) => string
  }
  slots: {
    inject(name: string, factory: () => unknown): unknown
    register(options: Record<string, unknown>, component: (props: ViewProps) => unknown): unknown
  }
  effect(factory: () => (() => void) | void, label?: string): unknown
}

export interface ViewProps {
  sessionId?: string
  useProjection?: (key: string) => unknown
  [key: string]: unknown
}

const client = new CodexHostClient()
const absentSubscribe = (): (() => void) => () => undefined

function isDocumentHidden(): boolean {
  return typeof document !== 'undefined' && document.visibilityState === 'hidden'
}

export function useLocale(ctx: ViewContext): string {
  const subscribe = useCallback(
    (listener: () => void) => ctx.locale.subscribe?.(listener) ?? absentSubscribe(),
    [ctx],
  )
  const read = useCallback(() => ctx.locale.getLocale?.().active ?? 'en', [ctx])
  return useSyncExternalStore(subscribe, read, read)
}

export function useCurrentSession(ctx: ViewContext): string | undefined {
  const service = recordOf(ctx.get('uiSession'))
  const adapter = recordOf(service?.adapter)
  const current = adapter?.current as Observable<unknown> | undefined
  const subscribe = useCallback(
    (listener: () => void) => current?.subscribe(listener) ?? absentSubscribe(),
    [current],
  )
  const read = useCallback(() => {
    const key = recordOf(current?.getSnapshot())?.key
    return typeof key === 'string' ? key : undefined
  }, [current])
  return useSyncExternalStore(subscribe, read, read)
}

export function useSessions(
  cursor: string | null,
  revision: number,
): { page: SessionPage | null; loading: boolean; error: string | null } {
  const cacheRef = useRef<{ revision: number; pages: BoundedLruCache<string, SessionPage> } | null>(
    null,
  )
  if (!cacheRef.current || cacheRef.current.revision !== revision) {
    cacheRef.current = { revision, pages: new BoundedLruCache(10) }
  }
  const cacheKey = cursor ?? ''
  const cachedPage = cacheRef.current.pages.get(cacheKey) ?? null
  const [state, setState] = useState<{
    key: string
    page: SessionPage | null
    loading: boolean
    error: string | null
  }>({ key: '', page: null, loading: true, error: null })
  const key = `${cacheKey}:${revision}`
  useEffect(() => {
    const cached = cacheRef.current?.pages.get(cacheKey)
    if (cached) {
      setState({ key, page: cached, loading: false, error: null })
      return
    }
    const controller = new AbortController()
    setState({ key, page: null, loading: true, error: null })
    void client
      .listSessions(cursor, controller.signal)
      .then((page) => {
        if (!controller.signal.aborted) {
          cacheRef.current?.pages.set(cacheKey, page)
          setState({ key, page, loading: false, error: null })
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setState({
            key,
            page: null,
            loading: false,
            error: String(error instanceof Error ? error.message : error),
          })
      })
    return () => controller.abort()
  }, [cursor, cacheKey, key])
  if (state.key === key) return state
  if (cachedPage) return { page: cachedPage, loading: false, error: null }
  return { page: null, loading: true, error: null }
}

interface UsageState {
  id: string | undefined
  usage: Usage | null
  loading: boolean
  error: string | null
  connected: boolean
  samples: Sample[]
  updatedAt: number | null
  snapshotSequence: number
}

export function useUsage(
  id: string | undefined,
  projection: unknown,
  revision: number,
  enabled = true,
): UsageState {
  const source = useRef({ id, projection, generation: 0 })
  if (source.current.id !== id || source.current.projection !== projection) {
    source.current = { id, projection, generation: source.current.generation + 1 }
  }
  const [state, setState] = useState<UsageState>({
    id,
    usage: null,
    loading: Boolean(id && enabled),
    error: null,
    connected: true,
    samples: [],
    updatedAt: null,
    snapshotSequence: 0,
  })
  useEffect(() => {
    if (!enabled || projection === undefined || !id) return
    const usage = usageOf(projection)
    const time = Date.now()
    setState((previous) => ({
      id,
      usage,
      loading: false,
      error: null,
      connected: true,
      samples: appendSample(previous.id === id ? previous.samples : [], usage, time),
      updatedAt: time,
      snapshotSequence: (previous.id === id ? previous.snapshotSequence : 0) + 1,
    }))
  }, [id, projection, enabled])
  useEffect(() => {
    if (!enabled || !id) return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    let running = false
    let pending = false
    let sawDisconnect = false
    let deferredWhileHidden = false
    const load = async (): Promise<void> => {
      if (!id || controller.signal.aborted) return
      if (running) {
        pending = true
        return
      }
      running = true
      const generation = source.current.generation
      const current = (): boolean =>
        !controller.signal.aborted && source.current.generation === generation
      try {
        const value = await client.inspectUsage(id, controller.signal)
        if (!current()) return
        const usage = usageOf(value)
        const time = Date.now()
        setState((previous) =>
          current()
            ? {
                id,
                usage,
                loading: false,
                error: null,
                connected: true,
                samples: appendSample(previous.id === id ? previous.samples : [], usage, time),
                updatedAt: time,
                snapshotSequence: (previous.id === id ? previous.snapshotSequence : 0) + 1,
              }
            : previous,
        )
      } catch (error) {
        if (current())
          setState((previous) =>
            current()
              ? {
                  ...(previous.id === id
                    ? previous
                    : {
                        id,
                        usage: null,
                        connected: false,
                        samples: [],
                        updatedAt: null,
                        snapshotSequence: 0,
                      }),
                  loading: false,
                  error: String(error instanceof Error ? error.message : error),
                }
              : previous,
          )
      } finally {
        running = false
        if (pending && !controller.signal.aborted) {
          pending = false
          void load()
        }
      }
    }
    const scheduleLoad = (): void => {
      if (isDocumentHidden()) {
        deferredWhileHidden = true
        return
      }
      if (timer !== undefined) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = undefined
        void load()
      }, 150)
    }
    const onVisibilityChange = (): void => {
      if (!isDocumentHidden() && deferredWhileHidden && !controller.signal.aborted) {
        deferredWhileHidden = false
        void load()
      }
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange)
    }
    if (projection === undefined || revision > 0) {
      setState((previous) =>
        previous.id === id
          ? { ...previous, loading: Boolean(id), error: null }
          : {
              id,
              usage: null,
              loading: Boolean(id),
              error: null,
              connected: true,
              samples: [],
              updatedAt: null,
              snapshotSequence: 0,
            },
      )
      void load()
    }
    const stop =
      id && projection === undefined
        ? observeUsageChanges(
            id,
            scheduleLoad,
            (connected) => {
              if (!controller.signal.aborted)
                setState((previous) => (previous.id === id ? { ...previous, connected } : previous))
              if (!connected) {
                sawDisconnect = true
              } else if (sawDisconnect) {
                sawDisconnect = false
                scheduleLoad()
              }
            },
          )
        : undefined
    return () => {
      controller.abort()
      stop?.()
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange)
      }
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [id, projection === undefined, revision, enabled])
  return state.id === id
    ? state
    : {
        id,
        usage: null,
        loading: Boolean(id && enabled),
        error: null,
        connected: true,
        samples: [],
        updatedAt: null,
        snapshotSequence: 0,
      }
}

export function useHistory(
  id: string | undefined,
  revision: number,
  usageSequence: number | null = null,
  enabled = true,
): {
  page: HistoryPage | null
  loading: boolean
  error: string | null
  older: () => void
  latest: () => void
  isOlder: boolean
} {
  const scope = useRef({ id, generation: 0 })
  if (scope.current.id !== id) scope.current = { id, generation: scope.current.generation + 1 }
  const [historyWindow, setWindow] = useState<{
    id: string
    generation: number
    before: number
    through: number
  } | null>(null)
  const before =
    historyWindow &&
    historyWindow.id === id &&
    historyWindow.generation === scope.current.generation
      ? historyWindow.before
      : undefined
  const through = before !== undefined ? historyWindow?.through : undefined
  const liveRevision = before === undefined ? usageSequence : null
  const [state, setState] = useState<{
    id?: string
    page: HistoryPage | null
    loading: boolean
    error: string | null
  }>({ page: null, loading: false, error: null })
  const [liveCatchup, setLiveCatchup] = useState(0)
  const latestLiveRef = useRef<number | null>(liveRevision)
  latestLiveRef.current = liveRevision
  const explicitInFlightRef = useRef(false)
  const settledLatestRef = useRef<{ id: string; revision: number; throughSeq: number } | null>(null)
  useEffect(() => setWindow(null), [id])
  useEffect(() => {
    if (!enabled || !id) {
      explicitInFlightRef.current = false
      settledLatestRef.current = null
      return
    }
    const controller = new AbortController()
    const liveAtStart = latestLiveRef.current
    explicitInFlightRef.current = true
    settledLatestRef.current = null
    setState((previous) => ({
      id,
      page: previous.id === id ? previous.page : null,
      loading: true,
      error: null,
    }))
    void client
      .history(id, controller.signal, before, through)
      .then((page) => {
        if (controller.signal.aborted) return
        explicitInFlightRef.current = false
        if (before === undefined) {
          settledLatestRef.current = { id, revision, throughSeq: page.throughSeq }
        }
        setState({ id, page, loading: false, error: null })
        if (
          before === undefined &&
          liveAtStart !== null &&
          latestLiveRef.current !== liveAtStart
        ) {
          setLiveCatchup((value) => value + 1)
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        explicitInFlightRef.current = false
        settledLatestRef.current = null
        setState((previous) => ({
          id,
          page: previous.id === id ? previous.page : null,
          loading: false,
          error: String(error instanceof Error ? error.message : error),
        }))
      })
    return () => {
      controller.abort()
      explicitInFlightRef.current = false
    }
  }, [id, before, through, revision, enabled])
  useEffect(() => {
    if (!enabled || !id || before !== undefined || liveRevision === null) return
    if (explicitInFlightRef.current) return
    const settled = settledLatestRef.current
    if (!settled || settled.id !== id || settled.revision !== revision) return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    let waitingVisible = false
    const runLive = (): void => {
      if (controller.signal.aborted || explicitInFlightRef.current) return
      const currentSettled = settledLatestRef.current
      if (!currentSettled || currentSettled.id !== id || currentSettled.revision !== revision)
        return
      if (isDocumentHidden()) {
        waitingVisible = true
        return
      }
      void client
        .historySince(id, controller.signal, currentSettled.throughSeq)
        .then((page) => {
          if (controller.signal.aborted || explicitInFlightRef.current || page === null) return
          settledLatestRef.current = { id, revision, throughSeq: page.throughSeq }
          setState({ id, page, loading: false, error: null })
        })
        .catch((error) => {
          if (!controller.signal.aborted && !explicitInFlightRef.current)
            setState((previous) => ({
              id,
              page: previous.id === id ? previous.page : null,
              loading: false,
              error: String(error instanceof Error ? error.message : error),
            }))
        })
    }
    const onVisibilityChange = (): void => {
      if (!isDocumentHidden() && waitingVisible && !controller.signal.aborted) {
        waitingVisible = false
        runLive()
      }
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange)
    }
    timer = setTimeout(runLive, 700)
    return () => {
      controller.abort()
      if (timer !== undefined) clearTimeout(timer)
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange)
      }
    }
  }, [id, before, revision, liveRevision, liveCatchup, enabled])
  const current =
    state.id === id ? state : { page: null, loading: Boolean(id && enabled), error: null }
  const latest = useCallback(() => setWindow(null), [])
  const beforeSeq = current.page?.beforeSeq
  const throughSeq = current.page?.throughSeq
  const older = useCallback(() => {
    if (id && beforeSeq !== undefined && throughSeq !== undefined)
      setWindow({
        id,
        generation: scope.current.generation,
        before: beforeSeq,
        through: throughSeq,
      })
  }, [id, beforeSeq, throughSeq])
  return {
    ...current,
    latest,
    isOlder: before !== undefined,
    older,
  }
}

const EMPTY_USAGE_MAP: ReadonlyMap<string, Usage | null> = new Map()

export function useOverviewUsage(
  rows: readonly SessionRow[],
  enabled: boolean,
  revision: number,
): ReadonlyMap<string, Usage | null> {
  const cacheRef = useRef<SessionUsageCache | null>(null)
  if (!cacheRef.current) cacheRef.current = new SessionUsageCache(200, 60_000)
  const [state, setState] = useState<{
    key: string
    entries: Map<string, Usage | null>
  }>(() => ({ key: '', entries: new Map() }))
  const targets = useMemo(
    () =>
      rows
        .filter((row) => isThreadId(row.id))
        .slice(0, 50)
        .map((row) => ({ id: row.id, stamp: row.updatedAt })),
    [rows],
  )
  const key =
    enabled && targets.length > 0
      ? `${revision}:${targets.map((target) => `${target.id}@${target.stamp ?? ''}`).join(',')}`
      : ''
  const cacheSnapshot = useMemo(() => {
    if (!key)
      return {
        initial: EMPTY_USAGE_MAP,
        missing: [] as Array<{ id: string; stamp: number | undefined }>,
      }
    const cache = cacheRef.current!
    const now = Date.now()
    const initial = new Map<string, Usage | null>()
    const missing: Array<{ id: string; stamp: number | undefined }> = []
    for (const target of targets) {
      const cached = cache.read(target.id, target.stamp, revision, now)
      if (cached.hit) initial.set(target.id, cached.usage)
      else missing.push(target)
    }
    return { initial, missing }
  }, [key, revision, targets])
  useEffect(() => {
    if (!key) {
      setState((previous) => (previous.key ? { key: '', entries: new Map() } : previous))
      return
    }
    if (cacheSnapshot.missing.length === 0) return
    const cache = cacheRef.current!
    const missing = cacheSnapshot.missing
    setState({ key, entries: new Map(cacheSnapshot.initial) })

    const controller = new AbortController()
    const batch = createBatchQueue<string, Usage | null>(
      (chunk) => {
        setState((previous) => {
          if (controller.signal.aborted || previous.key !== key) return previous
          const next = new Map(previous.entries)
          for (const [entryId, entryUsage] of chunk) next.set(entryId, entryUsage)
          return { key, entries: next }
        })
      },
      120,
      8,
    )
    let cursor = 0
    const workers = Array.from({ length: Math.min(4, missing.length) }, async () => {
      while (!controller.signal.aborted) {
        const index = cursor++
        if (index >= missing.length) break
        const target = missing[index]
        let nextUsage: Usage | null = null
        let resolved = false
        try {
          const snapshot = await client.inspectUsage(target.id, controller.signal)
          if (controller.signal.aborted) return
          nextUsage = usageOf(snapshot)
          resolved = true
        } catch {
          if (controller.signal.aborted) return
          nextUsage = null
        }
        if (resolved) cache.write(target.id, target.stamp, revision, nextUsage)
        batch.push(target.id, nextUsage)
      }
    })
    void Promise.all(workers).then(() => {
      if (!controller.signal.aborted) batch.flushNow()
    })
    return () => {
      controller.abort()
      batch.cancel()
    }
  }, [key, revision, cacheSnapshot])
  if (!key) return EMPTY_USAGE_MAP
  if (cacheSnapshot.missing.length === 0) return cacheSnapshot.initial
  return state.key === key ? state.entries : cacheSnapshot.initial
}
