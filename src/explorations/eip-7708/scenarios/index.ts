export { plainTransferScenario } from './01-plain-transfer'
export { contractWalletScenario } from './02-contract-wallet'
export { zeroValueScenario } from './03-zero-value'
export { revertedCallScenario } from './04-reverted-call'

import { plainTransferScenario } from './01-plain-transfer'
import { contractWalletScenario } from './02-contract-wallet'
import { zeroValueScenario } from './03-zero-value'
import { revertedCallScenario } from './04-reverted-call'
import type { TransferScenarioDefinition } from './types'

export const SCENARIO_ORDER = [
  '01-plain-transfer',
  '02-contract-wallet',
  '03-zero-value',
  '04-reverted-call',
] as const

export const SCENARIOS: Record<string, TransferScenarioDefinition> = {
  [plainTransferScenario.id]: plainTransferScenario,
  [contractWalletScenario.id]: contractWalletScenario,
  [zeroValueScenario.id]: zeroValueScenario,
  [revertedCallScenario.id]: revertedCallScenario,
}

export function getScenario(id: string): TransferScenarioDefinition {
  const scenario = SCENARIOS[id]
  if (scenario === undefined) {
    throw new Error(`Unknown EIP-7708 scenario: ${id}`)
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
