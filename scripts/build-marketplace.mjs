import { build } from 'esbuild'
import postcss from 'postcss'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const pkg = JSON.parse(await readFile('package.json', 'utf8'))
const manifest = JSON.parse(await readFile('manifest.json', 'utf8'))
if (pkg.name !== manifest.id || pkg.version !== manifest.version)
  throw new Error('Package and native manifest identity/version must match')
await mkdir('web', { recursive: true })
await build({
  entryPoints: ['src/market/web.tsx'],
  outfile: 'web/index.mjs',
  bundle: true,
  platform: 'browser',
  format: 'esm',
  target: 'es2022',
  jsx: 'automatic',
  define: {
    'process.env.NODE_ENV': '"production"',
    __CH_CONTEXT_VERSION__: JSON.stringify(pkg.version),
  },
  minify: true,
  legalComments: 'none',
})
const source =
  (await readFile('src/codexhost/styles.css', 'utf8')) +
  '\n' +
  (await readFile('src/codexhost/inspector.css', 'utf8'))
const tree = postcss.parse(source)
tree.walkRules((rule) => {
  for (let parent = rule.parent; parent; parent = parent.parent)
    if (parent.type === 'atrule' && parent.name.endsWith('keyframes')) return
  rule.selectors = rule.selectors.map((selector) =>
    selector.startsWith('body[data-ds-dark-theme]')
      ? selector.replace('body[data-ds-dark-theme]', ':host([data-ds-dark-theme])')
      : `:host ${selector}`,
  )
})
await writeFile('web/style.css', tree.toString())
console.log(`Built native Web extension ${manifest.id}@${manifest.version}`)
