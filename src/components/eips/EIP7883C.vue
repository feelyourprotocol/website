<script setup lang="ts">
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, getActivePrecompiles, type ExecResult } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'
import { ref, type Ref } from 'vue'
import {
  countUpwardsHexStr,
  dataToValueInput,
  isValidByteInputForm,
  preformatByteInputForm,
  toBigInt,
  toHex,
  valueToDataInput,
} from '../lib/byteFormUtils'
import PrecompileValueInput from '../precompiles/PrecompileValueInput.vue'
import { useRoute, useRouter } from 'vue-router'
import PrecompileResultC from '../precompiles/PrecompileResultC.vue'
import PrecompileExamplesC from '../precompiles/PrecompileExamplesC.vue'
import PrecompileDataInput from '../precompiles/PrecompileDataInput.vue'
import EIPC from './EIPC.vue'

const router = useRouter()
const route = useRoute()

/**
 * Examples
 */
const example: Ref<string> = ref('')
interface Examples {
  [key: string]: {
    title: string
    values: [string, string, string]
  }
}
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

const selectExample = async () => {
  if (example.value === '') {
    return
  }
  hexVals.value[3] = examples[example.value].values[0]
  hexVals.value[4] = examples[example.value].values[1]
  hexVals.value[5] = examples[example.value].values[2]
  await value2DataRun()
}

/**
 * URL Sharing
 */
function shareURL() {
  const routeData = router.resolve({
    name: 'EIP-7883',
    query: {
      b: hexVals.value[3],
      e: hexVals.value[4],
      m: hexVals.value[5],
    },
  })
  window.open(routeData.href, '_blank')
}

/**
 * Form values
 */
const data: Ref<string> = ref('')
const hexVals: Ref<[string, string, string, string, string, string]> = ref([
  '00',
  '00',
  '00',
  '00',
  '00',
  '00',
])
const bigIntVals: Ref<[bigint, bigint, bigint, bigint, bigint, bigint]> = ref([
  0n,
  0n,
  0n,
  0n,
  0n,
  0n,
])

const lengthsMask: Ref<(bigint | undefined)[]> = ref([32n, 32n, 32n, undefined, undefined])
const byteLengths: Ref<bigint[]> = ref([])

/**
 * Computation results
 */
const execResultPre: Ref<ExecResult | undefined> = ref()
const execResultPost: Ref<ExecResult | undefined> = ref()

/**
 * EVM Initialization
 */
const gasLimit = BigInt(5000000)

const commonPre = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const evmPre = await createEVM({ common: commonPre })
const modexpPre = getActivePrecompiles(commonPre).get('0000000000000000000000000000000000000005')!

const commonPost = new Common({ chain: Mainnet, hardfork: Hardfork.Osaka })
const evmPost = await createEVM({ common: commonPost })
const modexpPost = getActivePrecompiles(commonPost).get('0000000000000000000000000000000000000005')!

/**
 * Run the precompile
 */
async function run() {
  // Pre-Osaka run
  const callDataPre = {
    data: hexToBytes(`0x${data.value}`),
    gasLimit,
    common: commonPre,
    _EVM: evmPre,
  }
  execResultPre.value = await modexpPre(callDataPre)

  // Post-Osaka run
  const callDataPost = {
    data: hexToBytes(`0x${data.value}`),
    gasLimit,
    common: commonPost,
    _EVM: evmPost,
  }
  execResultPost.value = await modexpPost(callDataPost)
}

async function data2ValueRun() {
  data.value = preformatByteInputForm(data.value)
  if (!isValidByteInputForm(data.value)) {
    return false
  }

  byteLengths.value[3] = toBigInt(data, 0, 32 * 2)
  byteLengths.value[4] = toBigInt(data, 64, 64 + 32 * 2)
  byteLengths.value[5] = toBigInt(data, 128, 128 + 32 * 2)

  dataToValueInput(data, hexVals, bigIntVals, byteLengths)
  await run()
}

async function onDataInputFormChange() {
  example.value = ''
  await data2ValueRun()
}

async function value2DataRun() {
  for (let i = 0; i < hexVals.value.length; i++) {
    hexVals.value[i] = preformatByteInputForm(hexVals.value[i])
    if (!isValidByteInputForm(hexVals.value[i])) {
      return false
    }
  }

  valueToDataInput(hexVals, bigIntVals, lengthsMask, byteLengths)

  data.value =
    toHex(byteLengths.value[3], 32 * 2) +
    toHex(byteLengths.value[4], 32 * 2) +
    toHex(byteLengths.value[5], 32 * 2) +
    hexVals.value[3] +
    hexVals.value[4] +
    hexVals.value[5]

  await run()
}

async function onValueInputFormChange() {
  example.value = ''
  await value2DataRun()
}

async function init() {
  if ('b' in route.query && 'e' in route.query && 'm' in route.query) {
    try {
      hexVals.value[3] = route.query['b']!.toString()
      hexVals.value[4] = route.query['e']!.toString()
      hexVals.value[5] = route.query['m']!.toString()
      await value2DataRun()
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
  <EIPC
    title="ModExp Gas Cost Increase"
    eip="7883"
    descriptionHTML="Gas cost increases for the modexp precompile. There is a lot more to say here, but we do not say it right now."
    :shareURL="shareURL"
  >
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
      <PrecompileValueInput
        v-model="hexVals[5]"
        title="M"
        :input="onValueInputFormChange"
        :len="byteLengths[5]"
        :bigIntVal="bigIntVals[5]"
      />

      <div class="grid grid-cols-2 gap-1 mt-2.5">
        <PrecompileResultC v-model="execResultPre" title="Pre-Osaka" :left="true" />
        <PrecompileResultC v-model="execResultPost" title="Post-Osaka" :left="false" />
      </div>
    </div>
  </EIPC>
</template>
