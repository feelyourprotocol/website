import { bytesToHex } from '@ethereumjs/util'

export const SLOTNUM = 0x4b
export const TIMESTAMP = 0x42
export const STOP = 0x00
export const PUSH1 = 0x60
export const DIV = 0x04

export function bytecodeToHex(code: Uint8Array): string {
  return bytesToHex(code).substring(2)
}

/** SLOTNUM then STOP — stack top becomes the header slot. */
export function slotnumBytecode(): Uint8Array {
  return Uint8Array.from([SLOTNUM, STOP])
}

/** TIMESTAMP then SLOTNUM — stack top is the slot, second is the timestamp. */
export function timestampAndSlotBytecode(): Uint8Array {
  return Uint8Array.from([TIMESTAMP, SLOTNUM, STOP])
}

/** TIMESTAMP ÷ 12 — the trap that hardcodes a 12-second slot. */
export function timestampDiv12Bytecode(): Uint8Array {
  // EVM DIV is top ÷ second, so 12 must sit under TIMESTAMP.
  return Uint8Array.from([PUSH1, 12, TIMESTAMP, DIV, STOP])
}

export function stackTopNumbers(
  stack: { peek: (n: number) => bigint[] } | undefined,
  n: number,
): bigint[] {
  if (!stack) {
    throw new Error('Missing stack in result')
  }
  return stack.peek(n).reverse()
}
