import { zipSync } from 'fflate'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile('manifest.json', 'utf8'))
const paths = [
  'manifest.json',
  manifest.web.entry,
  manifest.web.style,
  manifest.icon,
  ...manifest.screenshots,
  'LICENSE',
  'NOTICE',
  'THIRD_PARTY_NOTICES.md',
  'README.md',
].sort()
const files = {}
for (const path of paths) {
  const bytes = await readFile(path)
  files[path] = path.endsWith('.png')
    ? bytes
    : Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n'))
}
const bytes = zipSync(files, { level: 9, mtime: new Date(2000, 0, 1, 0, 0, 0) })
await mkdir('dist', { recursive: true })
const path = `dist/${manifest.id}-${manifest.version}.zip`
await writeFile(path, bytes)
const sha256 = createHash('sha256').update(bytes).digest('hex')
await writeFile(`${path}.sha256`, `${sha256}  ${manifest.id}-${manifest.version}.zip\n`)
console.log(JSON.stringify({ path, bytes: bytes.length, sha256, files: paths }, null, 2))
