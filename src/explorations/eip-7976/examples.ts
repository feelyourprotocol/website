import type { Examples } from '@/explorations/REGISTRY'

import { SHAPE_ORDER, type ShapeId } from './schedule'

export interface ShapeMeta {
  title: string
  lesson: string
}

export const SHAPE_META: Record<ShapeId, ShapeMeta> = {
  zeros: {
    title: 'All zeros, almost no work',
    lesson:
      'One hundred zero bytes, and the call does no work. The floor is the price. On Glamsterdam that is 64 gas per byte. On Fusaka it is still 10.',
  },
  nonzeros: {
    title: 'Nonzero bytes, almost no work',
    lesson:
      'The same length, but every byte is nonzero. The floor still wins. The jump is smaller: 40 gas per byte becomes 64, not 10 becoming 64.',
  },
  busy: {
    title: 'A call that does real work',
    lesson:
      'This call does a few hundred additions. That work costs more than the floor, so each nonzero byte stays at 16 gas on both forks.',
  },
  'access-list': {
    title: 'Bytes hidden in an access list',
    lesson:
      'No calldata. One address and one storage key sit in an access list instead. On Glamsterdam those bytes still pay 64 gas each. On Fusaka they do not.',
  },
}

export const examples: Examples = Object.fromEntries(
  SHAPE_ORDER.map((id) => [id, { title: SHAPE_META[id].title, values: [id] }]),
)

export const DEFAULT_SHAPE_ID: ShapeId = 'zeros'
