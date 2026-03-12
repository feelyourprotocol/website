import { describe, expect, it } from 'vitest'

import { config } from './config'
import { examples } from './examples'
import { INFO } from './info'

describe('EIP-7883 Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7883')
      expect(INFO.path).toContain('eip-7883')
      expect(INFO.topic).toBe('robustness')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })
  })

  describe('config', () => {
    it('references a valid default example', () => {
      expect(examples[config.defaultExample]).toBeDefined()
    })

    it('defines 6 value fields (3 lengths + 3 editable)', () => {
      expect(config.values).toHaveLength(6)
    })

    it('has 3 editable values with urlParams', () => {
      const editable = config.values.filter((v) => v.urlParam)
      expect(editable).toHaveLength(3)
      expect(editable.map((v) => v.urlParam)).toEqual(['b', 'e', 'm'])
    })

    it('hides length fields from input display', () => {
      const hidden = config.values.filter((v) => v.showInput === false)
      expect(hidden).toHaveLength(3)
    })

    it('assembleData correctly encodes lengths + values', () => {
      const hexVals = ['', '', '', '03', '03', '02']
      const byteLengths = [0n, 0n, 0n, 1n, 1n, 1n]
      const result = config.assembleData!(hexVals, byteLengths)
      const expected =
        '0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000001' +
        '030302'
      expect(result).toBe(expected)
    })

    it('assembleData pads odd-length hex values', () => {
      const hexVals = ['', '', '', 'abc', 'de', 'f']
      const byteLengths = [0n, 0n, 0n, 2n, 1n, 1n]
      const result = config.assembleData!(hexVals, byteLengths)
      expect(result).toContain('0abc')
      expect(result).toContain('0f')
    })

    it('parseData correctly extracts byte lengths', () => {
      const data =
        '0000000000000000000000000000000000000000000000000000000000000001' +
        '0000000000000000000000000000000000000000000000000000000000000002' +
        '0000000000000000000000000000000000000000000000000000000000000003'
      const byteLengths = [0n, 0n, 0n, 0n, 0n, 0n]
      config.parseData!(data, byteLengths)
      expect(byteLengths[3]).toBe(1n)
      expect(byteLengths[4]).toBe(2n)
      expect(byteLengths[5]).toBe(3n)
    })

    it('assembleData and parseData are inverse operations for lengths', () => {
      const hexVals = ['', '', '', '03', '0102030405', '02']
      const byteLengths = [0n, 0n, 0n, 1n, 5n, 1n]
      const assembled = config.assembleData!(hexVals, byteLengths)

      const parsedLengths = [0n, 0n, 0n, 0n, 0n, 0n]
      config.parseData!(assembled, parsedLengths)
      expect(parsedLengths[3]).toBe(1n)
      expect(parsedLengths[4]).toBe(5n)
      expect(parsedLengths[5]).toBe(1n)
    })
  })

  describe('examples', () => {
    it('has at least one example', () => {
      expect(Object.keys(examples).length).toBeGreaterThan(0)
    })

    it('each example has 3 values (B, E, M)', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}" should have 3 values`).toHaveLength(3)
      }
    })

    it('each example has a non-empty title', () => {
      for (const ex of Object.values(examples)) {
        expect(ex.title.length).toBeGreaterThan(0)
      }
    })

    it('example values contain valid hex characters', () => {
      const hexRegex = /^[0-9a-f]+$/i
      for (const [key, ex] of Object.entries(examples)) {
        for (const val of ex.values) {
          expect(val, `Value in "${key}" should be valid hex`).toMatch(hexRegex)
        }
      }
    })
  })
})
