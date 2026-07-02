import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { SOCIAL_CARD_IDS } from '../../../../roadmap/social/src/cards.ts'
import {
  SOCIAL_CAPTURE_WIDTH,
  SOCIAL_DIST_DIR,
  SOCIAL_OUTPUT_DIR,
  socialCardOutputBase,
  WEBSITE_ROOT,
} from '../config.ts'
import { parseSocialCardIds } from '../parseCardIds.ts'

describe('parseSocialCardIds', () => {
  it('returns all cards for empty args', () => {
    expect(parseSocialCardIds([])).toEqual([...SOCIAL_CARD_IDS])
  })

  it('returns all cards for "all"', () => {
    expect(parseSocialCardIds(['all'])).toEqual([...SOCIAL_CARD_IDS])
  })

  it('returns a single requested card', () => {
    expect(parseSocialCardIds(['timeline'])).toEqual(['timeline'])
  })

  it('returns multiple requested cards in order', () => {
    expect(parseSocialCardIds(['board', 'hero'])).toEqual(['board', 'hero'])
  })

  it('throws on unknown ids', () => {
    expect(() => parseSocialCardIds(['nope'])).toThrow(/Unknown card id/)
  })
})

describe('social config paths', () => {
  it('SOCIAL_DIST_DIR resolves under website root (not og/)', () => {
    expect(SOCIAL_DIST_DIR).toBe(resolve(WEBSITE_ROOT, 'roadmap/social/dist'))
    expect(SOCIAL_DIST_DIR).not.toContain(`${resolve(WEBSITE_ROOT, 'og')}${resolve.sep}roadmap`)
  })

  it('SOCIAL_OUTPUT_DIR resolves under website root', () => {
    expect(SOCIAL_OUTPUT_DIR).toBe(resolve(WEBSITE_ROOT, 'roadmap/social/out'))
  })

  it('socialCardOutputBase builds png/webp stems per card', () => {
    expect(socialCardOutputBase('hero')).toBe(`${SOCIAL_OUTPUT_DIR}/hero`)
  })

  it('SOCIAL_CAPTURE_WIDTH is Twitter-friendly 1200px', () => {
    expect(SOCIAL_CAPTURE_WIDTH).toBe(1200)
  })
})
