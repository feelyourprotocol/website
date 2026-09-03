#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { loadVideoEnv } from '../loadEnv.ts'
import { parseProjectArgs } from '../parseProjectArgs.ts'
import { synthesizeProjectVoice } from '../voice/synthesize.ts'

const PROJECTS_ROOT = join(import.meta.dirname, '../../projects')

async function main(): Promise<void> {
  loadVideoEnv()

  let projectId: string
  try {
    projectId = parseProjectArgs(process.argv.slice(2)).projectId
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    console.error('Usage: npm run voice:synth -- <project-id> [--force]')
    process.exit(1)
  }

  const force = process.argv.includes('--force')
  const projectDir = join(PROJECTS_ROOT, projectId)
  if (!existsSync(projectDir)) {
    console.error(`Unknown project: ${projectId}`)
    process.exit(1)
  }

  console.log(`Synthesizing voice for ${projectId}…`)
  const manifest = await synthesizeProjectVoice(projectDir, { force })

  console.log(`\nWrote ${join(projectDir, 'voice/full.mp3')}`)
  console.log(`Wrote ${join(projectDir, 'voice/manifest.json')}`)
  console.log(`Total voice: ~${Math.round(manifest.totalDurationMs / 100) / 10}s`)
  for (const [beat, timing] of Object.entries(manifest.beats)) {
    console.log(`  ${beat}: ${(timing.durationMs / 1000).toFixed(1)}s`)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
