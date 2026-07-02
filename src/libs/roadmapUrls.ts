/** Production roadmap URLs (static host serves VitePress output as `.html` files). */
export const ROADMAP_ORIGIN = 'https://roadmap.feelyourprotocol.org'

export function roadmapPage(path = '', hash?: string): string {
  const slug = path.replace(/^\//, '').replace(/\.html$/, '')
  const fragment = hash ? `#${hash.replace(/^#/, '')}` : ''
  if (!slug) return `${ROADMAP_ORIGIN}/index.html${fragment}`
  return `${ROADMAP_ORIGIN}/${slug}.html${fragment}`
}

export const ROADMAP_HOME = roadmapPage()
export const ROADMAP_VISION = roadmapPage('vision/problem-vision')
export const ROADMAP_TOKEN = roadmapPage('monetization/token')

/**
 * Project X account — single source of truth for the fleet.
 *
 * Handle: **@FeelEthereum** — not @feelyourprotocol (domain name ≠ X handle).
 * When adding social links elsewhere (roadmap/docs/community-token VitePress configs,
 * copy, error messages), import or mirror this constant and keep the comment.
 */
export const FYP_X_HANDLE = '@FeelEthereum' as const
export const FYP_X_URL = 'https://x.com/FeelEthereum'
