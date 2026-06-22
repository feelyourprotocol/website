import { describe, expect, it } from 'vitest'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import {
  DEFAULT_DESCRIPTION,
  formatEipSpecLabel,
  generateRobotsTxt,
  generateSitemapXml,
  getBreadcrumbsForPath,
  getPageSeoForPath,
  getPageSeoForRoute,
  getSitemapPaths,
  getStaticShellHeading,
  getValidSpaPaths,
  injectBuiltPageHtml,
  injectSeoIntoHtml,
  injectStaticShellIntoHtml,
  SITE_ORIGIN,
  stripHtml,
  truncateDescription,
} from '../pageSeo'

describe('pageSeo', () => {
  it('lists all router paths except the catch-all 404 route', () => {
    const paths = getValidSpaPaths()

    expect(paths).toContain('/')
    expect(paths).toContain('/imprint')
    expect(paths).toContain('/all')

    for (const topic of Object.values(TOPICS)) {
      expect(paths).toContain(topic.path)
    }
    for (const exploration of Object.values(EXPLORATIONS)) {
      expect(paths).toContain(exploration.path)
    }
  })

  it('excludes empty topic pages from the sitemap', () => {
    const sitemapPaths = getSitemapPaths()

    expect(sitemapPaths).toContain('/scaling')
    expect(sitemapPaths).toContain('/ux')
    expect(sitemapPaths).not.toContain('/privacy')
    expect(sitemapPaths.length).toBeLessThan(getValidSpaPaths().length)
  })

  it('builds exploration page meta with EIP-specific title and description', () => {
    const exploration = Object.values(EXPLORATIONS)[0]!
    const seo = getPageSeoForPath(exploration.path)

    expect(seo.title).toContain(exploration.title)
    expect(seo.description.length).toBeGreaterThan(20)
    expect(seo.canonicalUrl).toBe(`${SITE_ORIGIN}${exploration.path}`)
    expect(JSON.stringify(seo.jsonLd)).toContain(exploration.infoURL)
  })

  it('marks filtered list views as noindex with a clean canonical URL', () => {
    const seo = getPageSeoForRoute('/all', { tag: 'EVM' })

    expect(seo.noindex).toBe(true)
    expect(seo.canonicalUrl).toBe(`${SITE_ORIGIN}/all`)
  })

  it('marks empty topic pages as noindex', () => {
    const seo = getPageSeoForPath('/privacy')

    expect(seo.noindex).toBe(true)
  })

  it('builds breadcrumbs for exploration pages', () => {
    const exploration = Object.values(EXPLORATIONS)[0]!
    const topic = TOPICS[exploration.topic]
    const crumbs = getBreadcrumbsForPath(exploration.path)

    expect(crumbs.map((item) => item.label)).toEqual(['Home', topic.title, exploration.title])
    expect(crumbs[1]?.to).toBe(topic.path)
  })

  it('generates sitemap.xml with lastmod tags', () => {
    const xml = generateSitemapXml({ '/scaling': '2026-06-08' })

    expect(xml).toContain('<lastmod>2026-06-08</lastmod>')
    expect(xml).toContain(`${SITE_ORIGIN}/scaling`)
    expect(xml).not.toContain('/privacy')
  })

  it('injects title, meta, canonical, and JSON-LD into HTML', () => {
    const html = injectSeoIntoHtml(
      '<!DOCTYPE html><html><head><title>Old</title></head><body></body></html>',
      getPageSeoForPath('/'),
    )

    expect(html).toContain('<title>Feel Your Protocol</title>')
    expect(html).toContain(`<meta name="description" content="${DEFAULT_DESCRIPTION}">`)
    expect(html).toContain(`<link rel="canonical" href="${SITE_ORIGIN}/">`)
    expect(html).toContain('application/ld+json')
  })

  it('builds static shell headings from route context', () => {
    const exploration = Object.values(EXPLORATIONS)[0]!
    const topic = TOPICS[exploration.topic]

    expect(getStaticShellHeading('/')).toBe(
      'Feel Your Protocol — Interactive Ethereum Protocol Explorations',
    )
    expect(getStaticShellHeading('/robustness')).toBe('Robustness')
    expect(getStaticShellHeading(exploration.path)).toBe(exploration.title)
    expect(getBreadcrumbsForPath(exploration.path).at(-1)?.label).toBe(exploration.title)
    expect(getStaticShellHeading(topic.path)).toBe(topic.title)
  })

  it('injects static above-the-fold shell into #app', () => {
    const html = injectBuiltPageHtml(
      '<!DOCTYPE html><html><head><title>Old</title></head><body><div id="app"></div></body></html>',
      getPageSeoForPath('/scaling'),
      { logoSrc: '/assets/logo-TEST.png' },
    )

    expect(html).toContain('data-static-shell')
    expect(html).toContain('fetchpriority="high"')
    expect(html).toContain('/assets/logo-TEST.png')
    expect(html).toContain('<h1 class="sr-only">Scaling</h1>')
    expect(html).toContain('<title>Scaling — Feel Your Protocol</title>')
  })

  it('throws when static shell injection cannot find #app', () => {
    expect(() =>
      injectStaticShellIntoHtml('<html><body></body></html>', '/', { logoSrc: '/assets/logo.png' }),
    ).toThrow('#app placeholder not found')
  })

  it('formats helper utilities', () => {
    expect(stripHtml('<b>Hello</b> world')).toBe('Hello world')
    expect(truncateDescription('word '.repeat(40)).length).toBeLessThanOrEqual(160)
    expect(formatEipSpecLabel('eip-8024')).toBe('EIP-8024')
  })

  it('generates robots.txt', () => {
    const robots = generateRobotsTxt()
    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
    expect(robots).toContain('Allow: /')
  })
})
