<script setup lang="ts">
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, getActivePrecompiles } from '@ethereumjs/evm'
import { bytesToHex, hexToBytes } from '@ethereumjs/util'
import { ref, type Ref } from 'vue'
import {
  byteToValueInput,
  isValidByteInputForm,
  preformatByteInputForm,
  toHex,
  toVal,
  valueToByteInput,
} from '../lib/byteFormUtils'
import PrecompileC from '@/components/precompiles/PrecompileC.vue'
import PrecompileValueInput from '../precompiles/PrecompileValueInput.vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

/**
 * Examples
 */
const example: Ref<string> = ref('')
interface Examples {
  [key: string]: [bigint, bigint, bigint]
}
const examples: Examples = {
  'rsa-random': [3n, 5n, 2n],
}

const selectExample = () => {
  if (example.value === '') {
    return
  }
  vals.value[3] = examples[example.value][0]
  vals.value[4] = examples[example.value][1]
  vals.value[5] = examples[example.value][2]
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
const gas: Ref<bigint | undefined> = ref(BigInt(0))
const result: Ref<string> = ref('')

/**
 * EVM Initialization
 */
const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
const gasLimit = BigInt(5000000)

const evm = await createEVM({ common })
const modexp = getActivePrecompiles(common).get('0000000000000000000000000000000000000005')!

/**
 * Run the precompile
 */
async function run() {
  console.log(`0x${data.value}`)
  const callData = {
    data: hexToBytes(`0x${data.value}`),
    gasLimit,
    common,
    _EVM: evm,
  }
  const res = await modexp(callData)
  console.log(res)
  gas.value = res.executionGasUsed
  result.value = bytesToHex(res.returnValue)
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
  <PrecompileC
    title="ModExp Gas Cost Increase"
    eip="7883"
    descriptionHTML="Gas cost increases for the modexp precompile. There is a lot more to say here, but we do not say it right now."
    :shareURL="shareURL"
  >
    <div>
      <p class="text-right">
        <select
          v-model="example"
          class="text-blue-900 text-xs border-1 pl-1 pr-1 pt-0.5 pb-0.5 rounded-sm"
          @change="selectExample"
        >
          <option disabled selected value="">Examples</option>
          <option value="rsa-random">RSA Random</option>
        </select>
      </p>

      <p>
        <textarea
          @input="onByteInputFormChange"
          rows="6"
          v-model="data"
          class="block w-full mt-1.5 mb-2 font-mono text-xs rounded-sm text-slate-600 bg-blue-50 p-1"
        ></textarea>
      </p>

      <PrecompileValueInput title="B" :len="byteLengths[3]" :hex="hexStrings[3]">
        <input
          @input="onValueInputFormChange"
          v-model.number="vals[3]"
          class="text-right font-mono text-xs col-span-5 bg-blue-50 text-slate-600 rounded-xs p-0.5"
        />
      </PrecompileValueInput>

      <PrecompileValueInput title="E" :len="byteLengths[4]" :hex="hexStrings[4]">
        <input
          @input="onValueInputFormChange"
          v-model.number="vals[4]"
          class="text-right font-mono text-xs col-span-5 bg-blue-50 text-slate-600 rounded-xs p-0.5"
        />
      </PrecompileValueInput>

      <PrecompileValueInput title="M" :len="byteLengths[5]" :hex="hexStrings[5]">
        <input
          @input="onValueInputFormChange"
          v-model.number="vals[5]"
          class="text-right font-mono text-xs col-span-5 bg-blue-50 text-slate-600 rounded-xs p-0.5"
        />
      </PrecompileValueInput>

      <div class="grid grid-cols-2 gap-1 mt-2.5">
        <div class="bg-blue-900 rounded-sm p-2.5 text-left">
          <span class="text-xs bg-white p-1 text-blue-900 rounded-xs">Pre-Osaka</span>
          <p class="text-2xl font-bold text-white mt-2.5">{{ gas }} Gas</p>
          <p class="text-xs font-bold font-mono text-white mt-1 break-words w-full overflow-hidden">
            Result: {{ result }}
          </p>
        </div>
        <div class="bg-blue-900 rounded-sm p-2.5 text-right">
          <span class="text-xs w-fit bg-white p-1 text-blue-900 rounded-xs">Post-Osaka</span>
          <p class="text-2xl font-bold text-white mt-2.5">200 Gas</p>
          <p class="text-xs font-bold font-mono text-white mt-1 break-words w-full overflow-hidden">
            Result: 0x00
          </p>
        </div>
      </div>
    </div>
  </PrecompileC>
</template>
