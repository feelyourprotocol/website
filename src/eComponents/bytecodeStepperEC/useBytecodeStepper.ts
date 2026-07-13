import { computed, onUnmounted, ref, shallowRef } from 'vue'
import type { EVM, ExecResult } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'

import type { Examples } from '@/explorations/REGISTRY'
import { resolveInitialExample } from '@/libs/exampleFromQuery'

import { isValidByteInputForm } from '../precompileInterfaceEC/utils'
import { disassembleBytecode } from './disassemble'
import { createStepGate, runBytecode } from './runBytecode'
import type { BytecodeStepperConfig, InstructionRow, RunMode, StepSnapshot } from './types'

const DEFAULT_GAS = 1_000_000n

export function useBytecodeStepper(config: BytecodeStepperConfig, evm: EVM) {
  const bytecodeHex = ref('')
  const example = ref('')
  const instructions = ref<InstructionRow[]>([])
  const mode = ref<RunMode>('idle')
  const currentStepIndex = ref(-1)
  const steps = shallowRef<StepSnapshot[]>([])
  const execResult = shallowRef<ExecResult>()
  const error = ref<string>()

  const gasLimit = config.gasLimit ?? DEFAULT_GAS
  const maxStackDisplay = config.maxStackDisplay ?? 12
  const maxMemoryBytes = config.maxMemoryBytes ?? 64

  let aborted = false
  let stepGate = createStepGate()
  let runInFlight: Promise<void> | undefined
  let runGeneration = 0

  const validationErrors = computed(() => isValidByteInputForm(bytecodeHex.value))
  const canExecute = computed(
    () => bytecodeHex.value.length > 0 && validationErrors.value.length === 0,
  )

  const currentSnapshot = computed(() => {
    if (currentStepIndex.value < 0) return undefined
    return steps.value[currentStepIndex.value]
  })

  const gasUsed = computed(() => {
    if (execResult.value) {
      return execResult.value.executionGasUsed
    }
    const snap = currentSnapshot.value
    if (!snap) return undefined
    return gasLimit - snap.gasLeft
  })

  const isBusy = computed(() => mode.value === 'running' || mode.value === 'stepping')

  function cleanupExecution() {
    runGeneration++
    aborted = true
    stepGate.abort()
    evm.events.removeAllListeners('step')
    runInFlight = undefined
  }

  function resetExecutionState() {
    cleanupExecution()
    aborted = false
    stepGate = createStepGate()
    mode.value = 'idle'
    currentStepIndex.value = -1
    steps.value = []
    execResult.value = undefined
    error.value = undefined
  }

  function updateDisassembly() {
    if (!canExecute.value) {
      instructions.value = []
      return
    }
    const code = hexToBytes(`0x${bytecodeHex.value}`)
    instructions.value = disassembleBytecode(code, evm.common)
  }

  /** Reset execution and re-arm stepping for the current bytecode (shared by Reset / edits / examples). */
  async function rearm() {
    updateDisassembly()
    if (!canExecute.value) {
      resetExecutionState()
      return
    }
    steps.value = []
    currentStepIndex.value = -1
    execResult.value = undefined
    error.value = undefined
    await executeRun(true)
    await waitUntilArmed()
  }

  async function onBytecodeChange() {
    example.value = ''
    await rearm()
  }

  async function selectExample(examples: Examples) {
    if (example.value === '') return
    bytecodeHex.value = examples[example.value]!.values[0]
    await rearm()
  }

  async function init(examples: Examples, queryExample?: string) {
    example.value = resolveInitialExample(examples, config.defaultExample, queryExample)
    await selectExample(examples)
  }

  function onStepRecorded(snapshot: StepSnapshot, index: number) {
    steps.value = [...steps.value, snapshot]
    currentStepIndex.value = index
  }

  async function executeRun(stepMode: boolean) {
    if (!canExecute.value) return

    const previousRun = runInFlight
    cleanupExecution()
    aborted = false
    stepGate = createStepGate()
    const generation = runGeneration
    steps.value = []
    currentStepIndex.value = -1
    execResult.value = undefined
    error.value = undefined
    mode.value = stepMode ? 'stepping' : 'running'

    if (previousRun) {
      await previousRun.catch(() => {})
    }

    const code = hexToBytes(`0x${bytecodeHex.value}`)

    const onStep = (snapshot: StepSnapshot, index: number) => {
      if (generation !== runGeneration) return
      onStepRecorded(snapshot, index)
    }

    runInFlight = runBytecode({
      evm,
      code,
      gasLimit,
      stepMode,
      stepGate,
      onStep,
      shouldAbort: () => aborted || generation !== runGeneration,
    })
      .then((result) => {
        if (generation !== runGeneration) return
        execResult.value = result
        if (result.exceptionError) {
          mode.value = 'error'
          error.value = result.exceptionError.error
        } else {
          mode.value = 'finished'
        }
      })
      .catch((err: unknown) => {
        if (generation !== runGeneration || aborted) return
        mode.value = 'error'
        error.value = err instanceof Error ? err.message : String(err)
      })
      .finally(() => {
        runInFlight = undefined
      })

    if (!stepMode) {
      await runInFlight
    }
  }

  async function runAll() {
    if (isBusy.value) {
      resetExecutionState()
    }
    await executeRun(false)
  }

  async function stepOnce() {
    if (!canExecute.value) return
    if (mode.value === 'finished' || mode.value === 'error') return

    if (mode.value === 'idle') {
      await rearm()
      return
    }

    if (mode.value === 'stepping') {
      stepGate.advance()
    }
  }

  async function reset() {
    await rearm()
  }

  async function waitUntilArmed(timeoutMs = 2000): Promise<void> {
    const start = Date.now()
    while (mode.value !== 'stepping' || steps.value.length !== 1 || steps.value[0]?.pc !== 0) {
      if (Date.now() - start > timeoutMs) {
        throw new Error('Timed out waiting for step mode')
      }
      await new Promise((r) => setTimeout(r, 10))
    }
  }

  onUnmounted(() => {
    cleanupExecution()
  })

  return {
    bytecodeHex,
    example,
    instructions,
    mode,
    currentStepIndex,
    steps,
    execResult,
    error,
    validationErrors,
    canExecute,
    currentSnapshot,
    gasUsed,
    gasLimit,
    maxStackDisplay,
    maxMemoryBytes,
    isBusy,
    onBytecodeChange,
    selectExample,
    init,
    runAll,
    stepOnce,
    reset,
  }
}
