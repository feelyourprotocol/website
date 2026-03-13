import { EXPLORATIONS } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'

export interface TagCloudItem {
  key: string
  label: string
  weight: number
  fontSize: number
}

const tagKeyMap = new Map<string, string>()
for (const [key, value] of Object.entries(Tag)) {
  tagKeyMap.set(value, key)
}

/**
 * Compute weighted tag cloud items from a set of exploration IDs.
 * Returns up to `maxTags` tags sorted alphabetically by label, each with a
 * font size linearly interpolated between `minRem` and `maxRem` based on
 * usage weight.
 */
export function computeTagCloud(
  explorationIds: string[],
  maxTags = 12,
  minRem = 0.8,
  maxRem = 1.6,
): TagCloudItem[] {
  const counts = new Map<string, number>()
  for (const id of explorationIds) {
    const exploration = EXPLORATIONS[id]
    if (!exploration) continue
    for (const tag of exploration.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }

  const items: TagCloudItem[] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxTags)
    .map(([tag, weight]) => ({
      key: tagKeyMap.get(tag)!,
      label: tag,
      weight,
      fontSize: 0,
    }))

  const maxWeight = Math.max(...items.map((i) => i.weight), 1)
  const minWeight = Math.min(...items.map((i) => i.weight), 1)
  const range = maxWeight - minWeight || 1

  for (const item of items) {
    const t = (item.weight - minWeight) / range
    item.fontSize = minRem + t * (maxRem - minRem)
  }

  items.sort((a, b) => a.label.localeCompare(b.label))
  return items
}
