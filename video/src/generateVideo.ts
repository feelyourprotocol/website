import { join } from 'node:path'

import { loadVideoEnv } from './loadEnv.ts'
import { finalMp4Path,formatOutputBanner } from './outputPaths.ts'
import { recordVideo } from './recordVideo.ts'
import { muxVideoAudio } from './voice/ffmpeg.ts'
import { loadVoiceManifest,synthesizeProjectVoice, voiceDir } from './voice/synthesize.ts'
import type { VoiceManifest } from './voice/types.ts'

export interface GenerateVideoOptions {
  preview?: boolean
  forceSynth?: boolean
  skipSynth?: boolean
  distDir: string
  projectsRoot: string
}

export interface GenerateVideoResult {
  projectId: string
  /** Silent Playwright capture — intermediate only, no audio */
  silentWebmPath: string
  /** Upload-ready output — video + voice muxed */
  finalPath: string
  manifest: VoiceManifest
}

/**
 * Generate the final short: synthesize voice → record silent webm → mux to mp4.
 * Requires `website:build` (dist/website) unless invoked via npm run video:generate.
 */
export async function generateVideo(
  projectId: string,
  options: GenerateVideoOptions,
): Promise<GenerateVideoResult> {
  loadVideoEnv()

  const projectDir = join(options.projectsRoot, projectId)

  let manifest: VoiceManifest
  if (options.skipSynth) {
    const existing = loadVoiceManifest(projectDir)
    if (!existing) {
      throw new Error('No voice/manifest.json — run without --skip-synth first')
    }
    manifest = existing
    console.log('\n── 1/3 Voice synthesis (skipped — reusing voice/) ──')
  } else {
    console.log('\n── 1/3 Voice synthesis ──')
    manifest = await synthesizeProjectVoice(projectDir, { force: options.forceSynth ?? false })
  }

  console.log('\n── 2/3 Record (voice-synced, silent webm) ──')
  const recorded = await recordVideo(projectId, {
    preview: options.preview,
    distDir: options.distDir,
    projectsRoot: options.projectsRoot,
    fromGenerate: true,
  })

  if (!recorded.outputPath) {
    throw new Error('Recording did not produce a .webm file')
  }

  const audioPath = join(voiceDir(projectDir), 'full.mp3')
  const finalPath = finalMp4Path(recorded.outputPath)

  console.log('\n── 3/3 Mux → final (video + audio) ──')
  muxVideoAudio(recorded.outputPath, audioPath, finalPath)

  console.log(formatOutputBanner(finalPath, recorded.outputPath))

  return {
    projectId,
    silentWebmPath: recorded.outputPath,
    finalPath,
    manifest,
  }
}
