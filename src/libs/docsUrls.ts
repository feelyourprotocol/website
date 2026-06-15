/** Production docs URLs (static host serves VitePress output as `.html` files). */
export const DOCS_ORIGIN = 'https://docs.feelyourprotocol.org'

export function docsPage(path = '', hash?: string): string {
  const slug = path.replace(/^\//, '').replace(/\.html$/, '')
  const fragment = hash ? `#${hash.replace(/^#/, '')}` : ''
  if (!slug) return `${DOCS_ORIGIN}/index.html${fragment}`
  return `${DOCS_ORIGIN}/${slug}.html${fragment}`
}

export const DOCS_HOME = docsPage()
export const DOCS_ADD_EXPLORATION = docsPage('contributing/adding-an-exploration')
