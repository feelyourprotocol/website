/**
 * MCP lineage fork ids (Berlin → Glamsterdam). Keep in sync with
 * `mcp-execution-engine/src/forks/lineage.ts` `LINEAGE_FORK_IDS`.
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
