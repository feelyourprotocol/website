import type { PrefixedHexString } from '@ethereumjs/util'

import {
  CLEAR_BYTECODE,
  CONTRACT_ADDRESS,
  DEFAULT_SENDER_BALANCE,
  EXPECTED,
  RESET_BYTECODE,
  REWRITE_BYTECODE,
  SENDER_ADDRESS,
  SLOT0,
  VALUE1,
} from './constants'
import { buildLegacyCall } from './helpers'
import type { HardforkChoice, RefundScenarioDefinition } from './types'

function senderAndContract(code: PrefixedHexString, label: string) {
  return [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label,
      address: CONTRACT_ADDRESS,
      nonce: 1n,
      code,
      storage: [{ slot: SLOT0, value: VALUE1 }],
    },
  ]
}

function callBuilder(common: Parameters<typeof buildLegacyCall>[0], gasLimit: bigint) {
  return buildLegacyCall(common, gasLimit)
}

export const clearScenario: RefundScenarioDefinition = {
  id: '01-clear-slot',
  title: '1. Clear a slot',
  lesson:
    'The slot holds 1. The transaction writes 0. You get a storage-clear refund. On Glamsterdam ' +
    'that refund comes off your bill only — the block still counts the full charge. On Fusaka ' +
    'the refund shrinks the block too.',
  step: 1,
  preState: senderAndContract(CLEAR_BYTECODE, 'contract (slot 0 = 1)'),
  programSummary: [
    {
      label: 'program',
      detail: 'PUSH 0 · PUSH 0 · SSTORE — write 0 into slot 0',
    },
  ],
  expected: EXPECTED.clear,
  buildTx: callBuilder,
}

export const rewriteScenario: RefundScenarioDefinition = {
  id: '02-rewrite-slot',
  title: '2. Rewrite the slot',
  lesson:
    'The slot holds 1. The transaction writes 2. Nothing is cleared, so there is no refund. ' +
    'On each fork, what you pay is what the block counts. The two forks may charge different ' +
    'amounts for the write itself — that split is a separate change.',
  step: 2,
  preState: senderAndContract(REWRITE_BYTECODE, 'contract (slot 0 = 1)'),
  programSummary: [
    {
      label: 'program',
      detail: 'PUSH 2 · PUSH 0 · SSTORE — write 2 into slot 0',
    },
  ],
  expected: EXPECTED.rewrite,
  buildTx: callBuilder,
}

export const resetScenario: RefundScenarioDefinition = {
  id: '03-put-it-back',
  title: '3. Put the value back',
  lesson:
    'The slot holds 1. The transaction writes 2, then writes 1 again. Restoring the original ' +
    'is cheap work, so the block does not add a second full write. On Glamsterdam the extra ' +
    'refund still comes off your bill only. On Fusaka that refund shrinks the block as well.',
  step: 3,
  preState: senderAndContract(RESET_BYTECODE, 'contract (slot 0 = 1)'),
  programSummary: [
    {
      label: 'program',
      detail: 'PUSH 2 · SSTORE · PUSH 1 · SSTORE — write 2, then write 1 back',
    },
  ],
  expected: EXPECTED.reset,
  buildTx: callBuilder,
}

export const SCENARIOS = {
  [clearScenario.id]: clearScenario,
  [rewriteScenario.id]: rewriteScenario,
  [resetScenario.id]: resetScenario,
} as const

export const SCENARIO_ORDER = [clearScenario.id, rewriteScenario.id, resetScenario.id] as const

export type ScenarioId = (typeof SCENARIO_ORDER)[number]

export function getScenario(id: string): RefundScenarioDefinition {
  const scenario = SCENARIOS[id as ScenarioId]
  if (scenario === undefined) {
    throw new Error(`Unknown EIP-7778 scenario: ${id === '' ? '(empty)' : id}`)
  }
  return scenario
}

export function getAdjacentScenarioId(id: string, direction: -1 | 1): string | undefined {
  const index = SCENARIO_ORDER.indexOf(id as ScenarioId)
  if (index === -1) return undefined
  return SCENARIO_ORDER[index + direction]
}

export function figuresMatch(hardfork: HardforkChoice, id: string): boolean {
  const expected = getScenario(id).expected[hardfork]
  return expected.pay === expected.block
}
