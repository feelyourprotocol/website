import './bootstrap-playwright-env.ts'

import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { generateVideo } from './generateVideo.ts'
import { parseGenerateCliArgs } from './parseGenerateArgs.ts'

const WEBSITE_ROOT = join(import.meta.dirname, '../..')
const DIST_DIR = join(WEBSITE_ROOT, 'dist')
const PROJECTS_ROOT = join(import.meta.dirname, '../projects')

async function main(): Promise<void> {
  let args: ReturnType<typeof parseGenerateCliArgs>
  try {
    args = parseGenerateCliArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  const projectDir = join(PROJECTS_ROOT, args.projectId)
  if (!existsSync(projectDir)) {
    console.error(`Unknown project: ${args.projectId}`)
    process.exit(1)
  }

  if (!existsSync(join(DIST_DIR, 'website'))) {
    console.error('Website build not found. Run: npm run video:generate -- <project-id>')
    console.error('(includes website:build automatically when run from website/)')
    process.exit(1)
  }

  await generateVideo(args.projectId, {
    preview: args.preview,
    forceSynth: args.forceSynth,
    skipSynth: args.skipSynth,
    distDir: DIST_DIR,
    projectsRoot: PROJECTS_ROOT,
  })
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
