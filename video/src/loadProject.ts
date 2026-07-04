import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getExplorationMeta, themeForExploration } from './explorationRegistry.ts'
import type {
  ContentFile,
  LoadedVideoProject,
  PlaybookConfig,
  VideoContentConfig,
  VideoOverlayDefinition,
  VideoAnnotationDefinition,
  VideoHighlightSetDefinition,
  ZonesFile,
} from './types.ts'
import { mergeVoiceTiming } from './voice/mergeTiming.ts'
import { loadVoiceManifest } from './voice/synthesize.ts'

function readJsonFile<T>(path: string): T {
  const raw = readFileSync(path, 'utf8')
  return JSON.parse(raw) as T
}

function buildContentConfig(contentFile: ContentFile, zones?: ZonesFile): VideoContentConfig {
  const explorationId = contentFile.meta.exploration
  const overlays: Record<string, VideoOverlayDefinition> = {}
  const annotations: Record<string, VideoAnnotationDefinition> = {}
  const highlightSets: Record<string, VideoHighlightSetDefinition> = {}

  for (const [key, overlay] of Object.entries(contentFile.overlays)) {
    overlays[key] = { ...overlay, id: key }
  }

  for (const [key, annotation] of Object.entries(contentFile.annotations ?? {})) {
    annotations[key] = { ...annotation, id: key }
  }

  for (const [key, set] of Object.entries(contentFile.highlightSets ?? {})) {
    highlightSets[key] = { ...set, id: key }
  }

  const focusAreas: Record<string, { selector: string }> = {}
  if (zones?.focusAreas) {
    for (const [key, area] of Object.entries(zones.focusAreas)) {
      focusAreas[key] = { selector: area.selector }
    }
  }

  return {
    explorationId,
    theme: themeForExploration(explorationId),
    overlays,
    annotations: Object.keys(annotations).length ? annotations : undefined,
    highlightSets: Object.keys(highlightSets).length ? highlightSets : undefined,
    focusAreas: Object.keys(focusAreas).length ? focusAreas : undefined,
  }
}

function loadZones(projectDir: string): ZonesFile | undefined {
  const zonesPath = join(projectDir, 'zones.json')
  try {
    return readJsonFile<ZonesFile>(zonesPath)
  } catch {
    return undefined
  }
}

export function loadVideoProject(
  projectId: string,
  projectsRoot: string,
  options: { useVoiceTiming?: boolean } = {},
): LoadedVideoProject {
  const projectDir = join(projectsRoot, projectId)
  const contentPath = join(projectDir, 'content.json')
  const playbookPath = join(projectDir, 'playbook.json')

  const contentFile = readJsonFile<ContentFile>(contentPath)
  const playbook = readJsonFile<PlaybookConfig>(playbookPath)

  if (contentFile.meta.exploration !== playbook.exploration) {
    throw new Error(
      `content.json exploration (${contentFile.meta.exploration}) != playbook.json (${playbook.exploration})`,
    )
  }

  const explorationMeta = getExplorationMeta(playbook.exploration)
  const zones = loadZones(projectDir)
  const voiceManifest = loadVoiceManifest(projectDir)
  const playbookBase = playbook
  const useVoice = options.useVoiceTiming !== false && voiceManifest !== undefined
  const playbookResolved = useVoice ? mergeVoiceTiming(playbookBase, voiceManifest) : playbookBase

  return {
    projectId,
    projectDir,
    content: buildContentConfig(contentFile, zones),
    playbook: playbookResolved,
    playbookBase,
    voiceManifest,
    zones,
    explorationPath: explorationMeta.path,
  }
}

/** Playbook with voice timing applied when manifest exists. */
export function resolvePlaybook(project: LoadedVideoProject): PlaybookConfig {
  return project.playbook
}

export function estimatePlaybookDurationMs(playbook: PlaybookConfig): number {
  let total = 0
  for (const step of playbook.steps) {
    const hasActions =
      step.selectExample !== undefined ||
      step.step !== undefined ||
      step.scroll !== undefined ||
      step.expandCompanion !== undefined ||
      step.click !== undefined

    const readMs = step.cue ?? (step.overlay && !hasActions ? step.wait : 0) ?? 0
    total += readMs

    if (step.step !== undefined) {
      const action = typeof step.step === 'number' ? { count: step.step } : step.step
      total += (action.count ?? 1) * (action.interval ?? 400)
    }
    if (step.selectExample) total += 800
    if (step.scroll) total += 700
    if (step.expandCompanion) total += 500

    const holdMs =
      step.cue !== undefined && hasActions
        ? (step.wait ?? 0)
        : !step.overlay
          ? (step.wait ?? 0)
          : 0
    total += holdMs
  }
  return total
}
