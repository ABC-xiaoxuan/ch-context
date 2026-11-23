export const EVENT_PLOT_WIDTH = 720
export const EVENT_PLOT_INSET = 8
const EVENT_PLOT_SPAN = EVENT_PLOT_WIDTH - EVENT_PLOT_INSET * 2

export function eventX(index: number, count: number): number {
  return EVENT_PLOT_INSET + (index / Math.max(1, count - 1)) * EVENT_PLOT_SPAN
}

export function eventIndexAt(fraction: number, count: number): number {
  if (count < 2 || !Number.isFinite(fraction)) return 0
  return Math.min(
    count - 1,
    Math.max(
      0,
      Math.round(
        ((fraction * EVENT_PLOT_WIDTH - EVENT_PLOT_INSET) / EVENT_PLOT_SPAN) * (count - 1),
      ),
    ),
  )
}
