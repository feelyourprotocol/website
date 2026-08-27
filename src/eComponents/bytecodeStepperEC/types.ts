import type { ExecResult } from '@ethereumjs/evm'

/** Exploration-local config passed to BytecodeStepperEC. EVM instance stays in MyC.vue. */
export interface BytecodeStepperConfig {
  /** Must match exploration folder id and REGISTRY key. */
  explorationId: string
  /** Key from `examples.ts` selected on first load. */
  defaultExample: string
  /** Gas limit for EVM runs (default applied in component if omitted). */
  gasLimit?: bigint
  /** Max stack items shown in the UI. */
  maxStackDisplay?: number
  /** Max memory bytes rendered in the memory panel. */
  maxMemoryBytes?: number
}

export type RunMode = 'idle' | 'stepping' | 'running' | 'finished' | 'error'

export interface InstructionRow {
  pc: number
  opcodeByte: number
  name: string
  immediateHex?: string
  size: number
  /** Spaced hex of this instruction's bytes, e.g. "60 01" — matches the input string at offset pc. */
  rawBytes: string
}

export interface StepSnapshot {
  pc: number
  opcodeName: string
  gasLeft: bigint
  gasCost: bigint
  stack: bigint[]
  memory: Uint8Array
}

export interface BytecodeRunState {
  bytecodeHex: string
  instructions: InstructionRow[]
  mode: RunMode
  currentStepIndex: number
  steps: StepSnapshot[]
  execResult?: ExecResult
  error?: string
  gasUsed?: bigint
}
