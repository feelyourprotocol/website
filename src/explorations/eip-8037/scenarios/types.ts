import type { Common } from '@ethereumjs/common'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'

export type HardforkChoice = 'amsterdam' | 'osaka'
export type GasLimitMode = 'classic' | 'recommended'

/** Account pre-state applied via the state manager before tx execution. */
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

export interface GasScenarioDefinition {
  id: string
  title: string
  lesson: string
  step: number
  preState: PreStateAccount[]
  txSummary: TxSummaryLine[]
  /**
   * Floor for recommended `gasLimit` when `estimateTxGasDimensions` misses
   * execution-only state gas (SSTORE).
   */
  recommendedGasLimitFloor?: bigint
  /** Expected Amsterdam `txStateGas` after a successful run (protocol claim). */
  expectedAmsterdamStateGas: bigint
  buildTx: (common: Common, gasLimit: bigint) => TypedTransaction
}

export interface ScenarioRunResult {
  scenarioId: string
  hardforkId: HardforkChoice
  hardforkLabel: string
  gasLimitMode: GasLimitMode
  gasLimit: bigint
  txSuccessful: boolean
  exceptionError?: string
  txRegularGas: bigint
  txStateGas: bigint
  totalGasSpent: bigint
}
