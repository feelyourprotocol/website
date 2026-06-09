import { depthLabel, exchangeOperandToDepth } from './stackDepth'
import type { InstructionRow } from './types'

/** EIP-8024 immediate decode (mirrors @ethereumjs/evm). */
function decodeDupnSwapnDepth(immediate: number): number {
  return (immediate + 145) & 0xff
}

function decodeExchangeDepths(immediate: number): [number, number] {
  const k = immediate ^ 0x8f
  const q = (k >> 4) & 0xf
  const r = k & 0xf
  if (q < r) {
    return [q + 1, r + 1]
  }
  return [r + 1, 29 - q]
}

function immediateByte(row: InstructionRow): number | undefined {
  const parts = row.rawBytes.trim().split(/\s+/)
  if (parts.length < 2) return undefined
  return parseInt(parts[1]!, 16)
}

function formatPushValue(row: InstructionRow): string {
  const hex = row.immediateHex?.replace(/^0x/i, '') ?? row.name.match(/0x[0-9a-f]+/i)?.[0]?.slice(2)
  if (!hex) return 'a value'
  const value = BigInt(`0x${hex}`)
  if (value <= 999_999n) return value.toString()
  return `0x${hex}`
}

const STATIC: Record<string, string> = {
  STOP: 'Halt execution',
  ADD: 'Pop two values, add them, and push the result',
  MUL: 'Pop two values, multiply them, and push the product',
  SUB: 'Pop two values, subtract the top from the second, and push the difference',
  DIV: 'Pop two values, divide the second by the top (unsigned), and push the quotient',
  SDIV: 'Pop two values, divide the second by the top (signed), and push the quotient',
  MOD: 'Pop two values, take the remainder of unsigned division, and push it',
  SMOD: 'Pop two values, take the remainder of signed division, and push it',
  ADDMOD: 'Pop three values, compute (a + b) mod N, and push the result',
  MULMOD: 'Pop three values, compute (a × b) mod N, and push the result',
  EXP: 'Pop base and exponent, raise base to the exponent, and push the result',
  SIGNEXTEND: 'Sign-extend a value to a wider byte width and push the result',
  LT: 'Pop two values, compare (unsigned), and push 1 if the second is less than the top',
  GT: 'Pop two values, compare (unsigned), and push 1 if the second is greater than the top',
  SLT: 'Pop two values, compare (signed), and push 1 if the second is less than the top',
  SGT: 'Pop two values, compare (signed), and push 1 if the second is greater than the top',
  EQ: 'Pop two values, compare for equality, and push 1 if they match',
  ISZERO: 'Pop a value and push 1 if it is zero, otherwise 0',
  AND: 'Pop two values, bitwise AND them, and push the result',
  OR: 'Pop two values, bitwise OR them, and push the result',
  XOR: 'Pop two values, bitwise XOR them, and push the result',
  NOT: 'Pop a value, bitwise NOT it, and push the result',
  BYTE: 'Pop an index and a word, extract that byte, and push it',
  SHL: 'Pop shift amount and value, shift left, and push the result',
  SHR: 'Pop shift amount and value, logical shift right, and push the result',
  SAR: 'Pop shift amount and value, arithmetic shift right, and push the result',
  CLZ: 'Pop a value, count leading zero bits, and push the count',
  KECCAK256: 'Pop offset and length, hash that memory region with Keccak-256, and push the digest',
  ADDRESS: 'Push the address of the currently executing account',
  BALANCE: 'Pop an address and push its balance in wei',
  ORIGIN: 'Push the address that originally started this transaction',
  CALLER: 'Push the address that called the current code',
  CALLVALUE: 'Push the wei amount sent with the current call',
  CALLDATALOAD: 'Pop a byte offset and push the 32-byte calldata word starting there',
  CALLDATASIZE: 'Push the size of the call input data in bytes',
  CALLDATACOPY: 'Copy a slice of calldata into memory',
  CODESIZE: 'Push the size of this contract’s bytecode in bytes',
  CODECOPY: 'Copy a slice of this contract’s bytecode into memory',
  GASPRICE: 'Push the gas price of the current transaction',
  EXTCODESIZE: 'Pop an address and push the size of its runtime bytecode',
  EXTCODECOPY: 'Copy bytecode from an external account into memory',
  EXTCODEHASH: 'Pop an address and push the hash of its runtime bytecode',
  RETURNDATASIZE: 'Push the size of the buffer returned by the last call',
  RETURNDATACOPY: 'Copy return data from the last call into memory',
  RETURNDATALOAD: 'Pop an offset and push a word from the last call’s return data',
  BLOCKHASH: 'Pop a block number and push that block’s hash (if available)',
  COINBASE: 'Push the current block’s fee recipient address',
  TIMESTAMP: 'Push the current block’s timestamp',
  NUMBER: 'Push the current block number',
  PREVRANDAO: 'Push the current block’s prevrandao value',
  DIFFICULTY: 'Push the current block’s difficulty (legacy name for prevrandao)',
  GASLIMIT: 'Push the current block’s gas limit',
  CHAINID: 'Push the chain ID of the current network',
  SELFBALANCE: 'Push this contract’s own balance in wei',
  BASEFEE: 'Push the current block’s base fee per gas',
  BLOBHASH: 'Pop a blob index and push the versioned hash of that blob',
  BLOBBASEFEE: 'Push the current block’s blob base fee',
  SLOTNUM: 'Push the current slot number (consensus layer)',
  POP: 'Remove the top stack item',
  MLOAD: 'Pop a memory offset and push the 32-byte word stored there',
  MSTORE: 'Pop an offset and value, storing the word in memory',
  MSTORE8: 'Pop an offset and byte value, storing one byte in memory',
  SLOAD: 'Pop a storage key and push the stored value',
  SSTORE: 'Pop a key and value, writing to contract storage',
  TLOAD: 'Pop a transient storage key and push its value',
  TSTORE: 'Pop a key and value, writing to transient storage',
  MCOPY: 'Copy a region of memory to another memory region',
  JUMP: 'Pop a destination PC and jump execution there (must land on JUMPDEST)',
  JUMPI: 'Pop destination and condition; jump only if the condition is non-zero',
  PC: 'Push the program counter of this opcode',
  MSIZE: 'Push the current memory size in bytes',
  GAS: 'Push the amount of gas still available',
  JUMPDEST: 'Mark a valid jump destination (no stack effect)',
  LOG0: 'Emit a log with no indexed topics',
  LOG1: 'Emit a log with one indexed topic',
  LOG2: 'Emit a log with two indexed topics',
  LOG3: 'Emit a log with three indexed topics',
  LOG4: 'Emit a log with four indexed topics',
  CREATE: 'Deploy a new contract with value from memory and push its address',
  CREATE2: 'Deploy a contract with a deterministic address and push it',
  CALL: 'Message-call another account and push a success flag',
  CALLCODE: 'Legacy call that runs code in the context of the current account',
  DELEGATECALL: 'Call another contract’s code without transferring value',
  STATICCALL: 'Call another contract in read-only (static) mode',
  RETURN: 'Stop execution and return data from memory',
  REVERT: 'Revert execution and return revert data from memory',
  INVALID: 'Consume all remaining gas and fault',
  SELFDESTRUCT: 'Send remaining balance to an address and destroy this account',
  DATALOAD: 'Pop an offset and push a word from EOF container data',
  DATALOADN: 'Push a fixed word from EOF container data (immediate offset)',
  DATASIZE: 'Push the size of the EOF container data section',
  DATACOPY: 'Copy a slice of EOF container data into memory',
  RJUMP: 'Relative jump by a signed immediate offset',
  RJUMPI: 'Relative jump if the top stack value is non-zero',
  RJUMPV: 'Relative jump using a jump table indexed by the top stack value',
  CALLF: 'Call an EOF function by index',
  RETF: 'Return from the current EOF function',
  JUMPF: 'Tail-call jump to an EOF function',
  EOFCREATE: 'Create a contract from EOF initcode and push its address',
  RETURNCONTRACT: 'Return deployment code for an EOF contract creation',
  EXTCALL: 'EOF external call and push a status code',
  EXTDELEGATECALL: 'EOF delegate-style external call',
  EXTSTATICCALL: 'EOF static external call',
}

export function explainInstruction(row: InstructionRow): string {
  const { opcodeByte } = row
  const base = row.name.split(' ')[0] ?? row.name

  if (opcodeByte === 0x5f) {
    return 'Push 0 onto the stack'
  }

  if (opcodeByte >= 0x60 && opcodeByte <= 0x7f) {
    return `Push ${formatPushValue(row)} onto the stack`
  }

  if (opcodeByte >= 0x80 && opcodeByte <= 0x8f) {
    const depth = opcodeByte - 0x80 + 1
    return `Copy ${depthLabel(depth)} onto the top of the stack`
  }

  if (opcodeByte >= 0x90 && opcodeByte <= 0x9f) {
    const depth = opcodeByte - 0x90 + 2
    return `Swap the top stack item with ${depthLabel(depth)}`
  }

  if (opcodeByte === 0xe6) {
    const imm = immediateByte(row)
    if (imm !== undefined) {
      const depth = decodeDupnSwapnDepth(imm)
      return `Copy ${depthLabel(depth)} onto the top of the stack`
    }
    return 'Copy a deep stack item onto the top (DUPN)'
  }

  if (opcodeByte === 0xe7) {
    const imm = immediateByte(row)
    if (imm !== undefined) {
      const depth = decodeDupnSwapnDepth(imm)
      return `Swap the top stack item with ${depthLabel(depth)}`
    }
    return 'Swap the top item with a deep stack item (SWAPN)'
  }

  if (opcodeByte === 0xe8) {
    const imm = immediateByte(row)
    if (imm !== undefined) {
      const [a, b] = decodeExchangeDepths(imm)
      return `Swap ${depthLabel(exchangeOperandToDepth(a))} with ${depthLabel(exchangeOperandToDepth(b))}`
    }
    return 'Swap two stack items below the top (EXCHANGE)'
  }

  if (opcodeByte >= 0xa0 && opcodeByte <= 0xa4) {
    const topics = opcodeByte - 0xa0
    return STATIC[`LOG${topics}`] ?? `Emit a log with ${topics} indexed topic(s)`
  }

  const known = STATIC[base]
  if (known) {
    return known
  }

  return `Execute ${row.name}`
}
