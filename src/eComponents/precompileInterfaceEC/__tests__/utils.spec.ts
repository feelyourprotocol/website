import { describe, expect, it } from 'vitest'
import { ref } from 'vue'

import {
  countUpwardsHexStr,
  dataToValueInput,
  isValidByteInputForm,
  padHex,
  toHex,
  valueToDataInput,
} from '../utils'

describe('isValidByteInputForm', () => {
  it('accepts valid hex without prefix', () => {
    expect(isValidByteInputForm('deadbeef')).toEqual([])
  })

  it('accepts empty string', () => {
    expect(isValidByteInputForm('')).toEqual([])
  })

  it('rejects 0x prefix', () => {
    const errors = isValidByteInputForm('0xdeadbeef')
    expect(errors.some((e) => e.includes('0x'))).toBe(true)
  })

  it('rejects invalid hex characters', () => {
    const errors = isValidByteInputForm('zzzz')
    expect(errors.some((e) => e.toLowerCase().includes('invalid'))).toBe(true)
  })

  it('validates expected byte length (too short)', () => {
    const errors = isValidByteInputForm('dead', 4n)
    expect(errors.some((e) => e.includes('4 bytes expected'))).toBe(true)
  })

  it('validates expected byte length (too long)', () => {
    const errors = isValidByteInputForm('deadbeefcafe', 2n)
    expect(errors.some((e) => e.includes('2 bytes expected'))).toBe(true)
  })

  it('accepts correct expected length', () => {
    expect(isValidByteInputForm('deadbeef', 4n)).toEqual([])
  })

  it('returns multiple errors when applicable', () => {
    const errors = isValidByteInputForm('0xzz', 4n)
    expect(errors.length).toBeGreaterThanOrEqual(2)
  })
})

describe('toHex', () => {
  it('converts bigint to padded hex string', () => {
    expect(toHex(255n, 4)).toBe('00ff')
  })

  it('converts zero', () => {
    expect(toHex(0n, 4)).toBe('0000')
  })

  it('pads to requested length', () => {
    expect(toHex(1n, 64)).toBe('0'.repeat(63) + '1')
  })

  it('does not truncate if value exceeds length', () => {
    expect(toHex(256n, 2)).toBe('100')
  })
})

describe('padHex', () => {
  it('pads odd-length hex strings', () => {
    expect(padHex('abc')).toBe('0abc')
  })

  it('leaves even-length hex strings unchanged', () => {
    expect(padHex('abcd')).toBe('abcd')
  })

  it('pads single character', () => {
    expect(padHex('f')).toBe('0f')
  })

  it('leaves empty string unchanged', () => {
    expect(padHex('')).toBe('')
  })
})

describe('countUpwardsHexStr', () => {
  it('generates counting hex bytes', () => {
    expect(countUpwardsHexStr(3)).toBe('010203')
  })

  it('returns empty string for zero', () => {
    expect(countUpwardsHexStr(0)).toBe('')
  })

  it('generates single byte', () => {
    expect(countUpwardsHexStr(1)).toBe('01')
  })

  it('pads single-digit numbers', () => {
    expect(countUpwardsHexStr(9)).toBe('010203040506070809')
  })
})

describe('dataToValueInput', () => {
  it('splits data into value fields by byte lengths', () => {
    const data = ref('aabbccdd')
    const hexVals = ref(['', ''])
    const bigIntVals = ref<(bigint | undefined)[]>([undefined, undefined])
    const byteLengths = ref([2n, 2n])

    dataToValueInput(data, hexVals, bigIntVals, byteLengths)

    expect(hexVals.value).toEqual(['aabb', 'ccdd'])
  })

  it('updates bigIntVals when defined', () => {
    const data = ref('00ff')
    const hexVals = ref([''])
    const bigIntVals = ref<(bigint | undefined)[]>([0n])
    const byteLengths = ref([2n])

    dataToValueInput(data, hexVals, bigIntVals, byteLengths)

    expect(bigIntVals.value[0]).toBe(255n)
  })

  it('leaves bigIntVals undefined when not tracked', () => {
    const data = ref('aabb')
    const hexVals = ref([''])
    const bigIntVals = ref<(bigint | undefined)[]>([undefined])
    const byteLengths = ref([2n])

    dataToValueInput(data, hexVals, bigIntVals, byteLengths)

    expect(bigIntVals.value[0]).toBeUndefined()
  })

  it('handles multiple fields with different lengths', () => {
    const data = ref('aabbccddee')
    const hexVals = ref(['', '', ''])
    const bigIntVals = ref<(bigint | undefined)[]>([undefined, undefined, undefined])
    const byteLengths = ref([1n, 2n, 2n])

    dataToValueInput(data, hexVals, bigIntVals, byteLengths)

    expect(hexVals.value).toEqual(['aa', 'bbcc', 'ddee'])
  })
})

describe('valueToDataInput', () => {
  it('computes byte lengths from hex values', () => {
    const hexVals = ref(['aabb', 'ccdd'])
    const bigIntVals = ref<(bigint | undefined)[]>([undefined, undefined])
    const lengthsMask = ref<(bigint | undefined)[]>([undefined, undefined])
    const byteLengths = ref([0n, 0n])

    valueToDataInput(hexVals, bigIntVals, lengthsMask, byteLengths)

    expect(byteLengths.value).toEqual([2n, 2n])
  })

  it('uses length mask when defined', () => {
    const hexVals = ref(['aabb'])
    const bigIntVals = ref<(bigint | undefined)[]>([undefined])
    const lengthsMask = ref<(bigint | undefined)[]>([32n])
    const byteLengths = ref([0n])

    valueToDataInput(hexVals, bigIntVals, lengthsMask, byteLengths)

    expect(byteLengths.value[0]).toBe(32n)
  })

  it('updates bigIntVals when defined', () => {
    const hexVals = ref(['00ff'])
    const bigIntVals = ref<(bigint | undefined)[]>([0n])
    const lengthsMask = ref<(bigint | undefined)[]>([undefined])
    const byteLengths = ref([0n])

    valueToDataInput(hexVals, bigIntVals, lengthsMask, byteLengths)

    expect(bigIntVals.value[0]).toBe(255n)
  })
})
