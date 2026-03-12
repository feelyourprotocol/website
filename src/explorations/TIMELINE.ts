/**
 * Timeline is a taxonomy that combines two dimensions: how settled an idea is (from
 * early mention to finalized spec) and where it sits relative to mainnet Ethereum
 * (specific hardfork vs. general readiness stage). Hardfork entries are named after
 * their Ethereum community event city of origin.
 *
 * The non-hardfork categories (Ready, Research, Ideas) are static. New hardfork
 * entries can be added as Ethereum's upgrade schedule evolves.
 */
export const TIMELINE: Timeline = {
  fusaka: {
    title: 'Fusaka',
    shortDescription: 'Active hardfork — EIPs finalized and scheduled for mainnet deployment.',
    emoji: '🏯',
    onChain: true,
    order: 100,
  },
  glamsterdam: {
    title: 'Glamsterdam',
    shortDescription: 'Upcoming hardfork — EIP candidates under active consideration.',
    emoji: '🌷',
    onChain: false,
    order: 110,
  },
  ready: {
    title: 'Ready',
    shortDescription:
      'Mature proposals that could be picked for a future hardfork with little friction.',
    emoji: '🍎',
    onChain: false,
    order: 500,
  },
  research: {
    title: 'Research',
    shortDescription:
      'Substantial drafts and papers with a clear direction, but final shaping still in progress.',
    emoji: '🔬',
    onChain: false,
    order: 600,
  },
  ideas: {
    title: 'Ideas',
    shortDescription:
      'Early-stage concepts — a mention on a forum or social media, not yet a formal proposal.',
    emoji: '💡',
    onChain: false,
    order: 700,
  },
}

export interface TimelineEntry {
  /** Display name. */
  title: string
  /** One-liner description, e.g. for tooltips or hover states. */
  shortDescription: string
  /** Emoji representing the entry visually. */
  emoji: string
  /** Whether the related EIP/research is already active on mainnet. */
  onChain: boolean
  /** Numeric ordering key; lower values appear earlier on the timeline. */
  order: number
}

export interface Timeline {
  [key: string]: TimelineEntry
}
