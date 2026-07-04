import type { PlaybookConfig, PlaybookStep } from '../types.ts'
import {
  actionDurationMs,
  fitStepIntervals,
  stepHasActions,
} from './actionTiming.ts'
import type { VoiceManifest } from './types.ts'

const POST_CARD_TAIL_MS = 300
const MIN_WAIT_MS = 400
const TIMELINE_BUFFER_MS = 120
/** Outro CTA band — hold at least this long so Forkcast / FYP cards are readable. */
export const OUTRO_MIN_HOLD_MS = 5000

export interface MergeVoiceTimingOptions {
  minWaitMs?: number
  postCardTailMs?: number
}

function clonePlaybook(playbook: PlaybookConfig): PlaybookConfig {
  return JSON.parse(JSON.stringify(playbook)) as PlaybookConfig
}

function beatKey(step: PlaybookStep, index: number): string {
  return step.beat ?? `step-${index + 1}`
}

function nextVoiceBeat(
  steps: PlaybookStep[],
  fromIndex: number,
  manifest: VoiceManifest,
): { index: number; startMs: number } | undefined {
  for (let i = fromIndex + 1; i < steps.length; i++) {
    const key = beatKey(steps[i]!, i)
    const timing = manifest.beats[key]
    if (timing) return { index: i, startMs: timing.startMs }
  }
  return undefined
}

function isCardOnlyStep(step: PlaybookStep): boolean {
  const hasActions = stepHasActions(step)
  return Boolean(step.overlay) && !hasActions && step.cue === undefined
}

/**
 * Apply voice manifest timestamps to playbook cue/wait/interval fields.
 * Returns a new playbook; original is unchanged.
 */
export function mergeVoiceTiming(
  playbook: PlaybookConfig,
  manifest: VoiceManifest,
  options: MergeVoiceTimingOptions = {},
): PlaybookConfig {
  const merged = clonePlaybook(playbook)
  const postTail = options.postCardTailMs ?? POST_CARD_TAIL_MS
  const minWait = options.minWaitMs ?? MIN_WAIT_MS

  for (let i = 0; i < merged.steps.length; i++) {
    const step = merged.steps[i]!
    const key = beatKey(step, i)
    const voice = manifest.beats[key]
    if (!voice) continue

    const hasActions = stepHasActions(step)
    const next = nextVoiceBeat(merged.steps, i, manifest)

    if (isCardOnlyStep(step)) {
      if (key === 'outro') {
        step.wait = Math.max(voice.durationMs + postTail, OUTRO_MIN_HOLD_MS)
      } else {
        step.wait = voice.durationMs + postTail
      }
      continue
    }

    if (step.overlay && step.cue !== undefined && hasActions) {
      step.cue = voice.durationMs

      const postVoiceBudget =
        (next?.startMs ?? voice.endMs + 2000) - voice.endMs - TIMELINE_BUFFER_MS

      const fixedWithoutSteps = actionDurationMs({ ...step, step: undefined })
      const stepBudget = Math.max(0, postVoiceBudget - fixedWithoutSteps - minWait)

      if (step.step !== undefined) {
        const fitted = fitStepIntervals(step, stepBudget)
        if (fitted) step.step = fitted
      }

      const actionMs = actionDurationMs(step)
      step.wait = Math.max(minWait, postVoiceBudget - actionMs)
      continue
    }

    if (step.overlay && step.cue !== undefined && !hasActions) {
      step.cue = voice.durationMs
      const postVoiceBudget =
        (next?.startMs ?? voice.endMs + 2000) - voice.endMs - TIMELINE_BUFFER_MS
      step.wait = Math.max(minWait, postVoiceBudget)
      continue
    }

    if (step.overlay && !step.cue && !hasActions && step.wait !== undefined) {
      step.wait = voice.durationMs
    }
  }

  return merged
}

export function voiceTimingSummary(
  playbook: PlaybookConfig,
  manifest: VoiceManifest,
): Array<{ beat: string; voiceMs: number; stepTotalMs: number }> {
  const merged = mergeVoiceTiming(playbook, manifest)
  const rows: Array<{ beat: string; voiceMs: number; stepTotalMs: number }> = []

  for (let i = 0; i < merged.steps.length; i++) {
    const step = merged.steps[i]!
    const key = beatKey(step, i)
    const voice = manifest.beats[key]
    if (!voice) continue

    const hasActions = stepHasActions(step)
    let stepTotal = 0
    if (isCardOnlyStep(step)) {
      stepTotal = step.wait ?? 0
    } else if (step.cue !== undefined) {
      stepTotal = step.cue
      if (hasActions) {
        stepTotal += actionDurationMs(step) + (step.wait ?? 0)
      } else {
        stepTotal += step.wait ?? 0
      }
    } else {
      stepTotal = step.wait ?? 0
    }

    rows.push({ beat: key, voiceMs: voice.durationMs, stepTotalMs: stepTotal })
  }

  return rows
}
