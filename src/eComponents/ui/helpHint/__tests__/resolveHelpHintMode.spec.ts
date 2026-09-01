import { describe, expect, it } from 'vitest'

import { resolveHelpHintMode } from '@/eComponents/ui/helpHint/resolveHelpHintMode'

describe('resolveHelpHintMode', () => {
  it('returns none for empty text', () => {
    expect(
      resolveHelpHintMode({
        mode: 'auto',
        tier: 'useful',
        canHover: true,
        text: '   ',
      }),
    ).toBe('none')
  })

  it('uses tooltip on fine-pointer hover devices in auto mode', () => {
    expect(
      resolveHelpHintMode({
        mode: 'auto',
        tier: 'useful',
        canHover: true,
        text: 'Run the block',
      }),
    ).toBe('tooltip')
  })

  it('uses inline on touch for useful tier by default', () => {
    expect(
      resolveHelpHintMode({
        mode: 'auto',
        tier: 'useful',
        canHover: false,
        text: 'Run the block',
      }),
    ).toBe('inline')
  })

  it('uses popover on touch when configured', () => {
    expect(
      resolveHelpHintMode({
        mode: 'auto',
        tier: 'useful',
        canHover: false,
        text: 'Timeline description',
        touchFallback: 'popover',
      }),
    ).toBe('popover')
  })

  it('hides decorative hints on touch', () => {
    expect(
      resolveHelpHintMode({
        mode: 'auto',
        tier: 'decorative',
        canHover: false,
        text: 'Share',
      }),
    ).toBe('none')
  })

  it('falls back from tooltip mode on touch using touchFallback', () => {
    expect(
      resolveHelpHintMode({
        mode: 'tooltip',
        tier: 'essential',
        canHover: false,
        text: 'Slow warning',
        touchFallback: 'inline',
      }),
    ).toBe('inline')
  })
})
