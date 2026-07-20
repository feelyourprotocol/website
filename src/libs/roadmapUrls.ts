/** Production roadmap URLs (static host serves VitePress output as `.html` files). */
export const ROADMAP_ORIGIN = 'https://roadmap.feelyourprotocol.org'

/** Production MCP docs URLs (static host serves VitePress output as `.html` files). */
export const MCP_DOCS_ORIGIN = 'https://mcp-docs.feelyourprotocol.org'

export function roadmapPage(path = '', hash?: string): string {
  const slug = path.replace(/^\//, '').replace(/\.html$/, '')
  const fragment = hash ? `#${hash.replace(/^#/, '')}` : ''
  if (!slug) return `${ROADMAP_ORIGIN}/index.html${fragment}`
  return `${ROADMAP_ORIGIN}/${slug}.html${fragment}`
}

export const ROADMAP_HOME = roadmapPage()
export const ROADMAP_VISION = roadmapPage('vision/problem-vision')
export const ROADMAP_TOKEN = roadmapPage('monetization/token')

export function mcpDocsPage(path = '', hash?: string): string {
  const slug = path.replace(/^\//, '').replace(/\.html$/, '')
  const fragment = hash ? `#${hash.replace(/^#/, '')}` : ''
  if (!slug) return `${MCP_DOCS_ORIGIN}/index.html${fragment}`
  return `${MCP_DOCS_ORIGIN}/${slug}.html${fragment}`
}

export const MCP_DOCS_HOME = mcpDocsPage()
export const MCP_DOCS_OVERVIEW = mcpDocsPage('use/introduction')

/**
 * Project X account — single source of truth for the fleet.
 *
 * Handle: **@FeelEthereum** — not @feelyourprotocol (domain name ≠ X handle).
 * When adding social links elsewhere (roadmap/website-docs/community-token VitePress configs,
 * copy, error messages), import or mirror this constant and keep the comment.
 */
export const FYP_X_HANDLE = '@FeelEthereum' as const
export const FYP_X_URL = 'https://x.com/FeelEthereum'
