/**
 * Project timeline data — drives `<Timeline />`.
 *
 * To update: add an event to `TIMELINE_EVENTS` (and a phase to
 * `TIMELINE_PHASES` when a new chapter begins). Events are grouped under
 * their phase by the `phase` id; the component renders left→right.
 */

export interface TimelinePhase {
  /** Stable id, referenced by events. */
  id: number
  label: string
  /** Human-readable date range, e.g. "Sep 2025 – Jun 2026". */
  range: string
  /** Accent color (hex). */
  color: string
}

export interface TimelineEvent {
  /** ISO-ish date or month, e.g. "2025-09-11" or "2026-06". */
  date: string
  label: string
  phase: number
  /** Optional one-line context. */
  note?: string
  /** Mark as a reached/historical event (filled dot) vs. upcoming (hollow). */
  done?: boolean
}

export const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: 1,
    label: 'Phase 1 · Side Project',
    range: 'Sep 2025 – Jun 2026',
    color: '#64748b',
  },
  {
    id: 2,
    label: 'Phase 2 · Funded & Focused',
    range: 'Jun 2026',
    color: '#7c3aed',
  },
  {
    id: 3,
    label: 'Phase 3 · Sustainable Business',
    range: 'Jun 2026 →',
    color: '#06b6d4',
  },
]

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: '2025-09-11',
    label: 'First commit',
    phase: 1,
    note: 'Project launched on GitHub — built for fun, to close the protocol↔app gap.',
    done: true,
  },
  {
    date: '2026-06-05',
    label: 'Bankr token claimed',
    phase: 2,
    note: 'Community token secured ~2 months of funding; new urgency and a regular schedule.',
    done: true,
  },
  {
    date: '2026-06-06',
    label: 'Twitter / X set up',
    phase: 2,
    note: 'Public channel for protocol education and project updates.',
    done: true,
  },
  {
    date: '2026-06',
    label: 'New explorations',
    phase: 2,
    note: 'EIP-8024, BAL and more built during the focused period.',
    done: true,
  },
  {
    date: '2026-06',
    label: 'Phase 3 begins',
    phase: 3,
    note: 'Conceptualization + early build: future-protocol MCP server alongside the website.',
    done: true,
  },
  {
    date: '2026-07',
    label: 'MCP engine & docs',
    phase: 3,
    note: 'mcp-docs live; execution engine v0.1; gateway tools (describe_capabilities, run_evm_bytecode).',
    done: true,
  },
  {
    date: '2026-08',
    label: 'EIP catalogue twins',
    phase: 3,
    note: 'Osaka vs Amsterdam compare; runnable modules for 8024, 7708, 7883, 7951.',
    done: true,
  },
  {
    date: '2026-09',
    label: 'Round-trip pipeline',
    phase: 3,
    note: 'EIP → exploration → MCP catalogue in ~30 minutes; Amsterdam EIPs filling the catalog.',
    done: true,
  },
  {
    date: '2026-10-05',
    label: 'Public MCP launch week',
    phase: 3,
    note: 'Hosted HTTP at mcp.feelyourprotocol.org + x402 (USDC on Base). See /roadmap/launch.',
  },
  {
    date: 'later',
    label: 'Enterprise tier',
    phase: 3,
    note: 'Flat annual stablecoin tier + revenue→token loop, introduced "when they come".',
  },
]
