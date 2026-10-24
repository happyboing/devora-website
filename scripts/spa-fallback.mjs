// GitHub Pages has no rewrite rules and answers unknown paths with 404.html, so
// the built index.html is copied there. Deep links such as /team or /contact
// then boot the SPA, which renders the matching route.
import { copyFile, access } from 'node:fs/promises'
import { join } from 'node:path'

const dist = join(import.meta.dirname, '..', 'dist')
const index = join(dist, 'index.html')

await access(index)
await copyFile(index, join(dist, '404.html'))

console.log('SPA fallback written: dist/404.html')
