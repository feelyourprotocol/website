#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { estimatePlaybookDurationMs, loadVideoProject, resolvePlaybook } from '../loadProject.ts'
import { buildStoryboard, printStoryboard, validateStoryboard } from '../storyboard.ts'
import { parseProjectArgs } from '../parseProjectArgs.ts'
import { voiceTimingSummary } from '../voice/mergeTiming.ts'
import { loadVoiceManifest } from '../voice/synthesize.ts'

const PROJECTS_ROOT = join(import.meta.dirname, '../../projects')

function main(): void {
  let projectId: string
  try {
    projectId = parseProjectArgs(process.argv.slice(2)).projectId
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    console.error('Usage: npm run voice:plan -- <project-id>')
    process.exit(1)
  }

  const projectDir = join(PROJECTS_ROOT, projectId)
  if (!existsSync(projectDir)) {
    console.error(`Unknown project: ${projectId}`)
    process.exit(1)
  }

  const manifest = loadVoiceManifest(projectDir)
  if (!manifest) {
    console.error(`No voice/manifest.json — run: npm run video:voice:synth -- ${projectId}`)
    process.exit(1)
  }

  const project = loadVideoProject(projectId, PROJECTS_ROOT)
  const playbook = resolvePlaybook(project)
  const timeline = buildStoryboard(playbook, project.content)

  console.log(`Project: ${projectId}`)
  console.log(`Voice track: ~${Math.round(manifest.totalDurationMs / 1000)}s`)
  console.log(`Video est.:  ~${Math.round(estimatePlaybookDurationMs(playbook) / 1000)}s (voice-synced)`)
  console.log('')
  console.log('Voice ↔ beat alignment')
  console.log('─'.repeat(56))
  let voiceCursor = 0
  for (const row of voiceTimingSummary(project.playbook, manifest)) {
    const at = formatTime(voiceCursor)
    console.log(
      `${at}  ${row.beat.padEnd(14)} voice ${(row.voiceMs / 1000).toFixed(1)}s  step ${(row.stepTotalMs / 1000).toFixed(1)}s`,
    )
    voiceCursor += row.stepTotalMs
  }
  console.log('─'.repeat(56))
  console.log('')
  printStoryboard(timeline)

  const issues = validateStoryboard(playbook, project.content, project.zones)
  if (issues.length) {
    console.log('\nValidation:')
    for (const issue of issues) {
      console.log(`  [${issue.severity.toUpperCase()}] step ${issue.step}: ${issue.message}`)
    }
  }
}

function formatTime(ms: number): string {
  const s = ms / 1000
  const m = Math.floor(s / 60)
  const r = s - m * 60
  return `${String(m).padStart(2, '0')}:${r.toFixed(1).padStart(4, '0')}`
}

main()
