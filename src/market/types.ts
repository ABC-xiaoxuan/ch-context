export type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject

export interface JsonObject {
  [key: string]: JsonValue
}

export type WebExtensionDispose = () => void | Promise<void>

export interface WebExtensionContribution {
  id: string
  title: { en: string; 'zh-CN': string }
  render(
    container: HTMLElement,
    signal: AbortSignal,
  ): void | WebExtensionDispose | Promise<void | WebExtensionDispose>
}

export interface WebExtensionApi {
  readonly signal: AbortSignal
  track(dispose: WebExtensionDispose): void
  assets: { url(path: string): string }
  storage: {
    get(): Promise<JsonObject>
    set(values: JsonObject): Promise<JsonObject>
    onChange(listener: (values: JsonObject) => void): () => void
  }
  settings: {
    registerPage(page: WebExtensionContribution): () => void
  }
  panels: {
    register(panel: WebExtensionContribution & { placement: 'main' | 'sidebar' }): () => void
  }
}
