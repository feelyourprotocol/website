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
