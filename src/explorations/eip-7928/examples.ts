import type { Examples } from '@/explorations/REGISTRY'

import { SCENARIO_ORDER, SCENARIOS } from './scenarios'
import type { BalHighlightField } from './scenarios/types'

/** Extended metadata keyed by scenario id (values[0] in {@link examples}). */
export interface BalExampleMeta {
  title: string
  lesson: string
  step: number
  adjustable: boolean
  highlightFields: BalHighlightField[]
}

export const exampleMeta: Record<string, BalExampleMeta> = Object.fromEntries(
  SCENARIO_ORDER.map((id) => {
    const scenario = SCENARIOS[id]
    return [
      id,
      {
        title: scenario.title,
        lesson: scenario.lesson,
        step: scenario.step,
        adjustable: scenario.adjustable,
        highlightFields: scenario.highlightFields,
      },
    ]
  }),
)

/** ExamplesUIC-compatible presets; values[0] is the scenario id passed to {@link runScenario}. */
export const examples: Examples = Object.fromEntries(
  SCENARIO_ORDER.map((id) => [id, { title: SCENARIOS[id].title, values: [id] }]),
)

export const DEFAULT_SCENARIO_ID = SCENARIO_ORDER[0]
