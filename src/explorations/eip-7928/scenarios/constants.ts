import { createAddressFromPrivateKey, createAddressFromString, hexToBytes } from '@ethereumjs/util'

import type { PrefixedHexString } from '@ethereumjs/util'

export const SENDER_PRIVATE_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
export const SENDER_ADDRESS = createAddressFromPrivateKey(SENDER_PRIVATE_KEY).toString()
export const CONTRACT_ADDRESS = '0x00000000000000000000000000000000000000c0' as PrefixedHexString
export const RECIPIENT_ADDRESS = '0x0000000000000000000000000000000000000000' as PrefixedHexString

export const SLOT_0 = `0x${'00'.repeat(32)}` as PrefixedHexString
export const VALUE_42 = `0x${'00'.repeat(31)}2a` as PrefixedHexString

/** SLOAD slot 0 → MSTORE → RETURN (see runTxWithContractState.ts). */
export const RETRIEVE_BYTECODE = `0x60005460005260206000f3` as PrefixedHexString

/** PUSH1 42; PUSH1 0; SSTORE; STOP */
export const SSTORE_42_BYTECODE = `0x602a60005500` as PrefixedHexString

export const DEFAULT_SENDER_BALANCE = BigInt(1e18)
export const DEFAULT_GAS_PRICE = 10n
export const DEFAULT_BLOCK_GAS_LIMIT = 30_000_000n

export const contractAddress = createAddressFromString(CONTRACT_ADDRESS)
