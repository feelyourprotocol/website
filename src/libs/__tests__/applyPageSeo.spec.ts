import { afterEach, describe, expect, it } from 'vitest'

import { EXPLORATIONS } from '@/explorations/REGISTRY'

import { applyPageSeo } from '../applyPageSeo'
import { getPageSeoForPath } from '../pageSeo'

describe('applyPageSeo', () => {
  afterEach(() => {
    document.head.innerHTML = ''
    document.title = ''
  })

  it('updates document title, description, canonical, and JSON-LD', () => {
    const exploration = Object.values(EXPLORATIONS)[0]!
    const seo = getPageSeoForPath(exploration.path)

    applyPageSeo(seo)

    expect(document.title).toBe(seo.title)
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      seo.description,
    )
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      seo.canonicalUrl,
    )
    expect(document.getElementById('page-seo-jsonld')?.textContent).toContain('BreadcrumbList')
  })

  it('sets robots noindex for filtered routes', () => {
    applyPageSeo(getPageSeoForPath('/all'))

    expect(document.querySelector('meta[name="robots"]')).toBeNull()

    applyPageSeo({
      ...getPageSeoForPath('/all'),
      noindex: true,
    })

    expect(document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex, follow',
    )
  })
})
