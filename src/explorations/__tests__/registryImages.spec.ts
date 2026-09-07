import { describe, expect, it } from 'vitest'

import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'
import {
  EXPLORATIONS,
  getExplorationCoverImage,
  getExplorationThumbnailImage,
  getRandomTopicExplorationImage,
} from '@/explorations/REGISTRY'

describe('exploration images', () => {
  it('uses imageSmall for thumbnails when present', () => {
    const exploration = EXPLORATIONS['eip-8024']!

    expect(getExplorationCoverImage(exploration)).toBe(exploration.image)
    expect(getExplorationThumbnailImage(exploration)).toBe(exploration.imageSmall)
    expect(getExplorationThumbnailImage(exploration)).not.toBe(exploration.image)
  })

  it('falls back to cover image when imageSmall is missing', () => {
    const exploration = { ...EXPLORATIONS['eip-8024']!, imageSmall: undefined }

    expect(getExplorationThumbnailImage(exploration)).toBe(exploration.image)
  })

  it('returns thumbnail URLs for topic cards', () => {
    const image = getRandomTopicExplorationImage('scaling')

    expect(image).toBeDefined()
    expect(
      Object.values(EXPLORATIONS)
        .filter((e) => e.topic === 'scaling')
        .some((e) => getExplorationThumbnailImage(e) === image),
    ).toBe(true)
  })

  it('every live exploration exposes a core question for home cards', () => {
    for (const exploration of Object.values(EXPLORATIONS)) {
      expect(exploration.coreQuestion.length).toBeGreaterThan(0)
    }
  })

  it('caps cover-only images to COVER_COLUMN_IMAGE_HEIGHT', () => {
    const coverOnly = Object.values(EXPLORATIONS).filter((exploration) => !exploration.rightPanel)
    expect(coverOnly.length).toBeGreaterThan(0)
    expect(coverOnly.map((exploration) => exploration.imageBoxHeight)).toEqual(
      coverOnly.map(() => COVER_COLUMN_IMAGE_HEIGHT),
    )
  })

  it('caps cover height when a companion shares the right column', () => {
    const withCompanion = Object.values(EXPLORATIONS).filter(
      (exploration) => exploration.rightPanel && exploration.image,
    )
    expect(withCompanion.length).toBeGreaterThan(0)
    for (const exploration of withCompanion) {
      expect(exploration.imageBoxHeight).toBeDefined()
    }
  })
})
