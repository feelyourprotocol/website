export interface ProjectCliArgs {
  projectId: string
  flags: string[]
}

export function parseProjectArgs(argv: string[]): ProjectCliArgs {
  const positional = argv.filter((a) => !a.startsWith('-'))
  const projectId = positional[0]
  if (!projectId) {
    throw new Error('Missing project id')
  }
  return { projectId, flags: argv.filter((a) => a.startsWith('-')) }
}

export function parseMuxArgs(argv: string[]): {
  projectId: string
  input?: string
  output?: string
  preview?: boolean
} {
  const { projectId, flags } = parseProjectArgs(argv)
  let input: string | undefined
  let output: string | undefined
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--input') input = argv[i + 1]
    if (argv[i] === '--output') output = argv[i + 1]
  }
  if (flags.includes('--help')) {
    throw new Error(
      'Usage: npm run voice:mux -- <project-id> [--preview] [--input path/to/video.webm] [--output path/to/out.mp4]',
    )
  }
  return { projectId, input, output, preview: flags.includes('--preview') }
}
