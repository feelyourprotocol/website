/** Social card ids — single source of truth (also imported by og/src/social/cardIds.ts). */
export const SOCIAL_CARD_IDS = ['hero', 'launch', 'timeline', 'board'] as const

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
      'MCP tools built — public hosted launch week 5–9 October 2026. Textbook on feelyourprotocol.org today.',
    footerHint: 'roadmap.feelyourprotocol.org',
  },
  launch: {
    id: 'launch',
    eyebrow: 'Launch week · 5–9 Oct 2026',
    title: 'Public hosted MCP — opening soon.',
    subtitle:
      'mcp.feelyourprotocol.org · describe_capabilities + run_evm_bytecode · x402 on Base. Hosted is the product.',
    footerHint: 'Explorations live today · agents at launch',
  },
  timeline: {
    id: 'timeline',
    eyebrow: 'Phase 3 · Timeline',
    title: 'Where we’ve been — and where we’re headed',
    subtitle: 'Side project → funded focus → build to public launch.',
    footerHint: 'Filled dots = reached · hollow = upcoming',
  },
  board: {
    id: 'board',
    eyebrow: 'Phase 3 · Roadmap',
    title: 'Parallel tracks',
    subtitle: 'Engine & API, website, infrastructure, and business — moving at different speeds.',
    footerHint: 'Data-driven board — edit roadmap/data/roadmap.ts',
  },
}
