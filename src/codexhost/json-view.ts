export type LosslessJsonNode =
  | { type: 'object'; entries: Array<{ key: string; value: LosslessJsonNode }> }
  | { type: 'array'; items: LosslessJsonNode[] }
  | { type: 'string'; value: string }
  | { type: 'number'; raw: string }
  | { type: 'boolean'; value: boolean }
  | { type: 'null' }

const MAX_DEPTH = 24
const MAX_NODES = 1500
const NUMBER_RE = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y

class JsonParser {
  private readonly input: string
  private pos = 0
  private nodes = 0

  constructor(input: string) {
    this.input = input
  }

  private skipWs(): void {
    while (this.pos < this.input.length) {
      const ch = this.input.charCodeAt(this.pos)
      if (ch === 32 || ch === 9 || ch === 10 || ch === 13) this.pos += 1
      else break
    }
  }

  private nextNode(): void {
    this.nodes += 1
    if (this.nodes > MAX_NODES) throw new Error('JSON node limit exceeded')
  }

  parseRoot(): LosslessJsonNode | null {
    this.skipWs()
    const first = this.input[this.pos]
    if (first !== '{' && first !== '[') return null
    const value = this.parseValue(0)
    this.skipWs()
    if (this.pos !== this.input.length) return null
    return value
  }

  private parseValue(depth: number): LosslessJsonNode {
    if (depth > MAX_DEPTH) throw new Error('JSON depth limit exceeded')
    this.skipWs()
    this.nextNode()
    const ch = this.input[this.pos]
    if (ch === '{') return this.parseObject(depth + 1)
    if (ch === '[') return this.parseArray(depth + 1)
    if (ch === '"') return { type: 'string', value: this.parseString() }
    if (ch === 't' && this.input.startsWith('true', this.pos)) {
      this.pos += 4
      return { type: 'boolean', value: true }
    }
    if (ch === 'f' && this.input.startsWith('false', this.pos)) {
      this.pos += 5
      return { type: 'boolean', value: false }
    }
    if (ch === 'n' && this.input.startsWith('null', this.pos)) {
      this.pos += 4
      return { type: 'null' }
    }
    return this.parseNumber()
  }

  private parseObject(depth: number): LosslessJsonNode {
    this.pos += 1
    const entries: Array<{ key: string; value: LosslessJsonNode }> = []
    this.skipWs()
    if (this.input[this.pos] === '}') {
      this.pos += 1
      return { type: 'object', entries }
    }
    while (this.pos < this.input.length) {
      this.skipWs()
      if (this.input[this.pos] !== '"') throw new Error('Expected string key')
      const key = this.parseString()
      this.skipWs()
      if (this.input[this.pos] !== ':') throw new Error('Expected colon')
      this.pos += 1
      const value = this.parseValue(depth)
      entries.push({ key, value })
      this.skipWs()
      const sep = this.input[this.pos]
      if (sep === ',') {
        this.pos += 1
        continue
      }
      if (sep === '}') {
        this.pos += 1
        return { type: 'object', entries }
      }
      throw new Error('Expected comma or closing brace')
    }
    throw new Error('Unterminated object')
  }

  private parseArray(depth: number): LosslessJsonNode {
    this.pos += 1
    const items: LosslessJsonNode[] = []
    this.skipWs()
    if (this.input[this.pos] === ']') {
      this.pos += 1
      return { type: 'array', items }
    }
    while (this.pos < this.input.length) {
      items.push(this.parseValue(depth))
      this.skipWs()
      const sep = this.input[this.pos]
      if (sep === ',') {
        this.pos += 1
        continue
      }
      if (sep === ']') {
        this.pos += 1
        return { type: 'array', items }
      }
      throw new Error('Expected comma or closing bracket')
    }
    throw new Error('Unterminated array')
  }

  private parseString(): string {
    const start = this.pos
    this.pos += 1
    while (this.pos < this.input.length) {
      const ch = this.input.charCodeAt(this.pos)
      if (ch === 34) {
        this.pos += 1
        return JSON.parse(this.input.slice(start, this.pos)) as string
      }
      if (ch === 92) {
        this.pos += 2
        continue
      }
      if (ch < 32) throw new Error('Invalid control char')
      this.pos += 1
    }
    throw new Error('Unterminated string')
  }

  private parseNumber(): LosslessJsonNode {
    NUMBER_RE.lastIndex = this.pos
    const match = NUMBER_RE.exec(this.input)
    if (!match) throw new Error('Invalid number')
    this.pos += match[0].length
    return { type: 'number', raw: match[0] }
  }
}

export function parseLosslessJson(raw: string | undefined): LosslessJsonNode | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (trimmed.length < 2 || trimmed.length > 16_000) return null
  const first = trimmed[0]
  if (first !== '{' && first !== '[') return null
  try {
    return new JsonParser(trimmed).parseRoot()
  } catch {
    return null
  }
}
