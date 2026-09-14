import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { pickSearchHit, searchQueryForProject } from '../matchSearchHit.ts'
import { syncPlaylistProjects } from '../syncPlaylist.ts'
import type { YoutubeApi, YoutubeVideoDetails } from '../youtubeApi.ts'

describe('searchQueryForProject / pickSearchHit', () => {
  it('turns eip-7708 into EIP-7708', () => {
    expect(searchQueryForProject('eip-7708')).toBe('EIP-7708')
  })

  it('prefers an exact title, then a unique EIP-id hit', () => {
    const hits = [
      { videoId: 'aaa', title: 'Unrelated' },
      { videoId: 'bbb', title: 'EIP-7708 Explained: Native ETH Transfers Emit a Log (Amsterdam) #Shorts' },
    ]
    expect(
      pickSearchHit(
        'EIP-7708 Explained: Native ETH Transfers Emit a Log (Amsterdam) #Shorts',
        'eip-7708',
        hits,
      ).videoId,
    ).toBe('bbb')
    expect(pickSearchHit('other title', 'eip-7708', hits).videoId).toBe('bbb')
  })

  it('rejects zero or many id matches', () => {
    expect(() => pickSearchHit('t', 'eip-7708', [])).toThrow(/No YouTube search hits/)
    expect(() =>
      pickSearchHit('t', 'eip-7708', [
        { videoId: 'a', title: 'EIP-7708 one' },
        { videoId: 'b', title: 'EIP-7708 two' },
      ]),
    ).toThrow(/Ambiguous/)
  })
})

const YML = `schema: video-short-youtube/v1
id: eip-7843
title: 'EIP-7843 The Feel: Read the Beacon Slot On-Chain (Amsterdam) #Shorts'
description: |
  snippet
tags:
  - Ethereum
category: Science & Technology
playlist: Feel Your Protocol · Amsterdam EIPs
thumbnail:
  file: thumb.jpg
  width: 1280
  time_sec: 1.5
  source: title-card
sources:
  exploration_url: https://feelyourprotocol.org/eip-7843-slotnum-opcode
  spec_url: https://eips.ethereum.org/EIPS/eip-7843
  forkcast_url: null
`

function mockApi(opts: {
  playlistId: string | null
  existing: string[]
  search: { videoId: string; title: string }[]
  details: YoutubeVideoDetails
}): YoutubeApi & { inserted: string[]; created: string[] } {
  const inserted: string[] = []
  const created: string[] = []
  const api: YoutubeApi & { inserted: string[]; created: string[] } = {
    inserted,
    created,
    async insertVideo() {
      throw new Error('unused')
    },
    async setThumbnail() {},
    async findPlaylistIdByTitle(title: string) {
      if (opts.playlistId === null) return undefined
      return `${opts.playlistId}:${title}`
    },
    async createPlaylist({ title }) {
      created.push(title)
      return { id: `PLnew:${title}` }
    },
    async insertPlaylistItem({ videoId }) {
      inserted.push(videoId)
    },
    async updatePrivacy() {},
    async searchMine() {
      return opts.search
    },
    async listPlaylistVideoIds() {
      return [...opts.existing]
    },
    async getVideo() {
      return opts.details
    },
  }
  return api
}

describe('syncPlaylistProjects', () => {
  it('inserts a looked-up video and writes published', async () => {
    const root = mkdtempSync(join(tmpdir(), 'fyp-pl-'))
    const dir = join(root, 'eip-7843')
    mkdirSync(dir)
    writeFileSync(join(dir, 'youtube.yml'), YML)
    const api = mockApi({
      playlistId: 'PL1',
      existing: ['nMN66P_AWPk'],
      search: [
        {
          videoId: 'G_xA761lhEQ',
          title: 'EIP-7843 The Feel: Read the Beacon Slot On-Chain (Amsterdam) #Shorts',
        },
      ],
      details: {
        videoId: 'G_xA761lhEQ',
        title: 'EIP-7843 The Feel: Read the Beacon Slot On-Chain (Amsterdam) #Shorts',
        privacy: 'public',
        publishedAt: '2026-09-10T15:31:10.000Z',
      },
    })
    const rows = await syncPlaylistProjects(root, api, ['eip-7843'])
    expect(rows[0]?.addedToPlaylist).toBe(true)
    expect(rows[0]?.wrotePublished).toBe(true)
    expect(rows[0]?.playlists).toEqual([
      'Feel Your Protocol · Amsterdam EIPs',
      'Feel Your Protocol · Robustness',
    ])
    expect(api.inserted).toEqual(['G_xA761lhEQ', 'G_xA761lhEQ'])
    expect(readFileSync(join(dir, 'youtube.yml'), 'utf8')).toContain('video_id: G_xA761lhEQ')
  })

  it('skips insert when the video is already on the playlist', async () => {
    const root = mkdtempSync(join(tmpdir(), 'fyp-pl-'))
    const dir = join(root, 'eip-7843')
    mkdirSync(dir)
    writeFileSync(
      join(dir, 'youtube.yml'),
      `${YML}
published:
  video_id: G_xA761lhEQ
  url: https://www.youtube.com/shorts/G_xA761lhEQ
  privacy: public
  uploaded_at: 2026-09-10T15:31:10.000Z
`,
    )
    const api = mockApi({
      playlistId: 'PL1',
      existing: ['G_xA761lhEQ'],
      search: [],
      details: {
        videoId: 'G_xA761lhEQ',
        title: 'x',
        privacy: 'public',
        publishedAt: '2026-09-10T15:31:10.000Z',
      },
    })
    const rows = await syncPlaylistProjects(root, api, ['eip-7843'])
    expect(rows[0]?.addedToPlaylist).toBe(false)
    expect(api.inserted).toEqual([])
    expect(rows[0]?.createdPlaylist).toBe(false)
  })

  it('creates the playlist when the title is missing', async () => {
    const root = mkdtempSync(join(tmpdir(), 'fyp-pl-'))
    const dir = join(root, 'eip-7843')
    mkdirSync(dir)
    writeFileSync(
      join(dir, 'youtube.yml'),
      `${YML}
published:
  video_id: G_xA761lhEQ
  url: https://www.youtube.com/shorts/G_xA761lhEQ
  privacy: public
  uploaded_at: 2026-09-10T15:31:10.000Z
`,
    )
    const api = mockApi({
      playlistId: null,
      existing: [],
      search: [],
      details: {
        videoId: 'G_xA761lhEQ',
        title: 'x',
        privacy: 'public',
        publishedAt: '2026-09-10T15:31:10.000Z',
      },
    })
    const rows = await syncPlaylistProjects(root, api, ['eip-7843'])
    expect(api.created).toEqual([
      'Feel Your Protocol · Amsterdam EIPs',
      'Feel Your Protocol · Robustness',
    ])
    expect(rows[0]?.createdPlaylist).toBe(true)
    expect(rows[0]?.addedToPlaylist).toBe(true)
    expect(api.inserted).toEqual(['G_xA761lhEQ', 'G_xA761lhEQ'])
  })
})
