import type { SpeechWithTimestampsResponse } from './types.ts'

const DEFAULT_MODEL = 'eleven_v3'

export interface ElevenLabsConfig {
  apiKey: string
  voiceId: string
  modelId?: string
}

export function resolveElevenLabsConfig(): ElevenLabsConfig {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim()
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim()
  if (!apiKey) {
    throw new Error(
      'Missing ELEVENLABS_API_KEY. Copy video/.env.example to video/.env and add your key.',
    )
  }
  if (!voiceId) {
    throw new Error('Missing ELEVENLABS_VOICE_ID in video/.env')
  }
  return {
    apiKey,
    voiceId,
    modelId: process.env.ELEVENLABS_MODEL_ID?.trim() || DEFAULT_MODEL,
  }
}

export async function synthesizeWithTimestamps(
  config: ElevenLabsConfig,
  text: string,
  modelId?: string,
): Promise<SpeechWithTimestampsResponse> {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(config.voiceId)}/with-timestamps`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': config.apiKey,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ text, model_id: modelId ?? config.modelId ?? DEFAULT_MODEL }),
  }).catch((err: unknown) => {
    const cause = err instanceof Error && 'cause' in err ? (err.cause as Error | undefined) : undefined
    const detail = cause?.message ?? (err instanceof Error ? err.message : String(err))
    throw new Error(`ElevenLabs request failed (${detail})`)
  })

  const bodyText = await res.text()
  if (!res.ok) {
    throw new Error(`ElevenLabs HTTP ${res.status}: ${bodyText}`)
  }

  return JSON.parse(bodyText) as SpeechWithTimestampsResponse
}
