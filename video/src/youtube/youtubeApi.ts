import type { YoutubeSearchHit } from './matchSearchHit.ts'
import { googleErrorMessage } from './oauth.ts'
import type { YoutubePrivacy } from './types.ts'

const API = 'https://www.googleapis.com/youtube/v3'
const UPLOAD = 'https://www.googleapis.com/upload/youtube/v3'

const PRIVACY: ReadonlySet<string> = new Set(['public', 'unlisted', 'private'])

export interface YoutubeVideoDetails {
  videoId: string
  title: string
  privacy: YoutubePrivacy
  publishedAt: string
}

export interface YoutubeApi {
  insertVideo(opts: {
    metadata: unknown
    videoBytes: Uint8Array
  }): Promise<{ id: string }>
  setThumbnail(opts: { videoId: string; jpegBytes: Uint8Array }): Promise<void>
  findPlaylistIdByTitle(title: string): Promise<string | undefined>
  createPlaylist(opts: {
    title: string
    description?: string
    privacy?: YoutubePrivacy
  }): Promise<{ id: string }>
  insertPlaylistItem(opts: { playlistId: string; videoId: string }): Promise<void>
  updatePrivacy(opts: { videoId: string; privacy: YoutubePrivacy }): Promise<void>
  searchMine(query: string): Promise<YoutubeSearchHit[]>
  listPlaylistVideoIds(playlistId: string): Promise<string[]>
  getVideo(videoId: string): Promise<YoutubeVideoDetails | undefined>
}

export function createYoutubeApi(accessToken: string, fetchImpl: typeof fetch): YoutubeApi {
  const auth = { Authorization: `Bearer ${accessToken}` }

  async function apiJson(
    url: string,
    init: RequestInit,
  ): Promise<{ status: number; json: Record<string, unknown> }> {
    const res = await fetchImpl(url, init)
    const text = await res.text()
    let json: Record<string, unknown> = {}
    if (text) {
      try {
        json = JSON.parse(text) as Record<string, unknown>
      } catch {
        json = { message: 'non-JSON response' }
      }
    }
    if (!res.ok) {
      throw new Error(`YouTube API HTTP ${res.status}: ${googleErrorMessage(json, res.status)}`)
    }
    return { status: res.status, json }
  }

  return {
    async insertVideo({ metadata, videoBytes }) {
      const init = await fetchImpl(`${UPLOAD}/videos?uploadType=resumable&part=snippet,status`, {
        method: 'POST',
        headers: {
          ...auth,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Type': 'video/mp4',
          'X-Upload-Content-Length': String(videoBytes.byteLength),
        },
        body: JSON.stringify(metadata),
      })
      if (!init.ok) {
        const text = await init.text()
        let json: Record<string, unknown> = {}
        try {
          json = JSON.parse(text) as Record<string, unknown>
        } catch {
          json = {}
        }
        throw new Error(
          `YouTube video init HTTP ${init.status}: ${googleErrorMessage(json, init.status)}`,
        )
      }
      const location = init.headers.get('location') ?? init.headers.get('Location')
      if (!location) {
        throw new Error('YouTube video init missing Location header')
      }
      const put = await fetchImpl(location, {
        method: 'PUT',
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Length': String(videoBytes.byteLength),
        },
        body: videoBytes,
      })
      const text = await put.text()
      let json: Record<string, unknown> = {}
      try {
        json = JSON.parse(text) as Record<string, unknown>
      } catch {
        json = {}
      }
      if (!put.ok) {
        throw new Error(`YouTube video PUT HTTP ${put.status}: ${googleErrorMessage(json, put.status)}`)
      }
      if (typeof json.id !== 'string' || !json.id) {
        throw new Error('YouTube video upload response missing id')
      }
      return { id: json.id }
    },

    async setThumbnail({ videoId, jpegBytes }) {
      await apiJson(`${UPLOAD}/thumbnails/set?videoId=${encodeURIComponent(videoId)}&uploadType=media`, {
        method: 'POST',
        headers: {
          ...auth,
          'Content-Type': 'image/jpeg',
          'Content-Length': String(jpegBytes.byteLength),
        },
        body: jpegBytes,
      })
    },

    async findPlaylistIdByTitle(title: string) {
      let pageToken: string | undefined
      do {
        const params = new URLSearchParams({
          part: 'snippet',
          mine: 'true',
          maxResults: '50',
        })
        if (pageToken) params.set('pageToken', pageToken)
        const { json } = await apiJson(`${API}/playlists?${params.toString()}`, {
          method: 'GET',
          headers: auth,
        })
        const items = Array.isArray(json.items) ? json.items : []
        for (const item of items) {
          if (!item || typeof item !== 'object') continue
          const rec = item as { id?: unknown; snippet?: { title?: unknown } }
          if (rec.snippet?.title === title && typeof rec.id === 'string') return rec.id
        }
        pageToken = typeof json.nextPageToken === 'string' ? json.nextPageToken : undefined
      } while (pageToken)
      return undefined
    },

    async createPlaylist({ title, description, privacy }) {
      const { json } = await apiJson(`${API}/playlists?part=snippet,status`, {
        method: 'POST',
        headers: {
          ...auth,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          snippet: {
            title,
            description: description ?? 'Feel Your Protocol exploration Shorts.',
          },
          status: { privacyStatus: privacy ?? 'public' },
        }),
      })
      if (typeof json.id !== 'string' || !json.id) {
        throw new Error('YouTube playlist create response missing id')
      }
      return { id: json.id }
    },

    async insertPlaylistItem({ playlistId, videoId }) {
      await apiJson(`${API}/playlistItems?part=snippet`, {
        method: 'POST',
        headers: {
          ...auth,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          snippet: {
            playlistId,
            resourceId: { kind: 'youtube#video', videoId },
          },
        }),
      })
    },

    async updatePrivacy({ videoId, privacy }) {
      await apiJson(`${API}/videos?part=status`, {
        method: 'PUT',
        headers: {
          ...auth,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          id: videoId,
          status: {
            privacyStatus: privacy,
            selfDeclaredMadeForKids: false,
          },
        }),
      })
    },

    async searchMine(query: string) {
      const params = new URLSearchParams({
        part: 'snippet',
        forMine: 'true',
        type: 'video',
        maxResults: '10',
        q: query,
      })
      const { json } = await apiJson(`${API}/search?${params.toString()}`, {
        method: 'GET',
        headers: auth,
      })
      const items = Array.isArray(json.items) ? json.items : []
      const hits: YoutubeSearchHit[] = []
      for (const item of items) {
        if (!item || typeof item !== 'object') continue
        const rec = item as { id?: { videoId?: unknown }; snippet?: { title?: unknown } }
        const videoId = rec.id?.videoId
        const title = rec.snippet?.title
        if (typeof videoId === 'string' && typeof title === 'string') {
          hits.push({ videoId, title })
        }
      }
      return hits
    },

    async listPlaylistVideoIds(playlistId: string) {
      const ids: string[] = []
      let pageToken: string | undefined
      do {
        const params = new URLSearchParams({
          part: 'snippet',
          playlistId,
          maxResults: '50',
        })
        if (pageToken) params.set('pageToken', pageToken)
        const { json } = await apiJson(`${API}/playlistItems?${params.toString()}`, {
          method: 'GET',
          headers: auth,
        })
        const items = Array.isArray(json.items) ? json.items : []
        for (const item of items) {
          if (!item || typeof item !== 'object') continue
          const rec = item as { snippet?: { resourceId?: { videoId?: unknown } } }
          const videoId = rec.snippet?.resourceId?.videoId
          if (typeof videoId === 'string') ids.push(videoId)
        }
        pageToken = typeof json.nextPageToken === 'string' ? json.nextPageToken : undefined
      } while (pageToken)
      return ids
    },

    async getVideo(videoId: string) {
      const params = new URLSearchParams({
        part: 'snippet,status',
        id: videoId,
      })
      const { json } = await apiJson(`${API}/videos?${params.toString()}`, {
        method: 'GET',
        headers: auth,
      })
      const items = Array.isArray(json.items) ? json.items : []
      const item = items[0]
      if (!item || typeof item !== 'object') return undefined
      const rec = item as {
        id?: unknown
        snippet?: { title?: unknown; publishedAt?: unknown }
        status?: { privacyStatus?: unknown }
      }
      const privacy = rec.status?.privacyStatus
      const publishedAt = rec.snippet?.publishedAt
      const title = rec.snippet?.title
      if (typeof rec.id !== 'string' || typeof privacy !== 'string' || !PRIVACY.has(privacy)) {
        return undefined
      }
      if (typeof publishedAt !== 'string' || typeof title !== 'string') return undefined
      return {
        videoId: rec.id,
        title,
        privacy: privacy as YoutubePrivacy,
        publishedAt,
      }
    },
  }
}
