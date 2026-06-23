import { describe, expect, it } from 'vitest'

import {
  CT_DESCRIPTION,
  CT_OG_IMAGE_PATH,
  CT_PAGE_TITLE,
  CT_SITE_ORIGIN,
  generateCommunityRobotsTxt,
  generateCommunitySitemapXml,
  getCommunityPageSeo,
} from '../pageSeo'

describe('community pageSeo', () => {
  it('defines a single canonical home URL without hash', () => {
    const seo = getCommunityPageSeo()

    expect(seo.title).toBe(CT_PAGE_TITLE)
    expect(seo.canonicalUrl).toBe(`${CT_SITE_ORIGIN}/`)
    expect(seo.description).toBe(CT_DESCRIPTION)
    expect(seo.description.length).toBeLessThanOrEqual(160)
    expect(seo.imageUrl).toBe(`${CT_SITE_ORIGIN}${CT_OG_IMAGE_PATH}`)
    expect(seo.imageWidth).toBe(1200)
    expect(seo.imageHeight).toBe(630)
  })

  it('generates robots.txt and sitemap.xml for the subdomain', () => {
    expect(generateCommunityRobotsTxt()).toContain(`Sitemap: ${CT_SITE_ORIGIN}/sitemap.xml`)
    expect(generateCommunitySitemapXml('2026-06-23')).toContain(`<loc>${CT_SITE_ORIGIN}/</loc>`)
    expect(generateCommunitySitemapXml('2026-06-23')).toContain('<lastmod>2026-06-23</lastmod>')
  })
})
