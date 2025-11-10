<script setup lang="ts">
import { Hardfork } from '@ethereumjs/common'
import { type ExecResult } from '@ethereumjs/evm'
import { ref, type Ref } from 'vue'
import {
  dataToValueInput,
  isValidByteInputForm,
  preformatByteInputForm,
  valueToDataInput,
} from '../lib/byteFormUtils.js'
import PrecompileValueInput from '../precompiles/PrecompileValueInput.vue'
import { useRoute, useRouter } from 'vue-router'
import PrecompileResultC from '../precompiles/PrecompileResultC.vue'
import PrecompileExamplesC from '../precompiles/PrecompileExamplesC.vue'
import PrecompileDataInput from '../precompiles/PrecompileDataInput.vue'
import EIPC from './EIPC.vue'
import {
  runPrecompile,
  type BIGINT_5,
  type BIGINT_UNDEFINED_5,
  type Examples,
  type HEX_5,
} from '../lib/precompiles.js'
import { EIPs } from '@/views/lib/structure.js'

const eip = EIPs['eip-7951']

const data: Ref<string> = ref('')
const hexVals: Ref<HEX_5> = ref(Array(5).fill('') as HEX_5)
const bigIntVals: Ref<BIGINT_5> = ref(Array(5).fill(0n) as BIGINT_5)

const lengthsMask: Ref<BIGINT_UNDEFINED_5> = ref([32n, 32n, 32n, 32n, 32n])
const byteLengths: Ref<BIGINT_5> = ref(Array(5).fill(0n) as BIGINT_5)

const example: Ref<string> = ref('')

const execResultPre: Ref<ExecResult | undefined> = ref()
const execResultPost: Ref<ExecResult | undefined> = ref()

const router = useRouter()
const route = useRoute()

/**
 * Examples
 */
const examples: Examples = {
  simple: {
    title: 'Simple',
    values: ['03', '03', '02', '05', '03'],
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
      b: hexVals.value[3],
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
  data.value = preformatByteInputForm(data.value)
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
    hexVals.value[i] = preformatByteInputForm(hexVals.value[i])
    if (!isValidByteInputForm(hexVals.value[i])) {
      return false
    }
  }

  valueToDataInput(hexVals, bigIntVals, lengthsMask, byteLengths)

  data.value = hexVals.value[3] + hexVals.value[4]

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
      hexVals.value[3] = route.query['b']!.toString()
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
  <EIPC :title="eip.title" :eip="eip.num" :shareURL="shareURL">
    <template v-slot:description>
      <b>How are ModExp gas costs changing with Fusaka?</b> EIP-7883 changes the gas calculation
      algorithm. Especially interesting to explore are values around 32 bytes. Also take note of the
      new base costs. A major use case in smart contracts is to verify RSA signatures, e.g. in the
      context of airdrops. You can find a realistic RSA value setup in the examples. Also note that
      this widget also respects the new ModExp value boundaries set with EIP-7823 (also Fusaka).
    </template>
    <template v-slot:content>
      <div>
        <p class="text-right">
          <PrecompileExamplesC v-model="example" :examples="examples" :change="selectExample" />
        </p>

        <p>
          <PrecompileDataInput v-model="data" rows="6" :formChange="onDataInputFormChange" />
        </p>

        <PrecompileValueInput
          v-model="hexVals[3]"
          title="B"
          :input="onValueInputFormChange"
          :len="byteLengths[3]"
          :bigIntVal="bigIntVals[3]"
        />
        <PrecompileValueInput
          v-model="hexVals[4]"
          title="E"
          :input="onValueInputFormChange"
          :len="byteLengths[4]"
          :bigIntVal="bigIntVals[4]"
        />

        <div class="grid grid-cols-2 gap-1 mt-2.5">
          <PrecompileResultC v-model="execResultPre" title="Pre-Osaka" :left="true" />
          <PrecompileResultC v-model="execResultPost" title="Post-Osaka" :left="false" />
        </div>
      </div>
    </template>
  </EIPC>
</template>
