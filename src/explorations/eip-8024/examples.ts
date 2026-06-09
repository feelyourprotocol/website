import type { Examples } from '@/explorations/REGISTRY'

import {
  bytecodeToHex,
  dupnBytecode,
  exchangeBytecode,
  invalidDupnBytecode,
  PUSH_ADD,
  swapnBytecode,
} from './bytecode'

export const examples: Examples = {
  'push-add': {
    title: 'Push + Add (sanity check)',
    values: [bytecodeToHex(PUSH_ADD)],
  },
  dupn: {
    title: 'DUPN — copy stack item at depth 17',
    values: [bytecodeToHex(dupnBytecode())],
  },
  swapn: {
    title: 'SWAPN — swap top with item at depth 17',
    values: [bytecodeToHex(swapnBytecode())],
  },
  exchange: {
    title: 'EXCHANGE — swap stack items at depths 2 & 3',
    values: [bytecodeToHex(exchangeBytecode())],
  },
  'invalid-dupn': {
    title: 'Invalid — stack too shallow for DUPN',
    values: [bytecodeToHex(invalidDupnBytecode())],
  },
}
