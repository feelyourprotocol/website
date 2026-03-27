import { describe, expect, it } from 'vitest'

import { isValidExplorationDate } from '@/libs/dates'

import { INFO } from '../info'

describe('EIP-8141 Info', () => {
  it('has correct metadata', () => {
    expect(INFO.id).toBe('eip-8141')
    expect(INFO.path).toContain('eip-8141')
    expect(INFO.topic).toBe('ux')
    expect(INFO.timeline).toBe('research')
    expect(INFO.poweredBy.length).toBeGreaterThan(0)
  })

  it('has a valid added date', () => {
    expect(isValidExplorationDate(INFO.added)).toBe(true)
  })

  it('has required text fields', () => {
    expect(INFO.introText.length).toBeGreaterThan(0)
    expect(INFO.usageText.length).toBeGreaterThan(0)
    expect(INFO.title).toContain('Frame')
  })

  it('has creator attribution', () => {
    expect(INFO.creatorName).toBe('HolgerD77')
    expect(INFO.creatorURL).toBeDefined()
  })

  it('has relevant tags', () => {
    expect(INFO.tags.length).toBe(2)
    expect(INFO.tags).toContain('Account Abstraction')
    expect(INFO.tags).toContain('Post Quantum')
  })
})
