import { describe, expect, it } from 'vitest'

import { depthFromIndex, exchangeOperandToDepth } from '../stackDepth'

describe('stackDepth', () => {
  it('maps stack index to depth from top', () => {
    expect(depthFromIndex(0)).toBe(1)
    expect(depthFromIndex(16)).toBe(17)
  })

  it('maps EXCHANGE below-top operands to stack depth', () => {
    expect(exchangeOperandToDepth(1)).toBe(2)
    expect(exchangeOperandToDepth(2)).toBe(3)
  })
})
