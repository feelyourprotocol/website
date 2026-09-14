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

/** Insert or replace the top-level `published:` mapping. Preserves the rest of the file. */
export function writePublished(ymlText: string, published: YoutubePublishedMeta): string {
  const block = formatPublishedBlock(published)
  const replaced = ymlText.replace(/(?:^|\n)published:\n(?:  .*\n?)*/m, `\n${block}\n`)
  if (replaced !== ymlText) return replaced.replace(/\n+$/, '\n')
  return `${ymlText.replace(/\n+$/, '')}\n\n${block}\n`
}

export function shortsUrl(videoId: string): string {
  return `https://www.youtube.com/shorts/${videoId}`
}
