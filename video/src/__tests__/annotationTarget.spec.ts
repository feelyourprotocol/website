import { describe, expect, it } from 'vitest'

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
    expect(resolveTargetSelector('disassembly-active', undefined)).toBe(
      '[data-disassembly-active="true"]',
    )
    expect(resolveTargetSelector('stack-top', undefined)).toBe('[data-stack-depth="1"]')
    expect(resolveTargetSelector('stack-depth-17', undefined)).toBe('[data-stack-depth="17"]')
  })
})
