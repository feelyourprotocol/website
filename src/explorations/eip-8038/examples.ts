import type { Examples } from '@/explorations/REGISTRY'

import { SCENARIO_ORDER, SCENARIOS } from './scenarios'

export interface AccessExampleMeta {
  title: string
  lesson: string
  step: number
}

export const exampleMeta: Record<string, AccessExampleMeta> = Object.fromEntries(
  SCENARIO_ORDER.map((id) => {
    const scenario = SCENARIOS[id]
    return [
      id,
      {
        title: scenario.title,
        lesson: scenario.lesson,
        step: scenario.step,
      },
    ]
  }),
)

export const examples: Examples = Object.fromEntries(
  SCENARIO_ORDER.map((id) => [id, { title: SCENARIOS[id].title, values: [id] }]),
)

export const DEFAULT_SCENARIO_ID = SCENARIO_ORDER[0]
