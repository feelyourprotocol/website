/**
 * Post-build step (`npm run generate:spa-fallbacks`, after `vite build`).
 *
 * nginx serves static files with `try_files $uri $uri/ =404` (no blanket index.html
 * fallback). This script materializes what nginx needs:
 *
 * - Per-route `index.html` with injected title, meta, canonical, Open Graph, JSON-LD,
 *   and a minimal static above-the-fold shell inside `#app` (early LCP paint)
 * - `404.html` — same app shell with noindex meta
 * - `sitemap.xml` and `robots.txt`
 *
 * Route logic lives in `pageSeo.ts` (testable); this file handles filesystem writes.
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { EXPLORATIONS } from '../src/explorations/REGISTRY'
import { TOPICS } from '../src/explorations/TOPICS'
import {
  generateRobotsTxt,
  generateSitemapXml,
  getPageSeoForPath,
  getSpaFallbackDirectories,
  getValidSpaPaths,
  injectBuiltPageHtml,
  type StaticShellAssets,
} from '../src/libs/pageSeo'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const websiteRoot = join(scriptDir, '..')
const outDir = join(websiteRoot, 'dist/website')
const indexPath = join(outDir, 'index.html')

function toLastmod(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function lastmodForPath(path: string): string {
  if (path === '/' || path === '/all') {
    return toLastmod(statSync(join(websiteRoot, 'package.json')).mtime)
  }

  if (path === '/imprint') {
    return toLastmod(statSync(join(websiteRoot, 'src/views/ImprintView.vue')).mtime)
  }

  const exploration = Object.values(EXPLORATIONS).find((entry) => entry.path === path)
  if (exploration) {
    return toLastmod(statSync(join(websiteRoot, 'src/explorations', exploration.id, 'info.ts')).mtime)
  }

  const topic = Object.values(TOPICS).find((entry) => entry.path === path)
  if (topic && topic.explorations.length > 0) {
    const mtimes = topic.explorations.map((id) =>
      statSync(join(websiteRoot, 'src/explorations', id, 'info.ts')).mtimeMs,
    )
    return toLastmod(new Date(Math.max(...mtimes)))
  }

  return toLastmod(statSync(join(websiteRoot, 'package.json')).mtime)
}

function findBuiltAsset(prefix: string): string {
  const assetsDir = join(outDir, 'assets')
  const file = readdirSync(assetsDir).find((entry) => entry.startsWith(`${prefix}-`))
  if (!file) {
    throw new Error(`Built asset not found in ${assetsDir}: ${prefix}-*`)
  }
  return `/assets/${file}`
}

const shellHtml = readFileSync(indexPath, 'utf8')
const staticShellAssets: StaticShellAssets = { logoSrc: findBuiltAsset('logo') }
const lastmodByPath = Object.fromEntries(getValidSpaPaths().map((path) => [path, lastmodForPath(path)]))

function writeBuiltPageHtml(targetPath: string, routePath: string): void {
  writeFileSync(
    targetPath,
    injectBuiltPageHtml(shellHtml, getPageSeoForPath(routePath), staticShellAssets),
  )
}

writeBuiltPageHtml(indexPath, '/')

for (const dir of getSpaFallbackDirectories()) {
  const path = `/${dir}`
  const targetDir = join(outDir, dir)
  mkdirSync(targetDir, { recursive: true })
  writeBuiltPageHtml(join(targetDir, 'index.html'), path)
}

writeBuiltPageHtml(join(outDir, '404.html'), '/404-not-found')
writeFileSync(join(outDir, 'sitemap.xml'), generateSitemapXml(lastmodByPath))
writeFileSync(join(outDir, 'robots.txt'), generateRobotsTxt())

console.log(
  `Wrote ${getSpaFallbackDirectories().length + 1} SEO HTML shells, 404.html, sitemap.xml, robots.txt`,
)
