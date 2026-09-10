/** EIP-7843 slot number is a uint64. */
export const UINT64_MAX = (1n << 64n) - 1n

export const DEFAULT_SLOT = 42n

export type ParseSlotResult = { ok: true; value: bigint } | { ok: false; error: string }

export function parseSlotNumber(raw: string): ParseSlotResult {
  const trimmed = raw.trim()
  if (trimmed === '') {
    return { ok: false, error: 'Enter a slot number' }
  }
  if (!/^[0-9]+$/.test(trimmed)) {
    return { ok: false, error: 'Slot must be a whole number (0 or more)' }
  }
  const value = BigInt(trimmed)
  if (value > UINT64_MAX) {
    return { ok: false, error: 'Slot is larger than a 64-bit unsigned integer' }
  }
  return { ok: true, value }
}
