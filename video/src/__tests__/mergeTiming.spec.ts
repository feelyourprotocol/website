import { describe, expect, it } from 'vitest'

import { loadVideoProject } from '../loadProject.ts'
import { mergeVoiceTiming, voiceTimingSummary } from '../voice/mergeTiming.ts'
import type { VoiceManifest } from '../voice/types.ts'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const PROJECTS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../projects')

function fixtureManifest(): VoiceManifest {
  return {
    version: 1,
    generatedAt: '2026-01-01T00:00:00.000Z',
    model: 'eleven_v3',
    voiceId: 'test',
    audioFile: 'voice/full.mp3',
    segmentGapMs: 350,
    totalDurationMs: 30_000,
    beats: {
      hook: { startMs: 0, endMs: 4000, durationMs: 4000, segmentFile: 'voice/segments/hook.mp3' },
      context: { startMs: 4350, endMs: 7500, durationMs: 3150, segmentFile: 'voice/segments/context.mp3' },
      opcodes: { startMs: 7850, endMs: 12_000, durationMs: 4150, segmentFile: 'voice/segments/opcodes.mp3' },
      'stack-grow': {
        startMs: 12_350,
        endMs: 15_500,
        durationMs: 3150,
        segmentFile: 'voice/segments/stack-grow.mp3',
      },
      'dupn-hit': {
        startMs: 15_850,
        endMs: 19_500,
        durationMs: 3650,
        segmentFile: 'voice/segments/dupn-hit.mp3',
      },
      calculator: {
        startMs: 19_850,
        endMs: 23_000,
        durationMs: 3150,
        segmentFile: 'voice/segments/calculator.mp3',
      },
      recap: { startMs: 23_350, endMs: 26_500, durationMs: 3150, segmentFile: 'voice/segments/recap.mp3' },
      outro: { startMs: 26_850, endMs: 30_000, durationMs: 3150, segmentFile: 'voice/segments/outro.mp3' },
    },
  }
}

describe('mergeVoiceTiming', () => {
  it('sets card-only wait from voice duration', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const merged = mergeVoiceTiming(project.playbookBase, fixtureManifest())
    expect(merged.steps[0]?.wait).toBe(4300)
  })

  it('sets cue from voice duration on action beats', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const merged = mergeVoiceTiming(project.playbookBase, fixtureManifest())
    expect(merged.steps[3]?.cue).toBe(3150)
    expect(merged.steps[3]?.step).toBeDefined()
  })

  it('produces a summary row per voiced beat', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const rows = voiceTimingSummary(project.playbookBase, fixtureManifest())
    expect(rows.length).toBe(8)
    expect(rows[0]?.beat).toBe('hook')
  })

  it('holds outro at least 5s for CTA cards', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const merged = mergeVoiceTiming(project.playbookBase, fixtureManifest())
    expect(merged.steps.find((s) => s.beat === 'outro')?.wait).toBeGreaterThanOrEqual(5000)
  })
})
