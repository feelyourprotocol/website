import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

import { loadVideoProject } from '../loadProject.ts'
import { buildStoryboard, validateStoryboard } from '../storyboard.ts'

const PROJECTS_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../../projects')

describe('storyboard eip-8024', () => {
  it('builds a cue → reveal timeline', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const timeline = buildStoryboard(project.playbook, project.content)

    expect(timeline.entries.some((e) => e.phase === 'cue' && e.overlay === 'stack-cue')).toBe(true)
    expect(timeline.entries.some((e) => e.label.includes('step ×'))).toBe(true)
    expect(timeline.totalMs).toBeGreaterThan(30_000)
  })

  it('passes validation for focus areas and overlays', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const issues = validateStoryboard(project.playbook, project.content, project.zones)
    expect(issues.filter((i) => i.severity === 'error')).toHaveLength(0)
  })

  it('includes guide annotations in the timeline', () => {
    const project = loadVideoProject('eip-8024', PROJECTS_ROOT)
    const timeline = buildStoryboard(project.playbook, project.content)
    expect(timeline.entries.some((e) => e.phase === 'guide' && e.annotation === 'guide-stack')).toBe(
      true,
    )
  })
})
