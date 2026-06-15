import { describe, expect, it } from 'vitest'

import { DOCS_ADD_EXPLORATION, DOCS_HOME, docsPage } from '../docsUrls'

describe('docsUrls', () => {
  it('builds home URL with index.html', () => {
    expect(DOCS_HOME).toBe('https://docs.feelyourprotocol.org/index.html')
    expect(docsPage()).toBe(DOCS_HOME)
  })

  it('builds page URLs with .html suffix', () => {
    expect(DOCS_ADD_EXPLORATION).toBe(
      'https://docs.feelyourprotocol.org/contributing/adding-an-exploration.html',
    )
    expect(docsPage('guide/architecture', 'topics')).toBe(
      'https://docs.feelyourprotocol.org/guide/architecture.html#topics',
    )
  })
})
