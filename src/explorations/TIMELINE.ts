/**
 * Website catalog timeline — forks that have explorations.
 *
 * Ids match the MCP lineage catalog (`mcp-execution-engine` `LINEAGE_FORK_IDS`).
 * From Shapella on, the combined upgrade name is canonical; the EL city name
 * is an alias (osaka → fusaka, amsterdam → glamsterdam). Historical lineage
 * forks (berlin … pectra) exist on MCP for lab runs; add them here only when
 * an exploration is registered.
 *
 * Role (`historical` | `current` | `preview`) is the same `ForkRole` as MCP
 * `namedForks`. Tooltips come from `FORK_ROLE_HINT`. Fork roles stay sharp;
 * EIP twins stay after activation (adoption still matters). Do not drop a
 * TIMELINE row or exploration just because that fork is live on mainnet.
 */
export type ForkRole = 'historical' | 'current' | 'preview'

export const FORK_ROLE_HINT: Record<ForkRole, string> = {
  historical: 'Past hardfork — already superseded on mainnet.',
  current: 'Active hardfork — live on mainnet today.',
  preview: 'Upcoming hardfork — EIP candidates under active consideration.',
}

/** Fork ids that have a browse pill on the website (subset of MCP lineage). */
export type WebsiteTimelineId = 'fusaka' | 'glamsterdam'

export const TIMELINE: Timeline = {
  fusaka: {
    title: 'Fusaka',
    role: 'current',
    emoji: '🏯',
    order: 100,
  },
  glamsterdam: {
    title: 'Glamsterdam',
    role: 'preview',
    emoji: '🌷',
    order: 110,
  },
}

export interface TimelineEntry {
  /** Display name (combined upgrade name). */
  title: string
  /** Same role vocabulary as MCP `namedForks[].role`. */
  role: ForkRole
  /** Emoji representing the entry visually. */
  emoji: string
  /** Numeric ordering key; higher values appear first (top) on the timeline. */
  order: number
}

export type Timeline = Record<WebsiteTimelineId, TimelineEntry>
