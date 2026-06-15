/**
 * Valid routes and SEO artifacts for the main site (SPA = Single Page Application).
 *
 * This module is the source of truth for which URLs exist in the Vue app. It is
 * imported by unit tests and by the post-build script `scripts/generate-spa-fallbacks.ts`,
 * which writes static files into `dist/website/` for nginx (see server-config README).
 *
 * Keep route lists in sync with `src/router/index.ts` — both derive from REGISTRY/TOPICS.
 */
import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

export const SITE_ORIGIN = 'https://feelyourprotocol.org'

/** Paths handled by Vue Router (excluding the catch-all 404 route). */
export function getValidSpaPaths(): string[] {
  const paths = ['/', '/imprint', '/all']

  for (const topic of Object.values(TOPICS)) {
    paths.push(topic.path)
  }
  for (const exploration of Object.values(EXPLORATIONS)) {
    paths.push(exploration.path)
  }

  return paths
}

/** Canonical absolute URLs for sitemap.xml (same routes as the SPA). */
export function getSitemapUrls(): string[] {
  return getValidSpaPaths().map((path) =>
    path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`,
  )
}

export function generateSitemapXml(): string {
  const urls = getSitemapUrls()
  const entries = urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join('\n')

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n')
}

export function generateRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_ORIGIN}/sitemap.xml`, ''].join('\n')
}

/** Directory names under dist/website/ that receive a copied index.html (all except `/`). */
export function getSpaFallbackDirectories(): string[] {
  return getValidSpaPaths()
    .filter((path) => path !== '/')
    .map((path) => path.replace(/^\//, ''))
}
