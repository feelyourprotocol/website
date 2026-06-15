/**
 * Post-build step (`npm run generate:spa-fallbacks`, after `vite build`).
 *
 * nginx serves static files with `try_files $uri $uri/ =404` (no blanket index.html
 * fallback). This script materializes what nginx needs:
 *
 * - `scaling/index.html`, … — one copy per valid SPA route so deep links return 200
 * - `404.html` — same app shell; Vue Router shows NotFoundView for unknown paths
 * - `sitemap.xml` and `robots.txt` — canonical URLs from `src/libs/spaRoutes.ts`
 *
 * Route logic lives in spaRoutes.ts (testable, no filesystem I/O); this file only writes files.
 */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  generateRobotsTxt,
  generateSitemapXml,
  getSpaFallbackDirectories,
} from '../src/libs/spaRoutes'

const outDir = join(dirname(fileURLToPath(import.meta.url)), '../dist/website')
const indexPath = join(outDir, 'index.html')

for (const dir of getSpaFallbackDirectories()) {
  const targetDir = join(outDir, dir)
  mkdirSync(targetDir, { recursive: true })
  copyFileSync(indexPath, join(targetDir, 'index.html'))
}

copyFileSync(indexPath, join(outDir, '404.html'))
writeFileSync(join(outDir, 'sitemap.xml'), generateSitemapXml())
writeFileSync(join(outDir, 'robots.txt'), generateRobotsTxt())

console.log(
  `Wrote ${getSpaFallbackDirectories().length} SPA fallbacks, 404.html, sitemap.xml, robots.txt`,
)
