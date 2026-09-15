import {
  SCIENCE_TECHNOLOGY_CATEGORY_ID,
  YOUTUBE_YML_SCHEMA,
  type YoutubePrivacy,
  type YoutubePublishedMeta,
  type YoutubeShortMeta,
  type YoutubeSourcesMeta,
  type YoutubeThumbnailMeta,
} from './types.ts'

const PRIVACY: ReadonlySet<string> = new Set(['public', 'unlisted', 'private'])

export function parseScalar(raw: string): string | number | boolean | null {
  const v = raw.trim()
  if (v === '' || v === '|' || v === '|-') {
    throw new Error(`parseScalar: expected a plain value, got ${JSON.stringify(raw)}`)
  }
  if (v === 'null' || v === '~') return null
  if (v === 'true') return true
  if (v === 'false') return false
  if (/^-?\d+$/.test(v)) return Number(v)
  if (/^-?\d+\.\d+$/.test(v)) return Number(v)
  if (v.length >= 2 && v.startsWith("'") && v.endsWith("'")) {
    return v.slice(1, -1).replace(/''/g, "'")
  }
  if (v.length >= 2 && v.startsWith('"') && v.endsWith('"')) {
    return v.slice(1, -1).replace(/\\"/g, '"')
  }
  return v
}

function isBlankOrComment(line: string): boolean {
  const t = line.trim()
  return t === '' || t.startsWith('#')
}

function readBlockScalar(lines: string[], start: number, strip: boolean): { text: string; next: number } {
  const body: string[] = []
  let i = start
  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() !== '' && !line.startsWith(' ') && !line.startsWith('\t')) break
    if (line.trim() === '') {
      body.push('')
    } else if (line.startsWith('  ')) {
      body.push(line.slice(2))
    } else {
      break
    }
    i++
  }
  while (body.length && body[body.length - 1] === '') body.pop()
  const joined = body.join('\n')
  return { text: strip ? joined : `${joined}\n`, next: i }
}

function readList(lines: string[], start: number): { items: string[]; next: number } {
  const items: string[] = []
  let i = start
  while (i < lines.length) {
    const line = lines[i]
    if (isBlankOrComment(line)) {
      i++
      continue
    }
    const m = line.match(/^  - (.+)$/)
    if (!m) break
    const value = parseScalar(m[1])
    items.push(value == null ? '' : String(value))
    i++
  }
  return { items, next: i }
}

function readMap(lines: string[], start: number): { map: Record<string, unknown>; next: number } {
  const map: Record<string, unknown> = {}
  let i = start
  while (i < lines.length) {
    const line = lines[i]
    if (isBlankOrComment(line)) {
      i++
      continue
    }
    const m = line.match(/^  ([a-z_]+):\s*(.*)$/)
    if (!m) break
    map[m[1]] = parseScalar(m[2])
    i++
  }
  return { map, next: i }
}

function asString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`youtube.yml: missing ${field}`)
  }
  return value
}

function asPrivacy(value: unknown): YoutubePrivacy {
  if (typeof value !== 'string' || !PRIVACY.has(value)) {
    throw new Error(`youtube.yml: published.privacy must be public, unlisted, or private`)
  }
  return value as YoutubePrivacy
}

function asThumbnail(map: Record<string, unknown>): YoutubeThumbnailMeta {
  const file = asString(map.file, 'thumbnail.file')
  const thumb: YoutubeThumbnailMeta = { file }
  if (typeof map.width === 'number') thumb.width = map.width
  if (typeof map.time_sec === 'number') thumb.time_sec = map.time_sec
  if (typeof map.source === 'string') thumb.source = map.source
  return thumb
}

function asSources(map: Record<string, unknown>): YoutubeSourcesMeta {
  const forkcast = map.forkcast_url
  if (forkcast !== null && typeof forkcast !== 'string') {
    throw new Error('youtube.yml: sources.forkcast_url must be a URL or null')
  }
  return {
    exploration_url: asString(map.exploration_url, 'sources.exploration_url'),
    spec_url: asString(map.spec_url, 'sources.spec_url'),
    forkcast_url: forkcast,
  }
}

function asPublished(map: Record<string, unknown>): YoutubePublishedMeta {
  return {
    video_id: asString(map.video_id, 'published.video_id'),
    url: asString(map.url, 'published.url'),
    privacy: asPrivacy(map.privacy),
    uploaded_at: asString(map.uploaded_at, 'published.uploaded_at'),
  }
}

/** Parse `video-short-youtube/v1` YAML (2-space indent, `|` / `|-` blocks, simple maps/lists). */
export function parseYoutubeYml(text: string): YoutubeShortMeta {
  const lines = text.split(/\r?\n/)
  const root: Record<string, unknown> = {}
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (isBlankOrComment(line)) {
      i++
      continue
    }
    const m = line.match(/^([a-z_]+):\s*(.*)$/)
    if (!m) {
      throw new Error(`youtube.yml: cannot parse line ${i + 1}`)
    }
    const key = m[1]
    const rest = m[2]
    i++

    if (rest === '|' || rest === '|-') {
      const block = readBlockScalar(lines, i, rest === '|-')
      root[key] = block.text
      i = block.next
      continue
    }
    if (rest === '') {
      if (key === 'tags') {
        const list = readList(lines, i)
        root[key] = list.items
        i = list.next
        continue
      }
      const nested = readMap(lines, i)
      root[key] = nested.map
      i = nested.next
      continue
    }
    root[key] = parseScalar(rest)
  }

  if (root.schema !== YOUTUBE_YML_SCHEMA) {
    throw new Error(`youtube.yml: expected schema ${YOUTUBE_YML_SCHEMA}`)
  }
  if (root.category !== 'Science & Technology') {
    throw new Error(
      `youtube.yml: category must be "Science & Technology" (YouTube id ${SCIENCE_TECHNOLOGY_CATEGORY_ID})`,
    )
  }
  if (!Array.isArray(root.tags) || root.tags.length === 0) {
    throw new Error('youtube.yml: tags must be a non-empty list')
  }

  const meta: YoutubeShortMeta = {
    schema: YOUTUBE_YML_SCHEMA,
    id: asString(root.id, 'id'),
    title: asString(root.title, 'title'),
    description: asString(root.description, 'description'),
    tags: root.tags.map(String),
    category: 'Science & Technology',
    playlist: asString(root.playlist, 'playlist'),
    thumbnail: asThumbnail((root.thumbnail ?? {}) as Record<string, unknown>),
    sources: asSources((root.sources ?? {}) as Record<string, unknown>),
  }
  if (root.published && typeof root.published === 'object') {
    meta.published = asPublished(root.published as Record<string, unknown>)
  }
  if (meta.title.length > 100) {
    throw new Error('youtube.yml: title exceeds 100 characters')
  }
  if (meta.description.length > 5000) {
    throw new Error('youtube.yml: description exceeds 5000 characters')
  }
  return meta
}
