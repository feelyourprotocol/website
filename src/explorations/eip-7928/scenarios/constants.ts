import type { PrefixedHexString } from '@ethereumjs/util'
import {
  createAddressFromPrivateKey,
  createAddressFromString,
  createContractAddress,
  hexToBytes,
} from '@ethereumjs/util'

export const SENDER_PRIVATE_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
export const SENDER_ADDRESS = createAddressFromPrivateKey(SENDER_PRIVATE_KEY).toString()
export const RECIPIENT_PRIVATE_KEY = hexToBytes(`0x${'71'.repeat(32)}`)
export const RECIPIENT_ADDRESS = createAddressFromPrivateKey(RECIPIENT_PRIVATE_KEY).toString() as PrefixedHexString
export const CONTRACT_PRIVATE_KEY = hexToBytes(`0x${'42'.repeat(32)}`)
export const CONTRACT_ADDRESS = createAddressFromPrivateKey(CONTRACT_PRIVATE_KEY).toString() as PrefixedHexString
export const CALLER_PRIVATE_KEY = hexToBytes(`0x${'43'.repeat(32)}`)
export const CALLER_ADDRESS = createAddressFromPrivateKey(CALLER_PRIVATE_KEY).toString() as PrefixedHexString
/** Block fee recipient — kept distinct from other addresses so fee flow reads cleanly. */
export const COINBASE_ADDRESS = '0x00000000000000000000000000000000000000c1' as PrefixedHexString

export const SLOT_0 = `0x${'00'.repeat(32)}` as PrefixedHexString
export const VALUE_42 = `0x${'00'.repeat(31)}2a` as PrefixedHexString

/** SLOAD slot 0 → MSTORE → RETURN (see runTxWithContractState.ts). */
export const RETRIEVE_BYTECODE = `0x60005460005260206000f3` as PrefixedHexString

/** PUSH1 42; PUSH1 0; SSTORE; STOP */
export const SSTORE_42_BYTECODE = `0x602a60005500` as PrefixedHexString

/** PUSH1 42; PUSH1 0; SSTORE; PUSH1 0; PUSH1 0; REVERT */
export const SSTORE_REVERT_BYTECODE = `0x602a60005560006000fd` as PrefixedHexString

/**
 * Caller runtime: CALL callee with empty calldata, copy 32-byte return to memory, STOP.
 * Callee address is embedded as a PUSH20 immediate ({@link CONTRACT_ADDRESS}).
 */
export const CALL_FORWARD_BYTECODE =
  `0x6020600060006000600073${CONTRACT_ADDRESS.slice(2).toLowerCase()}620186a0f100` as PrefixedHexString

/** Init code: CODECOPY runtime into memory, RETURN — deploys {@link SSTORE_42_BYTECODE}. */
export const CREATE_DEPLOY_INIT_BYTECODE =
  `0x6006600c60003960066000f3${SSTORE_42_BYTECODE.slice(2)}` as PrefixedHexString

/** Address of the contract created when the sender (nonce 0) runs a CREATE tx. */
export const CREATE_DEPLOYED_ADDRESS = createContractAddress(
  createAddressFromString(SENDER_ADDRESS),
  0n,
).toString() as PrefixedHexString

export const DEFAULT_SENDER_BALANCE = BigInt(1e18)
export const DEFAULT_GAS_PRICE = 10n
export const DEFAULT_BLOCK_GAS_LIMIT = 30_000_000n

export const contractAddress = createAddressFromString(CONTRACT_ADDRESS)
export const callerAddress = createAddressFromString(CALLER_ADDRESS)
