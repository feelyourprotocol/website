import { type PageSeo, truncateDescription } from '../../../src/libs/seoCore'

export const CT_SITE_ORIGIN = 'https://community-token.feelyourprotocol.org' as const
export const CT_SITE_NAME = 'Feel Your Protocol' as const

export const CT_PAGE_TITLE = `Community Token — ${CT_SITE_NAME}` as const

export const CT_DESCRIPTION = truncateDescription(
  'Community token transparency for Feel Your Protocol: how the FYP token on Base works, creator fees, treasury, and guidelines — documented in good faith.',
)

/** Stable path under `community-token/public/og/` — copied to `dist/community-token/og/` on build. */
export const CT_OG_IMAGE_PATH = '/og/default.webp' as const
export const CT_OG_IMAGE_WIDTH = 1200
export const CT_OG_IMAGE_HEIGHT = 630

function absoluteUrl(path: string): string {
  return path === '/' ? `${CT_SITE_ORIGIN}/` : `${CT_SITE_ORIGIN}${path}`
}

export function getCommunityPageSeo(): PageSeo {
  return {
    path: '/',
    title: CT_PAGE_TITLE,
    description: CT_DESCRIPTION,
    canonicalUrl: absoluteUrl('/'),
    imageUrl: absoluteUrl(CT_OG_IMAGE_PATH),
    imageWidth: CT_OG_IMAGE_WIDTH,
    imageHeight: CT_OG_IMAGE_HEIGHT,
    imageAlt: CT_PAGE_TITLE,
  }
}

export function generateCommunitySitemapXml(lastmod?: string): string {
  const loc = absoluteUrl('/')
  const lastmodTag = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url>\n    <loc>${loc}</loc>${lastmodTag}\n  </url>`,
    '</urlset>',
    '',
  ].join('\n')
}

export function generateCommunityRobotsTxt(): string {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${CT_SITE_ORIGIN}/sitemap.xml`, ''].join('\n')
}
