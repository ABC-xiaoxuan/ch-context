import assert from 'node:assert/strict'
import { readFile, lstat } from 'node:fs/promises'
import postcss from 'postcss'

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'))
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
assert.equal(manifest.manifestVersion, 2)
assert.equal(manifest.id, pkg.name)
assert.equal(manifest.version, pkg.version)
assert.equal(manifest.author, 'ABC-xiaoxuan')
assert.equal(manifest.web.apiVersion, 1)
assert.equal(manifest.web.entry, 'web/index.mjs')
assert.equal(manifest.web.style, 'web/style.css')
for (const key of ['desktop', 'page', 'widget', 'backend']) assert.equal(manifest[key], undefined)
for (const key of ['name', 'description', 'details'])
  for (const lang of ['en', 'zh-CN']) assert.ok(manifest[key][lang].trim().length > 0)
const source = await readFile(manifest.web.entry, 'utf8')
assert.ok(Buffer.byteLength(source) < 2 * 1024 * 1024)
assert.ok(!/\beval\s*\(/u.test(source))
assert.ok(!/\bnew\s+Function\b/u.test(source))
assert.ok(!/\bchild_process\b/u.test(source))
assert.ok(!source.includes('__ModuleLoader__'))
assert.ok(!source.includes('CODEXHOST_RUNTIME_TOKEN'))
assert.ok(!/^import\s/m.test(source))
const css = await readFile(manifest.web.style, 'utf8')
assert.ok(Buffer.byteLength(css) < 256 * 1024)
assert.ok(!css.includes('data-ch-context-surface'))
postcss.parse(css).walkRules((rule) => {
  for (let parent = rule.parent; parent; parent = parent.parent)
    if (parent.type === 'atrule' && parent.name.endsWith('keyframes')) return
  for (const selector of rule.selectors)
    assert.ok(selector.startsWith(':host'), `Native CSS escaped its shadow boundary: ${selector}`)
})
assert.ok(manifest.screenshots.length > 0 && manifest.screenshots.length <= 4)
for (const [path, limit] of [
  [manifest.icon, 128 * 1024],
  ...manifest.screenshots.map((path) => [path, 512 * 1024]),
]) {
  assert.ok(!path.includes('..') && path.endsWith('.png'))
  assert.equal((await lstat(path)).isSymbolicLink(), false)
  const bytes = await readFile(path)
  assert.ok(bytes.length > 100 && bytes.length <= limit)
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
}
console.log(
  `Verified native manifest v2, Web-only ESM, static scan, shadow CSS and raster assets: ${manifest.id}@${manifest.version}`,
)
