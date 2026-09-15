import { ensurePlaylistId } from './ensurePlaylist.ts'
import type { YoutubeApi } from './youtubeApi.ts'

export function isAlreadyInPlaylistError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return /already/i.test(msg) || /HTTP 409/.test(msg)
}

export interface AddToPlaylistsResult {
  created: string[]
  added: string[]
}

/**
 * Ensure each named playlist exists and contains `videoId`.
 * `membership` caches video ids per playlist id across calls in one sync run.
 */
export async function addVideoToNamedPlaylists(
  api: YoutubeApi,
  videoId: string,
  titles: string[],
  membership: Map<string, Set<string>> = new Map(),
): Promise<AddToPlaylistsResult> {
  const created: string[] = []
  const added: string[] = []
  for (const title of titles) {
    const ensured = await ensurePlaylistId(api, title)
    if (ensured.created) created.push(title)
    let ids = membership.get(ensured.playlistId)
    if (!ids) {
      ids = ensured.created
        ? new Set()
        : new Set(await api.listPlaylistVideoIds(ensured.playlistId))
      membership.set(ensured.playlistId, ids)
    }
    if (ids.has(videoId)) continue
    try {
      await api.insertPlaylistItem({ playlistId: ensured.playlistId, videoId })
      ids.add(videoId)
      added.push(title)
    } catch (err) {
      if (!isAlreadyInPlaylistError(err)) throw err
    }
  }
  return { created, added }
}
