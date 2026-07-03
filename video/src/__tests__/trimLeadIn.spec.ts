import { copyFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import {
  findLeadInTrimSec,
  isTitleBandFrame,
  LEAD_IN_LUMINANCE_THRESHOLD,
  LEAD_IN_MIN_DARK_PIXEL_RATIO,
  LEAD_IN_MAX_MEAN_LUMINANCE,
  trimVideoLeadIn,
  verifyVideoLeadIn,
} from '../trimLeadIn.ts'

const SAMPLE_VIDEO = join(
  dirname(fileURLToPath(import.meta.url)),
  '../../projects/eip-8024/output/eip-8024-2026-07-03T12-59-38.webm',
)

function withVideoCopy(fn: (copyPath: string) => void): void {
  if (!existsSync(SAMPLE_VIDEO)) return
  const dir = mkdtempSync(join(tmpdir(), 'fyp-trim-test-'))
  const copy = join(dir, 'sample.webm')
  copyFileSync(SAMPLE_VIDEO, copy)
  try {
    fn(copy)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

describe('trimLeadIn', () => {
  it('rejects exploration UI frames that only match legacy bright-text heuristics', () => {
    expect(
      isTitleBandFrame({
        min: 0,
        max: 255,
        textSpanPx: 336,
        darkPixelRatio: 0.0002,
        meanLuminance: 248,
      }),
    ).toBe(false)
    expect(
      isTitleBandFrame({
        min: 0,
        max: 255,
        textSpanPx: 310,
        darkPixelRatio: 0.79,
        meanLuminance: 41,
      }),
    ).toBe(true)
  })

  it('findLeadInTrimSec returns 0 when frame 0 already shows the title', () => {
    withVideoCopy((copy) => {
      const atZero = verifyVideoLeadIn(copy)
      if (!atZero.ok) return
      expect(findLeadInTrimSec(copy)).toBe(0)
    })
  })

  it('trims lead-in so frame 0 shows the title card when needed', () => {
    withVideoCopy((copy) => {
      const before = verifyVideoLeadIn(copy)
      const result = trimVideoLeadIn(copy)
      const after = verifyVideoLeadIn(copy)

      expect(after.ok).toBe(true)
      expect(after.maxLuminance).toBeGreaterThanOrEqual(LEAD_IN_LUMINANCE_THRESHOLD)

      if (!before.ok) {
        expect(result.trimmedSec).toBeGreaterThan(0)
      } else {
        expect(result.trimmedSec).toBe(0)
      }
    })
  })
})
