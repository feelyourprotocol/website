import type { Examples } from '@/explorations/REGISTRY'

import { SHAPE_ORDER, type ShapeId } from './pieces'

export interface ShapeMeta {
  title: string
  lesson: string
}

export const SHAPE_META: Record<ShapeId, ShapeMeta> = {
  'send-eth': {
    title: 'Send ETH to someone else',
    lesson:
      'A value transfer to an existing account still totals 21,000: 12,000 for the sender, 3,000 to touch the recipient, and 6,000 to move the value and write the transfer log.',
  },
  self: {
    title: 'Send ETH to yourself',
    lesson:
      'You are already the sender, so the recipient touch and the value charge drop away. Only the 12,000 sender cost remains.',
  },
  'zero-value': {
    title: 'Call without sending ETH',
    lesson:
      'No value moves, so the 6,000 value charge is skipped. You still pay 12,000 for the sender and 3,000 to touch the recipient: 15,000.',
  },
}

export const examples: Examples = Object.fromEntries(
  SHAPE_ORDER.map((id) => [id, { title: SHAPE_META[id].title, values: [id] }]),
)

export const DEFAULT_SHAPE_ID: ShapeId = 'send-eth'
