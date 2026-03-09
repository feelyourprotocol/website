import { describe, expect, it } from 'vitest'

import { config } from './config'
import { examples } from './examples'
import { INFO } from './info'

describe('EIP-7951 Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7951')
      expect(INFO.path).toContain('eip-7951')
      expect(INFO.topic).toBe('fusaka')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })
  })

  describe('config', () => {
    it('references a valid default example', () => {
      expect(examples[config.defaultExample]).toBeDefined()
    })

    it('defines 5 value fields', () => {
      expect(config.values).toHaveLength(5)
    })

    it('all values have fixed 32-byte expected length', () => {
      for (const val of config.values) {
        expect(val.expectedLen).toBe(32n)
      }
    })

    it('all values have URL params', () => {
      for (const val of config.values) {
        expect(val.urlParam).toBeDefined()
      }
    })

    it('does not define custom assembleData or parseData', () => {
      expect(config.assembleData).toBeUndefined()
      expect(config.parseData).toBeUndefined()
    })

    it('hides bigInt display', () => {
      expect(config.showBigInt).toBe(false)
    })
  })

  describe('examples', () => {
    it('has at least one example', () => {
      expect(Object.keys(examples).length).toBeGreaterThan(0)
    })

    it('each example has 5 values matching the 5 config fields', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}" should have 5 values`).toHaveLength(5)
      }
    })

    it('each value is a 64-character hex string (32 bytes)', () => {
      for (const [key, ex] of Object.entries(examples)) {
        for (const val of ex.values) {
          expect(val.length, `Value in "${key}" should be 64 chars`).toBe(64)
        }
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

    it('includes both valid and invalid signature examples', () => {
      const titles = Object.values(examples).map((e) => e.title.toLowerCase())
      expect(titles.some((t) => t.includes('valid') && !t.includes('invalid'))).toBe(true)
      expect(titles.some((t) => t.includes('invalid'))).toBe(true)
    })
  })
})
