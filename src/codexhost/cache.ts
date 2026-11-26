import type { Usage } from './model.ts'

export class BoundedLruCache<K, V> {
  private readonly maxEntries: number
  private readonly entries = new Map<K, V>()

  constructor(maxEntries: number) {
    this.maxEntries = Number.isFinite(maxEntries) ? Math.max(1, Math.floor(maxEntries)) : 1
  }

  get size(): number {
    return this.entries.size
  }

  get(key: K): V | undefined {
    if (!this.entries.has(key)) return undefined
    const value = this.entries.get(key)!
    this.entries.delete(key)
    this.entries.set(key, value)
    return value
  }

  set(key: K, value: V): void {
    if (this.entries.has(key)) this.entries.delete(key)
    this.entries.set(key, value)
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next()
      if (oldest.done) break
      this.entries.delete(oldest.value)
    }
  }

  delete(key: K): void {
    this.entries.delete(key)
  }

  clear(): void {
    this.entries.clear()
  }
}

interface UsageCacheEntry {
  stamp: number | undefined
  usage: Usage | null
  fetchedAt: number
  revision: number
}

export class SessionUsageCache {
  private readonly store: BoundedLruCache<string, UsageCacheEntry>
  private readonly ttlMs: number

  constructor(maxEntries = 200, ttlMs = 60_000) {
    this.store = new BoundedLruCache(maxEntries)
    this.ttlMs = ttlMs
  }

  get size(): number {
    return this.store.size
  }

  read(
    id: string,
    stamp: number | undefined,
    revision: number,
    now = Date.now(),
  ): { hit: true; usage: Usage | null } | { hit: false } {
    const entry = this.store.get(id)
    if (!entry) return { hit: false }
    if (
      entry.revision !== revision ||
      entry.stamp !== stamp ||
      now < entry.fetchedAt ||
      now - entry.fetchedAt > this.ttlMs
    ) {
      this.store.delete(id)
      return { hit: false }
    }
    return { hit: true, usage: entry.usage }
  }

  write(
    id: string,
    stamp: number | undefined,
    revision: number,
    usage: Usage | null,
    now = Date.now(),
  ): void {
    this.store.set(id, { stamp, usage, fetchedAt: now, revision })
  }

  clear(): void {
    this.store.clear()
  }
}

export interface BatchQueue<K, V> {
  push(key: K, value: V): void
  flushNow(): void
  cancel(): void
}

export function createBatchQueue<K, V>(
  onFlush: (batch: ReadonlyMap<K, V>) => void,
  delayMs = 120,
  maxBatch = 8,
): BatchQueue<K, V> {
  let pending = new Map<K, V>()
  let timer: ReturnType<typeof setTimeout> | undefined

  const flushNow = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
    if (pending.size === 0) return
    const batch = pending
    pending = new Map<K, V>()
    onFlush(batch)
  }

  const push = (key: K, value: V): void => {
    pending.set(key, value)
    if (pending.size >= maxBatch) {
      flushNow()
      return
    }
    if (timer === undefined) {
      timer = setTimeout(flushNow, delayMs)
    }
  }

  const cancel = (): void => {
    if (timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
    pending.clear()
  }

  return { push, flushNow, cancel }
}
