import { describe, expect, it } from 'vitest'

import { playlistsForProject, topicPlaylistTitle } from '../topicPlaylist.ts'

describe('topicPlaylistTitle', () => {
  it('matches site topic titles', () => {
    expect(topicPlaylistTitle('robustness')).toBe('Feel Your Protocol · Robustness')
    expect(topicPlaylistTitle('ux')).toBe('Feel Your Protocol · UX')
  })

  it('rejects an unknown topic', () => {
    expect(() => topicPlaylistTitle('mev')).toThrow(/Unknown topic/)
  })
})

describe('playlistsForProject', () => {
  it('adds fork then topic, without duplicating', () => {
    expect(playlistsForProject('eip-8038', 'Feel Your Protocol · Amsterdam EIPs')).toEqual([
      'Feel Your Protocol · Amsterdam EIPs',
      'Feel Your Protocol · Robustness',
    ])
    expect(playlistsForProject('eip-7708', 'Feel Your Protocol · Amsterdam EIPs')).toEqual([
      'Feel Your Protocol · Amsterdam EIPs',
      'Feel Your Protocol · UX',
    ])
  })
})
