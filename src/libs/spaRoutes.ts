/**
 * Re-exports route and SEO helpers from `pageSeo.ts` (kept for existing imports).
 *
 * @see pageSeo.ts — source of truth for paths, meta, sitemap, and robots.txt
 */
export {
  generateRobotsTxt,
  generateSitemapXml,
  getSitemapEntries,
  getSitemapPaths,
  getSpaFallbackDirectories,
  getValidSpaPaths,
  injectSeoIntoHtml,
  SITE_ORIGIN,
} from './pageSeo'

import { getSitemapPaths, SITE_ORIGIN } from './pageSeo'

export function getSitemapUrls(): string[] {
  return getSitemapPaths().map((path) =>
    path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`,
  )
}
