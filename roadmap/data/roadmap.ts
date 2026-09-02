/**
 * Roadmap data — drives `<RoadmapBoard />`.
 *
 * The board is a grid of tracks (rows) × horizons (columns). Both are
 * flexible: add or remove horizons in `ROADMAP_HORIZONS` and tracks in
 * `ROADMAP_TRACKS`. Each track item is placed in a column via its
 * `horizon` id. Keep 2–5 tracks for a readable layout.
 *
 * Four execution streams. Docs sections can be more granular than the
 * board (e.g. pricing, token and GTM each get their own page) — the board
 * stays crisp by grouping monetization, token and GTM under "Business".
 *
 * NOTE: directional, not committed scheduling — refine in content rounds.
 */

export type RoadmapStatus = 'planned' | 'in-progress' | 'done'

export interface RoadmapHorizon {
  /** Stable id, referenced by items. */
  id: string
  label: string
}

export interface RoadmapItem {
  title: string
  /** Which horizon column this item sits in. */
  horizon: string
  status: RoadmapStatus
  note?: string
}

export interface RoadmapTrack {
  id: string
  label: string
  /** Accent color (hex). */
  accent: string
  items: RoadmapItem[]
}

export const ROADMAP_HORIZONS: RoadmapHorizon[] = [
  { id: 'now', label: 'Now' },
  { id: 'next', label: 'Next' },
  { id: 'later', label: 'Later' },
]

export const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: 'engine',
    label: 'Engine & API',
    accent: '#7c3aed',
    items: [
      {
        title: 'MCP tools implemented',
        horizon: 'now',
        status: 'done',
        note: 'describe_capabilities + run_evm_bytecode; generic verbs, not per-EIP tools.',
      },
      {
        title: 'Amsterdam EIP catalogue',
        horizon: 'now',
        status: 'in-progress',
        note: 'Same fork: Amsterdam = EL rules label, Glamsterdam = fork name. Round-trip pipeline filling runnable modules.',
      },
      {
        title: 'Public hosted MCP',
        horizon: 'now',
        status: 'in-progress',
        note: 'HTTP at mcp.feelyourprotocol.org — launch week 5–9 Oct 2026.',
      },
      {
        title: 'EIP-7928 BAL generate',
        horizon: 'next',
        status: 'planned',
        note: 'Generate shape for block-level access lists.',
      },
      {
        title: 'Hegota scope (EL EIPs)',
        horizon: 'later',
        status: 'planned',
        note: 'FOCIL, frame txs, EL changes per EIP-8081.',
      },
    ],
  },
  {
    id: 'website',
    label: 'Website & Education',
    accent: '#06b6d4',
    items: [
      {
        title: 'Explorations & education',
        horizon: 'now',
        status: 'in-progress',
        note: '~2 Amsterdam explorations per week; video pipeline for social.',
      },
      {
        title: 'MCP twin links per exploration',
        horizon: 'now',
        status: 'in-progress',
        note: 'Each live exploration maps to mcp-docs/use/eips/.',
      },
      {
        title: 'Without vs with MCP proof',
        horizon: 'next',
        status: 'planned',
        note: 'Documented agent comparisons — oracle vs LLM-only answers.',
      },
    ],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    accent: '#0ea5e9',
    items: [
      { title: 'Website on Strato', horizon: 'now', status: 'done' },
      {
        title: 'AWS EC2 MCP host',
        horizon: 'now',
        status: 'in-progress',
        note: 'Compute-optimized Graviton; nginx + TLS for public HTTP.',
      },
      { title: 'Scale & observability', horizon: 'later', status: 'planned' },
    ],
  },
  {
    id: 'business',
    label: 'Business & Community',
    accent: '#f59e0b',
    items: [
      {
        title: 'x402 on public endpoint',
        horizon: 'now',
        status: 'in-progress',
        note: 'USDC on Base; per-gas pricing target for launch week.',
      },
      {
        title: 'Tiered token discounts',
        horizon: 'next',
        status: 'planned',
        note: 'Holder discount lane — never a gate for newcomers.',
      },
      {
        title: 'MCP registry listings',
        horizon: 'next',
        status: 'planned',
      },
      { title: 'Enterprise annual tier / buyback', horizon: 'later', status: 'planned', note: 'Introduce "when they come".' },
    ],
  },
]
