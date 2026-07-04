import { computed, ref, type ShallowRef, shallowRef } from 'vue'
import { useRouter } from 'vue-router'
import type { PrefixedHexString } from '@ethereumjs/util'

import type { Examples } from '@/explorations/REGISTRY'
import { parseExampleQueryParam, resolveInitialExample } from '@/libs/exampleFromQuery'

import type { PrecompileConfig } from './types'
import { dataToValueInput, isValidByteInputForm, valueToDataInput } from './utils'

export interface PrecompileInitOptions {
  /** Value from `?example=` (parsed or raw string from route). */
  queryExample?: string
  /** Current route query — used for field-level share URL params on init. */
  routeQuery?: Record<string, unknown>
}

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
  }
}

export function usePrecompileState<T = unknown>(
  config: PrecompileConfig,
  examples: Examples,
  run: (data: PrefixedHexString) => Promise<T>,
) {
  const { data, hexVals, bigIntVals, lengthsMask, byteLengths, example } = createState(config)
  const result: ShallowRef<T | undefined> = shallowRef()

  const editableIndices = config.values.map((v, i) => (v.urlParam ? i : -1)).filter((i) => i !== -1)

  const inputValues = computed(() =>
    config.values.map((def, index) => ({ ...def, index })).filter((def) => def.showInput !== false),
  )

  // --- Data conversion ---

  async function data2Values() {
    if (isValidByteInputForm(data.value).length > 0) return
    if (config.parseData) {
      config.parseData(data.value, byteLengths.value)
    }
    dataToValueInput(data, hexVals, bigIntVals, byteLengths)
    result.value = await run(`0x${data.value}`)
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
    result.value = await run(`0x${data.value}`)
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
    const router = useRouter()
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

  async function init(options: PrecompileInitOptions = {}) {
    const routeQuery = options.routeQuery ?? {}
    const resolvedExample = parseExampleQueryParam(options.queryExample ?? routeQuery.example)
    if (resolvedExample !== undefined) {
      example.value = resolveInitialExample(examples, config.defaultExample, resolvedExample)
      await selectExample()
      return
    }

    const urlParams = editableIndices.map((i) => config.values[i].urlParam!)
    const hasAllParams = urlParams.length > 0 && urlParams.every((p) => p in routeQuery)

    if (hasAllParams) {
      try {
        for (const i of editableIndices) {
          hexVals.value[i] = routeQuery[config.values[i].urlParam!]!.toString()
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
    inputValues,
    result,
    selectExample,
    shareURL,
    onDataInputFormChange,
    onValueInputFormChange,
    init,
  }
}
