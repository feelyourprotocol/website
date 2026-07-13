import type {
  PlaybookConfig,
  PlaybookStep,
  PlaybookStepAction,
  VideoContentConfig,
  ZonesFile,
} from './types.ts'

export interface StoryboardEntry {
  index: number
  beat?: string
  phase: 'title' | 'cue' | 'reveal' | 'hold' | 'pause' | 'guide'
  overlay?: string
  annotation?: string
  placement?: string
  focus?: string
  durationMs: number
  label: string
}

export interface StoryboardTimeline {
  entries: StoryboardEntry[]
  totalMs: number
}

function stepHasActions(step: PlaybookStep): boolean {
  return (
    step.selectExample !== undefined ||
    step.step !== undefined ||
    step.scroll !== undefined ||
    step.expandCompanion !== undefined ||
    step.click !== undefined
  )
}

function stepAction(step: PlaybookStep): PlaybookStepAction | undefined {
  if (step.step === undefined) return undefined
  return typeof step.step === 'number' ? { count: step.step } : step.step
}

function actionDuration(step: PlaybookStep): number {
  let total = 0
  if (step.selectExample) total += 800
  const action = stepAction(step)
  if (action) {
    const count = action.count ?? 1
    const interval = action.interval ?? 400
    const climaxFrom = action.climaxFrom ?? 0
    const climaxInterval = action.climaxInterval ?? Math.round(interval * 2.6)
    const climaxPauseMs = action.climaxPauseMs ?? 0
    const holdAfterClimaxMs = action.holdAfterClimaxMs ?? 0

    for (let i = 0; i < count; i++) {
      const stepNum = i + 1
      const inClimax = climaxFrom > 0 && stepNum >= climaxFrom
      if (inClimax && action.highlightSet && stepNum === climaxFrom) {
        total += climaxPauseMs + 150
      }
      total += inClimax ? climaxInterval : interval
      if (action.highlightAfterStep === stepNum) {
        total += 350 + holdAfterClimaxMs
      }
    }
  }
  if (step.scroll) total += 700
  if (step.expandCompanion) total += 500
  return total
}

function formatTime(ms: number): string {
  const s = ms / 1000
  const m = Math.floor(s / 60)
  const r = s - m * 60
  return `${String(m).padStart(2, '0')}:${r.toFixed(1).padStart(4, '0')}`
}

export function buildStoryboard(
  playbook: PlaybookConfig,
  content?: VideoContentConfig,
): StoryboardTimeline {
  const entries: StoryboardEntry[] = []
  let cursor = 0

  for (let i = 0; i < playbook.steps.length; i++) {
    const step = playbook.steps[i]!
    const hasActions = stepHasActions(step)
    const beat = step.beat ?? `step-${i + 1}`
    const overlayDef = step.overlay && content?.overlays[step.overlay]
    const annotationDef = step.annotate && content?.annotations?.[step.annotate]

    if (step.annotate && annotationDef) {
      entries.push({
        index: i,
        beat,
        phase: 'guide',
        annotation: step.annotate,
        focus: annotationDef.target,
        durationMs: 0,
        label: `GUIDE → ${annotationDef.label} (parallel through beat)`,
      })
    }

    if (step.overlay) {
      const readMs = step.cue ?? (hasActions ? 0 : (step.wait ?? 0))
      if (readMs > 0) {
        entries.push({
          index: i,
          beat,
          phase: overlayDef?.type === 'title-card' || overlayDef?.type === 'outro-card' ? 'title' : 'cue',
          overlay: step.overlay,
          placement: step.placement ?? overlayDef?.placement,
          focus: step.focus,
          durationMs: readMs,
          label: `READ  "${overlayLabel(step.overlay, content)}"`,
        })
        cursor += readMs
      }
    }

    if (
      step.overlay &&
      (step.hideOverlay === true ||
        (hasActions && step.hideOverlay !== false && step.cue !== undefined))
    ) {
      entries.push({
        index: i,
        beat,
        phase: 'reveal',
        durationMs: 0,
        label: 'HIDE overlay → reveal exploration',
      })
    }

    if (step.hideOverlay && !step.overlay) {
      entries.push({
        index: i,
        beat,
        phase: 'pause',
        durationMs: 0,
        label: 'HIDE overlay',
      })
    }

    const actionMs = actionDuration(step)
    if (actionMs > 0) {
      entries.push({
        index: i,
        beat,
        phase: 'reveal',
        focus: step.focus,
        durationMs: actionMs,
        label: revealLabel(step),
      })
      cursor += actionMs
    }

    const holdMs =
      step.cue !== undefined && hasActions
        ? (step.wait ?? 0)
        : step.overlay && !hasActions
          ? 0
          : !step.overlay
            ? (step.wait ?? 0)
            : 0
    if (holdMs > 0) {
      entries.push({
        index: i,
        beat,
        phase: 'hold',
        focus: step.focus,
        durationMs: holdMs,
        label: 'HOLD (let viewer absorb)',
      })
      cursor += holdMs
    }
  }

  return { entries, totalMs: cursor }
}

function overlayLabel(id: string, content?: VideoContentConfig): string {
  const o = content?.overlays[id]
  if (!o) return id
  if (o.closing) return o.closing
  if (o.ctas?.length) return o.ctas.map((c) => `${c.label} → ${c.url}`).join(' · ')
  return o.text ?? o.headline ?? o.title ?? o.primary ?? o.cta ?? o.segments?.[0]?.text ?? id
}

function revealLabel(step: PlaybookStep): string {
  const parts: string[] = []
  if (step.selectExample) parts.push(`select ${step.selectExample}`)
  if (step.step !== undefined) {
    const a = typeof step.step === 'number' ? { count: step.step } : step.step
    parts.push(`step ×${a.count ?? 1}`)
  }
  if (step.scroll) parts.push('scroll')
  if (step.expandCompanion) parts.push(`companion ${step.expandCompanion}`)
  if (step.click) parts.push(`click ${step.click}`)
  return `REVEAL  ${parts.join(', ')}`
}

export function printStoryboard(timeline: StoryboardTimeline): void {
  let cursor = 0
  console.log('Storyboard timeline')
  console.log('─'.repeat(72))
  for (const entry of timeline.entries) {
    const at = formatTime(cursor)
    const dur = entry.durationMs > 0 ? ` (${Math.round(entry.durationMs / 100) / 10}s)` : ''
    const meta = [
      entry.overlay ? `overlay=${entry.overlay}` : '',
      entry.annotation ? `annotate=${entry.annotation}` : '',
      entry.placement ? `placement=${entry.placement}` : '',
      entry.focus ? `focus=${entry.focus}` : '',
    ]
      .filter(Boolean)
      .join(' ')
    console.log(`${at}  [${entry.phase.toUpperCase()}] ${entry.label}${dur}`)
    if (meta) console.log(`         ${meta}`)
    cursor += entry.durationMs
  }
  console.log('─'.repeat(72))
  console.log(`Total: ~${Math.round(timeline.totalMs / 1000)}s`)
}

export interface StoryboardIssue {
  step: number
  beat?: string
  severity: 'error' | 'warn'
  message: string
}

export function validateStoryboard(
  playbook: PlaybookConfig,
  content?: VideoContentConfig,
  zones?: ZonesFile,
): StoryboardIssue[] {
  const issues: StoryboardIssue[] = []

  for (let i = 0; i < playbook.steps.length; i++) {
    const step = playbook.steps[i]!
    const hasActions = stepHasActions(step)

    if (step.overlay && hasActions && step.cue === undefined && step.hideOverlay !== true) {
      issues.push({
        step: i + 1,
        beat: step.beat,
        severity: 'warn',
        message:
          'Overlay and actions in same beat without `cue` — text may cover the action. Add cue (read ms) then hide before reveal.',
      })
    }

    if (step.overlay && hasActions && step.cue !== undefined && step.cue < 1200) {
      issues.push({
        step: i + 1,
        beat: step.beat,
        severity: 'warn',
        message: `Cue ${step.cue}ms is short for reading — consider ≥1800ms.`,
      })
    }

    if (step.focus && zones && !zones.focusAreas[step.focus]) {
      issues.push({
        step: i + 1,
        beat: step.beat,
        severity: 'error',
        message: `Unknown focus "${step.focus}" — add to zones.json.`,
      })
    }

    if (step.overlay && content && !content.overlays[step.overlay]) {
      issues.push({
        step: i + 1,
        beat: step.beat,
        severity: 'error',
        message: `Unknown overlay "${step.overlay}" in content.json.`,
      })
    }

    if (step.annotate && content && !content.annotations?.[step.annotate]) {
      issues.push({
        step: i + 1,
        beat: step.beat,
        severity: 'error',
        message: `Unknown annotation "${step.annotate}" in content.json.`,
      })
    }

    if (step.annotate && content?.annotations?.[step.annotate] && zones) {
      const target = content.annotations[step.annotate]!.target
      if (!zones.focusAreas[target] && !target.startsWith('[') && !target.startsWith('.')) {
        issues.push({
          step: i + 1,
          beat: step.beat,
          severity: 'error',
          message: `Annotation target "${target}" not in zones.json focusAreas.`,
        })
      }
    }

    const action = stepAction(step)
    if (action?.highlightSet && content && !content.highlightSets?.[action.highlightSet]) {
      issues.push({
        step: i + 1,
        beat: step.beat,
        severity: 'error',
        message: `Unknown highlightSet "${action.highlightSet}" in content.json.`,
      })
    }
    if (action?.highlightSetAfter && content && !content.highlightSets?.[action.highlightSetAfter]) {
      issues.push({
        step: i + 1,
        beat: step.beat,
        severity: 'error',
        message: `Unknown highlightSetAfter "${action.highlightSetAfter}" in content.json.`,
      })
    }
  }

  return issues
}
