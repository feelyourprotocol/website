export const TREASURY_URL =
  'https://github.com/feelyourprotocol/website/tree/main/treasury' as const

export const TREASURY_WALLET_URL =
  'https://basescan.org/address/0x15952A6B59F8BaDBD3551F896377EEcF461E79F8#asset-multichain' as const

export type TreasuryChartSlice = {
  id: string
  label: string
  eur: number
  color: string
}

/** Machine-readable chart spec — embed on page for AI reproduction. */
export type TreasuryChartSpec = {
  chartId: string
  title: string
  subtitle: string
  generatedAt: string
  basis: {
    description: string
    totalEur: number
    sources: string[]
  }
  reproduce: string[]
  slices: TreasuryChartSlice[]
}

export const TREASURY_SECTION = {
  title: 'Treasury',
  lead: 'Live snapshot — full books on GitHub.',
} as const

/** Snapshot aligned with treasury/2026/*.md — update when ledgers change. */
export const TREASURY_SNAPSHOT_2026 = {
  year: 2026,
  claimedEur: 5752.34,
  withdrawnEur: 0,
  pendingWithdrawalEur: 0,
} as const

/**
 * Allocation of 2026 claims by earmarked use. Early snapshot — mostly illustrates intent.
 *
 * @ai-chart treasury-allocation-2026
 */
export const ALLOCATION_CHART_2026: TreasuryChartSpec = {
  chartId: 'treasury-allocation-2026',
  title: 'Claimed fees (2026)',
  subtitle: 'Earmarked use',
  generatedAt: '2026-08-26',
  basis: {
    description: 'Sum of claims in treasury/2026/claims.md',
    totalEur: 5752.34,
    sources: [
      'treasury/2026/claims.md',
      'treasury/2026/withdrawals.md',
      'treasury/2026/06/fyp.md',
      'treasury/2026/06/ethereumjs.md',
      'treasury/2026/06/expenses.md',
      'treasury/2026/07/fyp.md',
      'treasury/2026/07/expenses.md',
      'treasury/2026/08/fyp.md',
      'treasury/2026/08/ethereumjs.md',
      'treasury/2026/08/expenses.md',
    ],
  },
  reproduce: [
    'totalEur = claims.md frontmatter total_claimed_eur',
    'work slice per month = that month fyp.md + ethereumjs.md frontmatter total_eur',
    'expenses slice = that month expenses.md frontmatter total_eur',
    'unallocated = totalEur − sum(work slices) − sum(expenses slices) (omit slice if zero)',
    'Regenerate chart when claims or month detail files change; bump generatedAt',
  ],
  slices: [
    {
      id: 'work-jun',
      label: 'June work',
      eur: 2300,
      color: '#06b6d4',
    },
    {
      id: 'work-jul',
      label: 'July work',
      eur: 1450,
      color: '#0891b2',
    },
    {
      id: 'work-aug',
      label: 'August work',
      eur: 1150,
      color: '#0e7490',
    },
    {
      id: 'expenses-jun',
      label: 'June expenses',
      eur: 61.4,
      color: '#f59e0b',
    },
    {
      id: 'expenses-jul',
      label: 'July expenses',
      eur: 61.4,
      color: '#d97706',
    },
    {
      id: 'expenses-aug',
      label: 'August expenses',
      eur: 61.4,
      color: '#b45309',
    },
    {
      id: 'unallocated',
      label: 'Unallocated',
      eur: 668.14,
      color: '#94a3b8',
    },
  ],
}
