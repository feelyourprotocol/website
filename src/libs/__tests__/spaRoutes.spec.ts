import { describe, expect, it } from 'vitest'

import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import {
  generateRobotsTxt,
  generateSitemapXml,
  getSitemapPaths,
  getSitemapUrls,
  getSpaFallbackDirectories,
  SITE_ORIGIN,
} from '../spaRoutes'

describe('spaRoutes re-exports', () => {
  it('derives fallback directories for nginx try_files', () => {
    const dirs = getSpaFallbackDirectories()

    expect(dirs).not.toContain('')
    expect(dirs).toContain('imprint')
    expect(dirs).toContain('scaling')
    expect(dirs).toContain(Object.values(EXPLORATIONS)[0]!.path.replace(/^\//, ''))
  })

  it('builds sitemap URLs from indexed paths only', () => {
    const urls = getSitemapUrls()

    expect(urls).toContain(`${SITE_ORIGIN}/`)
    expect(urls).toContain(`${SITE_ORIGIN}/imprint`)
    expect(urls.length).toBe(getSitemapPaths().length)
    expect(urls.every((url) => url.startsWith(SITE_ORIGIN))).toBe(true)
    expect(urls.some((url) => url.endsWith('/privacy'))).toBe(false)
  })

  it('generates sitemap.xml and robots.txt', () => {
    const xml = generateSitemapXml()
    expect(xml).toContain('<?xml version="1.0"')
    expect(xml).toContain(`${SITE_ORIGIN}/scaling`)
    expect(xml).not.toContain('/404')

    for (const topic of Object.values(TOPICS)) {
      if (topic.explorations.length === 0) {
        expect(xml).not.toContain(`${SITE_ORIGIN}${topic.path}`)
      }
    }

    const robots = generateRobotsTxt()
    expect(robots).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)
    expect(robots).toContain('Allow: /')
  })
})
