import type { CharacterAlignment } from './types.ts'

/** Duration in ms from ElevenLabs character alignment. */
export function alignmentDurationMs(alignment: CharacterAlignment | null | undefined): number {
  const ends = alignment?.character_end_times_seconds
  if (!ends?.length) return 0
  const last = ends[ends.length - 1]!
  return Math.ceil(last * 1000)
}
