export interface RecordCliArgs {
  projectId: string
  preview: boolean
  dryRun: boolean
}

export function parseRecordCliArgs(argv: string[]): RecordCliArgs {
  const positional = argv.filter((a) => !a.startsWith('-'))
  const projectId = positional[0]
  if (!projectId) {
    throw new Error('Missing project id. Usage: npm run record -- <project-id> [--preview] [--dry-run]')
  }

  return {
    projectId,
    preview: argv.includes('--preview'),
    dryRun: argv.includes('--dry-run'),
  }
}
