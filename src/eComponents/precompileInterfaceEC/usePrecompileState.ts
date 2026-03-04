import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ExecResult } from '@ethereumjs/evm'

import type { Examples } from '@/explorations/REGISTRY'

import { runPrecompile } from './run'
import type { PrecompileConfig } from './types'
import { dataToValueInput, isValidByteInputForm, valueToDataInput } from './utils'

function createState(config: PrecompileConfig) {
  return {
    data: ref(''),
    hexVals: ref<string[]>(config.values.map((v) => v.initialHex ?? '')),
    bigIntVals: ref<(bigint | undefined)[]>(
      config.values.map((v) => ((v.showBigInt ?? config.showBigInt ?? true) ? 0n : undefined)),
    ),
    lengthsMask: ref<(bigint | undefined)[]>(config.values.map((v) => v.expectedLen)),
    byteLengths: ref<bigint[]>(config.values.map(() => 0n)),
    example: ref(''),
    execResultPre: ref<ExecResult | undefined>(),
    execResultPost: ref<ExecResult | undefined>(),
  }
}

export function usePrecompileState(config: PrecompileConfig, examples: Examples) {
  const {
    data,
    hexVals,
    bigIntVals,
    lengthsMask,
    byteLengths,
    example,
    execResultPre,
    execResultPost,
  } = createState(config)

  const router = useRouter()
  const route = useRoute()

  const editableIndices = config.values.map((v, i) => (v.urlParam ? i : -1)).filter((i) => i !== -1)

  const inputValues = computed(() =>
    config.values.map((def, index) => ({ ...def, index })).filter((def) => def.showInput !== false),
  )

  // --- Data conversion ---

  async function run() {
    await runPrecompile(
      data.value,
      config.preHardfork,
      config.postHardfork,
      config.precompileAddress,
      execResultPre,
      execResultPost,
    )
  }

  async function data2Values() {
    if (isValidByteInputForm(data.value).length > 0) return
    if (config.parseData) {
      config.parseData(data.value, byteLengths.value)
    }
    dataToValueInput(data, hexVals, bigIntVals, byteLengths)
    await run()
  }

  async function values2Data() {
    for (let i = 0; i < config.values.length; i++) {
      if (isValidByteInputForm(hexVals.value[i], lengthsMask.value[i]).length > 0) {
        return
      }
    }
    valueToDataInput(hexVals, bigIntVals, lengthsMask, byteLengths)
    data.value = config.assembleData
      ? config.assembleData(hexVals.value, byteLengths.value)
      : hexVals.value.join('')
    await run()
  }

  // --- User interaction ---

  async function selectExample() {
    if (example.value === '') return
    const exVals = examples[example.value]!.values
    for (let j = 0; j < editableIndices.length; j++) {
      hexVals.value[editableIndices[j]] = exVals[j]
    }
    await values2Data()
  }

  function shareURL() {
    const query: Record<string, string> = {}
    for (const i of editableIndices) {
      query[config.values[i].urlParam!] = hexVals.value[i]
    }
    const routeData = router.resolve({ name: config.explorationId, query })
    window.open(routeData.href, '_blank')
  }

  async function onDataInputFormChange() {
    example.value = ''
    await data2Values()
  }

  async function onValueInputFormChange() {
    example.value = ''
    await values2Data()
  }

  // --- Initialization ---

  async function init() {
    const urlParams = editableIndices.map((i) => config.values[i].urlParam!)
    const hasAllParams = urlParams.length > 0 && urlParams.every((p) => p in route.query)

    if (hasAllParams) {
      try {
        for (const i of editableIndices) {
          hexVals.value[i] = route.query[config.values[i].urlParam!]!.toString()
        }
        await values2Data()
      } catch {
        // Fallback to default example on invalid URL params
      }
    } else {
      example.value = config.defaultExample
      await selectExample()
    }
  }

  return {
    data,
    example,
    hexVals,
    bigIntVals,
    byteLengths,
    execResultPre,
    execResultPost,
    inputValues,
    selectExample,
    shareURL,
    onDataInputFormChange,
    onValueInputFormChange,
    init,
  }
}
