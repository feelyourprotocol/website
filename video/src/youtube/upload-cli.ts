#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { loadVideoEnv } from '../loadEnv.ts'
import { parseUploadArgs, UPLOAD_USAGE } from './parseUploadArgs.ts'
import { planUpload, resolveYoutubeClientConfig, uploadShort } from './uploadShort.ts'

const PROJECTS_ROOT = join(import.meta.dirname, '../../projects')

async function main(): Promise<void> {
  loadVideoEnv()

  let args: ReturnType<typeof parseUploadArgs>
  try {
    args = parseUploadArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    if (!(err instanceof Error && err.message.includes('Usage:'))) {
      console.error(UPLOAD_USAGE)
    }
    process.exit(1)
  }

  const projectDir = join(PROJECTS_ROOT, args.projectId)
  if (!existsSync(projectDir)) {
    console.error(`Unknown project: ${args.projectId}`)
    process.exit(1)
  }

  const plan = planUpload(projectDir, args.privacy, args.skipPlaylist)
  console.log(`Project:  ${plan.meta.id}`)
  console.log(`Title:    ${plan.meta.title}`)
  console.log(`Privacy:  ${plan.privacy}`)
  console.log(`Video:    ${plan.videoPath}`)
  console.log(`Thumb:    ${plan.thumbPath}`)
  console.log(`Playlist: ${args.skipPlaylist ? '(skipped)' : plan.meta.playlist}`)
  if (plan.alreadyPublished) {
    console.log(`Existing: ${plan.meta.published!.url}`)
  }

  if (args.dryRun) {
    if (plan.alreadyPublished && !args.force) {
      const same = plan.meta.published!.privacy === args.privacy
      console.log(same ? 'Dry run: would skip (already published).' : 'Dry run: would update privacy.')
    } else {
      console.log('Dry run: would upload.')
    }
    return
  }

  const result = await uploadShort(
    projectDir,
    {
      privacy: args.privacy,
      force: args.force,
      skipPlaylist: args.skipPlaylist,
      config: resolveYoutubeClientConfig(process.env),
    },
    { fetch, now: () => new Date(), envPlaylistId: process.env.YOUTUBE_PLAYLIST_ID },
  )

  console.log(`${result.action}: ${result.url}`)
  for (const warning of result.warnings) {
    console.warn(warning)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
