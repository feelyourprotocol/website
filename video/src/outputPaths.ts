import { existsSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

/** Silent Playwright capture — intermediate only. */
export function silentWebmPath(outputDir: string, projectId: string, timestamp: string): string {
  return join(outputDir, `${projectId}-${timestamp}.webm`)
}

/** Upload-ready muxed output — video + voice. */
export function finalMp4Path(webmPath: string): string {
  return webmPath.replace(/\.webm$/i, '-final.mp4')
}

export function formatOutputBanner(finalPath: string, silentPath?: string): string {
  const lines = ['', '═'.repeat(72), 'FINAL (video + audio):', `  ${finalPath}`]
  if (silentPath) {
    lines.push('', 'Intermediate (silent, no audio):', `  ${silentPath}`)
  }
  lines.push('═'.repeat(72))
  return lines.join('\n')
}

/**
 * Delete files in `outputDir` belonging to earlier "generations" of this project.
 *
 * A generation is identified by the `<projectId>-<isoTimestamp>` prefix; every
 * sidecar of one generation shares it (`.webm`, `-final.mp4`, `-final-thumb.png`,
 * plus any future overlays). We keep exactly one generation — `keepTimestamp` — and
 * delete the rest so `output/` never accumulates stale uploads.
 *
 * Called by the recorder after a successful `.webm` write, since that is the only
 * step that starts a new generation (mux/thumb overwrite files inside an existing
 * generation, they never fork a new one).
 */
export function pruneOtherGenerations(
  outputDir: string,
  projectId: string,
  keepTimestamp: string,
): { deleted: string[] } {
  if (!existsSync(outputDir)) return { deleted: [] }
  const projectPrefix = `${projectId}-`
  const keepPrefix = `${projectId}-${keepTimestamp}`
  const deleted: string[] = []
  for (const name of readdirSync(outputDir)) {
    if (!name.startsWith(projectPrefix)) continue
    if (name.startsWith(keepPrefix)) continue
    const abs = join(outputDir, name)
    unlinkSync(abs)
    deleted.push(abs)
  }
  return { deleted }
}
