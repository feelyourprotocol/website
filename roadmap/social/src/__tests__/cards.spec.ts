import { describe, expect, it } from 'vitest'

import { isSocialCardId, SOCIAL_CARD_IDS, SOCIAL_CARDS } from '../cards.ts'

describe('social card registry', () => {
  it('defines hero, launch, timeline, and board', () => {
    expect(SOCIAL_CARD_IDS).toEqual(['hero', 'launch', 'timeline', 'board'])
  })

  it('isSocialCardId narrows known ids', () => {
    expect(isSocialCardId('timeline')).toBe(true)
    expect(isSocialCardId('launch')).toBe(true)
    expect(isSocialCardId('unknown')).toBe(false)
  })

  it('every card id has complete metadata', () => {
    for (const id of SOCIAL_CARD_IDS) {
      const meta = SOCIAL_CARDS[id]
      expect(meta.id).toBe(id)
      expect(meta.title.length).toBeGreaterThan(0)
      expect(meta.subtitle.length).toBeGreaterThan(0)
      expect(meta.eyebrow.length).toBeGreaterThan(0)
      expect(meta.footerHint.length).toBeGreaterThan(0)
    }
  })

  it('launch card mentions October 2026', () => {
    expect(SOCIAL_CARDS.launch.title).toMatch(/October 2026/i)
    expect(SOCIAL_CARDS.launch.eyebrow).toMatch(/launch date/i)
  })
})
