import type { PlaybookStep, PlaybookStepAction } from '../types.ts'

export const SELECT_EXAMPLE_MS = 800
export const SCROLL_MS = 700
export const COMPANION_MS = 500
export const HIGHLIGHT_SWITCH_MS = 350

export function normalizeStepAction(step: number | PlaybookStepAction): PlaybookStepAction {
  if (typeof step === 'number') return { count: step, interval: 400 }
  return {
    count: step.count ?? 1,
    interval: step.interval ?? 400,
    climaxFrom: step.climaxFrom,
    climaxInterval: step.climaxInterval,
    climaxPauseMs: step.climaxPauseMs,
    highlightSet: step.highlightSet,
    highlightAfterStep: step.highlightAfterStep,
    highlightSetAfter: step.highlightSetAfter,
    holdAfterClimaxMs: step.holdAfterClimaxMs,
  }
}

export function stepHasActions(step: PlaybookStep): boolean {
  return (
    step.selectExample !== undefined ||
    step.step !== undefined ||
    step.scroll !== undefined ||
    step.expandCompanion !== undefined ||
    step.click !== undefined
  )
}

/** Fixed action duration for a step given step interval overrides. */
export function actionDurationMs(step: PlaybookStep, intervalOverride?: number): number {
  let total = 0
  if (step.selectExample) total += SELECT_EXAMPLE_MS
  if (step.scroll) total += SCROLL_MS
  if (step.expandCompanion) total += COMPANION_MS

  if (step.step !== undefined) {
    const action = normalizeStepAction(step.step)
    const count = action.count ?? 1
    const interval = intervalOverride ?? action.interval ?? 400
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
        total += HIGHLIGHT_SWITCH_MS + holdAfterClimaxMs
      }
    }
  }

  return total
}

export function fitStepIntervals(
  step: PlaybookStep,
  budgetMs: number,
): PlaybookStepAction | undefined {
  if (step.step === undefined) return undefined

  const template = normalizeStepAction(step.step)
  const count = template.count ?? 1
  const climaxFrom = template.climaxFrom ?? 0
  const climaxInterval = template.climaxInterval ?? Math.round((template.interval ?? 400) * 2.6)
  const climaxPauseMs = template.climaxPauseMs ?? 0
  const holdAfterClimaxMs = template.holdAfterClimaxMs ?? 0

  let overhead = 0
  if (climaxFrom > 0 && template.highlightSet) {
    overhead += climaxPauseMs + 150 + climaxInterval
    if (template.highlightAfterStep) {
      overhead += HIGHLIGHT_SWITCH_MS + holdAfterClimaxMs
    }
  }

  const routineCount = climaxFrom > 0 ? Math.max(0, climaxFrom - 1) : count
  const routineBudget = Math.max(routineCount * 280, budgetMs - overhead)
  const interval =
    routineCount > 0 ? Math.max(280, Math.floor(routineBudget / routineCount)) : (template.interval ?? 400)

  return { ...template, interval, climaxInterval }
}
