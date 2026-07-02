/** Social card ids — single source of truth (also imported by og/src/social/cardIds.ts). */
export const SOCIAL_CARD_IDS = ['hero', 'timeline', 'board'] as const

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
    title: 'Building an AI pipeline for the future Ethereum protocol.',
    subtitle:
      'Vision, tracks, and draft concepts toward a deterministic API & MCP server for upcoming forks, EIPs, and research.',
    footerHint: 'Conceptualization — targets, not promises',
  },
  timeline: {
    id: 'timeline',
    eyebrow: 'Phase 3 · Timeline',
    title: 'Where we’ve been — and where we’re headed',
    subtitle: 'Three phases: side project → funded focus → sustainable business (future-protocol API).',
    footerHint: 'Filled dots = reached · hollow = upcoming targets',
  },
  board: {
    id: 'board',
    eyebrow: 'Phase 3 · Roadmap',
    title: 'Parallel tracks',
    subtitle: 'Engine & API, website, infrastructure, and business — moving at different speeds.',
    footerHint: 'Data-driven board — edit roadmap/data/roadmap.ts',
  },
}
