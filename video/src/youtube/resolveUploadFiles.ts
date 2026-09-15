import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import type { YoutubeShortMeta } from './types.ts'

export function newestFinalMp4(dir: string): string | undefined {
  if (!existsSync(dir)) return undefined
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('-final.mp4'))
    .map((f) => join(dir, f))
  if (!files.length) return undefined
  files.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  return files[0]
}

export interface UploadFiles {
  videoPath: string
  thumbPath: string
}

export function resolveUploadFiles(projectDir: string, meta: YoutubeShortMeta): UploadFiles {
  const outputDir = join(projectDir, 'output')
  const thumbPath = join(outputDir, meta.thumbnail.file)
  const pairedMp4 = thumbPath.replace(/-final-thumb\.(jpg|jpeg|png)$/i, '-final.mp4')
  const videoPath =
    existsSync(pairedMp4) && pairedMp4 !== thumbPath ? pairedMp4 : newestFinalMp4(outputDir)

  if (!videoPath || !existsSync(videoPath)) {
    throw new Error(
      `No *-final.mp4 in ${outputDir}. Mux first: npm run video:voice:mux -- ${meta.id}`,
    )
  }
  if (!existsSync(thumbPath)) {
    throw new Error(
      `Missing thumbnail ${thumbPath}. Extract it: npm run video:thumb -- ${meta.id}`,
    )
  }
  return { videoPath, thumbPath }
}
