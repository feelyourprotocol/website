import type { ComputedRef, InjectionKey, Ref } from 'vue'

import type { InstructionRow, RunMode } from './types'

export interface BytecodeStepperContext {
  activeInstruction: ComputedRef<InstructionRow | undefined>
  mode: Ref<RunMode>
  bytecodeHex: Ref<string>
  example: Ref<string>
}

export const BYTECODE_STEPPER_CONTEXT: InjectionKey<BytecodeStepperContext> =
  Symbol('bytecodeStepperContext')
