import type { Common } from '@ethereumjs/common'
import type { TypedTransaction } from '@ethereumjs/tx'
import type { PrefixedHexString } from '@ethereumjs/util'

export type HardforkChoice = 'amsterdam' | 'osaka'

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

export interface ProgramSummaryLine {
  label: string
  detail: string
}

/** Spec components for the state-touching opcode — not including PUSH glue. */
export interface CostComponents {
  access: bigint
  write: bigint
  create: bigint
  /** Where the create charge is metered. */
  createMeter: 'none' | 'regular' | 'state'
}

export interface AccessScenarioDefinition {
  id: string
  title: string
  lesson: string
  step: number
  preState: PreStateAccount[]
  programSummary: ProgramSummaryLine[]
  expectedProgramGas: Record<HardforkChoice, bigint>
  expectedComponents: Record<HardforkChoice, CostComponents>
  expectedAmsterdamStateGas: bigint
  buildTx: (common: Common, gasLimit: bigint) => TypedTransaction
}

export interface ScenarioRunResult {
  scenarioId: string
  hardforkId: HardforkChoice
  hardforkLabel: string
  programSuccessful: boolean
  exceptionError?: string
  programGas: bigint
  stateGas: bigint
  components: CostComponents
}
