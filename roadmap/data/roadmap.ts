/**
 * Roadmap data — drives `<RoadmapBoard />`.
 *
 * The board is a grid of tracks (rows) × horizons (columns). The column
 * is the status. Add or remove horizons in `ROADMAP_HORIZONS` and tracks
 * in `ROADMAP_TRACKS`. Each item sits in a column via its `horizon` id.
 * Keep 2–5 tracks for a readable layout.
 *
 * Four execution streams. Docs sections can be more granular than the
 * board (e.g. pricing, token and GTM each get their own page) — the board
 * stays crisp by grouping monetization, token and GTM under "Business".
 *
 * NOTE: directional, not committed scheduling — refine in content rounds.
 *
 * Done is the recent work still in view. When a card stops being the
 * point, it leaves the board. Done is not an archive.
 */

export interface RoadmapHorizon {
  /** Stable id, referenced by items. */
  id: string
  label: string
  /** Outline icon id from the roadmap icon set. */
  icon: string
}

export interface RoadmapItem {
  title: string
  /** Which horizon column this item sits in. */
  horizon: string
  note?: string
}

export interface RoadmapTrack {
  id: string
  label: string
  /** Accent color (hex). */
  accent: string
  /** Outline icon id from the roadmap icon set. */
  icon: string
  items: RoadmapItem[]
}

export const ROADMAP_HORIZONS: RoadmapHorizon[] = [
  { id: 'done', label: 'Done', icon: 'check' },
  { id: 'progress', label: 'In progress', icon: 'bolt' },
  { id: 'next', label: 'Next', icon: 'arrow' },
  { id: 'later', label: 'Later', icon: 'clock' },
]

export const ROADMAP_TRACKS: RoadmapTrack[] = [
  {
    id: 'engine',
    label: 'Engine & API',
    accent: '#7c3aed',
    icon: 'chip',
    items: [
      {
        title: 'MCP tools',
        horizon: 'done',
        note: 'Six generic verbs: probe, bytecode, transaction, block, generate, inspect.',
      },
      {
        title: 'Glamsterdam EIP catalogue',
        horizon: 'done',
        note: 'Runnable twins for the preview fork, plus Fusaka 7883 and 7951.',
      },
      {
        title: 'Public hosted MCP',
        horizon: 'progress',
        note: 'HTTP at mcp.feelyourprotocol.org — launch week 5–9 Oct 2026.',
      },
      {
        title: 'Usability evaluation',
        horizon: 'progress',
        note: 'Check whether the way the server is built, and the way it answers, is actually helpful.',
      },
      {
        title: 'Frame txs',
        horizon: 'next',
        note: 'The first Hegota execution slice. Starts on the paid tier.',
      },
      {
        title: 'Hegota scope',
        horizon: 'later',
        note: 'The rest of the Hegota execution work, after frame txs. Moves to free as that hardfork approaches.',
      },
    ],
  },
  {
    id: 'website',
    label: 'Website & Education',
    accent: '#06b6d4',
    icon: 'book',
    items: [
      {
        title: 'MCP twin links',
        horizon: 'done',
        note: 'Every live exploration has a catalogue page.',
      },
      {
        title: 'Explorations',
        horizon: 'progress',
        note: 'The textbook keeps growing.',
      },
    ],
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    accent: '#0ea5e9',
    icon: 'server',
    items: [
      { title: 'Website on Strato', horizon: 'done' },
      {
        title: 'AWS EC2 MCP host',
        horizon: 'done',
        note: 'Graviton host is up. Public HTTP opens with the hosted MCP.',
      },
      {
        title: 'Scale & observability',
        horizon: 'progress',
        note: 'A small custom metrics view is already running.',
      },
      {
        title: 'EIP build automation',
        horizon: 'next',
        note: 'A new EIP can be built overnight on an EthereumJS branch.',
      },
    ],
  },
  {
    id: 'business',
    label: 'Business & Community',
    accent: '#f59e0b',
    icon: 'people',
    items: [
      {
        title: 'Org docs and processes',
        horizon: 'done',
        note: 'In place for the relevant organizational parts.',
      },
      {
        title: 'Exploration marketing',
        horizon: 'done',
        note: 'Comics, videos, and the tweets that go with them.',
      },
      {
        title: 'Launch marketing',
        horizon: 'progress',
        note: 'MCP education and outreach, including one-to-one conversations.',
      },
      {
        title: 'x402 paid tier',
        horizon: 'next',
        note: 'USDC on Base for new EIPs, EIP-8141 first, once the open server has been used.',
      },
      {
        title: 'Agent-readable onboarding',
        horizon: 'later',
        note: 'Capability, price, and payment without a human who read the website.',
      },
      {
        title: 'Tiered token discounts',
        horizon: 'next',
        note: 'A holder discount on the paid tier. Never a gate for newcomers.',
      },
      {
        title: 'MCP registry listings',
        horizon: 'later',
        note: 'Machine-readable listings so agents can find the lab.',
      },
    ],
  },
]
