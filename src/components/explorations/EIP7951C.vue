<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import { type ExecResult } from '@ethereumjs/evm'
import { ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { dataToValueInput, isValidByteInputForm, valueToDataInput } from '../lib/byteFormUtils.js'
import PrecompileValueInput from '../precompiles/PrecompileValueInput.vue'
import PrecompileResultC from '../precompiles/PrecompileResultC.vue'
import ExamplesC from '../ui/ExamplesC.vue'
import HexDataInputC from '../ui/HexDataInputC.vue'
import ExplorationC from './ExplorationC.vue'
import PoweredByC from './PoweredByC.vue'
import {
  runPrecompile,
  type BIGINT_5,
  type BIGINT_UNDEFINED_5,
  type HEX_5,
} from '../lib/precompiles.js'
import { EXPLORATIONS } from '@/views/lib/structure.js'
import { type Examples } from '../lib/general.js'
import { PP_BOX_LAYOUT } from '../lib/layout'

const exploration = EXPLORATIONS['eip-7951']

const data: Ref<string> = ref('')
const hexVals: Ref<HEX_5> = ref(Array(5).fill('') as HEX_5)
const bigIntVals: Ref<BIGINT_UNDEFINED_5> = ref(Array(5).fill(undefined) as BIGINT_UNDEFINED_5)

const lengthsMask: Ref<BIGINT_UNDEFINED_5> = ref([32n, 32n, 32n, 32n, 32n])
const byteLengths: Ref<BIGINT_5> = ref(Array(5).fill(0n) as BIGINT_5)

const example: Ref<string> = ref('')

const execResultPre: Ref<ExecResult | undefined> = ref()
const execResultPost: Ref<ExecResult | undefined> = ref()

const poweredBy = exploration.poweredBy ?? []

const router = useRouter()
const route = useRoute()

/**
 * Examples
 */
const examples: Examples = {
  valid: {
    title: 'Valid ("Hello Fusaka!")',
    values: [
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933e6283e8838e46942fd',
      'eb3dc5ce2902f162745057efb7a3308eba992c0d843623603516845ffccd3f10',
      '3b91fedfb22f40063245c621036a040c159f02ae02e6d450ff9b53235e9232c4',
      'bfa6d0a419b5bc625939cccb8db65a16f7c30c697928660e9da53eda031e80fa',
      'db5998a893f9b8971a3892aecd132c0eca1bc9622e542f428d8129222f26bdc5',
    ],
  },
  'invalid-sig-r': {
    title: 'Invalid ("Hello Fusaka!"), modified sigR value',
    values: [
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933e6283e8838e46942fd',
      'ee3dc5ce2902f162745057efb7a3308eba992c0d843623603516845ffccd3f10',
      '3b91fedfb22f40063245c621036a040c159f02ae02e6d450ff9b53235e9232c4',
      'bfa6d0a419b5bc625939cccb8db65a16f7c30c697928660e9da53eda031e80fa',
      'db5998a893f9b8971a3892aecd132c0eca1bc9622e542f428d8129222f26bdc5',
    ],
  },
  'invalid-sig-0': {
    title: 'Invalid ("Hello Fusaka!"), sigR and sigS values 0',
    values: [
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933e6283e8838e46942fd',
      '0000000000000000000000000000000000000000000000000000000000000000',
      '0000000000000000000000000000000000000000000000000000000000000000',
      'bfa6d0a419b5bc625939cccb8db65a16f7c30c697928660e9da53eda031e80fa',
      'db5998a893f9b8971a3892aecd132c0eca1bc9622e542f428d8129222f26bdc5',
    ],
  },
  'valid-wycheproof-special-case-hash': {
    title: 'Valid (Wycheproof), special case hash',
    values: [
      '00000000690ed426ccf17803ebe2bd0884bcd58a1bb5e7477ead3645f356e7a9',
      '16aea964a2f6506d6f78c81c91fc7e8bded7d397738448de1e19a0ec580bf266',
      '252cd762130c6667cfe8b7bc47d27d78391e8e80c578d1cd38c3ff033be928e9',
      '2927b10512bae3eddcfe467828128bad2903269919f7086069c8c4df6c732838',
      'c7787964eaac00e5921fb1498a60f4606766b3d9685001558d1a974e7341513e',
    ],
  },
  'invalid-wycheproof-r-too-large': {
    title: 'Invalid (Wycheproof), r value too large',
    values: [
      '532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25',
      'ffffffff00000001000000000000000000000000fffffffffffffffffffffffc',
      'ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc63254e',
      'd705d16f80987e2d9b1a6957d29ce22febf7d10fa515153182415c8361baaca4',
      'b1fc105ee5ce80d514ec1238beae2037a6f83625593620d460819e8682160926',
    ],
  },
}

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
  <ExplorationC explorationId="eip-7951" :exploration="exploration" :shareURL="shareURL">
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
        <PoweredByC :poweredBy="poweredBy" />
      </div>
    </template>
  </ExplorationC>
</template>
