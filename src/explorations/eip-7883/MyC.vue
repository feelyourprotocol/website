<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import { type ExecResult } from '@ethereumjs/evm'
import { ref, watch, type Ref } from 'vue'
import {
  dataToValueInput,
  isValidByteInputForm,
  padHex,
  toBigInt,
  toHex,
  valueToDataInput,
} from '../../components/lib/byteFormUtils.js'
import PrecompileValueInput from '../../components/precompiles/PrecompileValueInput.vue'
import { useRoute, useRouter } from 'vue-router'
import PrecompileResultC from '../../components/precompiles/PrecompileResultC.vue'
import ExamplesC from '../../components/ui/ExamplesC.vue'
import HexDataInputC from '../../components/ui/HexDataInputC.vue'
import ExplorationC from '../ExplorationC.vue'
import PoweredByC from '../PoweredByC.vue'
import { TOPICS } from '../TOPICS'
import {
  runPrecompile,
  type BIGINT_6,
  type BIGINT_UNDEFINED_6,
  type HEX_6,
} from '../../components/lib/precompiles.js'
import { INFO } from './info'
import { examples } from './examples'

const exploration = INFO
const topic = TOPICS[exploration.topic]

const data: Ref<string> = ref('')

const hexVals: Ref<HEX_6> = ref(Array(6).fill('00'.repeat(32)) as HEX_6)
const bigIntVals: Ref<BIGINT_UNDEFINED_6> = ref(Array(6).fill(0n) as BIGINT_6)

const lengthsMask: Ref<BIGINT_UNDEFINED_6> = ref([32n, 32n, 32n, undefined, undefined, undefined])
const byteLengths: Ref<BIGINT_6> = ref(Array(6).fill(0n) as BIGINT_6)

const example: Ref<string> = ref('')

const execResultPre: Ref<ExecResult | undefined> = ref()
const execResultPost: Ref<ExecResult | undefined> = ref()

const poweredBy = exploration.poweredBy

const router = useRouter()
const route = useRoute()

watch(hexVals, () => {
  console.log('hexVals changed', hexVals.value)
})

/**
 * Example/URL helper functions
 */
const selectExample = async () => {
  if (example.value === '') {
    return
  }
  hexVals.value[3] = examples[example.value]!.values[0]
  hexVals.value[4] = examples[example.value]!.values[1]
  hexVals.value[5] = examples[example.value]!.values[2]
  await values2Data()
}

function shareURL() {
  const routeData = router.resolve({
    name: 'eip-7883',
    query: {
      b: hexVals.value[3],
      e: hexVals.value[4],
      m: hexVals.value[5],
    },
  })
  window.open(routeData.href, '_blank')
}

/**
 * EVM Initialization
 */

/**
 * Run the precompile
 */
async function run() {
  await runPrecompile(
    data.value,
    Hardfork.Prague,
    Hardfork.Osaka,
    '05',
    execResultPre,
    execResultPost,
  )
}

/**
 * The combined data is taken as the "source of truth" and the
 * individual values are derived from it.
 */
async function data2Values() {
  if (!isValidByteInputForm(data.value)) {
    return false
  }

  byteLengths.value[3] = toBigInt(data, 0, 32 * 2)
  byteLengths.value[4] = toBigInt(data, 64, 64 + 32 * 2)
  byteLengths.value[5] = toBigInt(data, 128, 128 + 32 * 2)

  dataToValueInput(data, hexVals, bigIntVals, byteLengths)
  await run()
}

/**
 * The data form values changed.
 */
async function onDataInputFormChange() {
  example.value = ''
  await data2Values()
}

/**
 * The individual values are taken as the "source of truth" and the
 * combined data is derived from them.
 */
async function values2Data() {
  for (let i = 0; i < hexVals.value.length; i++) {
    if (isValidByteInputForm(hexVals.value[i], lengthsMask.value[i]).length > 0) {
      return false
    }
  }

  valueToDataInput(hexVals, bigIntVals, lengthsMask, byteLengths)

  data.value =
    toHex(byteLengths.value[3], 32 * 2) +
    toHex(byteLengths.value[4], 32 * 2) +
    toHex(byteLengths.value[5], 32 * 2) +
    padHex(hexVals.value[3]) +
    padHex(hexVals.value[4]) +
    padHex(hexVals.value[5])

  await run()
}

/**
 * The (some) individual values form values changed.
 */
async function onValueInputFormChange() {
  console.log('onValueInputFormChange')
  example.value = ''
  await values2Data()
}

/**
 * Initialize the widget either with URL parameters or with a default example.
 */
async function init() {
  if ('b' in route.query && 'e' in route.query && 'm' in route.query) {
    try {
      hexVals.value[3] = route.query['b']!.toString()
      hexVals.value[4] = route.query['e']!.toString()
      hexVals.value[5] = route.query['m']!.toString()
      await values2Data()
    } catch {
      console.log('Invalid parameter call!')
    }
  } else {
    example.value = 'simple'
    await selectExample()
  }
}

await init()
</script>

<template>
  <ExplorationC
    explorationId="eip-7883"
    :exploration="exploration"
    :topic="topic"
    :shareURL="shareURL"
  >
    <template v-slot:content>
      <div>
        <ExamplesC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputC v-model="data" rows="6" :formChange="onDataInputFormChange" />

        <PrecompileValueInput
          v-model="hexVals[3]"
          title="B"
          :input="onValueInputFormChange"
          :len="byteLengths[3]"
          :expectedLen="lengthsMask[3]"
          :bigIntVal="bigIntVals[3]"
        />
        <PrecompileValueInput
          v-model="hexVals[4]"
          title="E"
          num="4"
          :input="onValueInputFormChange"
          :len="byteLengths[4]"
          :expectedLen="lengthsMask[4]"
          :bigIntVal="bigIntVals[4]"
        />
        <PrecompileValueInput
          v-model="hexVals[5]"
          title="M"
          num="5"
          :input="onValueInputFormChange"
          :len="byteLengths[5]"
          :expectedLen="lengthsMask[5]"
          :bigIntVal="bigIntVals[5]"
        />

        <div class="grid grid-cols-2 gap-1 mt-2.5">
          <PrecompileResultC v-model="execResultPre" title="Pre-Osaka" :left="true" />
          <PrecompileResultC v-model="execResultPost" title="Post-Osaka" :left="false" />
        </div>
        <PoweredByC :poweredBy="poweredBy" :topic="topic" />
      </div>
    </template>
  </ExplorationC>
</template>
