import type { PlaybookConfig } from './types.ts'

export interface CompanionCoverageIssue {
  step: number
  beat?: string
  severity: 'error' | 'warn'
  message: string
}

/** Controls in the main exploration chrome — covered when the companion sheet is half/full. */
export const STEPPER_CLICK_IDS = new Set([
  'bytecode-run',
  'bytecode-step',
  'run-block',
  'run-tx',
  'example-select',
])

export function isStepperClick(testId: string): boolean {
  return STEPPER_CLICK_IDS.has(testId)
}

function isLikelyCompanionClick(testId: string): boolean {
  return (
    testId === 'companion-peek' ||
    testId.startsWith('hardfork-') ||
    testId.startsWith('slot-') ||
    testId.startsWith('receipts-')
  )
}

/**
 * Walk the playbook in runner order (`selectExample` → `step` → `expandCompanion` → `click`)
 * and flag stepper actions the 540×960 companion sheet would cover.
 *
 * The sheet stays `half`/`full` until `expandCompanion: "peek"`. `hardfork-*` is not
 * classified here (main chrome on 7708/8037, companion on 7843) — rehearsal catches that.
 */
export function validateCompanionCoverage(playbook: PlaybookConfig): CompanionCoverageIssue[] {
  const issues: CompanionCoverageIssue[] = []
  let sheet: 'peek' | 'half' | 'full' = 'peek'

  for (let i = 0; i < playbook.steps.length; i++) {
    const step = playbook.steps[i]!
    const index = i + 1

    if (step.selectExample && sheet !== 'peek') {
      issues.push({
        step: index,
        beat: step.beat,
        severity: 'error',
        message: `selectExample while companion is ${sheet} — the sheet covers the example dropdown. Add expandCompanion: "peek" on an earlier beat.`,
      })
    }

    if (step.step !== undefined && sheet !== 'peek') {
      issues.push({
        step: index,
        beat: step.beat,
        severity: 'error',
        message: `bytecode-step while companion is ${sheet} — the sheet covers the stepper. Add expandCompanion: "peek" on an earlier beat.`,
      })
    }

    if (step.expandCompanion) sheet = step.expandCompanion

    if (!step.click) continue

    if (isStepperClick(step.click) && sheet !== 'peek') {
      issues.push({
        step: index,
        beat: step.beat,
        severity: 'error',
        message: `click "${step.click}" while companion is ${sheet} — the sheet covers the stepper. Add expandCompanion: "peek" on this beat (before the click) or an earlier beat.`,
      })
      continue
    }

    if (!isStepperClick(step.click) && !isLikelyCompanionClick(step.click) && sheet !== 'peek') {
      issues.push({
        step: index,
        beat: step.beat,
        severity: 'warn',
        message: `click "${step.click}" while companion is ${sheet} — if that control is in the stepper, add a peek beat first.`,
      })
    }
  }

  return issues
}
