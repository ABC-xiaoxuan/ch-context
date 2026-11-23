import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const pkg = JSON.parse(await readFile('package.json', 'utf8'))
const source = await readFile('lib/client.js', 'utf8')
assert.equal(pkg.name, 'ch-context')
assert.equal(pkg.main, undefined)
assert.equal(pkg.exports['.'], undefined)
assert.equal(pkg.exports['./client'], './lib/client.js')
assert.equal(pkg.dsh.client.platform, 'web')
assert.equal(pkg.peerDependencies?.['@deepseek-ai/dsh-session'], undefined)
assert.ok(source.length > 1000)
assert.ok(!source.includes('sessionProjections.register'))
assert.ok(!source.includes('http://127.0.0.1'))
assert.ok(!source.includes('CODEXHOST_RUNTIME_TOKEN'))
let registration
vm.runInNewContext(source, {
  fetch: globalThis.fetch,
  window: {
    __ModuleLoader__: {
      load(value) {
        registration = value
      },
    },
  },
})
assert.equal(registration.id, pkg.name)
const descriptor = registration.factory((name) => {
  assert.ok(['react', 'react/jsx-runtime', 'react-dom'].includes(name))
  return require(name)
})
assert.equal(descriptor.name, pkg.name)
assert.equal(typeof descriptor.apply, 'function')
console.log('Verified CodexHost client-only package identity and ModuleLoader registration')
