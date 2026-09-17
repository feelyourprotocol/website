/** Static topic hub ids — must match keys in `TOPICS.ts`. */
export const TOPIC_IDS = [
  'scaling',
  'privacy',
  'ux',
  'security',
  'robustness',
  'interoperability',
] as const

export type TopicId = (typeof TOPIC_IDS)[number]
