import type { SessionRow } from './api.ts'
import { isThreadId } from './model.ts'

export type RelationshipKind = 'subagent' | 'fork' | 'tree' | 'parent'

export interface RelatedSession {
  id: string
  title: string
  role: 'parent' | 'child'
  kind: RelationshipKind
  harness?: string
  loaded: boolean
}

const PRIORITY: Record<RelationshipKind, number> = { subagent: 4, fork: 3, tree: 2, parent: 1 }

function parentsOf(row: SessionRow): { id: string; kind: RelationshipKind }[] {
  const candidates: { id?: string; kind: RelationshipKind }[] = [
    { id: row.parentId, kind: row.origin === 'subagent' ? 'subagent' : 'parent' },
    { id: row.forkParentId, kind: 'fork' },
    { id: row.treeParentId, kind: 'tree' },
  ]
  return candidates.filter(
    (edge): edge is { id: string; kind: RelationshipKind } =>
      isThreadId(edge.id) && edge.id !== row.id,
  )
}

export function relatedSessions(rows: readonly SessionRow[], selected: string): RelatedSession[] {
  if (!isThreadId(selected)) return []
  const rowById = new Map<string, SessionRow>()
  for (const row of rows) rowById.set(row.id, row)
  const result = new Map<string, RelatedSession>()
  const add = (id: string, role: RelatedSession['role'], kind: RelationshipKind): void => {
    if (!isThreadId(id) || id === selected) return
    const key = `${role}:${id}`
    const previous = result.get(key)
    if (previous && PRIORITY[previous.kind] >= PRIORITY[kind]) return
    const row = rowById.get(id)
    result.set(key, {
      id,
      title: row?.title ?? '',
      role,
      kind,
      loaded: row !== undefined,
      ...(row?.harness ? { harness: row.harness } : {}),
    })
  }
  const current = rowById.get(selected)
  if (current) for (const edge of parentsOf(current)) add(edge.id, 'parent', edge.kind)
  for (const row of rows) {
    if (!isThreadId(row.id) || row.id === selected) continue
    for (const edge of parentsOf(row)) if (edge.id === selected) add(row.id, 'child', edge.kind)
  }
  return [...result.values()]
}
