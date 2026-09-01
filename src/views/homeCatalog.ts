import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { TIMELINE } from '@/explorations/TIMELINE'

/** Newest-first order for home Latest + catalog remainder. Prepend new ids here. */
export const FEATURED_EXPLORATION_IDS = [
  'eip-7708',
  'eip-7928',
  'eip-8024',
  'eip-7883',
  'eip-7594',
  'eip-7951',
]

export const LATEST_COUNT = 3

export function latestExplorationIds(
  featured: string[] = FEATURED_EXPLORATION_IDS,
  count = LATEST_COUNT,
): string[] {
  return featured.slice(0, count)
}

/** Featured ids after Latest, then any registry id not listed in featured. */
export function catalogExplorationIds(featured: string[] = FEATURED_EXPLORATION_IDS): string[] {
  const featuredSet = new Set(featured)
  const restOfFeatured = featured.slice(LATEST_COUNT)
  const unlisted = Object.keys(EXPLORATIONS).filter((id) => !featuredSet.has(id))
  return [...restOfFeatured, ...unlisted]
}

/** Hardfork / timeline titles currently represented in the catalog, oldest-first. */
export function catalogForkLabels(): string[] {
  const ids = new Set(Object.values(EXPLORATIONS).map((exploration) => exploration.timeline))
  return [...ids]
    .map((id) => TIMELINE[id])
    .filter((entry): entry is NonNullable<typeof entry> => entry !== undefined)
    .sort((a, b) => a.order - b.order)
    .map((entry) => entry.title)
}
