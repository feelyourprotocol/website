import { describe, expect, it } from 'vitest'

import {
  TITLE_CARD_PEEK_HEIGHT_FRAC,
  titleCardBandMaskFilter,
} from '../titleCardBand.ts'

describe('titleCardBand', () => {
  it('peek rows are one fifth of frame height each', () => {
    expect(TITLE_CARD_PEEK_HEIGHT_FRAC).toBe(0.2)
  })

  it('builds ffmpeg filter with scale and top/bottom black drawboxes', () => {
    const vf = titleCardBandMaskFilter(1280)
    expect(vf).toContain('scale=1280:-2:flags=lanczos')
    expect(vf).toContain('drawbox=x=0:y=0:w=iw:h=ih/5:color=black@1:t=fill')
    expect(vf).toContain('drawbox=x=0:y=4*ih/5:w=iw:h=ih/5:color=black@1:t=fill')
  })
})
