import type { PrefixedHexString } from '@ethereumjs/util'
import { createAddressFromPrivateKey, createAddressFromString, hexToBytes } from '@ethereumjs/util'

export const SENDER_PRIVATE_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
export const SENDER_ADDRESS = createAddressFromPrivateKey(SENDER_PRIVATE_KEY).toString()
export const RECIPIENT_PRIVATE_KEY = hexToBytes(`0x${'71'.repeat(32)}`)
export const RECIPIENT_ADDRESS = createAddressFromPrivateKey(
  RECIPIENT_PRIVATE_KEY,
).toString() as PrefixedHexString
export const WALLET_PRIVATE_KEY = hexToBytes(`0x${'42'.repeat(32)}`)
export const WALLET_ADDRESS = createAddressFromPrivateKey(
  WALLET_PRIVATE_KEY,
).toString() as PrefixedHexString
export const REVERT_CALLEE_PRIVATE_KEY = hexToBytes(`0x${'44'.repeat(32)}`)
export const REVERT_CALLEE_ADDRESS = createAddressFromPrivateKey(
  REVERT_CALLEE_PRIVATE_KEY,
).toString() as PrefixedHexString

export const COINBASE_ADDRESS = '0x00000000000000000000000000000000000000c1' as PrefixedHexString

/** PUSH1 0; PUSH1 0; REVERT */
export const REVERT_BYTECODE = `0x60006000fd` as PrefixedHexString

/** Forwards 1 wei to {@link RECIPIENT_ADDRESS} via CALL. */
export const WALLET_FORWARD_BYTECODE =
  `0x6000600060006001600173${RECIPIENT_ADDRESS.slice(2).toLowerCase()}5af100` as PrefixedHexString

/** CALLs {@link REVERT_CALLEE_ADDRESS} with 1 wei — inner transfer rolls back on revert. */
export const REVERT_CALLER_BYTECODE =
  `0x6000600060006001600173${REVERT_CALLEE_ADDRESS.slice(2).toLowerCase()}5af100` as PrefixedHexString

export const DEFAULT_SENDER_BALANCE = BigInt(1e18)
export const DEFAULT_GAS_PRICE = 10n
export const DEFAULT_BLOCK_GAS_LIMIT = 30_000_000n

export const walletAddress = createAddressFromString(WALLET_ADDRESS)
export const recipientAddress = createAddressFromString(RECIPIENT_ADDRESS)
