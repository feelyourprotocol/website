/** Documentation hub landing (fleet entrypoint). */
export const DOCS_HUB_ORIGIN = 'https://docs.feelyourprotocol.org'

/** Website contributor docs (VitePress on website-docs subdomain). */
export const WEBSITE_DOCS_ORIGIN = 'https://website-docs.feelyourprotocol.org'

export function websiteDocsPage(path = '', hash?: string): string {
  const slug = path.replace(/^\//, '').replace(/\.html$/, '')
  const fragment = hash ? `#${hash.replace(/^#/, '')}` : ''
  if (!slug) return `${WEBSITE_DOCS_ORIGIN}/index.html${fragment}`
  return `${WEBSITE_DOCS_ORIGIN}/${slug}.html${fragment}`
}

export const WEBSITE_DOCS_HOME = websiteDocsPage()
export const WEBSITE_DOCS_ADD_EXPLORATION = websiteDocsPage('contributing/adding-an-exploration')

/** @deprecated Use {@link WEBSITE_DOCS_ORIGIN} */
export const DOCS_ORIGIN = WEBSITE_DOCS_ORIGIN

/** @deprecated Use {@link websiteDocsPage} */
export const docsPage = websiteDocsPage

/** @deprecated Use {@link WEBSITE_DOCS_HOME} */
export const DOCS_HOME = WEBSITE_DOCS_HOME

/** @deprecated Use {@link WEBSITE_DOCS_ADD_EXPLORATION} */
export const DOCS_ADD_EXPLORATION = WEBSITE_DOCS_ADD_EXPLORATION
