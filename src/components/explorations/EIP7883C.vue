<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import { type ExecResult } from '@ethereumjs/evm'
import { ref, watch, type Ref } from 'vue'
import {
  countUpwardsHexStr,
  dataToValueInput,
  isValidByteInputForm,
  padHex,
  toBigInt,
  toHex,
  valueToDataInput,
} from '../lib/byteFormUtils.js'
import PrecompileValueInput from '../precompiles/PrecompileValueInput.vue'
import { useRoute, useRouter } from 'vue-router'
import PrecompileResultC from '../precompiles/PrecompileResultC.vue'
import ExamplesC from '../ui/ExamplesC.vue'
import HexDataInputC from '../ui/HexDataInputC.vue'
import ExplorationC from './ExplorationC.vue'
import PoweredByC from './PoweredByC.vue'
import {
  runPrecompile,
  type BIGINT_6,
  type BIGINT_UNDEFINED_6,
  type HEX_6,
} from '../lib/precompiles.js'
import { EXPLORATIONS } from '@/views/lib/structure.js'
import { type Examples } from '../lib/general.js'

const exploration = EXPLORATIONS['eip-7883']

const data: Ref<string> = ref('')

const hexVals: Ref<HEX_6> = ref(Array(6).fill('00'.repeat(32)) as HEX_6)
const bigIntVals: Ref<BIGINT_UNDEFINED_6> = ref(Array(6).fill(0n) as BIGINT_6)

const lengthsMask: Ref<BIGINT_UNDEFINED_6> = ref([32n, 32n, 32n, undefined, undefined, undefined])
const byteLengths: Ref<BIGINT_6> = ref(Array(6).fill(0n) as BIGINT_6)

const example: Ref<string> = ref('')

const execResultPre: Ref<ExecResult | undefined> = ref()
const execResultPost: Ref<ExecResult | undefined> = ref()

const poweredBy = exploration.poweredBy ?? []

const router = useRouter()
const route = useRoute()

watch(hexVals, () => {
  console.log('hexVals changed', hexVals.value)
})

/**
 * Examples
 */
const examples: Examples = {
  simple: {
    title: 'Simple',
    values: ['03', '03', '02'],
  },
  '5-byte-exponent': {
    title: '5-Byte Exponent',
    values: ['03', countUpwardsHexStr(5), '02'],
  },
  '20-byte-exponent': {
    title: '20-Byte Exponent',
    values: ['03', countUpwardsHexStr(20), '02'],
  },
  '32-byte-exponent': {
    title: '32-Byte Exponent',
    values: ['03', countUpwardsHexStr(32), '02'],
  },
  '33-byte-exponent': {
    title: '33-Byte Exponent',
    values: ['03', countUpwardsHexStr(33), '02'],
  },
  '1024-byte-exponent': {
    title: '1024-Byte Exponent',
    values: ['03', countUpwardsHexStr(1024), '02'],
  },
  '1025-byte-exponent': {
    title: '1025-Byte Exponent (invalid with EIP-7823)',
    values: ['03', countUpwardsHexStr(1025), '02'],
  },
  'rsa-random-2048-bit': {
    title: 'Random RSA 2048-bit',
    values: [
      '657468657265756d',
      '010001',
      'a709e2f84ac0e21eb0caa018cf7f697f774e96f8115fc2359e9cf60b1dd8d4048d974cdf8422bef6be3c162b04b916f7ea2133f0e3e4e0eee164859bd9c1e0ef0357c142f4f633b4add4aab86c8f8895cd33fbf4e024d9a3ad6be6267570b4a72d2c34354e0139e74ada665a16a2611490debb8e131a6cffc7ef25e74240803dd71a4fcd953c988111b0aa9bbc4c57024fc5e8c4462ad9049c7f1abed859c63455fa6d58b5cc34a3d3206ff74b9e96c336dbacf0cdd18ed0c66796ce00ab07f36b24cbe3342523fd8215a8e77f89e86a08db911f237459388dee642dae7cb2644a03e71ed5c6fa5077cf4090fafa556048b536b879a88f628698f0c7b420c4b7',
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
  <ExplorationC explorationId="eip-7883" :exploration="exploration" :shareURL="shareURL">
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
        <PoweredByC :poweredBy="poweredBy" />
      </div>
    </template>
  </ExplorationC>
</template>
