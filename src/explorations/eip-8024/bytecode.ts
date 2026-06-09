import { bytesToHex } from '@ethereumjs/util'

export const DUPN = 0xe6
export const SWAPN = 0xe7
export const EXCHANGE = 0xe8
export const STOP = 0x00
export const PUSH1 = 0x60

/** Encode DUPN / SWAPN immediate for one-based depth n (17..235). Spec: n = (x + 145) mod 256 */
export function encodeSingleImmediate(n: number): number {
  if (n < 17 || n > 235) {
    throw new Error(`DUPN/SWAPN depth must be 17..235, got ${n}`)
  }
  return (n - 145) & 0xff
}

/** Push consecutive values 1..count (bottom = 1, top = count) */
export function buildPushSequence(count: number): Uint8Array {
  const bytes = new Uint8Array(count * 2)
  for (let i = 0; i < count; i++) {
    bytes[i * 2] = PUSH1
    bytes[i * 2 + 1] = i + 1
  }
  return bytes
}

export function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((sum, part) => sum + part.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

export function bytecodeToHex(code: Uint8Array): string {
  return bytesToHex(code).substring(2)
}

export const PUSH_ADD = new Uint8Array([0x60, 0x01, 0x60, 0x02, 0x01, 0x00])

export function dupnDepth17Bytecode(): Uint8Array {
  return concatBytes(
    buildPushSequence(18),
    Uint8Array.from([DUPN, encodeSingleImmediate(17), STOP]),
  )
}

export function swapnDepth17Bytecode(): Uint8Array {
  return concatBytes(
    buildPushSequence(18),
    Uint8Array.from([SWAPN, encodeSingleImmediate(17), STOP]),
  )
}

export function exchange0x8eBytecode(): Uint8Array {
  return concatBytes(buildPushSequence(20), Uint8Array.from([EXCHANGE, 0x8e, STOP]))
}

/** Shorter demo: stack [1..18], DUPN duplicates deep item 2 without 17 DUP instructions */
export function dupnEffectBytecode(): Uint8Array {
  return dupnDepth17Bytecode()
}

/** Stack too shallow for DUPN depth 17 — triggers an exception */
export function invalidDupnBytecode(): Uint8Array {
  return concatBytes(buildPushSequence(5), Uint8Array.from([DUPN, encodeSingleImmediate(17), STOP]))
}

export function stackTopNumbers(
  stack: { peek: (n: number) => bigint[] } | undefined,
  n: number,
): number[] {
  if (!stack) {
    throw new Error('Missing stack in result')
  }
  return stack
    .peek(n)
    .map((word) => Number(word))
    .reverse()
}
