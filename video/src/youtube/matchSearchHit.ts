export interface YoutubeSearchHit {
  videoId: string
  title: string
}

/** `eip-7708` → `EIP-7708` for YouTube search. */
export function searchQueryForProject(projectId: string): string {
  const m = projectId.match(/^eip-(\d+)$/i)
  if (!m) return projectId
  return `EIP-${m[1]}`
}

export function pickSearchHit(
  yamlTitle: string,
  projectId: string,
  hits: YoutubeSearchHit[],
): YoutubeSearchHit {
  if (!hits.length) {
    throw new Error(`No YouTube search hits for ${projectId}`)
  }
  const exact = hits.find((h) => h.title === yamlTitle)
  if (exact) return exact
  const needle = searchQueryForProject(projectId).toLowerCase()
  const byId = hits.filter((h) => h.title.toLowerCase().includes(needle))
  if (byId.length === 1) return byId[0]
  if (byId.length > 1) {
    throw new Error(
      `Ambiguous YouTube search for ${projectId}: ${byId.map((h) => h.videoId).join(', ')}`,
    )
  }
  if (hits.length === 1) return hits[0]
  throw new Error(
    `Ambiguous YouTube search for ${projectId} (${hits.length} hits, none match title)`,
  )
}
