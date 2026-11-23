import { recordOf } from './model.ts'

export function isUsageInvalidation(value: unknown, threadId: string): boolean {
  const event = recordOf(value)
  if (event?.type !== 'changed') return false
  if (typeof event.threadId === 'string' && event.threadId !== threadId) return false
  return (
    typeof event.method === 'string' &&
    ['codexhost/thread/usage/updated', 'thread/tokenUsage/updated', 'thread/updated'].includes(
      event.method,
    )
  )
}

export function observeUsageChanges(
  threadId: string,
  invalidate: () => void,
  connected: (value: boolean) => void,
  fetcher: typeof fetch = fetch,
): () => void {
  const lifetime = new AbortController()
  let retryTimer: ReturnType<typeof setTimeout> | undefined
  let attempt = 0
  const connect = async (): Promise<void> => {
    try {
      const response = await fetcher('api/ch/v1/events', {
        credentials: 'same-origin',
        signal: lifetime.signal,
      })
      if (!response.ok || response.body === null) throw new Error('Events unavailable')
      if (lifetime.signal.aborted) return
      connected(true)
      attempt = 0
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let pending = ''
      try {
        while (!lifetime.signal.aborted) {
          const chunk = await reader.read()
          if (chunk.done) break
          pending += decoder.decode(chunk.value, { stream: true })
          if (pending.length > 1024 * 1024) throw new Error('Event frame too large')
          let newline: number
          while ((newline = pending.indexOf('\n')) !== -1) {
            const line = pending.slice(0, newline).trim()
            pending = pending.slice(newline + 1)
            if (!line) continue
            try {
              if (isUsageInvalidation(JSON.parse(line), threadId)) invalidate()
            } catch {
              continue
            }
          }
        }
      } finally {
        await reader.cancel().catch(() => undefined)
        reader.releaseLock()
      }
    } catch {
      if (lifetime.signal.aborted) return
    }
    if (lifetime.signal.aborted) return
    connected(false)
    retryTimer = setTimeout(
      () => {
        void connect()
      },
      Math.min(15000, 1000 * 2 ** attempt++),
    )
  }
  void connect()
  return () => {
    lifetime.abort()
    if (retryTimer !== undefined) clearTimeout(retryTimer)
  }
}
