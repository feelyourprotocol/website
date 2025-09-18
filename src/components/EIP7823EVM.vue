<script setup lang="ts">
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, getActivePrecompiles } from '@ethereumjs/evm'
import { bigIntToBytes, bigIntToHex, bytesToHex, hexToBigInt, hexToBytes } from '@ethereumjs/util'
import { ref, type Ref } from 'vue'
import { isValidByteInputForm, preformatByteInputForm } from './lib/inputUtils'


const validByteInputForm: Ref<boolean> = ref(true)

const lenB: Ref<bigint> = ref(1n)
const lenE: Ref<bigint> = ref(1n)
const lenM: Ref<bigint> = ref(1n)
const valB: Ref<bigint> = ref(2n)
const valE: Ref<bigint> = ref(2n)
const valM: Ref<bigint> = ref(2n)

const input = '0000000000000000000000000000000000000000000000000000000000000001' +
              '0000000000000000000000000000000000000000000000000000000000000001' +
              '0000000000000000000000000000000000000000000000000000000000000001' +
              '020202'

const data: Ref<string> = ref(input)
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
  console.log(data.value)
  const callData = {
    data: hexToBytes(`0x${data.value}`),
    gasLimit,
    common,
    _EVM: evm,
  }
  console.log(callData)
  const res = await modexp(callData)
  console.log(res)
  gas.value = res.executionGasUsed
  result.value = bytesToHex(res.returnValue)
}

function byteToValueInput() {
  data.value = preformatByteInputForm(data.value)
  validByteInputForm.value = isValidByteInputForm(data.value)
  console.log(validByteInputForm.value)
  if (!validByteInputForm.value) {
    return false
  }

  const from = (start: number, end: number) => {
    return hexToBigInt(`0x${data.value.substring(start, end)}`)
  }

  lenB.value = from(0, 32 * 2)
  lenE.value = from(64, 64 + 32 * 2)
  lenM.value = from(128, 128 + 32 * 2)

  const bStart = 192
  const bEnd = bStart + Number(lenB.value) * 2
  valB.value = from(bStart, bEnd)
  const eEnd = bEnd + Number(lenE.value) * 2
  valE.value = from(bEnd, eEnd)
  const mEnd = eEnd + Number(lenM.value) * 2
  valM.value = from(eEnd, mEnd)

  return true
}

async function onByteInputFormChange() {
  const success = byteToValueInput()
  if (success) {
    await run()
  }
}

function valueToByteInput() {
  const p = (value: bigint, length: number) => {
    return bigIntToHex(value).substring(2).padStart(length, '0')
  }

  console.log(bigIntToBytes(valB.value))
  console.log(bigIntToBytes(valB.value).byteLength)
  lenB.value = BigInt(bigIntToBytes(valB.value).byteLength)
  const lenBStr = p(lenB.value, 32 * 2)
  const valBStr = p(valB.value, Number(lenB.value) * 2)

  lenE.value = BigInt(bigIntToBytes(valE.value).byteLength)
  const lenEStr = p(lenE.value, 32 * 2)
  const valEStr = p(valE.value, Number(lenE.value) * 2)

  lenM.value = BigInt(bigIntToBytes(valM.value).byteLength)
  const lenMStr = p(lenM.value, 32 * 2)
  const valMStr = p(valM.value, Number(lenM.value) * 2)

  data.value = lenBStr + lenEStr + lenMStr + valBStr + valEStr + valMStr

  return true
}



async function onValueInputFormChange() {
  const success = valueToByteInput()
  if (success) {
    await run()
  }
}

await run()

</script>

<template>
  <div>
    <p>
      <span>Input:</span>
      <textarea rows="6" @input="onByteInputFormChange" v-model="data" 
        class="block w-full bg-gray-50 border border-gray-300"></textarea>
    </p>
    <p>
      B <input @input="onValueInputFormChange" v-model.number="valB" class="bg-gray-50 border border-gray-300"> Length: <span>{{  lenB }}</span>
    </p>
    <p>
      E <input @input="onValueInputFormChange" v-model.number="valE" class="bg-gray-50 border border-gray-300"> Length: <span>{{  lenE }}</span>
    </p>
    <p>
      M <input @input="onValueInputFormChange" v-model.number="valM" class="bg-gray-50 border border-gray-300"> Length: <span>{{  lenM }}</span>
    </p>
    
    <p class="mt-5">
      Gas: {{  gas }} | Result: {{  result }}
    </p>
  </div>


</template>
