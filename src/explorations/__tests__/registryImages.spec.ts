import { describe, expect, it } from 'vitest'

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
})
