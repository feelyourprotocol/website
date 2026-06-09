import type { Examples } from '@/explorations/REGISTRY'

import {
  bytecodeToHex,
  dupnDepth17Bytecode,
  dupnEffectBytecode,
  exchange0x8eBytecode,
  invalidDupnBytecode,
  PUSH_ADD,
  swapnDepth17Bytecode,
} from './bytecode'

export const examples: Examples = {
  'push-add': {
    title: 'Push + Add (sanity check)',
    values: [bytecodeToHex(PUSH_ADD)],
  },
  'dupn-depth-17': {
    title: 'DUPN — duplicate item at depth 17',
    values: [bytecodeToHex(dupnDepth17Bytecode())],
  },
  'swapn-depth-17': {
    title: 'SWAPN — swap top with item at depth 17',
    values: [bytecodeToHex(swapnDepth17Bytecode())],
  },
  'exchange-0x8e': {
    title: 'EXCHANGE — swap 1st and 2nd slots below top',
    values: [bytecodeToHex(exchange0x8eBytecode())],
  },
  'dupn-effect': {
    title: 'DUPN — why it matters (one opcode vs 17 DUPs)',
    values: [bytecodeToHex(dupnEffectBytecode())],
  },
  'invalid-dupn-immediate': {
    title: 'Invalid — stack too shallow for DUPN depth 17',
    values: [bytecodeToHex(invalidDupnBytecode())],
  },
}
