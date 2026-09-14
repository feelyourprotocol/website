import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { parseScalar, parseYoutubeYml } from '../parseYoutubeYml.ts'
import { YOUTUBE_YML_SCHEMA } from '../types.ts'
import { shortsUrl, writePublished } from '../writePublished.ts'

const PROJECTS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../../projects')

const FIXTURE = `schema: video-short-youtube/v1
id: eip-8038

title: 'EIP-8038 The Split: Touch, Change, Create (Amsterdam) #Shorts'

description: |
  EIP-8038 prices an SSTORE as touch, change, and create — the write is no longer one fused number.

  Explore it interactively:
  https://feelyourprotocol.org/eip-8038-state-access-gas

  #Ethereum #Amsterdam #SSTORE #FeelYourProtocol #Shorts

tags:
  - Ethereum
  - EIP-8038
  - Amsterdam

category: Science & Technology
playlist: Feel Your Protocol · Amsterdam EIPs

thumbnail:
  file: eip-8038-2026-09-14T10-36-04-final-thumb.jpg
  width: 1280
  time_sec: 1.5
  source: title-card

sources:
  exploration_url: https://feelyourprotocol.org/eip-8038-state-access-gas
  spec_url: https://eips.ethereum.org/EIPS/eip-8038
  forkcast_url: null
`

describe('parseScalar', () => {
  it('unwraps quotes, null, and numbers', () => {
    expect(parseScalar("'hello'")).toBe('hello')
    expect(parseScalar('null')).toBeNull()
    expect(parseScalar('1280')).toBe(1280)
    expect(parseScalar('1.5')).toBe(1.5)
  })
})

describe('parseYoutubeYml', () => {
  it('parses a fixture with block description and nested maps', () => {
    const meta = parseYoutubeYml(FIXTURE)
    expect(meta.schema).toBe(YOUTUBE_YML_SCHEMA)
    expect(meta.id).toBe('eip-8038')
    expect(meta.title).toContain('#Shorts')
    expect(meta.description).toContain('Explore it interactively')
    expect(meta.description.endsWith('\n')).toBe(true)
    expect(meta.tags).toEqual(['Ethereum', 'EIP-8038', 'Amsterdam'])
    expect(meta.playlist).toContain('Amsterdam')
    expect(meta.thumbnail.file).toMatch(/-final-thumb\.jpg$/)
    expect(meta.thumbnail.width).toBe(1280)
    expect(meta.thumbnail.time_sec).toBe(1.5)
    expect(meta.sources.forkcast_url).toBeNull()
    expect(meta.published).toBeUndefined()
  })

  it('loads committed project yaml', () => {
    for (const id of ['eip-8038', 'eip-7843']) {
      const meta = parseYoutubeYml(readFileSync(join(PROJECTS_ROOT, id, 'youtube.yml'), 'utf8'))
      expect(meta.id).toBe(id)
      expect(meta.title.endsWith('#Shorts')).toBe(true)
      expect(meta.category).toBe('Science & Technology')
      expect(meta.tags.length).toBeGreaterThan(3)
    }
  })

  it('rejects a wrong schema or category', () => {
    expect(() => parseYoutubeYml('schema: other\nid: x\n')).toThrow(/expected schema/)
    expect(() =>
      parseYoutubeYml(FIXTURE.replace('Science & Technology', 'Education')),
    ).toThrow(/Science & Technology/)
  })

  it('parses an existing published block', () => {
    const withPub = writePublished(FIXTURE, {
      video_id: 'abc123',
      url: shortsUrl('abc123'),
      privacy: 'unlisted',
      uploaded_at: '2026-09-14T16:00:00.000Z',
    })
    const meta = parseYoutubeYml(withPub)
    expect(meta.published?.video_id).toBe('abc123')
    expect(meta.published?.privacy).toBe('unlisted')
    expect(meta.sources.forkcast_url).toBeNull()
  })
})

describe('writePublished', () => {
  it('appends published on first write and replaces on the second', () => {
    const once = writePublished(FIXTURE, {
      video_id: 'aaa',
      url: shortsUrl('aaa'),
      privacy: 'unlisted',
      uploaded_at: '2026-09-14T16:00:00.000Z',
    })
    expect(once).toContain('video_id: aaa')
    const twice = writePublished(once, {
      video_id: 'bbb',
      url: shortsUrl('bbb'),
      privacy: 'public',
      uploaded_at: '2026-09-14T17:00:00.000Z',
    })
    expect(twice).toContain('video_id: bbb')
    expect(twice).not.toContain('video_id: aaa')
    expect(twice.match(/^published:/gm)?.length).toBe(1)
  })
})
