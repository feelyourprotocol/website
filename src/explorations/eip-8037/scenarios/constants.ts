import type { PrefixedHexString } from '@ethereumjs/util'
import { createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'

export const SENDER_PRIVATE_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
export const SENDER_ADDRESS = createAddressFromPrivateKey(SENDER_PRIVATE_KEY).toString()
export const RECIPIENT_PRIVATE_KEY = hexToBytes(`0x${'71'.repeat(32)}`)
export const RECIPIENT_ADDRESS = createAddressFromPrivateKey(
  RECIPIENT_PRIVATE_KEY,
).toString() as PrefixedHexString
export const CONTRACT_PRIVATE_KEY = hexToBytes(`0x${'42'.repeat(32)}`)
export const CONTRACT_ADDRESS = createAddressFromPrivateKey(
  CONTRACT_PRIVATE_KEY,
).toString() as PrefixedHexString

export const COINBASE_ADDRESS = '0x00000000000000000000000000000000000000c1' as PrefixedHexString

/** PUSH1 1; PUSH1 0; SSTORE; STOP — first write to slot 0. */
export const SSTORE_NEW_SLOT_BYTECODE = `0x600160005500` as PrefixedHexString

export const DEFAULT_SENDER_BALANCE = BigInt(1e18)
export const DEFAULT_GAS_PRICE = 10n
export const DEFAULT_BLOCK_GAS_LIMIT = 30_000_000n

/** Wallet-era default for a simple ETH transfer. */
export const CLASSIC_GAS_LIMIT = 21_000n

/** Probe / SSTORE recommended limit — estimator does not simulate SSTORE. */
export const EXECUTION_HEADROOM_GAS_LIMIT = 300_000n

/** EIP-8037 first-touch account: 120 bytes × 1530 cost-per-state-byte. */
export const FIRST_TOUCH_STATE_GAS = 120n * 1530n

/** EIP-8037 new storage slot: 64 bytes × 1530. */
export const NEW_STORAGE_SLOT_STATE_GAS = 64n * 1530n
