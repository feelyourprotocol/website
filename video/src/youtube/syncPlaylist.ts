import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { addVideoToNamedPlaylists } from './addToPlaylists.ts'
import { pickSearchHit, searchQueryForProject } from './matchSearchHit.ts'
import { parseYoutubeYml } from './parseYoutubeYml.ts'
import { playlistsForProject } from './topicPlaylist.ts'
import type { YoutubeShortMeta } from './types.ts'
import { shortsUrl, writePublished } from './writePublished.ts'
import type { YoutubeApi } from './youtubeApi.ts'

export interface PlaylistSyncResult {
  projectId: string
  videoId: string
  url: string
  playlists: string[]
  addedToPlaylist: boolean
  wrotePublished: boolean
  createdPlaylist: boolean
}

export async function resolveVideoId(
  meta: YoutubeShortMeta,
  api: YoutubeApi,
): Promise<string> {
  if (meta.published?.video_id) return meta.published.video_id
  const hits = await api.searchMine(searchQueryForProject(meta.id))
  return pickSearchHit(meta.title, meta.id, hits).videoId
}

export async function syncPlaylistProjects(
  projectsRoot: string,
  api: YoutubeApi,
  projectIds: string[],
): Promise<PlaylistSyncResult[]> {
  const dirs = projectIds.length
    ? projectIds.map((id) => join(projectsRoot, id))
    : readdirSync(projectsRoot)
        .map((name) => join(projectsRoot, name))
        .filter((dir) => existsSync(join(dir, 'youtube.yml')))

  const membership = new Map<string, Set<string>>()
  const results: PlaylistSyncResult[] = []

  for (const dir of dirs) {
    const ymlPath = join(dir, 'youtube.yml')
    if (!existsSync(ymlPath)) {
      throw new Error(`Missing ${ymlPath}`)
    }
    const raw = readFileSync(ymlPath, 'utf8')
    const meta = parseYoutubeYml(raw)
    const videoId = await resolveVideoId(meta, api)
    const details = await api.getVideo(videoId)
    const privacy = details?.privacy ?? meta.published?.privacy ?? 'public'
    const uploadedAt = details?.publishedAt ?? meta.published?.uploaded_at ?? new Date().toISOString()
    const titles = playlistsForProject(meta.id, meta.playlist)
    const { created, added } = await addVideoToNamedPlaylists(api, videoId, titles, membership)

    const published = {
      video_id: videoId,
      url: shortsUrl(videoId),
      privacy,
      uploaded_at: uploadedAt,
    }
    const next = writePublished(raw, published)
    const wrotePublished = next !== raw
    if (wrotePublished) writeFileSync(ymlPath, next)

    results.push({
      projectId: meta.id,
      videoId,
      url: published.url,
      playlists: titles,
      addedToPlaylist: added.length > 0,
      wrotePublished,
      createdPlaylist: created.length > 0,
    })
  }
  return results
}
