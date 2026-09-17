import type { Tag } from '@/explorations/TAGS'

/**
 * Schema source of truth for protocol-change metadata shared by the explorations
 * website and MCP. Add new shared parameters here first, then fill per-EIP
 * `canonical.ts`, then replicate into engine `EipCapability` and mcp-docs.
 */
export type ChangeNature =
  | 'repricing'
  | 'new-capability'
  | 'new-structure'
  | 'new-exec-model'
  | 'limit'
  | 'economic'

/** Query shapes the MCP surface may expose for this change. */
export type McpQueryShape = 'simulate' | 'transaction' | 'block' | 'generate' | 'inspect' | 'probe'

export interface ProtocolChangeIdentity {
  /** Folder id and route key, e.g. `eip-7883`. */
  id: string
  /** EIP number when applicable. */
  eip: number
  /** Canonical spec URL. */
  specUrl: string
  /** Short human name (may feed exploration title). */
  name: string
}

export interface ProtocolChangeQuestion {
  /** One sentence — bold intro lead and MCP page anchor. */
  coreQuestion: string
  changeNature: ChangeNature
}

export interface ProtocolChangeTaxonomy {
  topic: string
  /** Catalog fork id — combined upgrade name (`fusaka`, `glamsterdam`, `pectra`, …). Same as MCP `namedForks[].id`. */
  timeline: string
  tags: Tag[]
}

export interface ProtocolChangeMaturity {
  eipStatus?: string
  implMaturity?: string
  testMaturity?: string
}

export interface ProtocolChangeMcpHints {
  /** Shapes that address this problem set (`simulate`, `transaction`, `block`, `generate`, …). */
  shapes: McpQueryShape[]
  keywords?: string[]
  /**
   * Optional baseline vs preview fork pair. Ids are MCP catalog ids
   * (`fusaka`, `glamsterdam`, `pectra`, `dencun`, …), not EthereumJS EL names.
   */
  comparison?: {
    baselineForkId: string
    previewForkId: string
    note?: string
  }
  /**
   * Layer A docs page status. `planned-module` = page ships before a runnable catalog entry.
   * `sunset` means the lab cannot show the effect, or a later explicit cleanup — not
   * "already on mainnet." Activation keeps the exploration and MCP twin; fork `role`
   * may rotate around them.
   */
  docsStatus?: 'runnable' | 'planned-module' | 'sunset'
}

export interface ProtocolChangeCanonical {
  identity: ProtocolChangeIdentity
  question: ProtocolChangeQuestion
  taxonomy: ProtocolChangeTaxonomy
  maturity: ProtocolChangeMaturity
  mcp: ProtocolChangeMcpHints
}
