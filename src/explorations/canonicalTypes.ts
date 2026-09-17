import type { McpForkId } from '@/explorations/forkCatalog'
import type { Tag } from '@/explorations/TAGS'
import type { WebsiteTimelineId } from '@/explorations/TIMELINE'
import type { TopicId } from '@/explorations/topicIds'

/**
 * Schema source of truth for protocol-change metadata shared by the explorations
 * website and MCP twins. Workflow: extend this file → fill `eip-NNNN/canonical.ts`
 * → copy into engine `EipCapability` and `mcp-docs/use/eips/` (website wins on conflict).
 *
 * **Three fork vocabularies (do not mix):**
 * - `taxonomy.timeline` — website browse pill id (`WebsiteTimelineId`, subset of lineage).
 * - `mcp.comparison.*ForkId` — full MCP lineage id (`McpForkId`; see `forkCatalog.ts`).
 * - Fork **role** (`historical` | `current` | `preview`) lives on `TIMELINE` / probe
 *   `namedForks`, not on each EIP. EL city names (`osaka`, `prague`, …) are runtime
 *   aliases only — never put them in CANONICAL.
 *
 * Not every protocol feature gets a row here — fork-level behaviour (e.g. set-code txs
 * via `authorizationList` on Pectra+) is documented on tool pages, not as a catalogue twin.
 */
export type ChangeNature =
  | 'repricing'
  | 'new-capability'
  | 'new-structure'
  | 'new-exec-model'
  | 'limit'
  | 'economic'

/**
 * MCP verbs that honestly address this change. Copied to engine `EipCapability.shapes`
 * and the per-EIP docs page. `probe` is describe_capabilities only — do not list on twins.
 */
export type McpQueryShape = 'simulate' | 'transaction' | 'block' | 'generate' | 'inspect' | 'probe'

/** Stable ids and spec links — copied to `info.ts` title/SEO and MCP module header. */
export interface ProtocolChangeIdentity {
  /** Folder id and route key, e.g. `eip-7883`. Must match `src/explorations/<id>/`. */
  id: string
  /** EIP number when applicable. */
  eip: number
  /** Canonical spec URL (EIPs site). */
  specUrl: string
  /** Short human name; feeds exploration `title` and MCP catalogue `name`. */
  name: string
}

/** Problem framing — drives home cards, intro lead, and MCP docs opening. */
export interface ProtocolChangeQuestion {
  /** One sentence; bold intro lead on the site and anchor on the MCP EIP page. */
  coreQuestion: string
  /**
   * High-level class of change. Copied to engine `changeNature`; used in coverage tables
   * and agent briefs. Same closed set on website and engine — no ad hoc strings.
   */
  changeNature: ChangeNature
}

/** Website navigation taxonomy — one topic hub and one timeline pill per exploration. */
export interface ProtocolChangeTaxonomy {
  /** Static pillar id from `TOPICS.ts` / `topicIds.ts` (scaling, ux, …). */
  topic: TopicId
  /**
   * Fork id for browse filters and preview pills — must be a key of `TIMELINE.ts`
   * (`WebsiteTimelineId`). Same string as MCP `namedForks[].id` when that fork has
   * explorations; historical forks (e.g. `pectra`) stay in `McpForkId` only until a page exists.
   */
  timeline: WebsiteTimelineId
  /** Reusable concepts from `TAGS.ts` (max ~4); not EIP numbers. */
  tags: Tag[]
}

/** EIP process status on eips.ethereum.org — not fork `role` and not `docsStatus`. */
export type EipProcessStatus = 'Draft' | 'Review' | 'Last Call' | 'Final' | 'Stagnant' | 'Withdrawn'

/**
 * Spec/process maturity — optional prose for MCP module replicas and briefs.
 * Not shown on the public exploration UI today.
 */
export interface ProtocolChangeMaturity {
  /** EIP editor status (Draft, Final, …). */
  eipStatus?: EipProcessStatus
  /** Client / library implementation notes (free text). */
  implMaturity?: string
  /** Test coverage notes (free text). */
  testMaturity?: string
}

/** MCP twin hints — replicated into engine module + human catalogue; partially surfaced on site. */
export interface ProtocolChangeMcpHints {
  /** Runnable verbs for this twin (see `McpQueryShape`). */
  shapes: McpQueryShape[]
  /** Agent/search vocabulary; copied to engine `keywords`. Not shown on exploration UI. */
  keywords?: string[]
  /**
   * Suggested compare pair for docs and briefs (`baselineForkId` → `previewForkId`).
   * Ids are `McpForkId` lineage names, not EL aliases. At probe time, engine
   * `describe_capabilities().eips[].comparison` is **derived from `eipIntroductions`**
   * (predecessor vs `introducedAt`) — notes here are for humans/replicas, not guaranteed in JSON.
   */
  comparison?: {
    baselineForkId: McpForkId
    previewForkId: McpForkId
    /** Optional compare copy for mcp-docs; may not appear on the probe payload. */
    note?: string
  }
  /**
   * Per-EIP MCP docs page status. `runnable` = listed in probe `eips[]`.
   * `planned-module` = docs page before engine module ships.
   * `sunset` = retired exploration or no honest lab shape — not “already on mainnet.”
   * Drives home/catalog MCP pill when `runnable` or `planned-module`.
   */
  docsStatus?: 'runnable' | 'planned-module' | 'sunset'
}

/** Full canonical record for one exploration twin (or future MCP-only row). */
export interface ProtocolChangeCanonical {
  identity: ProtocolChangeIdentity
  question: ProtocolChangeQuestion
  taxonomy: ProtocolChangeTaxonomy
  maturity: ProtocolChangeMaturity
  mcp: ProtocolChangeMcpHints
}
