/** Stack depth counted from the top (1 = top item). Matches DUP/DUPN/SWAPN semantics. */

export function depthFromIndex(index: number): number {
  return index + 1
}

/** Depth for EXCHANGE operands: EIP uses 1-based distance below the top. */
export function exchangeOperandToDepth(belowTop: number): number {
  return belowTop + 1
}

export function depthLabel(depth: number): string {
  if (depth === 1) return 'the stack item at depth 1 (top)'
  return `the stack item at depth ${depth}`
}
