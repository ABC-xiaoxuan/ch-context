declare module '*.css' {
  const css: string
  export default css
}

declare module '*.woff2' {
  const bytes: Uint8Array
  export default bytes
}

declare const __CH_CONTEXT_VERSION__: string
