import { bigIntToHex, hexToBigInt, hexToBytes, isHexString } from '@ethereumjs/util'
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

/**
 * Remove the 0x-prefix if present.
 *
 * @param str - The input string
 * @returns The formatted string
 */
export const preformatByteInputForm = (str: string) => {
  if (str.substring(0, 2) === '0x') {
    str = str.substring(2)
  }
  return str
}

export const toBigInt = (data: Ref<string, string>, start: number, end: number) => {
  return hexToBigInt(`0x${data.value.substring(start, end)}`)
}

export const toHex = (value: bigint, length: number) => {
  return bigIntToHex(value).substring(2).padStart(length, '0')
}

/**
 * Derive the individual values from the combined data
 * being flexible on the number of values.
 *
 * @param data - The combined data as the "source of truth"
 * @param hexVals - The individual hex values
 * @param bigIntVals - The individual bigInt values
 * @param byteLengths - The individual byte lengths
 */
export const dataToValueInput = (
  data: Ref<string, string>,
  hexVals: Ref<string[], string[]>,
  bigIntVals: Ref<bigint[], bigint[]>,
  byteLengths: Ref<bigint[], bigint[]>,
) => {
  let start = 0
  for (let i = 0; i < hexVals.value.length; i++) {
    const end = start + Number(byteLengths.value[i]) * 2
    hexVals.value[i] = data.value.substring(start, end)
    bigIntVals.value[i] = toBigInt(data, start, end)
    start = end
  }
}

/**
 * Derive the combined data from the individual values
 * being flexible on the number of values.
 *
 * @param hexVals - The individual hex values
 * @param bigIntVals - The individual bigInt values
 * @param lengthsMask - The lengths mask defining certain fixed byte lengths
 * @param byteLengths - Calculated or taken from the lengths mask
 */
export const valueToDataInput = (
  hexVals: Ref<string[], string[]>,
  bigIntVals: Ref<bigint[], bigint[]>,
  lengthsMask: Ref<(bigint | undefined)[], (bigint | undefined)[]>,
  byteLengths: Ref<bigint[], bigint[]>,
) => {
  for (let i = 0; i < hexVals.value.length; i++) {
    if (lengthsMask.value[i] === undefined) {
      byteLengths.value[i] = BigInt(hexToBytes(`0x${hexVals.value[i]}`).byteLength)
    } else {
      byteLengths.value[i] = lengthsMask.value[i]!
    }
    bigIntVals.value[i] = hexToBigInt(`0x${hexVals.value[i]}`)
  }
}

/**
 * Only use up to 99
 */
export const countUpwardsHexStr = (num: number) => {
  let str = ''
  for (let i = 1; i <= num; i++) {
    str += i.toString().substring(0, 2).padStart(2, '0')
  }
  return str
}
