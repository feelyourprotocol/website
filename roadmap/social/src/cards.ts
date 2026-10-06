/** Social card ids — single source of truth (also imported by og/src/social/cardIds.ts). */
export const SOCIAL_CARD_IDS = [
  'hero',
  'launch',
  'timeline',
  'board',
  'youtube-banner',
  'twitter-banner',
] as const

export type SocialCardId = (typeof SOCIAL_CARD_IDS)[number]

export function isSocialCardId(value: string): value is SocialCardId {
  return (SOCIAL_CARD_IDS as readonly string[]).includes(value)
}

export type SocialCardMeta = {
  id: SocialCardId
  title: string
  subtitle: string
  eyebrow: string
  footerHint: string
}

export const SOCIAL_CARDS: Record<SocialCardId, SocialCardMeta> = {
  hero: {
    id: 'hero',
    eyebrow: 'Phase 3 · Roadmap',
    title: 'Deterministic oracle for the future Ethereum protocol.',
    subtitle:
      'The hosted MCP is live — 6 October 2026, full Glamsterdam, no payment. Textbook on feelyourprotocol.org.',
    footerHint: 'roadmap.feelyourprotocol.org',
  },
  launch: {
    id: 'launch',
    eyebrow: 'Open · Glamsterdam Sepolia',
    title: '6 October 2026',
    subtitle:
      'The MCP server has launched at mcp.feelyourprotocol.org — free Glamsterdam runs, the same day as Sepolia. Connect an agent, or explore the textbook.',
    footerHint: 'feelyourprotocol.org · connect on mcp-docs',
  },
  timeline: {
    id: 'timeline',
    eyebrow: 'Roadmap · Timeline',
    title: 'From the first commit',
    subtitle: 'The dated story, through the public MCP launch on 6 October 2026.',
    footerHint: 'Every mark on this card has happened',
  },
  board: {
    id: 'board',
    eyebrow: 'Phase 3 · Roadmap',
    title: 'Parallel tracks',
    subtitle: 'Engine & API, website, infrastructure, and business — moving at different speeds.',
    footerHint: 'Data-driven board — edit roadmap/data/roadmap.ts',
  },
  'youtube-banner': {
    id: 'youtube-banner',
    eyebrow: 'YouTube · @FeelEthereum',
    title: 'Feel Your Protocol',
    subtitle: 'Ethereum Protocol Explorations for Humans and AI',
    footerHint: 'EIP explainers · feelyourprotocol.org',
  },
  'twitter-banner': {
    id: 'twitter-banner',
    eyebrow: 'Interactive EIP explorations',
    title: 'Hands on.',
    subtitle: 'Explore protocol changes in the browser — real library code, no install.',
    footerHint: 'feelyourprotocol.org',
  },
}
