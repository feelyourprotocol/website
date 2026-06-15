import { describe, expect, it } from 'vitest'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import {
  generateRobotsTxt,
  generateSitemapXml,
  getSitemapUrls,
  getSpaFallbackDirectories,
  getValidSpaPaths,
  SITE_ORIGIN,
} from '../spaRoutes'

describe('spaRoutes', () => {
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

  it('derives fallback directories for nginx try_files', () => {
    const dirs = getSpaFallbackDirectories()

    expect(dirs).not.toContain('')
    expect(dirs).toContain('imprint')
    expect(dirs).toContain('scaling')
    expect(dirs).toContain(Object.values(EXPLORATIONS)[0]!.path.replace(/^\//, ''))
  })

  it('builds sitemap URLs for all valid SPA paths', () => {
    const urls = getSitemapUrls()

    expect(urls).toContain(`${SITE_ORIGIN}/`)
    expect(urls).toContain(`${SITE_ORIGIN}/imprint`)
    expect(urls.length).toBe(getValidSpaPaths().length)
    expect(urls.every((url) => url.startsWith(SITE_ORIGIN))).toBe(true)
  })

  it('generates sitemap.xml and robots.txt', () => {
    const xml = generateSitemapXml()
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain(`${SITE_ORIGIN}/scaling`)
    expect(xml).not.toContain('/404')

    const robots = generateRobotsTxt()
    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
    expect(robots).toContain('Allow: /')
  })
})
