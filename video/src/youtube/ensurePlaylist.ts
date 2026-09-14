import type { YoutubePrivacy } from './types.ts'
import type { YoutubeApi } from './youtubeApi.ts'

export const PLAYLIST_DESCRIPTION = 'Feel Your Protocol exploration Shorts.'

export async function ensurePlaylistId(
  api: Pick<YoutubeApi, 'findPlaylistIdByTitle' | 'createPlaylist'>,
  title: string,
  privacy: YoutubePrivacy = 'public',
): Promise<{ playlistId: string; created: boolean }> {
  const existing = await api.findPlaylistIdByTitle(title)
  if (existing) return { playlistId: existing, created: false }
  const created = await api.createPlaylist({
    title,
    description: PLAYLIST_DESCRIPTION,
    privacy,
  })
  return { playlistId: created.id, created: true }
}
