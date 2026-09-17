import type { Common } from '@ethereumjs/common'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'

/** Account pre-state applied via the state manager before block execution. */
export interface PreStateAccount {
  label: string
  address: PrefixedHexString
  balance?: bigint
  nonce?: bigint
  code?: PrefixedHexString
}

export interface TxSummaryLine {
  label: string
  detail: string
}

export interface TransferScenarioDefinition {
  id: string
  title: string
  lesson: string
  step: number
  preState: PreStateAccount[]
  txSummary: TxSummaryLine[]
  /** Expected EIP-7708 Transfer logs on Glamsterdam after a successful run. */
  expectedTransferLogsOnGlamsterdam: number
  /** Short teaching line when the receipt is empty on Glamsterdam. */
  emptyGlamsterdamHint?: string
  buildTransactions: (common: Common) => TypedTransaction[]
}

export interface ScenarioRunResult {
  scenarioId: string
  hardforkId: 'glamsterdam' | 'fusaka'
  hardforkLabel: string
  gasUsed: bigint
  txCount: number
  transferLogCount: number
  totalLogCount: number
  txSuccessful: boolean
}
