import { describe, expect, it } from 'vitest'

import { config } from './config'
import { run } from './custom/run'
import { examples } from './examples'
import { INFO } from './info'

describe('Custom Addition Precompile Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('custom-addition-precompile')
      expect(INFO.path).toContain('custom-addition-precompile')
      expect(INFO.topic).toBe('research')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })
  })

  describe('config', () => {
    it('references a valid default example', () => {
      expect(examples[config.defaultExample]).toBeDefined()
    })

    it('defines 2 value fields (A and B)', () => {
      expect(config.values).toHaveLength(2)
    })

    it('both values have fixed 32-byte expected length', () => {
      for (const val of config.values) {
        expect(val.expectedLen).toBe(32n)
      }
    })

    it('both values have URL params', () => {
      expect(config.values.map((v) => v.urlParam)).toEqual(['a', 'b'])
    })
  })

  describe('examples', () => {
    it('each example has 2 values', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}" should have 2 values`).toHaveLength(2)
      }
    })

    it('each value is a 64-character hex string', () => {
      for (const [key, ex] of Object.entries(examples)) {
        for (const val of ex.values) {
          expect(val.length, `Value in "${key}" should be 64 chars`).toBe(64)
        }
      }
    })

    it('values contain valid hex characters', () => {
      const hexRegex = /^[0-9a-f]+$/i
      for (const [key, ex] of Object.entries(examples)) {
        for (const val of ex.values) {
          expect(val, `Value in "${key}" should be valid hex`).toMatch(hexRegex)
        }
      }
    })
  })

  describe('custom run', () => {
    it('adds two small numbers (2 + 3 = 5)', async () => {
      const data =
        '0000000000000000000000000000000000000000000000000000000000000002' +
        '0000000000000000000000000000000000000000000000000000000000000003'
      const result = await run(data)
      expect(result.a).toBe(2n)
      expect(result.b).toBe(3n)
      expect(result.sum).toBe(5n)
      expect(result.execResult.executionGasUsed).toBe(15n)
    })

    it('handles overflow (wraps mod 2^256)', async () => {
      const data =
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff' +
        '0000000000000000000000000000000000000000000000000000000000000001'
      const result = await run(data)
      expect(result.sum).toBe(0n)
    })

    it('adds zeros', async () => {
      const data =
        '0000000000000000000000000000000000000000000000000000000000000000' +
        '0000000000000000000000000000000000000000000000000000000000000000'
      const result = await run(data)
      expect(result.sum).toBe(0n)
    })
  })
})
