export interface NarrationSegment {
  beat: string
  text: string
}

export interface NarrationFile {
  model?: string
  segmentGapMs?: number
  segments: NarrationSegment[]
}

export interface CharacterAlignment {
  characters: string[]
  character_start_times_seconds: number[]
  character_end_times_seconds: number[]
}

export interface SpeechWithTimestampsResponse {
  audio_base64: string
  alignment?: CharacterAlignment | null
}

export interface VoiceBeatTiming {
  startMs: number
  endMs: number
  durationMs: number
  segmentFile: string
}

export interface VoiceManifest {
  version: 1
  generatedAt: string
  model: string
  voiceId: string
  audioFile: string
  segmentGapMs: number
  totalDurationMs: number
  beats: Record<string, VoiceBeatTiming>
}

export interface SynthesizedSegment {
  beat: string
  text: string
  audioPath: string
  alignmentPath: string
  durationMs: number
}
