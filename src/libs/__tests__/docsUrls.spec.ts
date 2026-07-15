import { describe, expect, it } from 'vitest'

import {
  DOCS_HUB_ORIGIN,
  WEBSITE_DOCS_ADD_EXPLORATION,
  WEBSITE_DOCS_HOME,
  WEBSITE_DOCS_ORIGIN,
  websiteDocsPage,
} from '@/libs/docsUrls'

describe('docsUrls', () => {
  it('DOCS_HUB_ORIGIN is the fleet landing', () => {
    expect(DOCS_HUB_ORIGIN).toBe('https://docs.feelyourprotocol.org')
  })

  it('WEBSITE_DOCS_HOME points at website-docs index', () => {
    expect(WEBSITE_DOCS_HOME).toBe('https://website-docs.feelyourprotocol.org/index.html')
  })

  it('websiteDocsPage builds slug paths', () => {
    expect(websiteDocsPage('contributing/adding-an-exploration')).toBe(
      'https://website-docs.feelyourprotocol.org/contributing/adding-an-exploration.html',
    )
    expect(websiteDocsPage('guide/architecture', 'topics')).toBe(
      'https://website-docs.feelyourprotocol.org/guide/architecture.html#topics',
    )
  })

  it('WEBSITE_DOCS_ORIGIN is stable', () => {
    expect(WEBSITE_DOCS_ORIGIN).toBe('https://website-docs.feelyourprotocol.org')
  })

  it('WEBSITE_DOCS_ADD_EXPLORATION is stable', () => {
    expect(WEBSITE_DOCS_ADD_EXPLORATION).toBe(
      'https://website-docs.feelyourprotocol.org/contributing/adding-an-exploration.html',
    )
  })
})
