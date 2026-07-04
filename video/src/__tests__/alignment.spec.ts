import { describe, expect, it } from 'vitest'

import { alignmentDurationMs } from '../voice/alignment.ts'

describe('alignmentDurationMs', () => {
  it('returns ms from last character end time', () => {
    expect(
      alignmentDurationMs({
        characters: ['H', 'i'],
        character_start_times_seconds: [0, 0.1],
        character_end_times_seconds: [0.1, 0.35],
      }),
    ).toBe(350)
  })

  it('returns 0 for empty alignment', () => {
    expect(alignmentDurationMs(null)).toBe(0)
  })
})
