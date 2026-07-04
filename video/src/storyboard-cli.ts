import './bootstrap-playwright-env.ts'

import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { loadVideoProject, resolvePlaybook } from './loadProject.ts'
import { buildStoryboard, printStoryboard, validateStoryboard } from './storyboard.ts'

const PROJECTS_ROOT = join(import.meta.dirname, '../projects')

function main(): void {
  const projectId = process.argv[2]
  if (!projectId) {
    console.error('Usage: npm run storyboard -- <project-id>')
    process.exit(1)
  }

  const projectDir = join(PROJECTS_ROOT, projectId)
  if (!existsSync(projectDir)) {
    console.error(`Unknown project: ${projectId}`)
    process.exit(1)
  }

  const project = loadVideoProject(projectId, PROJECTS_ROOT)
  const playbook = resolvePlaybook(project)
  const timeline = buildStoryboard(playbook, project.content)
  const issues = validateStoryboard(playbook, project.content, project.zones)

  console.log(`Project: ${projectId}`)
  if (project.voiceManifest) {
    console.log(`Voice timing: manifest (${Math.round(project.voiceManifest.totalDurationMs / 1000)}s)`)
  }
  printStoryboard(timeline)

  if (issues.length > 0) {
    console.log('\nValidation:')
    for (const issue of issues) {
      const prefix = issue.severity === 'error' ? 'ERROR' : 'WARN'
      console.log(`  [${prefix}] step ${issue.step}${issue.beat ? ` (${issue.beat})` : ''}: ${issue.message}`)
    }
    if (issues.some((i) => i.severity === 'error')) process.exit(1)
  } else {
    console.log('\nValidation: OK')
  }
}

main()
