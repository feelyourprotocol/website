/** Intrinsic pieces from the pinned EIP-2780 schedule. Fusaka stays a flat 21,000. */

export type ShapeId = 'send-eth' | 'self' | 'zero-value'
export type HardforkChoice = 'glamsterdam' | 'fusaka'

export const SHAPE_ORDER = ['send-eth', 'self', 'zero-value'] as const satisfies readonly ShapeId[]

export const TX_BASE_GAS = 12_000n
export const RECIPIENT_GAS = 3_000n
export const VALUE_GAS = 6_000n
export const FLAT_INTRINSIC_GAS = 21_000n

export interface IntrinsicPieces {
  /** Sender signature, access, and write. Null when the fork still uses one flat charge. */
  base: bigint | null
  /** Recipient touch. Null when this shape does not pay it, or the fork is flat. */
  recipient: bigint | null
  /** Balance write and transfer log. Null when this shape does not pay it, or the fork is flat. */
  value: bigint | null
  total: bigint
  /** True when the total is the sum of named pieces. */
  split: boolean
}

const SHAPES = new Set<string>(SHAPE_ORDER)

export function isShapeId(value: string): value is ShapeId {
  return SHAPES.has(value)
}

export function intrinsicPieces(shape: ShapeId, hardfork: HardforkChoice): IntrinsicPieces {
  if (hardfork === 'fusaka') {
    return {
      base: null,
      recipient: null,
      value: null,
      total: FLAT_INTRINSIC_GAS,
      split: false,
    }
  }

  const recipient = shape === 'self' ? null : RECIPIENT_GAS
  const value = shape === 'send-eth' ? VALUE_GAS : null
  return {
    base: TX_BASE_GAS,
    recipient,
    value,
    total: TX_BASE_GAS + (recipient ?? 0n) + (value ?? 0n),
    split: true,
  }
}
