import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { alignmentDurationMs } from './alignment.ts'
import { resolveElevenLabsConfig, synthesizeWithTimestamps } from './elevenlabs.ts'
import { concatMp3Files, probeDurationMs } from './ffmpeg.ts'
import type {
  NarrationFile,
  SynthesizedSegment,
  VoiceManifest,
} from './types.ts'

export function loadNarrationFile(projectDir: string): NarrationFile {
  const path = join(projectDir, 'narration.json')
  if (!existsSync(path)) {
    throw new Error(`Missing narration.json in ${projectDir}`)
  }
  return JSON.parse(readFileSync(path, 'utf8')) as NarrationFile
}

export function voiceDir(projectDir: string): string {
  return join(projectDir, 'voice')
}

export function manifestPath(projectDir: string): string {
  return join(voiceDir(projectDir), 'manifest.json')
}

export function loadVoiceManifest(projectDir: string): VoiceManifest | undefined {
  const path = manifestPath(projectDir)
  if (!existsSync(path)) return undefined
  return JSON.parse(readFileSync(path, 'utf8')) as VoiceManifest
}

function segmentPaths(projectDir: string, beat: string): { mp3: string; alignment: string } {
  const dir = join(voiceDir(projectDir), 'segments')
  return {
    mp3: join(dir, `${beat}.mp3`),
    alignment: join(dir, `${beat}.alignment.json`),
  }
}

export async function synthesizeProjectVoice(
  projectDir: string,
  options: { force?: boolean } = {},
): Promise<VoiceManifest> {
  const narration = loadNarrationFile(projectDir)
  const config = resolveElevenLabsConfig()
  const model = narration.model ?? config.modelId ?? 'eleven_v3'
  const gapMs = narration.segmentGapMs ?? 350

  const vDir = voiceDir(projectDir)
  const segDir = join(vDir, 'segments')
  mkdirSync(segDir, { recursive: true })

  const synthesized: SynthesizedSegment[] = []

  for (const segment of narration.segments) {
    const paths = segmentPaths(projectDir, segment.beat)
    if (!options.force && existsSync(paths.mp3) && existsSync(paths.alignment)) {
      const alignment = JSON.parse(readFileSync(paths.alignment, 'utf8'))
      synthesized.push({
        beat: segment.beat,
        text: segment.text,
        audioPath: paths.mp3,
        alignmentPath: paths.alignment,
        durationMs: alignmentDurationMs(alignment),
      })
      console.log(`  skip ${segment.beat} (cached)`)
      continue
    }

    console.log(`  synth ${segment.beat}…`)
    const result = await synthesizeWithTimestamps(config, segment.text, model)
    writeFileSync(paths.mp3, Buffer.from(result.audio_base64, 'base64'))
    writeFileSync(paths.alignment, JSON.stringify(result.alignment ?? null, null, 2))

    synthesized.push({
      beat: segment.beat,
      text: segment.text,
      audioPath: paths.mp3,
      alignmentPath: paths.alignment,
      durationMs: alignmentDurationMs(result.alignment),
    })
  }

  const fullPath = join(vDir, 'full.mp3')
  concatMp3Files(
    fullPath,
    synthesized.map((s) => s.audioPath),
    gapMs,
  )

  const beats: VoiceManifest['beats'] = {}
  let cursor = 0
  for (let i = 0; i < synthesized.length; i++) {
    const seg = synthesized[i]!
    const startMs = cursor
    const endMs = cursor + seg.durationMs
    beats[seg.beat] = {
      startMs,
      endMs,
      durationMs: seg.durationMs,
      segmentFile: seg.audioPath,
    }
    cursor = endMs
    if (i < synthesized.length - 1) cursor += gapMs
  }

  const manifest: VoiceManifest = {
    version: 1,
    generatedAt: new Date().toISOString(),
    model,
    voiceId: config.voiceId,
    audioFile: 'voice/full.mp3',
    segmentGapMs: gapMs,
    totalDurationMs: probeDurationMs(fullPath) || cursor,
    beats,
  }

  writeFileSync(manifestPath(projectDir), JSON.stringify(manifest, null, 2))
  return manifest
}
