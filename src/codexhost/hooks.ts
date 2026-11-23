import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { CodexHostClient, type HistoryPage, type SessionPage } from './api.ts'
import { appendSample, recordOf, usageOf, type Sample, type Usage } from './model.ts'
import { observeUsageChanges } from './realtime.ts'

export interface Observable<T> {
  getSnapshot(): T
  subscribe(callback: () => void): () => void
}

export interface ClientContext {
  get(name: string): unknown
  locale: {
    getLocale?(): { active: string }
    subscribe?(callback: () => void): () => void
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

export function useLocale(ctx: ClientContext): string {
  const subscribe = useCallback(
    (listener: () => void) => ctx.locale.subscribe?.(listener) ?? absentSubscribe(),
    [ctx],
  )
  const read = useCallback(() => ctx.locale.getLocale?.().active ?? 'en', [ctx])
  return useSyncExternalStore(subscribe, read, read)
}

export function useCurrentSession(ctx: ClientContext): string | undefined {
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
                    : { id, usage: null, connected: false, samples: [], updatedAt: null }),
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
      }
}

export function useHistory(
  id: string | undefined,
  revision: number,
): {
  page: HistoryPage | null
  loading: boolean
  error: string | null
  older: () => void
} {
  const [historyWindow, setWindow] = useState<{
    id: string
    revision: number
    before: number
    through: number
  } | null>(null)
  const before =
    historyWindow && historyWindow.id === id && historyWindow.revision === revision
      ? historyWindow.before
      : undefined
  const through = before !== undefined ? historyWindow?.through : undefined
  const [state, setState] = useState<{
    id?: string
    page: HistoryPage | null
    loading: boolean
    error: string | null
  }>({ page: null, loading: false, error: null })
  useEffect(() => {
    if (!id) return
    const controller = new AbortController()
    setState((previous) => ({
      id,
      page: previous.id === id ? previous.page : null,
      loading: true,
      error: null,
    }))
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
    return () => controller.abort()
  }, [id, before, through, revision])
  const current = state.id === id ? state : { page: null, loading: Boolean(id), error: null }
  return {
    ...current,
    older: () => {
      if (id && current.page?.beforeSeq !== undefined)
        setWindow({
          id,
          revision,
          before: current.page.beforeSeq,
          through: current.page.throughSeq,
        })
    },
  }
}
