import { googleErrorMessage } from './oauth.ts'
import type { YoutubePrivacy } from './types.ts'

const API = 'https://www.googleapis.com/youtube/v3'
const UPLOAD = 'https://www.googleapis.com/upload/youtube/v3'

export interface YoutubeApi {
  insertVideo(opts: {
    metadata: unknown
    videoBytes: Uint8Array
  }): Promise<{ id: string }>
  setThumbnail(opts: { videoId: string; jpegBytes: Uint8Array }): Promise<void>
  findPlaylistIdByTitle(title: string): Promise<string | undefined>
  insertPlaylistItem(opts: { playlistId: string; videoId: string }): Promise<void>
  updatePrivacy(opts: { videoId: string; privacy: YoutubePrivacy }): Promise<void>
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
  }
}
