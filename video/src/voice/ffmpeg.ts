import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export function assertFfmpeg(): void {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
  } catch {
    throw new Error('ffmpeg is required. Install ffmpeg and retry.')
  }
}

export function writeSilenceMp3(path: string, durationSec: number): void {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-f',
      'lavfi',
      '-i',
      'anullsrc=r=44100:cl=mono',
      '-t',
      String(durationSec),
      '-q:a',
      '9',
      '-acodec',
      'libmp3lame',
      path,
    ],
    { stdio: 'ignore' },
  )
}

/** Concatenate mp3 files with optional silence gaps between them. */
export function concatMp3Files(outputPath: string, parts: string[], gapMs: number): void {
  assertFfmpeg()
  const dir = mkdtempSync(join(tmpdir(), 'fyp-voice-'))
  const listPath = join(dir, 'concat.txt')
  const lines: string[] = []
  const gapSec = gapMs / 1000

  for (let i = 0; i < parts.length; i++) {
    lines.push(`file '${parts[i]!.replace(/'/g, "'\\''")}'`)
    if (i < parts.length - 1 && gapMs > 0) {
      const silencePath = join(dir, `gap-${i}.mp3`)
      writeSilenceMp3(silencePath, gapSec)
      lines.push(`file '${silencePath.replace(/'/g, "'\\''")}'`)
    }
  }

  writeFileSync(listPath, lines.join('\n'))
  execFileSync(
    'ffmpeg',
    ['-y', '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', outputPath],
    { stdio: 'ignore' },
  )
}

export function muxVideoAudio(
  videoPath: string,
  audioPath: string,
  outputPath: string,
): void {
  assertFfmpeg()

  const videoSec = probeDurationMs(videoPath) / 1000
  const audioSec = probeDurationMs(audioPath) / 1000
  const padSec = Math.max(0, videoSec - audioSec)

  const filter =
    padSec > 0.02 ? `[1:a]apad=pad_dur=${padSec.toFixed(3)}[aout]` : '[1:a]anull[aout]'

  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      videoPath,
      '-i',
      audioPath,
      '-filter_complex',
      filter,
      '-map',
      '0:v:0',
      '-map',
      '[aout]',
      '-c:v',
      'copy',
      '-c:a',
      'aac',
      '-b:a',
      '192k',
      '-t',
      String(videoSec),
      outputPath,
    ],
    { stdio: 'ignore' },
  )
}

export function probeDurationMs(mediaPath: string): number {
  const raw = execFileSync(
    'ffprobe',
    [
      '-v',
      'error',
      '-show_entries',
      'format=duration',
      '-of',
      'default=noprint_wrappers=1:nokey=1',
      mediaPath,
    ],
    { encoding: 'utf8' },
  ).trim()
  const sec = Number.parseFloat(raw)
  if (!Number.isFinite(sec)) return 0
  return Math.round(sec * 1000)
}
