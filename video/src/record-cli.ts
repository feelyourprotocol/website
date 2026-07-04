import './bootstrap-playwright-env.ts'

import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { estimatePlaybookDurationMs, loadVideoProject, resolvePlaybook } from './loadProject.ts'
import { buildStoryboard, printStoryboard, validateStoryboard } from './storyboard.ts'
import { parseRecordCliArgs } from './parseRecordArgs.ts'

const WEBSITE_ROOT = join(import.meta.dirname, '../..')
const DIST_DIR = join(WEBSITE_ROOT, 'dist')
const PROJECTS_ROOT = join(import.meta.dirname, '../projects')

function runDryRun(projectId: string): void {
  const project = loadVideoProject(projectId, PROJECTS_ROOT)
  if (project.voiceManifest) {
    console.log(`Voice timing: ${join(project.projectDir, 'voice/manifest.json')}`)
  }
  const timeline = buildStoryboard(project.playbook, project.content)

  console.log(`Project: ${projectId}`)
  console.log(`Est. duration: ~${Math.round(estimatePlaybookDurationMs(project.playbook) / 1000)}s`)
  printStoryboard(timeline)
  const issues = validateStoryboard(project.playbook, project.content, project.zones)
  if (issues.length) {
    console.log('\nValidation:')
    for (const issue of issues) {
      console.log(`  [${issue.severity.toUpperCase()}] step ${issue.step}: ${issue.message}`)
    }
  }
}

async function main(): Promise<void> {
  let args: ReturnType<typeof parseRecordCliArgs>
  try {
    args = parseRecordCliArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  const projectDir = join(PROJECTS_ROOT, args.projectId)
  if (!existsSync(projectDir)) {
    console.error(`Unknown project: ${args.projectId}`)
    console.error(`Expected: video/projects/${args.projectId}/`)
    process.exit(1)
  }

  if (args.dryRun) {
    runDryRun(args.projectId)
    return
  }

  if (!existsSync(join(DIST_DIR, 'website'))) {
    console.error('Website build not found. Run first: npm run website:build')
    process.exit(1)
  }

  const { recordVideo } = await import('./recordVideo.ts')
  await recordVideo(args.projectId, {
    preview: args.preview,
    dryRun: false,
    distDir: DIST_DIR,
    projectsRoot: PROJECTS_ROOT,
    noVoice: args.noVoice,
  })
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
