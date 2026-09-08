import type { Examples } from '@/explorations/REGISTRY'

import { SCENARIO_ORDER, SCENARIOS } from './scenarios'

export interface GasExampleMeta {
  title: string
  lesson: string
  step: number
  expectedAmsterdamStateGas: bigint
}

export const exampleMeta: Record<string, GasExampleMeta> = Object.fromEntries(
  SCENARIO_ORDER.map((id) => {
    const scenario = SCENARIOS[id]
    return [
      id,
      {
        title: scenario.title,
        lesson: scenario.lesson,
        step: scenario.step,
        expectedAmsterdamStateGas: scenario.expectedAmsterdamStateGas,
      },
    ]
  }),
)

export const examples: Examples = Object.fromEntries(
  SCENARIO_ORDER.map((id) => [id, { title: SCENARIOS[id].title, values: [id] }]),
)

export const DEFAULT_SCENARIO_ID = SCENARIO_ORDER[0]
