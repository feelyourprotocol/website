import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { buildVideoResource } from './buildVideoResource.ts'
import { refreshAccessToken } from './oauth.ts'
import { parseYoutubeYml } from './parseYoutubeYml.ts'
import { resolveUploadFiles } from './resolveUploadFiles.ts'
import type { YoutubeClientConfig, YoutubePrivacy, YoutubeShortMeta } from './types.ts'
import { shortsUrl, writePublished } from './writePublished.ts'
import { createYoutubeApi, type YoutubeApi } from './youtubeApi.ts'

export function resolveYoutubeClientConfig(env: NodeJS.ProcessEnv): YoutubeClientConfig {
  const clientId = env.YOUTUBE_CLIENT_ID?.trim()
  const clientSecret = env.YOUTUBE_CLIENT_SECRET?.trim()
  const refreshToken = env.YOUTUBE_REFRESH_TOKEN?.trim()
  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET. Copy video/.env.example keys into video/.env and run npm run video:youtube:auth.',
    )
  }
  if (!refreshToken) {
    throw new Error(
      'Missing YOUTUBE_REFRESH_TOKEN. Run npm run video:youtube:auth (browser sign-in as the @FeelEthereum channel).',
    )
  }
  return { clientId, clientSecret, refreshToken }
}

export interface UploadPlan {
  meta: YoutubeShortMeta
  videoPath: string
  thumbPath: string
  privacy: YoutubePrivacy
  skipPlaylist: boolean
  alreadyPublished: boolean
}

export function planUpload(
  projectDir: string,
  privacy: YoutubePrivacy,
  skipPlaylist: boolean,
): UploadPlan {
  const ymlPath = join(projectDir, 'youtube.yml')
  if (!existsSync(ymlPath)) {
    throw new Error(`Missing ${ymlPath}`)
  }
  const meta = parseYoutubeYml(readFileSync(ymlPath, 'utf8'))
  const files = resolveUploadFiles(projectDir, meta)
  return {
    meta,
    ...files,
    privacy,
    skipPlaylist,
    alreadyPublished: Boolean(meta.published?.video_id),
  }
}

export interface UploadResult {
  videoId: string
  url: string
  action: 'uploaded' | 'skipped' | 'privacy-updated'
  warnings: string[]
}

export interface UploadShortDeps {
  fetch: typeof fetch
  now: () => Date
  createApi?: (accessToken: string, fetchImpl: typeof fetch) => YoutubeApi
  readFile?: (path: string) => Uint8Array
  writeFile?: (path: string, text: string) => void
  envPlaylistId?: string
}

export async function uploadShort(
  projectDir: string,
  opts: {
    privacy: YoutubePrivacy
    force: boolean
    skipPlaylist: boolean
    config: YoutubeClientConfig
  },
  deps: UploadShortDeps,
): Promise<UploadResult> {
  const plan = planUpload(projectDir, opts.privacy, opts.skipPlaylist)
  const ymlPath = join(projectDir, 'youtube.yml')
  const warnings: string[] = []

  if (plan.alreadyPublished && !opts.force) {
    const existingId = plan.meta.published!.video_id
    const url = plan.meta.published!.url || shortsUrl(existingId)
    if (plan.meta.published!.privacy === opts.privacy) {
      return { videoId: existingId, url, action: 'skipped', warnings }
    }
    const accessToken = await refreshAccessToken({ ...opts.config, fetch: deps.fetch })
    const api = (deps.createApi ?? createYoutubeApi)(accessToken, deps.fetch)
    await api.updatePrivacy({ videoId: existingId, privacy: opts.privacy })
    persistPublished(ymlPath, plan.meta, existingId, opts.privacy, deps)
    return { videoId: existingId, url, action: 'privacy-updated', warnings }
  }

  const accessToken = await refreshAccessToken({ ...opts.config, fetch: deps.fetch })
  const api = (deps.createApi ?? createYoutubeApi)(accessToken, deps.fetch)

  let playlistId: string | undefined
  if (!opts.skipPlaylist) {
    playlistId = deps.envPlaylistId?.trim() || (await api.findPlaylistIdByTitle(plan.meta.playlist))
    if (!playlistId) {
      throw new Error(
        `YouTube playlist not found: "${plan.meta.playlist}". Create it once in Studio, or pass --skip-playlist.`,
      )
    }
  }

  const readFile = deps.readFile ?? ((p: string) => new Uint8Array(readFileSync(p)))
  const videoBytes = readFile(plan.videoPath)
  const { id: videoId } = await api.insertVideo({
    metadata: buildVideoResource(plan.meta, opts.privacy),
    videoBytes,
  })
  const url = shortsUrl(videoId)

  try {
    await api.setThumbnail({ videoId, jpegBytes: readFile(plan.thumbPath) })
  } catch (err) {
    warnings.push(`Thumbnail upload failed: ${err instanceof Error ? err.message : String(err)}`)
  }

  if (playlistId) {
    try {
      await api.insertPlaylistItem({ playlistId, videoId })
    } catch (err) {
      warnings.push(`Playlist add failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  persistPublished(ymlPath, plan.meta, videoId, opts.privacy, deps)
  return { videoId, url, action: 'uploaded', warnings }
}

function persistPublished(
  ymlPath: string,
  meta: YoutubeShortMeta,
  videoId: string,
  privacy: YoutubePrivacy,
  deps: UploadShortDeps,
): void {
  const writeFile = deps.writeFile ?? writeFileSync
  const now = deps.now()
  const current = readFileSync(ymlPath, 'utf8')
  const next = writePublished(current, {
    video_id: videoId,
    url: shortsUrl(videoId),
    privacy,
    uploaded_at: now.toISOString(),
  })
  writeFile(ymlPath, next)
  meta.published = {
    video_id: videoId,
    url: shortsUrl(videoId),
    privacy,
    uploaded_at: now.toISOString(),
  }
}
