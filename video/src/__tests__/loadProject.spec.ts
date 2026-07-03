import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { estimatePlaybookDurationMs, loadVideoProject } from '../loadProject.ts'
import { parseRecordCliArgs } from '../parseRecordArgs.ts'
import { themeForExploration } from '../explorationRegistry.ts'

const PROJECTS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../projects')

describe('loadVideoProject eip-8024', () => {
  it('loads content and playbook with matching exploration ids', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)

    expect(project.content.explorationId).toBe('eip-8024')
    expect(project.playbook.exploration).toBe('eip-8024')
    expect(project.explorationPath).toContain('eip-8024')
    expect(project.content.overlays['title-card']?.type).toBe('title-card')
    expect(project.content.theme?.accent).toBe('#a855f7')
  })

  it('assigns overlay ids from content keys', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    expect(project.content.overlays['dupn-cue']?.id).toBe('dupn-cue')
    expect(project.zones?.focusAreas.stack?.selector).toContain('bytecode-stack')
  })

  it('estimates a shorts-friendly duration', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const ms = estimatePlaybookDurationMs(project.playbook)
    expect(ms).toBeGreaterThan(25_000)
    expect(ms).toBeLessThan(90_000)
  })
})

describe('themeForExploration', () => {
  it('returns purple for robustness explorations', () => {
    expect(themeForExploration('eip-8024').text).toBe('#6b21a8')
  })
})

describe('parseRecordCliArgs', () => {
  it('parses project id and flags', () => {
    expect(parseRecordCliArgs(['eip-8024', '--preview', '--dry-run'])).toEqual({
      projectId: 'eip-8024',
      preview: true,
      dryRun: true,
    })
  })

  it('throws when project id is missing', () => {
    expect(() => parseRecordCliArgs([])).toThrow(/Missing project id/)
  })
})
