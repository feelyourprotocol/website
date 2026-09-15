import { parseProjectArgs } from '../parseProjectArgs.ts'
import type { YoutubePrivacy } from './types.ts'

const PRIVACY: ReadonlySet<string> = new Set(['public', 'unlisted', 'private'])

export const UPLOAD_USAGE =
  'Usage: npm run video:youtube:upload -- <project-id> [--privacy unlisted|public|private] [--dry-run] [--force] [--skip-playlist]'

export interface YoutubeUploadCliArgs {
  projectId: string
  privacy: YoutubePrivacy
  dryRun: boolean
  force: boolean
  skipPlaylist: boolean
}

export function parseUploadArgs(argv: string[]): YoutubeUploadCliArgs {
  const { projectId, flags } = parseProjectArgs(argv)
  if (flags.includes('--help')) {
    throw new Error(UPLOAD_USAGE)
  }

  let privacy: YoutubePrivacy = 'unlisted'
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--privacy') {
      const raw = argv[i + 1]
      if (!raw || raw.startsWith('-') || !PRIVACY.has(raw)) {
        throw new Error(`--privacy must be public, unlisted, or private. ${UPLOAD_USAGE}`)
      }
      privacy = raw as YoutubePrivacy
    }
  }

  return {
    projectId,
    privacy,
    dryRun: flags.includes('--dry-run'),
    force: flags.includes('--force'),
    skipPlaylist: flags.includes('--skip-playlist'),
  }
}
