import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { validateCompanionCoverage } from '../companionCoverage.ts'
import { loadVideoProject } from '../loadProject.ts'
import { validateStoryboard } from '../storyboard.ts'
import type { PlaybookConfig } from '../types.ts'

const PROJECTS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../projects')

function playbook(steps: PlaybookConfig['steps']): PlaybookConfig {
  return { format: 'shorts', exploration: 'test', steps }
}

describe('validateCompanionCoverage', () => {
  it('errors when bytecode-step runs while the sheet is still full', () => {
    const issues = validateCompanionCoverage(
      playbook([
        { beat: 'open', expandCompanion: 'full' },
        { beat: 'climax', step: { count: 2, interval: 380 } },
      ]),
    )
    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(1)
    expect(issues[0]?.message).toMatch(/bytecode-step while companion is full/)
  })

  it('errors when a stepper click follows expandCompanion full on the same beat', () => {
    const issues = validateCompanionCoverage(
      playbook([{ beat: 'reveal', expandCompanion: 'full', click: 'run-block' }]),
    )
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('run-block'))).toBe(true)
  })

  it('allows a companion click after expand, then a stepper click after peek', () => {
    const issues = validateCompanionCoverage(
      playbook([
        { beat: 'osaka', expandCompanion: 'full', click: 'hardfork-osaka' },
        { beat: 'run', expandCompanion: 'peek', click: 'bytecode-run' },
      ]),
    )
    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })

  it('allows stepping after an explicit peek beat', () => {
    const issues = validateCompanionCoverage(
      playbook([
        { beat: 'context', expandCompanion: 'half' },
        { beat: 'clear', expandCompanion: 'peek' },
        { beat: 'slotnum', step: { count: 2, interval: 380 } },
      ]),
    )
    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })
})

describe('companion coverage on shipped playbooks', () => {
  it('accepts eip-7843 (peek before stepper, expand before Osaka toggle)', () => {
    const project = loadVideoProject('eip-7843', PROJECTS_ROOT)
    const issues = validateStoryboard(project.playbook, project.content, project.zones)
    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })

  it('accepts eip-8024 (companion opens after the last stepper beat)', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const issues = validateStoryboard(project.playbook, project.content, project.zones)
    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })

  it('flags eip-7708 run-block clicks while the receipts sheet is still full', () => {
    const project = loadVideoProject('eip-7708', PROJECTS_ROOT)
    const issues = validateCompanionCoverage(project.playbook)
    const errors = issues.filter((i) => i.severity === 'error')
    expect(errors.length).toBeGreaterThan(0)
    expect(errors.some((i) => i.message.includes('run-block'))).toBe(true)
  })
})
