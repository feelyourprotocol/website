import { describe, expect, it } from 'vitest'

import { parseUploadArgs } from '../parseUploadArgs.ts'

describe('parseUploadArgs', () => {
  it('defaults to unlisted and no extra flags', () => {
    expect(parseUploadArgs(['eip-8038'])).toEqual({
      projectId: 'eip-8038',
      privacy: 'unlisted',
      dryRun: false,
      force: false,
      skipPlaylist: false,
    })
  })

  it('parses privacy and flags', () => {
    expect(
      parseUploadArgs(['eip-8038', '--privacy', 'public', '--dry-run', '--force', '--skip-playlist']),
    ).toEqual({
      projectId: 'eip-8038',
      privacy: 'public',
      dryRun: true,
      force: true,
      skipPlaylist: true,
    })
  })

  it('rejects a bad privacy value', () => {
    expect(() => parseUploadArgs(['eip-8038', '--privacy', 'hidden'])).toThrow(/--privacy/)
  })

  it('throws when the project id is missing', () => {
    expect(() => parseUploadArgs([])).toThrow(/Missing project id/)
  })
})
