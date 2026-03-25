import { EXPLORATIONS } from '@/explorations/REGISTRY'

/**
 * Expected format for exploration dates: "YYYY-MM-DD HH:mm" (24h, UTC).
 * This format is human-readable, minute-precise, and lexicographically sortable.
 */
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):[0-5]\d$/

export function isValidExplorationDate(dateStr: string): boolean {
  return DATE_RE.test(dateStr)
}

export function parseExplorationDate(dateStr: string): Date {
  if (!isValidExplorationDate(dateStr)) {
    throw new Error(`Invalid exploration date format: "${dateStr}" (expected "YYYY-MM-DD HH:mm")`)
  }
  return new Date(`${dateStr.replace(' ', 'T')}:00Z`)
}

/**
 * Returns exploration IDs sorted by their `added` date, newest first.
 * Falls back to lexicographic ID order for explorations with identical dates.
 */
export function latestExplorationIds(count: number): string[] {
  return Object.keys(EXPLORATIONS)
    .sort((a, b) => {
      const cmp = EXPLORATIONS[b].added.localeCompare(EXPLORATIONS[a].added)
      return cmp !== 0 ? cmp : a.localeCompare(b)
    })
    .slice(0, count)
}
