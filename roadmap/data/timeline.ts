/**
 * Dated project story — drives `<Timeline />`.
 *
 * Add a real date. Work with no date belongs on the roadmap board.
 * Month precision (`YYYY-MM`) sorts after day-specific events in that month.
 */

export interface TimelineEvent {
  id: string
  /** `YYYY-MM-DD` or `YYYY-MM`. */
  date: string
  label: string
  note?: string
  /** Outline icon id from the roadmap icon set. */
  icon: string
  /** Reached. A dated marker still ahead omits this. */
  done?: boolean
}

export interface TimelineGroup {
  id: string
  label: string
  events: TimelineEvent[]
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function timelineSortKey(date: string): string {
  return date.split('-').length === 2 ? `${date}-32` : date
}

export function formatTimelineDate(date: string): string {
  const [year, month, day] = date.split('-')
  const name = MONTHS[Number(month) - 1] ?? month
  if (!day) return `${name} ${year}`
  return `${Number(day)} ${name} ${year}`
}

export function timelineQuarterId(date: string): string {
  const [year, month] = date.split('-')
  const quarter = Math.ceil(Number(month) / 3)
  return `${year}-Q${quarter}`
}

export function groupTimeline(events: TimelineEvent[]): TimelineGroup[] {
  const sorted = [...events].sort((a, b) => timelineSortKey(a.date).localeCompare(timelineSortKey(b.date)))
  const groups: TimelineGroup[] = []
  for (const event of sorted) {
    const id = timelineQuarterId(event.date)
    const [year, quarter] = id.split('-')
    const last = groups[groups.length - 1]
    if (!last || last.id !== id) {
      groups.push({ id, label: `${year} ${quarter}`, events: [event] })
    } else {
      last.events.push(event)
    }
  }
  return groups
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'first-commit',
    date: '2025-09-11',
    label: 'First commit',
    icon: 'spark',
    note: 'The project lands on GitHub, built to close the gap between the protocol and the apps.',
    done: true,
  },
  {
    id: 'bankr-token',
    date: '2026-06-05',
    label: 'Bankr token claimed',
    icon: 'token',
    note: 'The community token covers about two months, and the work gets a regular schedule.',
    done: true,
  },
  {
    id: 'twitter',
    date: '2026-06-06',
    label: 'Twitter / X',
    icon: 'people',
    note: 'A public channel for protocol education and project updates.',
    done: true,
  },
  {
    id: 'explorations',
    date: '2026-06',
    label: 'New explorations',
    icon: 'book',
    note: 'EIP-8024, block access lists, and more, in that focused stretch.',
    done: true,
  },
  {
    id: 'mcp-engine',
    date: '2026-07',
    label: 'MCP engine and docs',
    icon: 'chip',
    note: 'mcp-docs goes live. The execution engine and the first gateway tools land.',
    done: true,
  },
  {
    id: 'catalogue-twins',
    date: '2026-08',
    label: 'EIP catalogue twins',
    icon: 'stack',
    note: 'Fusaka and Glamsterdam side by side. Runnable modules for 8024, 7708, 7883, and 7951.',
    done: true,
  },
  {
    id: 'round-trip',
    date: '2026-09',
    label: 'Round-trip pipeline',
    icon: 'bolt',
    note: 'An EIP can go from exploration to MCP catalogue in about half an hour.',
    done: true,
  },
  {
    id: 'launch-week',
    date: '2026-10-06',
    label: 'Public MCP launch',
    icon: 'spark',
    note: 'Hosted HTTP at mcp.feelyourprotocol.org. Open, on the full Glamsterdam set, the same day as Glamsterdam Sepolia.',
    done: true,
  },
]

export const TIMELINE_GROUPS: TimelineGroup[] = groupTimeline(TIMELINE_EVENTS)
