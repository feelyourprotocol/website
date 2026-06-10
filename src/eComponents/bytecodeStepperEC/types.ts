import type { ExecResult } from '@ethereumjs/evm'

export interface BytecodeStepperConfig {
  explorationId: string
  defaultExample: string
  gasLimit?: bigint
  maxStackDisplay?: number
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
