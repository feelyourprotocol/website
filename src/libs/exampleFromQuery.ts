import type { Examples } from '@/explorations/REGISTRY'

/** URL query key for deep-linking to a specific exploration example preset. */
export const EXAMPLE_QUERY_PARAM = 'example'

/**
 * Parse the `?example=` query value from vue-router's `route.query`.
 * Returns `undefined` when absent or not a non-empty string.
 */
export function parseExampleQueryParam(value: unknown): string | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined
  return value
}

/**
 * Resolve which example key to load on exploration init.
 *
 * - Uses `queryExample` when it matches a key in `examples`.
 * - Falls back to `defaultExample` when the query is missing or invalid.
 */
export function resolveInitialExample(
  examples: Examples,
  defaultExample: string,
  queryExample?: string,
): string {
  if (queryExample !== undefined && queryExample in examples) {
    return queryExample
  }
  return defaultExample in examples ? defaultExample : (Object.keys(examples)[0] ?? '')
}
