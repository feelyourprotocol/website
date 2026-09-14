import { getExplorationMeta } from '../explorationRegistry.ts'

/** Display labels — same strings as `src/explorations/TOPICS.ts` titles. */
export const TOPIC_PLAYLIST_LABEL: Record<string, string> = {
  scaling: 'Scaling',
  privacy: 'Privacy',
  ux: 'UX',
  security: 'Security',
  robustness: 'Robustness',
  interoperability: 'Interoperability',
}

export function topicPlaylistTitle(topic: string): string {
  const label = TOPIC_PLAYLIST_LABEL[topic]
  if (!label) {
    throw new Error(`Unknown topic for YouTube playlist: ${topic}`)
  }
  return `Feel Your Protocol · ${label}`
}

/** Fork playlist from yaml, then topic playlist from the exploration registry. */
export function playlistsForProject(projectId: string, forkPlaylist: string): string[] {
  const topic = getExplorationMeta(projectId).topic
  const titles = [forkPlaylist.trim(), topicPlaylistTitle(topic)]
  return [...new Set(titles.filter(Boolean))]
}
