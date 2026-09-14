import type { PrefixedHexString } from '@ethereumjs/util'
import { createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'

export const SENDER_PRIVATE_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
export const SENDER_ADDRESS = createAddressFromPrivateKey(SENDER_PRIVATE_KEY).toString()
export const CONTRACT_ADDRESS = '0x00000000000000000000000000000000000000a1' as PrefixedHexString
export const COINBASE_ADDRESS = '0x00000000000000000000000000000000000000c1' as PrefixedHexString

/** PUSH1 2; PUSH1 0; SSTORE; STOP — write 2 into slot 0. */
export const SSTORE_UPDATE_BYTECODE = `0x600260005500` as PrefixedHexString
/** PUSH1 0; SLOAD; STOP — read slot 0. */
export const SLOAD_BYTECODE = `0x60005400` as PrefixedHexString
/** PUSH1 1; PUSH1 0; SSTORE; STOP — first write to an empty slot. */
export const SSTORE_NEW_SLOT_BYTECODE = `0x600160005500` as PrefixedHexString

export const DEFAULT_SENDER_BALANCE = BigInt(1e18)
export const DEFAULT_GAS_PRICE = 10n
export const DEFAULT_BLOCK_GAS_LIMIT = 30_000_000n
export const PROGRAM_GAS_LIMIT = 300_000n

/** EIP-2929 / EIP-8038 cold storage access — unchanged. */
export const COLD_STORAGE_ACCESS = 2_100n
/** Extracted write component before EIP-8038 (EIP-2200 remainder). */
export const OSAKA_STORAGE_WRITE = 2_800n
/** EIP-8038 STORAGE_WRITE. */
export const AMSTERDAM_STORAGE_WRITE = 10_000n
/** Pre-Amsterdam fused cost of setting a new slot (regular gas). */
export const OSAKA_STORAGE_SET = 20_000n
/** EIP-8037 new storage slot: 64 bytes × 1530, charged as state gas. */
export const NEW_STORAGE_SLOT_STATE_GAS = 64n * 1530n

/** Two PUSH1 opcodes in the SSTORE programs. */
export const SSTORE_PUSH_GAS = 6n
/** One PUSH1 in the SLOAD program. */
export const SLOAD_PUSH_GAS = 3n

export const OSAKA_EXISTING_PROGRAM_GAS = SSTORE_PUSH_GAS + 5_000n
export const AMSTERDAM_EXISTING_PROGRAM_GAS =
  SSTORE_PUSH_GAS + COLD_STORAGE_ACCESS + AMSTERDAM_STORAGE_WRITE
export const SLOAD_PROGRAM_GAS = SLOAD_PUSH_GAS + COLD_STORAGE_ACCESS
export const OSAKA_NEW_SLOT_PROGRAM_GAS = SSTORE_PUSH_GAS + COLD_STORAGE_ACCESS + OSAKA_STORAGE_SET
export const AMSTERDAM_NEW_SLOT_REGULAR_GAS = AMSTERDAM_EXISTING_PROGRAM_GAS
