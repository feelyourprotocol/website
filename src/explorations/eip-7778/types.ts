import type { Common } from '@ethereumjs/common'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'

export type HardforkChoice = 'glamsterdam' | 'fusaka'

export interface StorageSlot {
  slot: PrefixedHexString
  value: PrefixedHexString
}

export interface PreStateAccount {
  label: string
  address: PrefixedHexString
  balance?: bigint
  nonce?: bigint
  code?: PrefixedHexString
  storage?: StorageSlot[]
}

export interface ProgramLine {
  label: string
  detail: string
}

export interface LedgerExpectation {
  pay: bigint
  block: bigint
}

export interface RefundScenarioDefinition {
  id: string
  title: string
  lesson: string
  step: number
  preState: PreStateAccount[]
  programSummary: ProgramLine[]
  expected: Record<HardforkChoice, LedgerExpectation>
  buildTx: (common: Common, gasLimit: bigint) => TypedTransaction
}
