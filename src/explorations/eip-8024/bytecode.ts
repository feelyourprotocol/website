import { bytesToHex } from '@ethereumjs/util'

import {
  DUPN_SWAPN_MIN_DEPTH,
  encodeDupnSwapnImmediate,
} from '@/eComponents/bytecodeStepperEC/eip8024Immediate'

export const DUPN = 0xe6
export const SWAPN = 0xe7
export const EXCHANGE = 0xe8
export const STOP = 0x00
export const PUSH1 = 0x60

/** Minimum stack depth for DUPN / SWAPN immediates (EIP-8024). */
export const DUPN_MIN_DEPTH = DUPN_SWAPN_MIN_DEPTH

/** Encode DUPN / SWAPN immediate for one-based depth n (17..235). Spec: n = (x + 145) mod 256 */
export function encodeSingleImmediate(n: number): number {
  const result = encodeDupnSwapnImmediate(n)
  if (!result.ok) {
    throw new Error(result.error)
  }
  return result.immediate
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

/** Smallest valid DUPN demo: stack [1..17], copy item at depth 17 (value 1). */
export function dupnBytecode(): Uint8Array {
  return concatBytes(
    buildPushSequence(DUPN_MIN_DEPTH),
    Uint8Array.from([DUPN, encodeSingleImmediate(DUPN_MIN_DEPTH), STOP]),
  )
}

/** Smallest valid SWAPN demo: stack [1..18], swap top with item at depth 17. */
export function swapnBytecode(): Uint8Array {
  const stackSize = DUPN_MIN_DEPTH + 1
  return concatBytes(
    buildPushSequence(stackSize),
    Uint8Array.from([SWAPN, encodeSingleImmediate(DUPN_MIN_DEPTH), STOP]),
  )
}

/** Compact EXCHANGE demo: stack [1..4], swap depths 2 and 3 below the top. */
export function exchangeBytecode(): Uint8Array {
  return concatBytes(buildPushSequence(4), Uint8Array.from([EXCHANGE, 0x8e, STOP]))
}

/** Stack too shallow for DUPN depth 17 — triggers an exception. */
export function invalidDupnBytecode(): Uint8Array {
  return concatBytes(
    buildPushSequence(3),
    Uint8Array.from([DUPN, encodeSingleImmediate(DUPN_MIN_DEPTH), STOP]),
  )
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
