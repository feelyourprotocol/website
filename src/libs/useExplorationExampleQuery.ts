import { useRoute } from 'vue-router'

import { parseExampleQueryParam } from '@/libs/exampleFromQuery'

/** Read `?example=` from the current route for exploration deep-linking. */
export function useExplorationExampleQuery(): string | undefined {
  const route = useRoute()
  return parseExampleQueryParam(route.query?.example)
}
