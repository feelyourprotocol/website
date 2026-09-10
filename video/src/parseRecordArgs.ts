export interface RecordCliArgs {
  projectId: string
  preview: boolean
  dryRun: boolean
  /** Run playbook clicks in Chromium without writing a video (no encode, no mux). */
  rehearse: boolean
  /** Ignore voice/manifest.json — use manual cue/wait from playbook.json */
  noVoice: boolean
}

export function parseRecordCliArgs(argv: string[]): RecordCliArgs {
  const positional = argv.filter((a) => !a.startsWith('-'))
  const projectId = positional[0]
  if (!projectId) {
    throw new Error(
      'Missing project id. Usage: npm run record -- <project-id> [--preview] [--dry-run] [--rehearse] [--no-voice]',
    )
  }

  const dryRun = argv.includes('--dry-run')
  const rehearse = argv.includes('--rehearse')
  if (dryRun && rehearse) {
    throw new Error('Use either --dry-run (print steps) or --rehearse (click without recording), not both')
  }

  return {
    projectId,
    preview: argv.includes('--preview'),
    dryRun,
    rehearse,
    noVoice: argv.includes('--no-voice'),
  }
}
