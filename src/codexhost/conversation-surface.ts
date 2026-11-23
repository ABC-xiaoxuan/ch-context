import { useLayoutEffect, type RefObject } from 'react'

const surfaces = new WeakMap<HTMLElement, number>()

export function useConversationSurface(ref: RefObject<HTMLElement | null>, active: boolean): void {
  useLayoutEffect(() => {
    if (!active) return
    const surface = ref.current?.closest<HTMLElement>('[data-conversation-scroll]')
    if (!surface) return
    surfaces.set(surface, (surfaces.get(surface) ?? 0) + 1)
    surface.setAttribute('data-ch-context-surface', '')
    return () => {
      const remaining = (surfaces.get(surface) ?? 1) - 1
      if (remaining > 0) surfaces.set(surface, remaining)
      else {
        surfaces.delete(surface)
        surface.removeAttribute('data-ch-context-surface')
      }
    }
  }, [ref, active])
}
