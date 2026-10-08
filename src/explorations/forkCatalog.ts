/**
 * MCP lineage fork ids (Berlin → Glamsterdam). Used in `canonical.ts` for
 * `mcp.comparison` — not for website browse pills (`WebsiteTimelineId` in TIMELINE.ts).
 *
 * Keep in sync with `mcp-execution-engine/src/forks/lineage.ts` `LINEAGE_FORK_IDS`.
 * EthereumJS still runs on `elId` aliases (osaka, prague, …) inside the engine.
 */
export const MCP_FORK_IDS = [
  'berlin',
  'london',
  'paris',
  'shapella',
  'dencun',
  'pectra',
  'fusaka',
  'glamsterdam',
] as const

export type McpForkId = (typeof MCP_FORK_IDS)[number]

/**
 * Community upgrade mascots ([EIP-8066](https://eips.ethereum.org/EIPS/eip-8066)).
 * Berlin and London predate the formal process. Keep in sync with engine
 * `mcp-execution-engine/src/forks/mascots.ts`.
 */
export const FORK_MASCOT_EMOJI: Partial<Record<McpForkId, string>> = {
  paris: '🐼',
  shapella: '🦉',
  dencun: '🐡',
  pectra: '🦒',
  fusaka: '🦓',
  glamsterdam: '🐻‍❄️',
}

/** Display title with leading mascot when known. */
export function forkDisplayLabel(id: string, title: string): string {
  const emoji = FORK_MASCOT_EMOJI[id as McpForkId]
  return emoji ? `${emoji} ${title}` : title
}

/** Segmented hardfork toggle rows for Fusaka vs Glamsterdam widgets. */
export function fypHardforkToggleOptions(): Array<{
  value: 'fusaka' | 'glamsterdam'
  label: string
  testId: string
}> {
  return [
    {
      value: 'glamsterdam',
      label: forkDisplayLabel('glamsterdam', 'Glamsterdam'),
      testId: 'hardfork-glamsterdam',
    },
    {
      value: 'fusaka',
      label: forkDisplayLabel('fusaka', 'Fusaka'),
      testId: 'hardfork-fusaka',
    },
  ]
}
