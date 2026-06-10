import type { EVM, ExecResult, InterpreterStep } from '@ethereumjs/evm'

import type { StepSnapshot } from './types'

export function stepToSnapshot(step: InterpreterStep): StepSnapshot {
  const gasCost = step.opcode.dynamicFee ?? BigInt(step.opcode.fee)
  const stack = [...step.stack].reverse().map((word) => BigInt(word))

  return {
    pc: step.pc,
    opcodeName: step.opcode.name,
    gasLeft: step.gasLeft,
    gasCost,
    stack,
    memory: step.memory.slice(),
  }
}

export interface StepGate {
  wait(): Promise<void>
  advance(): void
  abort(): void
}

export function createStepGate(): StepGate {
  let release: (() => void) | undefined
  let aborted = false

  return {
    wait(): Promise<void> {
      if (aborted) {
        return Promise.reject(new Error('aborted'))
      }
      return new Promise<void>((resolve) => {
        release = resolve
      })
    },
    advance(): void {
      release?.()
      release = undefined
    },
    abort(): void {
      aborted = true
      release?.()
      release = undefined
    },
  }
}

export interface RunBytecodeOptions {
  evm: EVM
  code: Uint8Array
  gasLimit: bigint
  stepMode: boolean
  stepGate?: StepGate
  onStep: (snapshot: StepSnapshot, index: number) => void
  shouldAbort: () => boolean
}

export async function runBytecode(options: RunBytecodeOptions): Promise<ExecResult> {
  const { evm, code, gasLimit, stepMode, stepGate, onStep, shouldAbort } = options

  evm.events.removeAllListeners('step')

  let stepIndex = 0

  const stepHandler = async (_step: InterpreterStep, resolve?: (result?: unknown) => void) => {
    if (shouldAbort()) {
      resolve?.()
      return
    }

    const snapshot = stepToSnapshot(_step)
    onStep(snapshot, stepIndex)
    stepIndex++

    if (stepMode && stepGate) {
      try {
        await stepGate.wait()
      } catch {
        resolve?.()
        return
      }
    }

    if (shouldAbort()) {
      resolve?.()
      return
    }

    resolve?.()
  }

  evm.events.on('step', stepHandler)

  try {
    return await evm.runCode({ code, gasLimit })
  } finally {
    evm.events.off('step', stepHandler)
  }
}
