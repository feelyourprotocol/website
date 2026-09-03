import { mkdirSync, readdirSync, renameSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { startStaticServer } from '../../og/src/server.ts'
import { assertChromiumReady } from './chromium.ts'
import { parseVideoFormatId, VIDEO_FORMATS, VIDEO_RECORD_FORMAT } from './formats.ts'
import { estimatePlaybookDurationMs, loadVideoProject } from './loadProject.ts'
import { pruneOtherGenerations } from './outputPaths.ts'
import { ensureVideoFontsReady, runPlaybook, showLeadInOverlay, waitForExplorationReady } from './playbookRunner.ts'
import { trimVideoLeadIn } from './trimLeadIn.ts'
import type { LoadedVideoProject } from './types.ts'

export interface RecordVideoOptions {
  preview?: boolean
  distDir: string
  projectsRoot: string
  /** When true, ignore voice/manifest.json for playbook timing */
  noVoice?: boolean
  /** Internal: called from generateVideo — adjusts console hints */
  fromGenerate?: boolean
}

export interface RecordVideoResult {
  project: LoadedVideoProject
  outputPath?: string
  estimatedDurationMs: number
}

function websiteDistPath(distDir: string): string {
  const path = join(distDir, 'website')
  try {
    if (!statSync(path).isDirectory()) throw new Error('not a directory')
  } catch {
    throw new Error(`Missing build output: ${path}\nRun: npm run website:build`)
  }
  return path
}

function buildExplorationUrl(baseUrl: string, project: LoadedVideoProject, example?: string): string {
  const params = new URLSearchParams({ 'fyp-video': '1' })
  if (example) params.set('example', example)
  return `${baseUrl}${project.explorationPath}?${params.toString()}`
}

function collectNewestWebm(dir: string, before: Set<string>): string | undefined {
  const after = readdirSync(dir).filter((f) => f.endsWith('.webm'))
  const added = after.filter((f) => !before.has(f))
  if (added.length === 0) return undefined
  const paths = added.map((f) => join(dir, f))
  paths.sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  return paths[0]
}

export async function recordVideo(
  projectId: string,
  options: RecordVideoOptions,
): Promise<RecordVideoResult> {
  const project = loadVideoProject(projectId, options.projectsRoot, {
    useVoiceTiming: !options.noVoice,
  })
  const deliverableId = parseVideoFormatId(
    options.preview ? 'shorts-preview' : project.playbook.format,
  )
  const deliverable = VIDEO_FORMATS[deliverableId]
  const recordFormat = VIDEO_RECORD_FORMAT
  const estimatedDurationMs = estimatePlaybookDurationMs(project.playbook)

  console.log(`Project: ${projectId}`)
  console.log(`Record:  ${recordFormat.viewportWidth}×${recordFormat.viewportHeight} (layout reference)`)
  console.log(`Output:  ${deliverable.width}×${deliverable.height}${options.preview ? '' : ' (2× upscale on mux)'}`)
  if (project.voiceManifest) {
    console.log(`Voice:   ~${Math.round(project.voiceManifest.totalDurationMs / 1000)}s (synced playbook)`)
  }
  console.log(`Est. duration: ~${Math.round(estimatedDurationMs / 1000)}s`)

  await assertChromiumReady()

  const distRoot = websiteDistPath(options.distDir)
  const server = await startStaticServer(distRoot)
  const outputDir = join(project.projectDir, 'output')
  mkdirSync(outputDir, { recursive: true })

  const existingWebms = new Set(readdirSync(outputDir).filter((f) => f.endsWith('.webm')))

  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })

  try {
    const context = await browser.newContext({
      viewport: { width: recordFormat.viewportWidth, height: recordFormat.viewportHeight },
      deviceScaleFactor: recordFormat.deviceScaleFactor,
      recordVideo: {
        dir: outputDir,
        // Must match reference viewport — deliverable upscale happens at mux time.
        size: { width: recordFormat.viewportWidth, height: recordFormat.viewportHeight },
      },
    })

    const page = await context.newPage()

    page.on('console', (msg) => {
      if (msg.type() === 'error') console.error(`  [page] ${msg.text()}`)
    })

    await page.addInitScript((config) => {
      window.__FYP_VIDEO_CONFIG__ = config
      document.documentElement.classList.add('fyp-video-capture')
      document.documentElement.style.backgroundColor = '#000'
      if (document.body) document.body.style.backgroundColor = '#000'
      const href =
        'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700&display=block'
      if (!document.querySelector('link[data-fyp-video-fonts]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.dataset.fypVideoFonts = '1'
        document.head.appendChild(link)
      }
      const explorationRoot = `#${config.explorationId}-c`
      const style = document.createElement('style')
      style.dataset.fypVideoLeadIn = '1'
      style.textContent = `
        html.fyp-video-capture:not(.fyp-video-lead-in-ready) ${explorationRoot} {
          visibility: hidden !important;
        }
      `
      document.documentElement.appendChild(style)
    }, project.content)

    const url = buildExplorationUrl(server.url, project, project.playbook.defaultExample)

    console.log(`Recording: ${url}`)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60_000 })

    await ensureVideoFontsReady(page)

    const firstStep = project.playbook.steps[0]
    const leadInOverlay = firstStep?.overlay

    if (leadInOverlay) {
      console.log(`Lead-in: ${leadInOverlay}`)
      await showLeadInOverlay(page, leadInOverlay)
    }

    // Load exploration behind the title card (EVM init can take several seconds).
    await waitForExplorationReady(page, project.content.explorationId)

    console.log('Running playbook…')
    await runPlaybook(page, project.playbook, {
      skipInitialOverlay: leadInOverlay,
      content: project.content,
      zones: project.zones,
      onStep: (i, step) => {
        const label = step.overlay ?? step.selectExample ?? step.step ?? 'action'
        console.log(`  step ${i + 1}: ${typeof label === 'object' ? 'step' : label}`)
      },
    })

    await page.waitForTimeout(500)
    await context.close()

    const rawWebm = collectNewestWebm(outputDir, existingWebms)
    if (!rawWebm) {
      throw new Error('Playwright did not produce a .webm file')
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const finalPath = join(outputDir, `${projectId}-${timestamp}.webm`)
    renameSync(rawWebm, finalPath)

    console.log('Verifying lead-in preview frame…')
    const trim = trimVideoLeadIn(finalPath)
    if (trim.trimmedSec > 0) {
      console.log(
        `  Trimmed ${trim.trimmedSec.toFixed(2)}s black lead-in (luminance ${trim.maxLuminanceBefore} → ${trim.maxLuminanceAfter})`,
      )
    } else {
      console.log(`  Lead-in OK (luminance ${trim.maxLuminanceAfter})`)
    }

    console.log(`Saved (silent intermediate — no audio): ${finalPath}`)

    // Keep only the newest generation in output/ — one project = one uploadable set.
    const pruned = pruneOtherGenerations(outputDir, projectId, timestamp)
    if (pruned.deleted.length) {
      console.log(`Pruned ${pruned.deleted.length} older generation file(s):`)
      for (const p of pruned.deleted) console.log(`  ${p}`)
    }

    if (project.voiceManifest && !options.fromGenerate && !options.noVoice) {
      const flags = [options.preview ? '--preview' : '', '--skip-synth'].filter(Boolean).join(' ')
      console.log(
        `\nTo mux voice into the final upload file:\n  npm run video:generate -- ${projectId} ${flags}`.trimEnd(),
      )
    }
    return { project, outputPath: finalPath, estimatedDurationMs }
  } finally {
    await browser.close()
    await server.close()
  }
}
