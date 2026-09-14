import type { YoutubePublishedMeta } from './types.ts'

export function formatPublishedBlock(published: YoutubePublishedMeta): string {
  return [
    'published:',
    `  video_id: ${published.video_id}`,
    `  url: ${published.url}`,
    `  privacy: ${published.privacy}`,
    `  uploaded_at: ${published.uploaded_at}`,
  ].join('\n')
}

function stripPublishedBlocks(ymlText: string): string {
  const lines = ymlText.split(/\r?\n/)
  const out: string[] = []
  for (let i = 0; i < lines.length; i++) {
    if (lines[i] === 'published:') {
      i++
      while (i < lines.length && lines[i].startsWith('  ')) i++
      i--
      continue
    }
    out.push(lines[i])
  }
  return out.join('\n').replace(/\n+$/, '')
}

/** Insert or replace the top-level `published:` mapping. Preserves the rest of the file. */
export function writePublished(ymlText: string, published: YoutubePublishedMeta): string {
  const block = formatPublishedBlock(published)
  return `${stripPublishedBlocks(ymlText)}\n\n${block}\n`
}

export function shortsUrl(videoId: string): string {
  return `https://www.youtube.com/shorts/${videoId}`
}
