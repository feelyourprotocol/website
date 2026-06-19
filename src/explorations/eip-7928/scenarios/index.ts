import { plainTransferScenario } from './01-plain-transfer'
import { contractSloadScenario } from './02-contract-sload'
import { sstoreWriteScenario } from './03-sstore-write'
import { createDeployScenario } from './04-create-deploy'
import { twoTransfersScenario } from './05-two-transfers'
import { sstoreRevertScenario } from './06-sstore-revert'
import { crossContractCallScenario } from './07-cross-contract-call'
import type { BalScenarioDefinition } from './types'

export const SCENARIOS: Record<string, BalScenarioDefinition> = {
  [plainTransferScenario.id]: plainTransferScenario,
  [contractSloadScenario.id]: contractSloadScenario,
  [sstoreWriteScenario.id]: sstoreWriteScenario,
  [createDeployScenario.id]: createDeployScenario,
  [twoTransfersScenario.id]: twoTransfersScenario,
  [sstoreRevertScenario.id]: sstoreRevertScenario,
  [crossContractCallScenario.id]: crossContractCallScenario,
}

/** Curriculum order for prev/next navigation in the UI. */
export const SCENARIO_ORDER = [
  plainTransferScenario.id,
  contractSloadScenario.id,
  sstoreWriteScenario.id,
  createDeployScenario.id,
  twoTransfersScenario.id,
  sstoreRevertScenario.id,
  crossContractCallScenario.id,
] as const

export type ScenarioId = (typeof SCENARIO_ORDER)[number]

export function getScenario(id: string): BalScenarioDefinition {
  const scenario = SCENARIOS[id]
  if (scenario === undefined) {
    throw new Error(`Unknown BAL scenario: ${id}`)
  }
  return scenario
}

export function getAdjacentScenarioId(id: string, direction: -1 | 1): string | undefined {
  const index = SCENARIO_ORDER.indexOf(id as ScenarioId)
  if (index === -1) return undefined
  const next = SCENARIO_ORDER[index + direction]
  return next
}
