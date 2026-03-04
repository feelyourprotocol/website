import type { Ref } from 'vue'
import { bigIntToHex, hexToBigInt, hexToBytes, isHexString } from '@ethereumjs/util'

/**
 * Validates a raw hex input string for use as precompile data.
 *
 * Expects the string WITHOUT `0x` prefix. Returns an empty array if
 * valid, otherwise an array of human-readable error messages.
 */
export function isValidByteInputForm(str: string, expectedLen?: bigint): string[] {
  const errors: string[] = []
  if (str.substring(0, 2) === '0x') {
    errors.push('Enter without 0x-prefix')
  }
  if (expectedLen !== undefined && str.length !== Number(expectedLen) * 2) {
    errors.push(`${Number(expectedLen)} bytes expected (${str.length / 2} bytes provided)`)
  }
  if (!isHexString(`0x${str}`)) {
    errors.push('Hex value invalid')
  }
  return errors
}

/**
 * Converts a bigint to an unprefixed hex string, zero-padded to `length` characters.
 *
 * Example: `toHex(255n, 4)` → `"00ff"`
 */
export function toHex(value: bigint, length: number): string {
  return bigIntToHex(value).substring(2).padStart(length, '0')
}

/**
 * Ensures a hex string has even length by prepending a `0` if needed.
 * Precompile data fields require whole-byte alignment (2 hex chars per byte).
 *
 * Example: `padHex("abc")` → `"0abc"`, `padHex("abcd")` → `"abcd"`
 */
export function padHex(value: string): string {
  return value.length % 2 === 0 ? value : `0${value}`
}

/**
 * Splits a combined hex data string into individual value fields.
 *
 * Reads `data` sequentially, slicing each field according to the byte lengths
 * in `byteLengths`. Updates `hexVals` and (where defined) `bigIntVals` in place.
 */
export function dataToValueInput(
  data: Ref<string>,
  hexVals: Ref<string[]>,
  bigIntVals: Ref<(bigint | undefined)[]>,
  byteLengths: Ref<bigint[]>,
): void {
  let start = 0
  for (let i = 0; i < hexVals.value.length; i++) {
    const end = start + Number(byteLengths.value[i]) * 2
    hexVals.value[i] = data.value.substring(start, end)
    if (bigIntVals.value[i] !== undefined) {
      bigIntVals.value[i] = hexToBigInt(`0x${data.value.substring(start, end)}`)
    }
    start = end
  }
}

/**
 * Derives byte lengths and bigint representations from individual hex value fields.
 *
 * For each value: if a fixed length is defined in `lengthsMask`, it is used directly;
 * otherwise the actual byte length of the hex string is computed. BigInt values are
 * updated where defined.
 */
export function valueToDataInput(
  hexVals: Ref<string[]>,
  bigIntVals: Ref<(bigint | undefined)[]>,
  lengthsMask: Ref<(bigint | undefined)[]>,
  byteLengths: Ref<bigint[]>,
): void {
  for (let i = 0; i < hexVals.value.length; i++) {
    if (lengthsMask.value[i] === undefined) {
      byteLengths.value[i] = BigInt(hexToBytes(`0x${hexVals.value[i]}`).byteLength)
    } else {
      byteLengths.value[i] = lengthsMask.value[i]!
    }
    if (bigIntVals.value[i] !== undefined) {
      bigIntVals.value[i] = hexToBigInt(`0x${hexVals.value[i]}`)
    }
  }
}

/**
 * Generates a hex string of `num` bytes where each byte is the counter value
 * (01, 02, ..., 99). Useful for creating recognizable test data in examples.
 *
 * Example: `countUpwardsHexStr(3)` → `"010203"`
 */
export function countUpwardsHexStr(num: number): string {
  let str = ''
  for (let i = 1; i <= num; i++) {
    str += i.toString().substring(0, 2).padStart(2, '0')
  }
  return str
}
