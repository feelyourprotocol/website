<script setup lang="ts">
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, getActivePrecompiles, type ExecResult } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'
import { ref, type Ref } from 'vue'
import {
  byteToValueInput,
  isValidByteInputForm,
  preformatByteInputForm,
  toHex,
  toVal,
  valueToByteInput,
} from '../lib/byteFormUtils'
import PrecompileValueInput from '../precompiles/PrecompileValueInput.vue'
import { useRoute, useRouter } from 'vue-router'
import PrecompileResultC from '../precompiles/PrecompileResultC.vue'
import PrecompileExamplesC from '../precompiles/PrecompileExamplesC.vue'
import PrecompileByteInput from '../precompiles/PrecompileByteInput.vue'
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
    values: [bigint, bigint, bigint]
  }
}
const examples: Examples = {
  'rsa-random': {
    title: 'RSA Random',
    values: [3n, 5n, 2n],
  },
}

const selectExample = () => {
  if (example.value === '') {
    return
  }
  vals.value[3] = examples[example.value].values[0]
  vals.value[4] = examples[example.value].values[1]
  vals.value[5] = examples[example.value].values[2]
  value2ByteRun()
}

/**
 * URL Sharing
 */
function shareURL() {
  const routeData = router.resolve({
    name: 'EIP-7883',
    query: {
      b: vals.value[3].toString(),
      e: vals.value[4].toString(),
      m: vals.value[5].toString(),
    },
  })
  window.open(routeData.href, '_blank')
}

/**
 * Form values
 */
const vals: Ref<[bigint, bigint, bigint, bigint, bigint, bigint]> = ref([1n, 1n, 1n, 2n, 2n, 2n])
const lengthsMask: Ref<(bigint | undefined)[]> = ref([32n, 32n, 32n, undefined, undefined])

const byteLengths: Ref<bigint[]> = ref([])
const hexStrings: Ref<string[]> = ref([])
const data: Ref<string> = ref('')

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

async function byte2ValueRun() {
  data.value = preformatByteInputForm(data.value)
  if (!isValidByteInputForm(data.value)) {
    return false
  }

  byteLengths.value[3] = toVal(data, 0, 32 * 2)
  byteLengths.value[4] = toVal(data, 64, 64 + 32 * 2)
  byteLengths.value[5] = toVal(data, 128, 128 + 32 * 2)

  byteToValueInput(data, vals, byteLengths, hexStrings)
  await run()
}

async function onByteInputFormChange() {
  example.value = ''
  await byte2ValueRun()
}

async function value2ByteRun() {
  valueToByteInput(vals, lengthsMask, byteLengths, hexStrings)

  data.value =
    toHex(byteLengths.value[3], 32 * 2) +
    toHex(byteLengths.value[4], 32 * 2) +
    toHex(byteLengths.value[5], 32 * 2) +
    hexStrings.value[3] +
    hexStrings.value[4] +
    hexStrings.value[5]

  await run()
}

async function onValueInputFormChange() {
  example.value = ''
  value2ByteRun()
}

async function init() {
  if ('b' in route.query && 'e' in route.query && 'm' in route.query) {
    try {
      vals.value[3] = BigInt(route.query['b']!.toString())
      vals.value[4] = BigInt(route.query['e']!.toString())
      vals.value[5] = BigInt(route.query['m']!.toString())
    } catch {
      console.log('Invalid parameter call!')
    }
  }
  await value2ByteRun()
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
        <PrecompileByteInput v-model="data" rows="6" :formChange="onByteInputFormChange" />
      </p>

      <PrecompileValueInput
        v-model="vals[3]"
        title="B"
        :input="onValueInputFormChange"
        :len="byteLengths[3]"
        :hex="hexStrings[3]"
      />
      <PrecompileValueInput
        v-model="vals[4]"
        title="E"
        :input="onValueInputFormChange"
        :len="byteLengths[4]"
        :hex="hexStrings[4]"
      />
      <PrecompileValueInput
        v-model="vals[5]"
        title="M"
        :input="onValueInputFormChange"
        :len="byteLengths[5]"
        :hex="hexStrings[5]"
      />

      <div class="grid grid-cols-2 gap-1 mt-2.5">
        <PrecompileResultC v-model="execResultPre" title="Pre-Osaka" :left="true" />
        <PrecompileResultC v-model="execResultPost" title="Post-Osaka" :left="false" />
      </div>
    </div>
  </EIPC>
</template>
