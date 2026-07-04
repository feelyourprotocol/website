export interface GenerateCliArgs {
  projectId: string
  preview: boolean
  forceSynth: boolean
  /** Reuse voice/full.mp3 — skip ElevenLabs synthesis */
  skipSynth: boolean
}

export function parseGenerateCliArgs(argv: string[]): GenerateCliArgs {
  const positional = argv.filter((a) => !a.startsWith('-'))
  const projectId = positional[0]
  if (!projectId) {
    throw new Error(
      'Missing project id. Usage: npm run video:generate -- <project-id> [--preview] [--force-synth] [--skip-synth]',
    )
  }

  return {
    projectId,
    preview: argv.includes('--preview'),
    forceSynth: argv.includes('--force-synth'),
    skipSynth: argv.includes('--skip-synth'),
  }
}

/** @deprecated Use parseGenerateCliArgs */
export const parseRenderCliArgs = parseGenerateCliArgs
export type RenderCliArgs = GenerateCliArgs
