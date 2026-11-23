import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { CodexHostClient, type HistoryPage, type SessionPage, type SessionRow } from './api.ts'
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
  const [state, setState] = useState<{
    key: string
    page: SessionPage | null
    loading: boolean
    error: string | null
  }>({ key: '', page: null, loading: true, error: null })
  const key = `${cursor ?? ''}:${revision}`
  useEffect(() => {
    const controller = new AbortController()
    setState({ key, page: null, loading: true, error: null })
    void client
      .listSessions(cursor, controller.signal)
      .then((page) => {
        if (!controller.signal.aborted) setState({ key, page, loading: false, error: null })
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
  }, [cursor, key])
  return state.key === key ? state : { page: null, loading: true, error: null }
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
): UsageState {
  const source = useRef({ id, projection, generation: 0 })
  if (source.current.id !== id || source.current.projection !== projection) {
    source.current = { id, projection, generation: source.current.generation + 1 }
  }
  const [state, setState] = useState<UsageState>({
    id,
    usage: null,
    loading: Boolean(id),
    error: null,
    connected: true,
    samples: [],
    updatedAt: null,
    snapshotSequence: 0,
  })
  useEffect(() => {
    if (projection === undefined || !id) return
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
  }, [id, projection])
  useEffect(() => {
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    let running = false
    let pending = false
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
            () => {
              if (timer !== undefined) clearTimeout(timer)
              timer = setTimeout(() => {
                void load()
              }, 150)
            },
            (connected) => {
              if (!controller.signal.aborted)
                setState((previous) => (previous.id === id ? { ...previous, connected } : previous))
              if (connected) void load()
            },
          )
        : undefined
    return () => {
      controller.abort()
      stop?.()
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [id, projection === undefined, revision])
  return state.id === id
    ? state
    : {
        id,
        usage: null,
        loading: Boolean(id),
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
  useEffect(() => setWindow(null), [id])
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    setState((previous) => ({
      id,
      page: previous.id === id ? previous.page : null,
      loading: true,
      error: null,
    }))
    const load = (): void => {
      void client
        .history(id, controller.signal, before, through)
        .then((page) => {
          if (!controller.signal.aborted) setState({ id, page, loading: false, error: null })
        })
        .catch((error) => {
          if (!controller.signal.aborted)
            setState((previous) => ({
              id,
              page: previous.id === id ? previous.page : null,
              loading: false,
              error: String(error instanceof Error ? error.message : error),
            }))
        })
    }
    const timer =
      liveRevision !== null && state.id === id && state.page !== null
        ? setTimeout(load, 350)
        : undefined
    if (timer === undefined) load()
    return () => {
      controller.abort()
      if (timer !== undefined) clearTimeout(timer)
    }
  }, [id, before, through, revision, liveRevision])
  const current = state.id === id ? state : { page: null, loading: Boolean(id), error: null }
  return {
    ...current,
    latest: () => setWindow(null),
    isOlder: before !== undefined,
    older: () => {
      if (id && current.page?.beforeSeq !== undefined)
        setWindow({
          id,
          generation: scope.current.generation,
          before: current.page.beforeSeq,
          through: current.page.throughSeq,
        })
    },
  }
}

const EMPTY_USAGE_MAP: ReadonlyMap<string, Usage | null> = new Map()

export function useOverviewUsage(
  rows: readonly SessionRow[],
  enabled: boolean,
  revision: number,
): ReadonlyMap<string, Usage | null> {
  const [state, setState] = useState<{
    key: string
    entries: Map<string, Usage | null>
  }>(() => ({ key: '', entries: new Map() }))
  const ids = rows
    .map((row) => row.id)
    .filter(isThreadId)
    .slice(0, 50)
  const key = enabled && ids.length > 0 ? `${revision}:${ids.join(',')}` : ''
  useEffect(() => {
    if (!key) {
      setState({ key: '', entries: new Map() })
      return
    }
    const controller = new AbortController()
    setState({ key, entries: new Map() })
    const queue = [...ids]
    const workers = Array.from({ length: Math.min(3, queue.length) }, async () => {
      while (!controller.signal.aborted && queue.length > 0) {
        const id = queue.shift()
        if (!id) break
        let nextUsage: Usage | null = null
        try {
          const snapshot = await client.inspectUsage(id, controller.signal)
          if (controller.signal.aborted) return
          nextUsage = usageOf(snapshot)
        } catch {
          if (controller.signal.aborted) return
          nextUsage = null
        }
        setState((previous) => {
          if (controller.signal.aborted || previous.key !== key) return previous
          const next = new Map(previous.entries)
          next.set(id, nextUsage)
          return { key, entries: next }
        })
      }
    })
    void Promise.all(workers)
    return () => controller.abort()
  }, [key])
  return key && state.key === key ? state.entries : EMPTY_USAGE_MAP
}
