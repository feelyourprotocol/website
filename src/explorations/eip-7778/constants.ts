import type { PrefixedHexString } from '@ethereumjs/util'
import { createAddressFromPrivateKey, hexToBytes } from '@ethereumjs/util'

export const SENDER_PRIVATE_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
export const SENDER_ADDRESS = createAddressFromPrivateKey(
  SENDER_PRIVATE_KEY,
).toString() as PrefixedHexString
export const CONTRACT_ADDRESS = '0x00000000000000000000000000000000000000a1' as PrefixedHexString
export const COINBASE_ADDRESS = '0x00000000000000000000000000000000000000c1' as PrefixedHexString

/** PUSH1 0; PUSH1 0; SSTORE; STOP — write 0 into slot 0. */
export const CLEAR_BYTECODE = `0x600060005500` as PrefixedHexString
/** PUSH1 2; PUSH1 0; SSTORE; STOP — write 2 into slot 0. */
export const REWRITE_BYTECODE = `0x600260005500` as PrefixedHexString
/** PUSH1 2; PUSH1 0; SSTORE; PUSH1 1; PUSH1 0; SSTORE; STOP — write 2, then 1. */
export const RESET_BYTECODE = `0x6002600055600160005500` as PrefixedHexString

export const DEFAULT_SENDER_BALANCE = BigInt(1e18)
export const DEFAULT_GAS_PRICE = 10n
export const DEFAULT_BLOCK_GAS_LIMIT = 30_000_000n
export const PROGRAM_GAS_LIMIT = 300_000n

export const SLOT0 = `0x${'00'.repeat(32)}` as PrefixedHexString
export const VALUE1 = `0x${'00'.repeat(31)}01` as PrefixedHexString

/** Measured on EthereumJS Amsterdam / Osaka. Tests lock these. */
export const EXPECTED = {
  clear: {
    glamsterdam: { pay: 21_685n, block: 27_106n },
    fusaka: { pay: 21_206n, block: 21_206n },
  },
  rewrite: {
    glamsterdam: { pay: 27_106n, block: 27_106n },
    fusaka: { pay: 26_006n, block: 26_006n },
  },
  reset: {
    glamsterdam: { pay: 21_770n, block: 27_212n },
    fusaka: { pay: 23_312n, block: 23_312n },
  },
} as const
