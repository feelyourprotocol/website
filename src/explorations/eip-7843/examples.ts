import type { Examples } from '@/explorations/REGISTRY'

import {
  bytecodeToHex,
  slotnumBytecode,
  timestampAndSlotBytecode,
  timestampDiv12Bytecode,
} from './bytecode'

export const examples: Examples = {
  slotnum: {
    title: 'SLOTNUM — push the beacon slot',
    values: [bytecodeToHex(slotnumBytecode())],
  },
  'timestamp-and-slot': {
    title: 'TIMESTAMP then SLOTNUM — two different clocks',
    values: [bytecodeToHex(timestampAndSlotBytecode())],
  },
  'timestamp-div-12': {
    title: 'TIMESTAMP ÷ 12 — the hardcoded-slot trap',
    values: [bytecodeToHex(timestampDiv12Bytecode())],
  },
}
