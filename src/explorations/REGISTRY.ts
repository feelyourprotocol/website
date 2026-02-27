import { INFO as eip7594 } from './eip-7594/info'
import { INFO as eip7883 } from './eip-7883/info'
import { INFO as eip7951 } from './eip-7951/info'

export const EXPLORATIONS: Explorations = {
  [eip7594.id]: eip7594,
  [eip7883.id]: eip7883,
  [eip7951.id]: eip7951,
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
  image?: string
  introText: string
  usageText: string
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
