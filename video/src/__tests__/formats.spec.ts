import { describe, expect, it } from 'vitest'

import { assertFormatViewportMatchesOutput, VIDEO_FORMATS } from '../formats.ts'

describe('VIDEO_FORMATS', () => {
  it('matches viewport to output for all presets (avoids Playwright gray padding)', () => {
    for (const format of Object.values(VIDEO_FORMATS)) {
      assertFormatViewportMatchesOutput(format)
      expect(format.width / format.height).toBeCloseTo(9 / 16, 5)
    }
  })

  it('shorts is 1080×1920', () => {
    expect(VIDEO_FORMATS.shorts.width).toBe(1080)
    expect(VIDEO_FORMATS.shorts.height).toBe(1920)
  })

  it('shorts-preview is half scale', () => {
    expect(VIDEO_FORMATS['shorts-preview'].width).toBe(540)
    expect(VIDEO_FORMATS['shorts-preview'].height).toBe(960)
  })
})
