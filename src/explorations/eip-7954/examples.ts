import type { Examples } from '@/explorations/REGISTRY'

import { SCENARIO_ORDER, SCENARIOS } from './scenarios'

export const examples: Examples = Object.fromEntries(
  SCENARIO_ORDER.map((id) => [id, { title: SCENARIOS[id]!.title, values: [id] }]),
)

export const DEFAULT_SCENARIO_ID = SCENARIO_ORDER[0]
