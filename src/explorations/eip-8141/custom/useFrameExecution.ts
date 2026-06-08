import { computed, ref } from 'vue'

import { FRAME_EXAMPLES } from '../examples'
import type { FrameDefinition, FrameTxExecutionResult } from '../types'
import { executeFrameExample } from './frameRunner'

export function useFrameExecution() {
  const selectedExample = ref('simple-transfer')
  const frameDefinitions = ref<FrameDefinition[]>([...FRAME_EXAMPLES['simple-transfer'].frames])
  const executionResult = ref<FrameTxExecutionResult | null>(null)
  const revealedStepIndex = ref(-1)
  const isExecuting = ref(false)
  const errorMsg = ref('')

  const currentExample = computed(() => FRAME_EXAMPLES[selectedExample.value])

  const canStep = computed(
    () =>
      executionResult.value !== null &&
      revealedStepIndex.value < executionResult.value.frameSteps.length - 1,
  )

  const allRevealed = computed(
    () =>
      executionResult.value !== null &&
      revealedStepIndex.value >= executionResult.value.frameSteps.length - 1,
  )

  const visibleSteps = computed(() => {
    if (!executionResult.value || revealedStepIndex.value < 0) return []
    return executionResult.value.frameSteps.slice(0, revealedStepIndex.value + 1)
  })

  function selectExample(key: string) {
    if (!FRAME_EXAMPLES[key]) return
    selectedExample.value = key
    frameDefinitions.value = [...FRAME_EXAMPLES[key].frames]
    executionResult.value = null
    revealedStepIndex.value = -1
    errorMsg.value = ''
  }

  function updateFrameData(index: number, hex: string) {
    if (index < 0 || index >= frameDefinitions.value.length) return
    frameDefinitions.value[index] = { ...frameDefinitions.value[index], dataHex: hex }
  }

  async function execute() {
    const example = FRAME_EXAMPLES[selectedExample.value]
    if (!example) return

    isExecuting.value = true
    errorMsg.value = ''
    executionResult.value = null
    revealedStepIndex.value = -1

    try {
      const exampleWithEdits = {
        ...example,
        frames: frameDefinitions.value,
      }
      const result = await executeFrameExample(exampleWithEdits)
      executionResult.value = result

      if (result.frameSteps.length > 0) {
        revealedStepIndex.value = 0
      }

      if (!result.success && result.error) {
        errorMsg.value = result.error
      }
    } catch (e: unknown) {
      errorMsg.value = e instanceof Error ? e.message : String(e)
    } finally {
      isExecuting.value = false
    }
  }

  function stepForward() {
    if (canStep.value) {
      revealedStepIndex.value++
    }
  }

  function stepBack() {
    if (revealedStepIndex.value > 0) {
      revealedStepIndex.value--
    }
  }

  function reset() {
    executionResult.value = null
    revealedStepIndex.value = -1
    errorMsg.value = ''
    frameDefinitions.value = [...FRAME_EXAMPLES[selectedExample.value].frames]
  }

  return {
    selectedExample,
    frameDefinitions,
    executionResult,
    revealedStepIndex,
    isExecuting,
    errorMsg,
    currentExample,
    canStep,
    allRevealed,
    visibleSteps,
    selectExample,
    updateFrameData,
    execute,
    stepForward,
    stepBack,
    reset,
  }
}
