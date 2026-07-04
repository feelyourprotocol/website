import { describe, expect, it } from 'vitest'

import { targetOverlapsTopBanner } from '../../../src/video/annotationTarget.ts'
import { resolveTargetSelector } from '../annotationTarget.ts'

describe('resolveTargetSelector', () => {
  const zones = {
    stack: { selector: '[data-testid="bytecode-stack"]' },
  }

  it('resolves zone keys via focusAreas', () => {
    expect(resolveTargetSelector('stack', zones)).toBe('[data-testid="bytecode-stack"]')
  })

  it('passes through raw selectors', () => {
    expect(resolveTargetSelector('.foo', zones)).toBe('.foo')
  })

  it('falls back to data-testid', () => {
    expect(resolveTargetSelector('example-select', undefined)).toBe(
      '[data-testid="example-select"]',
    )
  })

  it('resolves built-in climax targets', () => {
    expect(resolveTargetSelector('disassembly-active-opcode', undefined)).toBe(
      '[data-disassembly-active="true"] [data-disassembly-opcode]',
    )
    expect(resolveTargetSelector('disassembly-dupn', undefined)).toBe(
      '[data-disassembly-opcode][data-disassembly-mnemonic*="DUPN"]',
    )
    expect(resolveTargetSelector('stack-top-value', undefined)).toBe(
      '[data-stack-depth="1"] [data-stack-value]',
    )
    expect(resolveTargetSelector('stack-depth-17-value', undefined)).toBe(
      '[data-stack-depth="17"] [data-stack-value]',
    )
  })
})

describe('targetOverlapsTopBanner', () => {
  const banner = { top: 56, bottom: 180, left: 0, right: 540, width: 540, height: 124 } as DOMRect

  it('suppresses when target sits under the banner', () => {
    const target = { top: 120, bottom: 150, left: 32, right: 200, width: 168, height: 30 } as DOMRect
    expect(targetOverlapsTopBanner(target, [banner])).toBe(true)
  })

  it('allows when target is below the banner', () => {
    const target = { top: 200, bottom: 230, left: 32, right: 200, width: 168, height: 30 } as DOMRect
    expect(targetOverlapsTopBanner(target, [banner])).toBe(false)
  })
})
