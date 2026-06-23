/**
 * Post-build step for the community-token mini-site (after `vite build --config vite.community-token.config.ts`).
 *
 * Mirrors the main site's `generate-spa-fallbacks.ts` pattern at a smaller scale:
 * - inject title, meta, canonical, Open Graph, and Twitter tags into `index.html`
 * - write `robots.txt` and `sitemap.xml` for community-token.feelyourprotocol.org
 */
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  generateCommunityRobotsTxt,
  generateCommunitySitemapXml,
  getCommunityPageSeo,
} from '../community-token/src/content/pageSeo'
import { injectSeoIntoHtml } from '../src/libs/seoCore'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const websiteRoot = join(scriptDir, '..')
const outDir = join(websiteRoot, 'dist/community-token')
const indexPath = join(outDir, 'index.html')
const pageSeoSource = join(websiteRoot, 'community-token/src/content/pageSeo.ts')

const lastmod = statSync(pageSeoSource).mtime.toISOString().slice(0, 10)

writeFileSync(indexPath, injectSeoIntoHtml(readFileSync(indexPath, 'utf8'), getCommunityPageSeo()))
writeFileSync(join(outDir, 'sitemap.xml'), generateCommunitySitemapXml(lastmod))
writeFileSync(join(outDir, 'robots.txt'), generateCommunityRobotsTxt())

console.log('Wrote community-token index.html SEO tags, sitemap.xml, robots.txt')
