import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import { buildVideoResource } from '../buildVideoResource.ts'
import { parseYoutubeYml } from '../parseYoutubeYml.ts'
import { resolveUploadFiles } from '../resolveUploadFiles.ts'
import { SCIENCE_TECHNOLOGY_CATEGORY_ID } from '../types.ts'
import { planUpload, resolveYoutubeClientConfig, uploadShort } from '../uploadShort.ts'
import type { YoutubeApi } from '../youtubeApi.ts'

const YML = `schema: video-short-youtube/v1
id: eip-8038
title: 'EIP-8038 The Split: Touch, Change, Create (Amsterdam) #Shorts'
description: |
  snippet
tags:
  - Ethereum
category: Science & Technology
playlist: Feel Your Protocol · Amsterdam EIPs
thumbnail:
  file: eip-8038-final-thumb.jpg
  width: 1280
  time_sec: 1.5
  source: title-card
sources:
  exploration_url: https://feelyourprotocol.org/eip-8038-state-access-gas
  spec_url: https://eips.ethereum.org/EIPS/eip-8038
  forkcast_url: null
`

function writeProject(extraYml = ''): string {
  const dir = mkdtempSync(join(tmpdir(), 'fyp-yt-'))
  mkdirSync(join(dir, 'output'))
  writeFileSync(join(dir, 'youtube.yml'), `${YML}${extraYml}`)
  writeFileSync(join(dir, 'output/eip-8038-final.mp4'), 'video')
  writeFileSync(join(dir, 'output/eip-8038-final-thumb.jpg'), 'jpeg')
  return dir
}

function tokenFetch(): typeof fetch {
  return async (input) => {
    if (String(input).includes('oauth2.googleapis.com/token')) {
      return new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 })
    }
    throw new Error(`unexpected fetch ${String(input)}`)
  }
}

function mockApi(calls: string[], playlistId: string | null = 'PL123'): YoutubeApi {
  return {
    async insertVideo() {
      calls.push('insertVideo')
      return { id: 'vidNew' }
    },
    async setThumbnail() {
      calls.push('setThumbnail')
    },
    async findPlaylistIdByTitle(title: string) {
      calls.push(`playlist:${title}`)
      return playlistId === null ? undefined : `${playlistId}:${title}`
    },
    async createPlaylist({ title }) {
      calls.push(`createPlaylist:${title}`)
      return { id: `PLnew:${title}` }
    },
    async insertPlaylistItem() {
      calls.push('insertPlaylistItem')
    },
    async updatePrivacy() {
      calls.push('updatePrivacy')
    },
    async searchMine() {
      return []
    },
    async listPlaylistVideoIds() {
      return []
    },
    async getVideo() {
      return undefined
    },
  }
}

const config = {
  clientId: 'cid',
  clientSecret: 'secret',
  refreshToken: 'refresh',
}

describe('resolveYoutubeClientConfig', () => {
  it('requires client, secret, and refresh token without echoing values', () => {
    expect(() => resolveYoutubeClientConfig({})).toThrow(/YOUTUBE_CLIENT_ID/)
    expect(() =>
      resolveYoutubeClientConfig({ YOUTUBE_CLIENT_ID: 'c', YOUTUBE_CLIENT_SECRET: 's' }),
    ).toThrow(/YOUTUBE_REFRESH_TOKEN/)
    expect(
      resolveYoutubeClientConfig({
        YOUTUBE_CLIENT_ID: 'c',
        YOUTUBE_CLIENT_SECRET: 's',
        YOUTUBE_REFRESH_TOKEN: 'r',
      }),
    ).toEqual({ clientId: 'c', clientSecret: 's', refreshToken: 'r' })
  })
})

describe('planUpload / resolveUploadFiles', () => {
  it('pairs the yaml thumbnail with the matching mp4', () => {
    const dir = writeProject()
    const plan = planUpload(dir, 'unlisted', false)
    expect(plan.videoPath.endsWith('eip-8038-final.mp4')).toBe(true)
    expect(plan.thumbPath.endsWith('eip-8038-final-thumb.jpg')).toBe(true)
    expect(plan.alreadyPublished).toBe(false)
    expect(resolveUploadFiles(dir, plan.meta).videoPath).toBe(plan.videoPath)
  })

  it('throws when the thumbnail is missing', () => {
    const dir = writeProject()
    writeFileSync(
      join(dir, 'youtube.yml'),
      YML.replace('eip-8038-final-thumb.jpg', 'missing-thumb.jpg'),
    )
    expect(() => planUpload(dir, 'unlisted', false)).toThrow(/Missing thumbnail/)
  })
})

describe('buildVideoResource', () => {
  it('sets category 28 and not-made-for-kids', () => {
    const dir = writeProject()
    const resource = buildVideoResource(parseYoutubeYml(readFileSync(join(dir, 'youtube.yml'), 'utf8')), 'unlisted')
    expect(resource.snippet.categoryId).toBe(SCIENCE_TECHNOLOGY_CATEGORY_ID)
    expect(resource.status.selfDeclaredMadeForKids).toBe(false)
    expect(resource.status.privacyStatus).toBe('unlisted')
  })
})

describe('uploadShort', () => {
  it('uploads, sets the thumbnail, adds the playlist, and writes published', async () => {
    const dir = writeProject()
    const calls: string[] = []
    const result = await uploadShort(
      dir,
      { privacy: 'unlisted', force: false, skipPlaylist: false, config },
      { fetch: tokenFetch(), now: () => new Date('2026-09-14T18:00:00.000Z'), createApi: () => mockApi(calls) },
    )
    expect(result.action).toBe('uploaded')
    expect(result.url).toBe('https://www.youtube.com/shorts/vidNew')
    expect(calls).toEqual([
      'insertVideo',
      'setThumbnail',
      'playlist:Feel Your Protocol · Amsterdam EIPs',
      'insertPlaylistItem',
      'playlist:Feel Your Protocol · Robustness',
      'insertPlaylistItem',
    ])
    const meta = parseYoutubeYml(readFileSync(join(dir, 'youtube.yml'), 'utf8'))
    expect(meta.published).toEqual({
      video_id: 'vidNew',
      url: 'https://www.youtube.com/shorts/vidNew',
      privacy: 'unlisted',
      uploaded_at: '2026-09-14T18:00:00.000Z',
    })
  })

  it('skips when published and privacy matches', async () => {
    const dir = writeProject(`
published:
  video_id: already
  url: https://www.youtube.com/shorts/already
  privacy: unlisted
  uploaded_at: 2026-09-14T10:00:00.000Z
`)
    const calls: string[] = []
    const result = await uploadShort(
      dir,
      { privacy: 'unlisted', force: false, skipPlaylist: false, config },
      { fetch: tokenFetch(), now: () => new Date(), createApi: () => mockApi(calls) },
    )
    expect(result.action).toBe('skipped')
    expect(result.videoId).toBe('already')
    expect(calls).toEqual([])
  })

  it('updates privacy on an existing video', async () => {
    const dir = writeProject(`
published:
  video_id: already
  url: https://www.youtube.com/shorts/already
  privacy: unlisted
  uploaded_at: 2026-09-14T10:00:00.000Z
`)
    const calls: string[] = []
    const result = await uploadShort(
      dir,
      { privacy: 'public', force: false, skipPlaylist: true, config },
      { fetch: tokenFetch(), now: () => new Date('2026-09-14T19:00:00.000Z'), createApi: () => mockApi(calls) },
    )
    expect(result.action).toBe('privacy-updated')
    expect(calls).toEqual(['updatePrivacy'])
    expect(parseYoutubeYml(readFileSync(join(dir, 'youtube.yml'), 'utf8')).published?.privacy).toBe(
      'public',
    )
  })

  it('creates the playlist when the title is missing', async () => {
    const dir = writeProject()
    const calls: string[] = []
    const result = await uploadShort(
      dir,
      { privacy: 'unlisted', force: false, skipPlaylist: false, config },
      {
        fetch: tokenFetch(),
        now: () => new Date('2026-09-14T18:00:00.000Z'),
        createApi: () => mockApi(calls, null),
      },
    )
    expect(result.action).toBe('uploaded')
    expect(result.warnings).toEqual([
      'Created playlist "Feel Your Protocol · Amsterdam EIPs"',
      'Created playlist "Feel Your Protocol · Robustness"',
    ])
    expect(calls).toEqual([
      'insertVideo',
      'setThumbnail',
      'playlist:Feel Your Protocol · Amsterdam EIPs',
      'createPlaylist:Feel Your Protocol · Amsterdam EIPs',
      'insertPlaylistItem',
      'playlist:Feel Your Protocol · Robustness',
      'createPlaylist:Feel Your Protocol · Robustness',
      'insertPlaylistItem',
    ])
  })
})
