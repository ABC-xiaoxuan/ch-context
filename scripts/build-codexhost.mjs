import { build, transform } from 'esbuild'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))
await mkdir(new URL('../lib/', import.meta.url), { recursive: true })
const minifyCssText = {
  name: 'minify-css-text',
  setup(pluginBuild) {
    pluginBuild.onLoad({ filter: /\.css$/ }, async (args) => {
      const raw = (await readFile(args.path, 'utf8')).replace(/\r\n/g, '\n')
      const { code } = await transform(raw, { loader: 'css', minify: true })
      return { contents: code, loader: 'text' }
    })
  },
}
const output = await build({
  entryPoints: ['src/codexhost/index.tsx'],
  bundle: true,
  write: false,
  platform: 'browser',
  format: 'cjs',
  target: 'es2022',
  jsx: 'automatic',
  external: ['react', 'react/jsx-runtime', 'react-dom'],
  plugins: [minifyCssText],
  define: {
    'process.env.NODE_ENV': '"production"',
    __CH_CONTEXT_VERSION__: JSON.stringify(pkg.version),
  },
  minify: true,
  legalComments: 'none',
})
const source = output.outputFiles[0].text
const wrapped = `window.__ModuleLoader__.load({id:${JSON.stringify(pkg.name)},factory:function(require){var module={exports:{}};var exports=module.exports;\n${source}\nreturn module.exports;}});\n`
await writeFile(new URL('../lib/client.js', import.meta.url), wrapped)
console.log(`Built ${pkg.name}@${pkg.version}: ${Buffer.byteLength(wrapped)} bytes`)
