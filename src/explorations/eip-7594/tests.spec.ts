import { describe, expect, it } from 'vitest'

import { examples } from './examples'
import { INFO } from './info'

describe('EIP-7594 Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7594')
      expect(INFO.path).toContain('eip-7594')
      expect(INFO.topic).toBe('scaling')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })
  })

  describe('examples', () => {
    it('has at least one example', () => {
      expect(Object.keys(examples).length).toBeGreaterThan(0)
    })

    it('each example has exactly 1 value (blob data)', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}" should have 1 value`).toHaveLength(1)
      }
    })

    it('blob data is non-empty', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values[0].length, `Blob in "${key}" should not be empty`).toBeGreaterThan(0)
      }
    })

    it('blob data contains valid hex characters', () => {
      const hexRegex = /^[0-9a-f]+$/i
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values[0], `Blob data in "${key}" should be valid hex`).toMatch(hexRegex)
      }
    })

    it('each example has a non-empty title', () => {
      for (const ex of Object.values(examples)) {
        expect(ex.title.length).toBeGreaterThan(0)
      }
    })
  })
})
