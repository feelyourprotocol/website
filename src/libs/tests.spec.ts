import { describe, expect, it } from 'vitest'

import { isValidExplorationDate, latestExplorationIds, parseExplorationDate } from './dates'
import { computeTagCloud } from './tagCloud'

describe('dates', () => {
  describe('isValidExplorationDate', () => {
    it('accepts valid dates', () => {
      expect(isValidExplorationDate('2025-12-08 11:40')).toBe(true)
      expect(isValidExplorationDate('2026-01-01 00:00')).toBe(true)
      expect(isValidExplorationDate('2025-11-30 23:59')).toBe(true)
    })

    it('rejects invalid formats', () => {
      expect(isValidExplorationDate('2025-12-08')).toBe(false)
      expect(isValidExplorationDate('12/08/2025 11:40')).toBe(false)
      expect(isValidExplorationDate('2025-13-08 11:40')).toBe(false)
      expect(isValidExplorationDate('2025-12-08 25:00')).toBe(false)
      expect(isValidExplorationDate('')).toBe(false)
    })
  })

  describe('parseExplorationDate', () => {
    it('parses to correct Date object', () => {
      const d = parseExplorationDate('2025-12-08 11:40')
      expect(d.getUTCFullYear()).toBe(2025)
      expect(d.getUTCMonth()).toBe(11)
      expect(d.getUTCDate()).toBe(8)
      expect(d.getUTCHours()).toBe(11)
      expect(d.getUTCMinutes()).toBe(40)
    })

    it('throws on invalid format', () => {
      expect(() => parseExplorationDate('not-a-date')).toThrow('Invalid exploration date format')
    })
  })

  describe('latestExplorationIds', () => {
    it('returns the requested number of IDs', () => {
      const ids = latestExplorationIds(3)
      expect(ids).toHaveLength(3)
    })

    it('returns newest first', () => {
      const ids = latestExplorationIds(4)
      expect(ids[0]).toBe('eip-8141')
    })

    it('respects the count limit', () => {
      const ids = latestExplorationIds(2)
      expect(ids).toHaveLength(2)
    })
  })
})

describe('tagCloud', () => {
  describe('computeTagCloud', () => {
    it('returns tags for valid exploration IDs', () => {
      const items = computeTagCloud(['eip-7883'])
      expect(items.length).toBeGreaterThan(0)
      expect(items.every((i) => i.label.length > 0)).toBe(true)
    })

    it('returns empty array for no explorations', () => {
      expect(computeTagCloud([])).toEqual([])
    })

    it('assigns font sizes within the specified range', () => {
      const items = computeTagCloud(['eip-7883', 'eip-7951', 'eip-7594'], 12, 0.8, 1.6)
      for (const item of items) {
        expect(item.fontSize).toBeGreaterThanOrEqual(0.8)
        expect(item.fontSize).toBeLessThanOrEqual(1.6)
      }
    })

    it('sorts output alphabetically by label', () => {
      const items = computeTagCloud(['eip-7883', 'eip-7951', 'eip-7594', 'eip-8141'])
      const labels = items.map((i) => i.label)
      const sorted = [...labels].sort((a, b) => a.localeCompare(b))
      expect(labels).toEqual(sorted)
    })

    it('respects maxTags limit', () => {
      const items = computeTagCloud(['eip-7883', 'eip-7951', 'eip-7594', 'eip-8141'], 2)
      expect(items.length).toBeLessThanOrEqual(2)
    })
  })
})
