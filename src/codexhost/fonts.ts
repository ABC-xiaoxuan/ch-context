import interLatinWoff2 from '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'

const INTER_UNICODE_RANGE =
  'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD'

interface FontEntry {
  count: number
  face: FontFace
}

const registry = new WeakMap<Document, FontEntry>()

export function acquireBundledFonts(targetDoc?: Document | null): () => void {
  const doc = targetDoc ?? (typeof document !== 'undefined' ? document : null)
  if (!doc || typeof FontFace === 'undefined' || !doc.fonts) return () => undefined
  let entry = registry.get(doc)
  if (!entry) {
    try {
      const face = new FontFace('CH Inter', new Uint8Array(interLatinWoff2), {
        style: 'normal',
        weight: '100 900',
        display: 'swap',
        unicodeRange: INTER_UNICODE_RANGE,
      })
      doc.fonts.add(face)
      void face.load().catch(() => {})
      entry = { count: 1, face }
      registry.set(doc, entry)
    } catch {
      return () => undefined
    }
  } else {
    entry.count += 1
  }
  let released = false
  return () => {
    if (released) return
    released = true
    const current = registry.get(doc)
    if (!current) return
    current.count -= 1
    if (current.count <= 0) {
      registry.delete(doc)
      try {
        doc.fonts.delete(current.face)
      } catch {}
    }
  }
}
