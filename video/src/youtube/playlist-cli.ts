#!/usr/bin/env node
import { join } from 'node:path'

import { loadVideoEnv } from '../loadEnv.ts'
import { refreshAccessToken } from './oauth.ts'
import { syncPlaylistProjects } from './syncPlaylist.ts'
import { resolveYoutubeClientConfig } from './uploadShort.ts'
import { createYoutubeApi } from './youtubeApi.ts'

const PROJECTS_ROOT = join(import.meta.dirname, '../../projects')

async function main(): Promise<void> {
  loadVideoEnv()
  const projectIds = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  const accessToken = await refreshAccessToken({
    ...resolveYoutubeClientConfig(process.env),
    fetch,
  })
  const results = await syncPlaylistProjects(
    PROJECTS_ROOT,
    createYoutubeApi(accessToken, fetch),
    projectIds,
  )
  for (const row of results) {
    const added = row.addedToPlaylist ? 'added' : 'already on playlist'
    const yaml = row.wrotePublished ? 'wrote published' : 'yaml unchanged'
    const created = row.createdPlaylist ? '; created playlist' : ''
    console.log(
      `${row.projectId}  ${row.url}  ${row.playlists.join(' · ')}  ${added}; ${yaml}${created}`,
    )
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
