import { describe, expect, it } from 'vitest'

import {
  assertFormatViewportMatchesOutput,
  deliverableScale,
  VIDEO_FORMATS,
  VIDEO_RECORD_FORMAT,
} from '../formats.ts'

describe('VIDEO_FORMATS', () => {
  it('records at 540×960 reference for all deliverables', () => {
    expect(VIDEO_RECORD_FORMAT.viewportWidth).toBe(540)
    expect(VIDEO_RECORD_FORMAT.viewportHeight).toBe(960)
  })

  it('validates output as uniform integer scale of viewport', () => {
    for (const format of Object.values(VIDEO_FORMATS)) {
      assertFormatViewportMatchesOutput(format)
      expect(format.width / format.height).toBeCloseTo(9 / 16, 5)
    }
  })

  it('shorts deliverable is 2× reference', () => {
    expect(VIDEO_FORMATS.shorts.width).toBe(1080)
    expect(VIDEO_FORMATS.shorts.height).toBe(1920)
    expect(deliverableScale(VIDEO_FORMATS.shorts)).toBe(2)
    expect(VIDEO_FORMATS.shorts.viewportWidth).toBe(540)
    expect(VIDEO_FORMATS.shorts.viewportHeight).toBe(960)
  })

  it('shorts-preview is 1× reference', () => {
    expect(VIDEO_FORMATS['shorts-preview'].width).toBe(540)
    expect(VIDEO_FORMATS['shorts-preview'].height).toBe(960)
    expect(deliverableScale(VIDEO_FORMATS['shorts-preview'])).toBe(1)
  })
})
