import { describe, expect, it } from 'vitest'

import { finalMp4Path } from '../outputPaths.ts'
import { parseGenerateCliArgs } from '../parseGenerateArgs.ts'

describe('parseGenerateCliArgs', () => {
  it('parses project id and flags', () => {
    expect(parseGenerateCliArgs(['eip-8024', '--preview', '--force-synth', '--skip-synth'])).toEqual({
      projectId: 'eip-8024',
      preview: true,
      forceSynth: true,
      skipSynth: true,
    })
  })

  it('throws when project id is missing', () => {
    expect(() => parseGenerateCliArgs([])).toThrow(/Missing project id/)
  })
})

describe('finalMp4Path', () => {
  it('replaces webm extension with -final.mp4', () => {
    expect(finalMp4Path('/out/eip-8024-2026.webm')).toBe('/out/eip-8024-2026-final.mp4')
  })
})
