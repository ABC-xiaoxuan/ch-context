export function safeHref(value: string, base = 'https://example.invalid/'): string | null {
  try {
    const url = new URL(value, base)
    return ['https:', 'http:', 'mailto:'].includes(url.protocol) ? url.href : null
  } catch {
    return null
  }
}

export function decodeText(value: string): string {
  const entities: Record<string, string> = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: '\u00a0',
  }
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi,
    (match, entity: string) => {
      if (!entity.startsWith('#')) return entities[entity.toLowerCase()] ?? match
      const code = entity.toLowerCase().startsWith('#x')
        ? Number.parseInt(entity.slice(2), 16)
        : Number.parseInt(entity.slice(1), 10)
      return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff)
        ? String.fromCodePoint(code)
        : '\ufffd'
    },
  )
}
