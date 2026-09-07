export { firstTouchScenario } from './01-first-touch'
export { fundedRecipientScenario } from './02-funded-recipient'
export { newStorageScenario } from './03-new-storage'

import { firstTouchScenario } from './01-first-touch'
import { fundedRecipientScenario } from './02-funded-recipient'
import { newStorageScenario } from './03-new-storage'
import type { GasScenarioDefinition } from './types'

export const SCENARIO_ORDER = ['01-first-touch', '02-funded-recipient', '03-new-storage'] as const

export const SCENARIOS: Record<string, GasScenarioDefinition> = {
  [firstTouchScenario.id]: firstTouchScenario,
  [fundedRecipientScenario.id]: fundedRecipientScenario,
  [newStorageScenario.id]: newStorageScenario,
}

export function getScenario(id: string): GasScenarioDefinition {
  const scenario = SCENARIOS[id]
  if (scenario === undefined) {
    throw new Error(`Unknown EIP-8037 scenario: ${id}`)
  }
  return scenario
}

export function getAdjacentScenarioId(currentId: string, direction: -1 | 1): string | undefined {
  const index = SCENARIO_ORDER.indexOf(currentId as (typeof SCENARIO_ORDER)[number])
  if (index === -1) return undefined
  const next = index + direction
  if (next < 0 || next >= SCENARIO_ORDER.length) return undefined
  return SCENARIO_ORDER[next]
}
