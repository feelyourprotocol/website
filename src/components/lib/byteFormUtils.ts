import { bigIntToBytes, bigIntToHex, hexToBigInt, isHexString } from '@ethereumjs/util'
import type { Ref } from 'vue'

/**
 * Checks for Byte input form validity
 * (call only after preformat! (so: strip 0x))
 * 
 * - No 0x-prefix
 * - Valid hex values
 * - Even length (two chars per byte)
 * 
 * @param str 
 * @returns true if valid
 */
export const isValidByteInputForm = (str: string) => {
  const validHex = isHexString(`0x${str}`)
  const evenLength = str.length % 2 === 0
  return validHex && evenLength
}

export const preformatByteInputForm = (str: string) => {
  if (str.substring(0, 2) === '0x') {
    str = str.substring(2)
  }
  return str
}

export const toVal = (data: Ref<string, string>, start: number, end: number) => {
  return hexToBigInt(`0x${data.value.substring(start, end)}`)
}

export const toHex = (value: bigint, length: number) => {
  return bigIntToHex(value).substring(2).padStart(length, '0')
}

export const byteToValueInput = (data: Ref<string, string>, vals: Ref<bigint[], bigint[]>,
  byteLengths: Ref<bigint[], bigint[]>, hexStrings: Ref<string[], string[]>) => {
  let start = 0
  for (let i = 0; i < vals.value.length; i++) {
    const end = start + Number(byteLengths.value[i]) * 2
    hexStrings.value[i] = data.value.substring(start, end)
    vals.value[i] = toVal(data, start, end)
    start = end
  }
}

export const valueToByteInput = (vals: Ref<bigint[], bigint[]>, lengthsMask: Ref<(bigint | undefined)[], (bigint | undefined)[]>,
  byteLengths: Ref<bigint[], bigint[]>, hexStrings: Ref<string[], string[]>) => {
  for (let i = 0; i < vals.value.length; i++) {
    if (lengthsMask.value[i] === undefined) {
      byteLengths.value[i] = BigInt(bigIntToBytes(vals.value[i]).byteLength)
    } else {
      byteLengths.value[i] = lengthsMask.value[i]!
    }
    hexStrings.value[i] = toHex(vals.value[i], Number(byteLengths.value[i]) * 2)
  }
}
