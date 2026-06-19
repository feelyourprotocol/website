import type { Common } from '@ethereumjs/common'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import type { PrefixedHexString } from '@ethereumjs/util'

/** BAL account fields the UI can spotlight per curriculum step. */
export type BalHighlightField =
  | 'balanceChanges'
  | 'nonceChanges'
  | 'codeChanges'
  | 'storageChanges'
  | 'storageReads'

/** Account pre-state applied via the state manager before block execution. */
export interface PreStateAccount {
  /** Short label for UI chips (e.g. "sender", "contract"). */
  label: string
  address: PrefixedHexString
  balance?: bigint
  nonce?: bigint
  code?: PrefixedHexString
  storage?: Array<[slot: PrefixedHexString, value: PrefixedHexString]>
}

/** Human-readable tx line for the condensed scenario panel. */
export interface TxSummaryLine {
  label: string
  detail: string
}

/** Annotated opcode line for optional bytecode strip in the UI. */
export interface BytecodeStep {
  opcode: string
  comment?: string
}

/**
 * One curriculum scenario: pre-state, txs, and metadata for the exploration UI.
 * Execution always goes through {@link runScenario} → `runBlock()` on Amsterdam.
 */
export interface BalScenarioDefinition {
  id: string
  title: string
  lesson: string
  step: number
  adjustable: boolean
  highlightFields: BalHighlightField[]
  preState: PreStateAccount[]
  txSummary: TxSummaryLine[]
  bytecodeSteps?: BytecodeStep[]
  buildTransactions: (common: Common) => TypedTransaction[]
}

export interface ScenarioRunResult {
  scenarioId: string
  preState: PreStateAccount[]
  balJson: BALJSONBlockAccessList
  balHash: PrefixedHexString
  gasUsed: bigint
  txCount: number
}
