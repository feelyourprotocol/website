/** Community token metadata — just enough to identify which token this page refers to. */
export type TokenInfoField = {
  label: string
  value: string
  href?: string
}

export const TOKEN_INFO = {
  name: 'Feel Your Protocol',
  symbol: 'FYP',
  network: 'Base',
  contractAddress: '0x8eae800ff67778057941792acdbab29904962ba3',
  bankrUrl: 'https://bankr.bot/discover/0x8eae800ff67778057941792acdbab29904962ba3',
  explorerUrl: 'https://basescan.org/token/0x8eae800ff67778057941792acdbab29904962ba3',
} as const

const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`

export const TOKEN_INFO_FIELDS: TokenInfoField[] = [
  { label: 'Name', value: TOKEN_INFO.name, href: TOKEN_INFO.bankrUrl },
  { label: 'Symbol', value: TOKEN_INFO.symbol },
  { label: 'Network', value: TOKEN_INFO.network },
  {
    label: 'Contract',
    value: shortAddress(TOKEN_INFO.contractAddress),
    href: TOKEN_INFO.explorerUrl,
  },
]
