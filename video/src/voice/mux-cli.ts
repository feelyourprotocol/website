#!/usr/bin/env node
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { parseMuxArgs } from '../parseProjectArgs.ts'
import { finalMp4Path, formatOutputBanner } from '../outputPaths.ts'
import { muxVideoAudio } from '../voice/ffmpeg.ts'
import { voiceDir } from '../voice/synthesize.ts'

const PROJECTS_ROOT = join(import.meta.dirname, '../../projects')

function newestWebm(dir: string): string | undefined {
  if (!existsSync(dir)) return undefined
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => join(dir, f))
  if (!files.length) return undefined
  files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  return files[0]
}

function main(): void {
  let args: ReturnType<typeof parseMuxArgs>
  try {
    args = parseMuxArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  const projectDir = join(PROJECTS_ROOT, args.projectId)
  const outputDir = join(projectDir, 'output')
  const videoPath = args.input ?? newestWebm(outputDir)
  const audioPath = join(voiceDir(projectDir), 'full.mp3')

  if (!videoPath || !existsSync(videoPath)) {
    console.error('No video file found. Record first or pass --input path/to/video.webm')
    process.exit(1)
  }
  if (!existsSync(audioPath)) {
    console.error(`Missing ${audioPath}. Run: npm run video:voice:synth -- ${args.projectId}`)
    process.exit(1)
  }

  const outPath = args.output ?? finalMp4Path(videoPath)

  console.log(`Video: ${videoPath}`)
  console.log(`Audio: ${audioPath}`)
  console.log('Muxing…')
  muxVideoAudio(videoPath, audioPath, outPath)
  console.log(formatOutputBanner(outPath, videoPath))
}

main()
