import { INFO as eip7594 } from './eip-7594/info'
import { INFO as eip7883 } from './eip-7883/info'
import { INFO as eip7951 } from './eip-7951/info'
import { INFO as eip8141 } from './eip-8141/info'
import type { Tag } from './TAGS'

export const EXPLORATIONS: Explorations = {
  [eip7594.id]: eip7594,
  [eip7883.id]: eip7883,
  [eip7951.id]: eip7951,
  [eip8141.id]: eip8141,
}

export interface Examples {
  [key: string]: {
    title: string
    values: string[]
  }
}

export interface PoweredByItem {
  name: string
  href: string
}

export interface Exploration {
  id: string
  path: string
  title: string
  infoURL: string
  topic: string
  timeline: string
  tags: Tag[]
  /** Date when the exploration was added, format: "YYYY-MM-DD HH:mm" (UTC). */
  added: string
  image?: string
  introText: string
  usageText: string
  creatorName?: string
  creatorURL?: string
  poweredBy: PoweredByItem[]
}
export interface Explorations {
  [key: string]: Exploration
}

export function getRandomTopicExplorationImage(topicId: string): string | undefined {
  const images = Object.values(EXPLORATIONS)
    .filter((e) => e.topic === topicId && e.image)
    .map((e) => e.image!)
  return images.length > 0 ? images[Math.floor(Math.random() * images.length)] : undefined
}

export function getTopicExplorationIds(topicId: string): string[] {
  const ids: string[] = []
  for (const [id, exploration] of Object.entries(EXPLORATIONS)) {
    if (exploration.topic === topicId) {
      ids.push(id)
    }
  }
  return ids
}
