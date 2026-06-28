import { existsSync, readdirSync,readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

import { EXPLORATIONS_DIR, TOPICS_FILE, WEBSITE_ROOT } from './config.ts'
import type { TopicColor } from './topic-colors.ts'
import { TOPIC_PALETTES } from './topic-colors.ts'

export interface ExplorationOgData {
  id: string
  title: string
  specLabel: string
  seoDescription: string
  topicId: string
  topicTitle: string
  topicColor: TopicColor
  palette: (typeof TOPIC_PALETTES)[TopicColor]
  coverUrl: string | null
}

export interface TopicOgData {
  id: string
  title: string
  pageTitle: string
  introText: string
  color: TopicColor
  palette: (typeof TOPIC_PALETTES)[TopicColor]
  explorationCount: number
  coverUrls: string[]
}

const TOPIC_IDS = ['scaling', 'privacy', 'ux', 'security', 'robustness', 'interoperability'] as const

function unescapeJs(value: string): string {
  return value.replace(/\\(['"\\])/g, '$1').replace(/\\n/g, ' ')
}

function matchSingle(source: string, key: string): string | undefined {
  const re = new RegExp(`${key}\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'`)
  const m = source.match(re)
  return m ? unescapeJs(m[1]) : undefined
}

export function formatEipSpecLabel(explorationId: string): string {
  const match = /^eip-(\d+)$/i.exec(explorationId)
  return match ? `EIP-${match[1]}` : explorationId.toUpperCase()
}

function truncate(text: string, maxLength = 140): string {
  if (text.length <= maxLength) return text
  const cut = text.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

function toPublicUrl(absolutePath: string): string {
  const rel = relative(WEBSITE_ROOT, absolutePath).split('\\').join('/')
  return `/${rel}`
}

export function findCoverImagePath(explorationId: string): string | null {
  const dir = join(EXPLORATIONS_DIR, explorationId)
  if (!existsSync(dir)) return null

  const preferred = ['image.webp', 'image.jpg', 'image.jpeg', 'image.png']
  for (const name of preferred) {
    const file = join(dir, name)
    if (existsSync(file)) return toPublicUrl(file)
  }

  const fallback = readdirSync(dir).find((name) => /^image\.(webp|jpe?g|png)$/i.test(name))
  return fallback ? toPublicUrl(join(dir, fallback)) : null
}

function matchConcat(source: string, key: string): string | undefined {
  const re = new RegExp(
    `${key}\\s*:\\s*((?:(?:'(?:[^'\\\\]|\\\\.)*'|"(?:[^"\\\\]|\\\\.)*")\\s*\\+?\\s*)+)`,
  )
  const m = source.match(re)
  if (!m) return undefined
  const parts: string[] = []
  for (const p of m[1].matchAll(/'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g)) {
    parts.push(unescapeJs(p[1] ?? p[2] ?? ''))
  }
  return parts.join('')
}

function readTopicBlock(source: string, topicId: string): string | undefined {
  const re = new RegExp(`${topicId}:\\s*\\{([\\s\\S]*?)\\n  \\},`)
  return source.match(re)?.[1]
}

function readTopicMeta(topicId: string): {
  title: string
  color: TopicColor
  introText: string
} {
  const source = readFileSync(TOPICS_FILE, 'utf8')
  const block = readTopicBlock(source, topicId)
  if (!block) {
    throw new Error(`Topic "${topicId}" not found in TOPICS.ts`)
  }

  const title = matchSingle(block, 'title')
  const color = matchSingle(block, 'color') as TopicColor | undefined
  const introText = matchConcat(block, 'introText') ?? matchSingle(block, 'introText')
  if (!title || !color || !introText) {
    throw new Error(`Failed to parse topic "${topicId}" from TOPICS.ts`)
  }

  return { title, color, introText }
}

function listExplorationIdsForTopic(topicId: string): string[] {
  const ids: string[] = []
  if (!existsSync(EXPLORATIONS_DIR)) return ids

  for (const entry of readdirSync(EXPLORATIONS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('eip-')) continue
    const infoFile = join(EXPLORATIONS_DIR, entry.name, 'info.ts')
    if (!existsSync(infoFile)) continue
    const source = readFileSync(infoFile, 'utf8')
    if (matchSingle(source, 'topic') === topicId) {
      ids.push(entry.name)
    }
  }
  return ids.sort()
}

export function readExplorationOgData(id: string): ExplorationOgData {
  const file = join(EXPLORATIONS_DIR, id, 'info.ts')
  let source: string
  try {
    source = readFileSync(file, 'utf8')
  } catch {
    throw new Error(`Could not read ${file} — is "${id}" a valid exploration id?`)
  }

  const title = matchSingle(source, 'title')
  const topicId = matchSingle(source, 'topic')
  if (!title || !topicId) {
    throw new Error(`Failed to parse title/topic from ${file}`)
  }

  const topic = readTopicMeta(topicId)
  const seoDescription =
    matchSingle(source, 'seoDescription') ??
    truncate(
      `Interactive Ethereum explainer for ${formatEipSpecLabel(id)}: ${title.replace(new RegExp(`^${formatEipSpecLabel(id)}\\s*`, 'i'), '').trim() || title}. Run real protocol libraries in your browser.`,
    )

  return {
    id,
    title,
    specLabel: formatEipSpecLabel(id),
    seoDescription: truncate(seoDescription, 160),
    topicId,
    topicTitle: topic.title,
    topicColor: topic.color,
    palette: TOPIC_PALETTES[topic.color],
    coverUrl: findCoverImagePath(id),
  }
}

export function readTopicOgData(topicId: string): TopicOgData {
  if (!TOPIC_IDS.includes(topicId as (typeof TOPIC_IDS)[number])) {
    throw new Error(
      `Unknown topic "${topicId}". Expected one of: ${TOPIC_IDS.join(', ')}`,
    )
  }

  const topic = readTopicMeta(topicId)
  const explorationIds = listExplorationIdsForTopic(topicId)
  const coverUrls = explorationIds
    .map((id) => findCoverImagePath(id))
    .filter((url): url is string => url !== null)
    .slice(0, 4)

  return {
    id: topicId,
    title: topic.title,
    pageTitle: `Ethereum ${topic.title}`,
    introText: truncate(topic.introText, 180),
    color: topic.color,
    palette: TOPIC_PALETTES[topic.color],
    explorationCount: explorationIds.length,
    coverUrls,
  }
}

export function listAllExplorationIds(): string[] {
  if (!existsSync(EXPLORATIONS_DIR)) return []
  return readdirSync(EXPLORATIONS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && existsSync(join(EXPLORATIONS_DIR, entry.name, 'info.ts')))
    .map((entry) => entry.name)
    .sort()
}

export function listAllTopicIds(): string[] {
  return [...TOPIC_IDS]
}
