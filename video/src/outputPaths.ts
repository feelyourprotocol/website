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
  const lines = [
    '',
    '═'.repeat(72),
    'FINAL (video + audio):',
    `  ${finalPath}`,
  ]
  if (silentPath) {
    lines.push('', 'Intermediate (silent, no audio):', `  ${silentPath}`)
  }
  lines.push('═'.repeat(72))
  return lines.join('\n')
}
