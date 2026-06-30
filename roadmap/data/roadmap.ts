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
      { title: 'Local zero-crypto MCP PoC', horizon: 'now', status: 'in-progress', note: 'Wrap one EthereumJS function as an MCP tool; prove the LLM round-trip.' },
      { title: 'Amsterdam EIP pipeline', horizon: 'now', status: 'in-progress', note: 'First full pipeline on already-implemented Amsterdam EIPs.' },
      { title: 'Glamsterdam scope (BAL, pricing)', horizon: 'next', status: 'planned' },
      { title: 'Hegota scope (Verkle, precompiles)', horizon: 'later', status: 'planned' },
    ],
  },
  {
    id: 'website',
    label: 'Website & Education',
    accent: '#06b6d4',
    items: [
      { title: 'Explorations & education', horizon: 'now', status: 'in-progress' },
      { title: 'API showcase links per exploration', horizon: 'next', status: 'planned', note: 'Visual funnel from each exploration to its API capability.' },
    ],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    accent: '#0ea5e9',
    items: [
      { title: 'Stays on Strato (website)', horizon: 'now', status: 'in-progress' },
      { title: 'AWS EC2 (c7g) for API', horizon: 'next', status: 'planned', note: 'Compute-optimized Graviton + worker pool for isolated sims.' },
      { title: 'Scale & observability', horizon: 'later', status: 'planned' },
    ],
  },
  {
    id: 'business',
    label: 'Business & Community',
    accent: '#f59e0b',
    items: [
      { title: 'x402 linear pricing (per-gas)', horizon: 'next', status: 'planned', note: 'USDC on Base, from request #1, no free tier.' },
      { title: 'Tiered token discounts', horizon: 'next', status: 'planned' },
      { title: 'Registry presence + outreach', horizon: 'next', status: 'planned' },
      { title: 'Enterprise annual tier / buyback', horizon: 'later', status: 'planned', note: 'Introduce "when they come".' },
    ],
  },
]
