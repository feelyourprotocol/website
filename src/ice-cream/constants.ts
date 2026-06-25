/** Base mainnet — Ice Cream Week / Special Actions. */
export const BASE_CHAIN_ID = 8453 as const

export const FYP_TOKEN_ADDRESS = '0x8eae800ff67778057941792acdbab29904962ba3' as const

export const FYP_TOKEN_SYMBOL = 'FYP' as const

/** IceCreamStand on Base mainnet — deployed 2026-06-25, block 47812253. */
export const ICE_CREAM_STAND_ADDRESS = '0xac39d6219C5e45Ba37C64F1604919ff80040eF7e' as const

export const ICE_CREAM_STAND_BASESCAN_URL =
  `https://basescan.org/address/${ICE_CREAM_STAND_ADDRESS}` as const

export const ICE_CREAM_STAND_DEPLOY_TX =
  '0xa537550cb1a54230c652c34838e60dcdd45249d973c9fa22fe5759bca0e42e86' as const

/** FYP scoop revenue — separate from the main protocol treasury (bookkeeping). */
export const FYP_SPECIAL_ACTIONS_WALLET_ADDRESS =
  '0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202' as const

export const FYP_SPECIAL_ACTIONS_WALLET_BASESCAN_URL =
  `https://basescan.org/address/${FYP_SPECIAL_ACTIONS_WALLET_ADDRESS}#asset-multichain` as const

export const ICE_CREAM_PRICE_FYP = '10' as const

export const ICE_CREAM_FEATURE_FLAG = true as const
