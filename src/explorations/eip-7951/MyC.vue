<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import { type ExecResult } from '@ethereumjs/evm'
import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  dataToValueInput,
  isValidByteInputForm,
  valueToDataInput,
} from '../../components/lib/byteFormUtils.js'
import PrecompileValueInput from '../../components/precompiles/PrecompileValueInput.vue'
import PrecompileResultC from '../../components/precompiles/PrecompileResultC.vue'
import ExamplesC from '../../components/ui/ExamplesC.vue'
import HexDataInputC from '../../components/ui/HexDataInputC.vue'
import ExplorationC from '../ExplorationC.vue'
import PoweredByC from '../PoweredByC.vue'
import { TOPICS } from '../TOPICS'
import {
  runPrecompile,
  type BIGINT_5,
  type BIGINT_UNDEFINED_5,
  type HEX_5,
} from '../../components/lib/precompiles.js'
import { INFO } from './info'
import { examples } from './examples'
import { PP_BOX_LAYOUT } from '../../components/lib/layout'

const exploration = INFO
const topic = TOPICS[exploration.topic]

const data: Ref<string> = ref('')
const hexVals: Ref<HEX_5> = ref(Array(5).fill('') as HEX_5)
const bigIntVals: Ref<BIGINT_UNDEFINED_5> = ref(Array(5).fill(undefined) as BIGINT_UNDEFINED_5)

const lengthsMask: Ref<BIGINT_UNDEFINED_5> = ref([32n, 32n, 32n, 32n, 32n])
const byteLengths: Ref<BIGINT_5> = ref(Array(5).fill(0n) as BIGINT_5)

const example: Ref<string> = ref('')

const execResultPre: Ref<ExecResult | undefined> = ref()
const execResultPost: Ref<ExecResult | undefined> = ref()

const poweredBy = exploration.poweredBy

const router = useRouter()
const route = useRoute()

/**
 * Example/URL helper functions
 */
const selectExample = async () => {
  if (example.value === '') {
    return
  }
  for (let i = 0; i < hexVals.value.length; i++) {
    hexVals.value[i] = examples[example.value]!.values[i]
  }
  await values2Data()
}

function shareURL() {
  const routeData = router.resolve({
    name: 'eip-7951',
    query: {
      hash: hexVals.value[0],
      sigr: hexVals.value[1],
      sigs: hexVals.value[2],
      pubx: hexVals.value[3],
      puby: hexVals.value[4],
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
    '100',
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

  data.value = hexVals.value.join('')

  await run()
}

/**
 * The (some) individual values form values changed.
 */
async function onValueInputFormChange() {
  example.value = ''
  await values2Data()
}

/**
 * Initialize the widget either with URL parameters or with a default example.
 */
async function init() {
  if ('b' in route.query && 'e' in route.query && 'm' in route.query) {
    try {
      hexVals.value[0] = route.query['hash']!.toString()
      hexVals.value[1] = route.query['sigr']!.toString()
      hexVals.value[2] = route.query['sigs']!.toString()
      hexVals.value[3] = route.query['pubx']!.toString()
      hexVals.value[4] = route.query['puby']!.toString()
      await values2Data()
    } catch {
      console.log('Invalid parameter call!')
    }
  } else {
    example.value = 'valid'
    await selectExample()
  }
}

await init()
</script>

<template>
  <ExplorationC
    explorationId="eip-7951"
    :exploration="exploration"
    :topic="topic"
    :shareURL="shareURL"
  >
    <template v-slot:content>
      <div>
        <ExamplesC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputC v-model="data" rows="6" :formChange="onDataInputFormChange" />

        <PrecompileValueInput
          v-for="(title, index) in ['Hash', 'SigR', 'SigS', 'PubX', 'PubY']"
          :key="index"
          v-model="hexVals[index]"
          :title="title"
          :input="onValueInputFormChange"
          :len="byteLengths[index]"
          :expectedLen="lengthsMask[index]"
          :bigIntVal="bigIntVals[index]"
        />

        <div :class="PP_BOX_LAYOUT">
          <PrecompileResultC v-model="execResultPre" title="Pre-Osaka" :left="true" />
          <PrecompileResultC v-model="execResultPost" title="Post-Osaka" :left="false" />
        </div>
        <PoweredByC :poweredBy="poweredBy" :topic="topic" />
      </div>
    </template>
  </ExplorationC>
</template>
