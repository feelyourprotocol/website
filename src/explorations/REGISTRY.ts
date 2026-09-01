import type { ProtocolChangeMcpHints } from './canonicalTypes'
import { INFO as eip7594 } from './eip-7594/info'
import { INFO as eip7708 } from './eip-7708/info'
import { INFO as eip7883 } from './eip-7883/info'
import { INFO as eip7928 } from './eip-7928/info'
import { INFO as eip7951 } from './eip-7951/info'
import { INFO as eip8024 } from './eip-8024/info'
import type { Tag } from './TAGS'

export const EXPLORATIONS: Explorations = {
  [eip7594.id]: eip7594,
  [eip7708.id]: eip7708,
  [eip7883.id]: eip7883,
  [eip7928.id]: eip7928,
  [eip7951.id]: eip7951,
  [eip8024.id]: eip8024,
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
  /** Folder name and route key, e.g. `eip-7883`. Must match `src/explorations/<id>/`. */
  id: string
  /** URL path segment, e.g. `/eip-7883-modexp-gas`. Used in router and OG generation. */
  path: string
  /** Human-readable page title shown in the exploration shell. */
  title: string
  /** Link to the canonical spec (EIPs site, ERC, or research note). */
  infoURL: string
  /** Topic ID — fixed set in `TOPICS.ts` (scaling, privacy, ux, …). Drives card grouping and topic colors. */
  topic: string
  /** Timeline entry ID from `TIMELINE.ts` (hardfork or maturity stage). */
  timeline: string
  /** Up to 3–4 reusable technical concepts from `TAGS.ts`. See architecture § tags. */
  tags: Tag[]
  image?: string
  /** Optional thumbnail (~300px) for topic cards and compact layouts; same basename as `image` with `_small` suffix. */
  imageSmall?: string
  /** Optional max height for the cover image in the exploration sidebar (CSS length, e.g. `12rem`). */
  imageBoxHeight?: string
  /** When set, exploration content may Teleport into `#exploration-right-panel`. */
  rightPanel?: boolean
  /** Plain-text discovery copy for meta tags and static prerender (~120–160 chars). See contributing guide. */
  seoDescription?: string
  /** From `CANONICAL.question.coreQuestion` — home preview cards and bold intro lead. */
  coreQuestion: string
  /** From `CANONICAL.mcp.docsStatus` — optional home pill (Runnable / Planned). */
  mcpDocsStatus?: ProtocolChangeMcpHints['docsStatus']
  /** HTML intro shown above the widget — pedagogical framing, not SEO copy. */
  introText: string
  /** HTML instructions for using the widget below the intro. */
  usageText: string
  /** Optional attribution for the exploration author. */
  creatorName?: string
  /** Optional link for the exploration author. */
  creatorURL?: string
  /** Libraries or projects the widget runs on — shown in the exploration footer. */
  poweredBy: PoweredByItem[]
}
export interface Explorations {
  [key: string]: Exploration
}

export function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(Math.random() * items.length)]
}

export function getExplorationCoverImage(exploration: Exploration): string | undefined {
  return exploration.image
}

/** Thumbnail for home/topic cards and other compact layouts; falls back to cover image. */
export function getExplorationThumbnailImage(exploration: Exploration): string | undefined {
  if (!exploration.image) return undefined
  return exploration.imageSmall ?? exploration.image
}

export function getRandomExplorationWithImage(): Exploration | undefined {
  return pickRandom(Object.values(EXPLORATIONS).filter((e) => e.image))
}

export function getRandomTopicExplorationImage(topicId: string): string | undefined {
  const images = Object.values(EXPLORATIONS)
    .filter((e) => e.topic === topicId && e.image)
    .map((e) => getExplorationThumbnailImage(e)!)
  return pickRandom(images)
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
