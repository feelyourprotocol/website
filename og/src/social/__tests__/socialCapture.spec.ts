import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { SOCIAL_CARD_IDS } from '../../../../roadmap/social/src/cards.ts'
import {
  SOCIAL_CAPTURE_WIDTH,
  SOCIAL_DIST_DIR,
  SOCIAL_OUTPUT_DIR,
  socialCardCaptureSpec,
  socialCardOutputBase,
  TWITTER_BANNER_HEIGHT,
  TWITTER_BANNER_OUTPUT_DIR,
  TWITTER_BANNER_WIDTH,
  WEBSITE_ROOT,
  YOUTUBE_BANNER_HEIGHT,
  YOUTUBE_BANNER_OUTPUT_DIR,
  YOUTUBE_BANNER_WIDTH,
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

  it('youtube-banner outputs to design/source/youtube (committed master)', () => {
    expect(socialCardOutputBase('youtube-banner')).toBe(
      `${YOUTUBE_BANNER_OUTPUT_DIR}/channel-banner`,
    )
    expect(YOUTUBE_BANNER_OUTPUT_DIR).toBe(resolve(WEBSITE_ROOT, 'design/source/youtube'))
  })

  it('youtube-banner capture spec is 2560×1440 at deviceScaleFactor 1', () => {
    expect(socialCardCaptureSpec('youtube-banner')).toEqual({
      width: YOUTUBE_BANNER_WIDTH,
      height: YOUTUBE_BANNER_HEIGHT,
      deviceScaleFactor: 1,
    })
    expect(YOUTUBE_BANNER_WIDTH).toBe(2560)
    expect(YOUTUBE_BANNER_HEIGHT).toBe(1440)
  })

  it('twitter cards keep 1200px width at 2x DPR', () => {
    expect(socialCardCaptureSpec('hero')).toEqual({
      width: SOCIAL_CAPTURE_WIDTH,
      deviceScaleFactor: 2,
    })
  })

  it('twitter-banner outputs to design/source/twitter (committed master)', () => {
    expect(socialCardOutputBase('twitter-banner')).toBe(
      `${TWITTER_BANNER_OUTPUT_DIR}/profile-banner`,
    )
    expect(TWITTER_BANNER_OUTPUT_DIR).toBe(resolve(WEBSITE_ROOT, 'design/source/twitter'))
  })

  it('twitter-banner capture spec is 1500×500 at deviceScaleFactor 1', () => {
    expect(socialCardCaptureSpec('twitter-banner')).toEqual({
      width: TWITTER_BANNER_WIDTH,
      height: TWITTER_BANNER_HEIGHT,
      deviceScaleFactor: 1,
    })
    expect(TWITTER_BANNER_WIDTH).toBe(1500)
    expect(TWITTER_BANNER_HEIGHT).toBe(500)
  })
})
