/** EIP-8024 DUPN / SWAPN / EXCHANGE immediate encode & decode (mirrors @ethereumjs/evm). */

export const DUPN_OPCODE = 0xe6
export const SWAPN_OPCODE = 0xe7
export const EXCHANGE_OPCODE = 0xe8

export const DUPN_SWAPN_MIN_DEPTH = 17
export const DUPN_SWAPN_MAX_DEPTH = 235

export const EXCHANGE_XOR_MASK = 0x8f // decimal 143

export type Eip8024ImmediateKind = 'dupn' | 'swapn' | 'exchange'

export interface ExpertStep {
  label: string
  detail: string
}

export interface Eip8024ImmediateBreakdown {
  kind: Eip8024ImmediateKind
  opcodeName: string
  immediateHex: string
  immediateDec: number
  summary: string
  intro: string
  expertSteps: ExpertStep[]
}

export interface DupnSwapnBreakdown extends Eip8024ImmediateBreakdown {
  kind: 'dupn' | 'swapn'
  operandN: number
  stackDepth: number
  swapTargetDepth?: number
}

export interface ExchangeBreakdown extends Eip8024ImmediateBreakdown {
  kind: 'exchange'
  k: number
  kHex: string
  q: number
  r: number
  operandA: number
  operandB: number
  stackDepthA: number
  stackDepthB: number
  usedLessThanBranch: boolean
}

export type AnyImmediateBreakdown = DupnSwapnBreakdown | ExchangeBreakdown

export function isEip8024ImmediateOpcode(opcodeByte: number): opcodeByte is number {
  return opcodeByte === DUPN_OPCODE || opcodeByte === SWAPN_OPCODE || opcodeByte === EXCHANGE_OPCODE
}

export function opcodeKindFromByte(opcodeByte: number): Eip8024ImmediateKind | undefined {
  if (opcodeByte === DUPN_OPCODE) return 'dupn'
  if (opcodeByte === SWAPN_OPCODE) return 'swapn'
  if (opcodeByte === EXCHANGE_OPCODE) return 'exchange'
  return undefined
}

export function immediateByteFromRow(rawBytes: string): number | undefined {
  const parts = rawBytes.trim().split(/\s+/)
  if (parts.length < 2) return undefined
  return parseInt(parts[1]!, 16)
}

// --- DUPN / SWAPN (decode_single) ---

export function decodeDupnSwapnOperand(immediate: number): number {
  return (immediate + 145) & 0xff
}

export function isValidDupnSwapnImmediateByte(immediate: number): boolean {
  return (immediate >= 0 && immediate <= 90) || (immediate >= 128 && immediate <= 255)
}

export function validateDupnSwapnDepth(depth: number): string | undefined {
  if (!Number.isInteger(depth)) return 'Depth must be a whole number'
  if (depth < DUPN_SWAPN_MIN_DEPTH || depth > DUPN_SWAPN_MAX_DEPTH) {
    return `Depth must be between ${DUPN_SWAPN_MIN_DEPTH} and ${DUPN_SWAPN_MAX_DEPTH}`
  }
  return undefined
}

export function encodeDupnSwapnImmediate(operandN: number): EncodeDupnSwapnResult {
  const err = validateDupnSwapnDepth(operandN)
  if (err) return { ok: false, error: err }

  const immediate = (operandN + 111) & 0xff
  if (!isValidDupnSwapnImmediateByte(immediate)) {
    return {
      ok: false,
      error: `Encoded byte 0x${immediate.toString(16).padStart(2, '0')} is reserved/invalid for DUPN/SWAPN`,
    }
  }
  return {
    ok: true,
    immediate,
    immediateHex: `0x${immediate.toString(16).padStart(2, '0')}`,
    operandN,
  }
}

export type EncodeDupnSwapnResult =
  | { ok: true; immediate: number; immediateHex: string; operandN: number }
  | { ok: false; error: string }

export function encodeDupnFromStackDepth(depth: number): EncodeDupnSwapnResult {
  if (!Number.isInteger(depth)) return { ok: false, error: 'Depth must be a whole number' }
  if (depth < DUPN_SWAPN_MIN_DEPTH) {
    return { ok: false, error: `DUPN depth must be at least ${DUPN_SWAPN_MIN_DEPTH}` }
  }
  return encodeDupnSwapnImmediate(depth)
}

export function encodeSwapnFromSwapDepth(swapDepth: number): EncodeDupnSwapnResult {
  if (!Number.isInteger(swapDepth)) return { ok: false, error: 'Depth must be a whole number' }
  if (swapDepth < DUPN_SWAPN_MIN_DEPTH + 1) {
    return {
      ok: false,
      error: `SWAPN swap target must be depth ${DUPN_SWAPN_MIN_DEPTH + 1} or deeper`,
    }
  }
  return encodeDupnSwapnImmediate(swapDepth - 1)
}

export function explainDupnImmediate(immediate: number): DupnSwapnBreakdown {
  const operandN = decodeDupnSwapnOperand(immediate)
  const immHex = `0x${immediate.toString(16).padStart(2, '0')}`

  return {
    kind: 'dupn',
    opcodeName: 'DUPN',
    immediateHex: immHex,
    immediateDec: immediate,
    summary: `${immHex} → n=${operandN} → copy depth ${operandN}`,
    intro:
      'DUPN uses the same single-byte encoding as SWAPN: one immediate maps to one stack index n (17–235).',
    operandN,
    stackDepth: operandN,
    expertSteps: [
      {
        label: '1. Read the immediate byte',
        detail: `The byte after DUPN is ${immHex} (decimal ${immediate}). It is not a stack depth directly — it encodes n.`,
      },
      {
        label: '2. Decode with the linear formula',
        detail: `n = (immediate + 145) mod 256 → (${immediate} + 145) mod 256 = ${operandN}.`,
      },
      {
        label: '3. Check the valid range',
        detail: `EIP-8024 allows ${DUPN_SWAPN_MIN_DEPTH} ≤ n ≤ ${DUPN_SWAPN_MAX_DEPTH}. Bytes with 90 < immediate < 128 are forbidden (JUMPDEST / PUSH safety).`,
      },
      {
        label: '4. Map to stack action',
        detail: `DUPN n copies the stack item at depth n onto the top. Here: copy depth ${operandN}.`,
      },
    ],
  }
}

export function explainSwapnImmediate(immediate: number): DupnSwapnBreakdown {
  const operandN = decodeDupnSwapnOperand(immediate)
  const swapDepth = operandN + 1
  const immHex = `0x${immediate.toString(16).padStart(2, '0')}`

  return {
    kind: 'swapn',
    opcodeName: 'SWAPN',
    immediateHex: immHex,
    immediateDec: immediate,
    summary: `${immHex} → n=${operandN} → swap top with depth ${swapDepth}`,
    intro:
      'SWAPN shares DUPN’s immediate encoding, but swaps the top item with the stack slot at depth n + 1.',
    operandN,
    stackDepth: swapDepth,
    swapTargetDepth: swapDepth,
    expertSteps: [
      {
        label: '1. Read the immediate byte',
        detail: `The byte after SWAPN is ${immHex} (decimal ${immediate}). Same encoding family as DUPN.`,
      },
      {
        label: '2. Decode with the linear formula',
        detail: `n = (immediate + 145) mod 256 → (${immediate} + 145) mod 256 = ${operandN}.`,
      },
      {
        label: '3. Check the valid range',
        detail: `EIP-8024 allows ${DUPN_SWAPN_MIN_DEPTH} ≤ n ≤ ${DUPN_SWAPN_MAX_DEPTH}. You need at least n + 1 items on the stack.`,
      },
      {
        label: '4. Map to stack action',
        detail: `SWAPN n swaps the top with depth n + 1 (like SWAP1 targets depth 2). Here: swap top ↔ depth ${swapDepth}.`,
      },
    ],
  }
}

// --- EXCHANGE (decode_pair) ---

export function decodeExchangeOperands(immediate: number): [number, number] {
  const k = immediate ^ EXCHANGE_XOR_MASK
  const q = (k >> 4) & 0xf
  const r = k & 0xf
  if (q < r) {
    return [q + 1, r + 1]
  }
  return [r + 1, 29 - q]
}

export function exchangeOperandToStackDepth(operand: number): number {
  return operand + 1
}

export function explainExchangeImmediate(immediate: number): ExchangeBreakdown {
  const k = immediate ^ EXCHANGE_XOR_MASK
  const q = (k >> 4) & 0xf
  const r = k & 0xf
  const usedLessThanBranch = q < r
  const [operandA, operandB] = decodeExchangeOperands(immediate)
  const stackDepthA = exchangeOperandToStackDepth(operandA)
  const stackDepthB = exchangeOperandToStackDepth(operandB)
  const immHex = `0x${immediate.toString(16).padStart(2, '0')}`

  const branchNote = usedLessThanBranch
    ? `q (${q}) < r (${r}), so operands are (q+1, r+1)`
    : `q (${q}) ≥ r (${r}), so operands are (r+1, 29−q)`

  return {
    kind: 'exchange',
    opcodeName: 'EXCHANGE',
    immediateHex: immHex,
    immediateDec: immediate,
    summary: `${immHex} → n=${operandA}, m=${operandB} → depths ${stackDepthA} & ${stackDepthB}`,
    intro:
      'EXCHANGE packs two stack positions into one byte using XOR + nibble splitting — different from DUPN/SWAPN.',
    k,
    kHex: `0x${k.toString(16).padStart(2, '0')}`,
    q,
    r,
    operandA,
    operandB,
    stackDepthA,
    stackDepthB,
    usedLessThanBranch,
    expertSteps: [
      {
        label: '1. Read the immediate byte',
        detail: `The byte after EXCHANGE is ${immHex} (decimal ${immediate}). It encodes two operands, not one depth.`,
      },
      {
        label: '2. XOR with the fixed mask 143 (0x8f)',
        detail: `${immHex} XOR 0x8f = 0x${k.toString(16).padStart(2, '0')}. This keeps immediates out of the JUMPDEST / PUSH range.`,
      },
      {
        label: '3. Split into two 4-bit fields',
        detail: `k = ${k}: high nibble q = ${q}, low nibble r = ${r}.`,
      },
      {
        label: '4. Decode the operand pair',
        detail: `${branchNote} → operands n=${operandA}, m=${operandB}.`,
      },
      {
        label: '5. Map to stack depths',
        detail: `EXCHANGE n m swaps depths n+1 and m+1. Here: depth ${stackDepthA} ↔ depth ${stackDepthB}.`,
      },
    ],
  }
}

export function explainEip8024Immediate(
  kind: Eip8024ImmediateKind,
  immediate: number,
): AnyImmediateBreakdown {
  switch (kind) {
    case 'dupn':
      return explainDupnImmediate(immediate)
    case 'swapn':
      return explainSwapnImmediate(immediate)
    case 'exchange':
      return explainExchangeImmediate(immediate)
  }
}

export type EncodeExchangeResult =
  | {
      ok: true
      immediate: number
      immediateHex: string
      operandA: number
      operandB: number
      stackDepthA: number
      stackDepthB: number
    }
  | { ok: false; error: string }

export function validateExchangeOperands(n: number, m: number): string | undefined {
  if (!Number.isInteger(n) || !Number.isInteger(m)) {
    return 'Operands must be whole numbers'
  }
  if (n < 1 || m < 1) {
    return 'Operands must be at least 1 (stack depth 2 or deeper)'
  }
  if (n >= m) {
    return 'First operand n must be less than second operand m'
  }
  if (n + m > 30) {
    return 'n + m must be at most 30 (EIP-8024 limit)'
  }
  return undefined
}

export function isValidExchangeImmediateByte(immediate: number): boolean {
  return (immediate >= 0 && immediate <= 81) || (immediate >= 128 && immediate <= 255)
}

export function encodeExchangeImmediate(n: number, m: number): EncodeExchangeResult {
  const validationError = validateExchangeOperands(n, m)
  if (validationError) {
    return { ok: false, error: validationError }
  }

  let q: number
  let r: number
  if (m <= 16) {
    q = n - 1
    r = m - 1
  } else {
    q = 29 - m
    r = n - 1
  }

  const k = 16 * q + r
  const immediate = k ^ EXCHANGE_XOR_MASK

  if (!isValidExchangeImmediateByte(immediate)) {
    return {
      ok: false,
      error: `Encoded byte 0x${immediate.toString(16).padStart(2, '0')} is reserved/invalid for EXCHANGE`,
    }
  }

  return {
    ok: true,
    immediate,
    immediateHex: `0x${immediate.toString(16).padStart(2, '0')}`,
    operandA: n,
    operandB: m,
    stackDepthA: exchangeOperandToStackDepth(n),
    stackDepthB: exchangeOperandToStackDepth(m),
  }
}

export function encodeExchangeFromStackDepths(
  depthA: number,
  depthB: number,
): EncodeExchangeResult {
  if (!Number.isInteger(depthA) || !Number.isInteger(depthB)) {
    return { ok: false, error: 'Stack depths must be whole numbers' }
  }
  if (depthA < 2 || depthB < 2) {
    return { ok: false, error: 'Stack depths must be at least 2 (depth 1 is the top)' }
  }
  if (depthA === depthB) {
    return { ok: false, error: 'Choose two different stack depths' }
  }

  const n = Math.min(depthA, depthB) - 1
  const m = Math.max(depthA, depthB) - 1
  return encodeExchangeImmediate(n, m)
}

export function formatDupnEncodeResult(
  result: Extract<EncodeDupnSwapnResult, { ok: true }>,
): string {
  return `depth ${result.operandN} → n=${result.operandN} → ${result.immediateHex}`
}

export function formatSwapnEncodeResult(
  result: Extract<EncodeDupnSwapnResult, { ok: true }>,
): string {
  return `depth ${result.operandN + 1} → n=${result.operandN} → ${result.immediateHex}`
}

export function formatExchangeEncodeResult(
  result: Extract<EncodeExchangeResult, { ok: true }>,
): string {
  return `depths ${result.stackDepthA} & ${result.stackDepthB} → n=${result.operandA}, m=${result.operandB} → ${result.immediateHex}`
}
