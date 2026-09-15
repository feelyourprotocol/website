import { describe, expect, it } from 'vitest'

import { ensurePlaylistId, PLAYLIST_DESCRIPTION } from '../ensurePlaylist.ts'

describe('ensurePlaylistId', () => {
  it('returns an existing playlist without creating', async () => {
    const created: string[] = []
    const id = await ensurePlaylistId(
      {
        async findPlaylistIdByTitle() {
          return 'PLold'
        },
        async createPlaylist({ title }) {
          created.push(title)
          return { id: 'PLnew' }
        },
      },
      'Feel Your Protocol · Amsterdam EIPs',
    )
    expect(id).toEqual({ playlistId: 'PLold', created: false })
    expect(created).toEqual([])
  })

  it('creates a public playlist when the title is missing', async () => {
    const created: { title: string; description?: string; privacy?: string }[] = []
    const id = await ensurePlaylistId(
      {
        async findPlaylistIdByTitle() {
          return undefined
        },
        async createPlaylist(opts) {
          created.push(opts)
          return { id: 'PLnew' }
        },
      },
      'Feel Your Protocol · Osaka EIPs',
    )
    expect(id).toEqual({ playlistId: 'PLnew', created: true })
    expect(created).toEqual([
      {
        title: 'Feel Your Protocol · Osaka EIPs',
        description: PLAYLIST_DESCRIPTION,
        privacy: 'public',
      },
    ])
  })
})
