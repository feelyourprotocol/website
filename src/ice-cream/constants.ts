/** Base mainnet — Ice Cream Week / Special Actions. */
export const FYP_TOKEN_ADDRESS = '0x8eae800ff67778057941792acdbab29904962ba3' as const

export const FYP_TOKEN_SYMBOL = 'FYP' as const

/** FYP scoop revenue — separate from the main protocol treasury (bookkeeping). */
export const FYP_SPECIAL_ACTIONS_WALLET_ADDRESS =
  '0x4AEef6965A4cBcddb2e96555dCD0cB1afA7Bd202' as const

export const FYP_SPECIAL_ACTIONS_WALLET_BASESCAN_URL =
  `https://basescan.org/address/${FYP_SPECIAL_ACTIONS_WALLET_ADDRESS}#asset-multichain` as const

export const ICE_CREAM_PRICE_FYP = '10' as const

export const ICE_CREAM_FEATURE_FLAG = true as const
