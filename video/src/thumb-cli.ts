#!/usr/bin/env node
/**
 * Extract a YouTube Shorts custom thumbnail from a muxed *-final.mp4.
 *
 * Defaults: frame @ 1.5 s (title-card window), JPEG @ 1280×2276 (9:16).
 * YouTube's thumbnail validator expects width ≥ 1280 and JPG/PNG/GIF/BMP under 2 MB;
 * a raw PNG grab at 1080×960 often fails silently in Studio's upload picker.
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

import { parseProjectArgs } from './parseProjectArgs.ts'
import { assertFfmpeg } from './voice/ffmpeg.ts'

const PROJECTS_ROOT = join(import.meta.dirname, '../projects')
const DEFAULT_TIME_SEC = 1.5
/** 9:16 at width 1280 → 1280×2276 — meets YouTube's ≥1280 px width floor for thumbnails. */
const YOUTUBE_SHORTS_THUMB_WIDTH = 1280

interface ThumbArgs {
  projectId: string
  input?: string
  output?: string
  timeSec: number
  width: number
}

function parseThumbArgs(argv: string[]): ThumbArgs {
  const { projectId, flags } = parseProjectArgs(argv)
  if (flags.includes('--help')) {
    throw new Error(
      'Usage: npm run thumb -- <project-id> [--time 1.5] [--width 1280] [--input <mp4>] [--output <jpg>]',
    )
  }
  let input: string | undefined
  let output: string | undefined
  let timeSec = DEFAULT_TIME_SEC
  let width = YOUTUBE_SHORTS_THUMB_WIDTH
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--input') input = argv[i + 1]
    if (argv[i] === '--output') output = argv[i + 1]
    if (argv[i] === '--time') timeSec = Number.parseFloat(argv[i + 1] ?? '')
    if (argv[i] === '--width') width = Number.parseInt(argv[i + 1] ?? '', 10)
  }
  if (!Number.isFinite(timeSec) || timeSec < 0) {
    throw new Error(`--time must be a non-negative number of seconds (got "${argv.join(' ')}")`)
  }
  if (!Number.isFinite(width) || width < 640) {
    throw new Error(`--width must be an integer ≥ 640 (got "${argv.join(' ')}")`)
  }
  return { projectId, input, output, timeSec, width }
}

function newestFinalMp4(dir: string): string | undefined {
  if (!existsSync(dir)) return undefined
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('-final.mp4'))
    .map((f) => join(dir, f))
  if (!files.length) return undefined
  files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  return files[0]
}

function thumbPath(finalMp4: string): string {
  // `<id>-<ts>-final.mp4` → `<id>-<ts>-final-thumb.jpg`
  return finalMp4.replace(/\.mp4$/i, '-thumb.jpg')
}

/** Drop legacy `-final-thumb.png` when we emit `-final-thumb.jpg` for the same generation. */
function removeLegacyPngThumb(jpgPath: string): void {
  const legacy = jpgPath.replace(/\.jpg$/i, '.png')
  if (legacy !== jpgPath && existsSync(legacy)) unlinkSync(legacy)
}

function main(): void {
  let args: ThumbArgs
  try {
    args = parseThumbArgs(process.argv.slice(2))
  } catch (err) {
    console.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  const projectDir = join(PROJECTS_ROOT, args.projectId)
  const outputDir = join(projectDir, 'output')
  const inputPath = args.input ?? newestFinalMp4(outputDir)
  if (!inputPath || !existsSync(inputPath)) {
    console.error(
      `No *-final.mp4 found in ${outputDir}. Mux first: npm run video:voice:mux -- ${args.projectId}`,
    )
    process.exit(1)
  }

  const outPath = args.output ?? thumbPath(inputPath)
  assertFfmpeg()

  const ffArgs = [
    '-y',
    '-ss',
    String(args.timeSec),
    '-i',
    inputPath,
    '-vf',
    `scale=${args.width}:-2:flags=lanczos`,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    outPath,
  ]

  console.log(`Input:  ${inputPath}`)
  console.log(`Frame:  t=${args.timeSec}s @ ${args.width}px wide (9:16)`)
  console.log(`Output: ${outPath}`)
  execFileSync('ffmpeg', ffArgs, { stdio: 'ignore' })
  removeLegacyPngThumb(outPath)
  console.log('Done.')
}

main()
