const credits = new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 })

export function previewLine(text: string, limit = 160): string {
  return (text.split(/\r?\n/).find((line) => line.trim().length > 0) ?? '')
    .trim()
    .replace(/^#{1,6}\s+/, '')
    .slice(0, limit)
}

export function formatUsd(value: number): string {
  return `$${value > 0 && value < 0.0001 ? value.toPrecision(2) : value.toFixed(value >= 1 ? 2 : 4)}`
}

export function formatCredits(value: number): string {
  return value > 0 && value < 0.0001 ? '<0.0001' : credits.format(value)
}
