import type { Common } from '@ethereumjs/common'
import type { PrefixedHexString } from '@ethereumjs/util'

import {
  AMSTERDAM_EXISTING_PROGRAM_GAS,
  AMSTERDAM_NEW_SLOT_REGULAR_GAS,
  AMSTERDAM_STORAGE_WRITE,
  COLD_STORAGE_ACCESS,
  CONTRACT_ADDRESS,
  DEFAULT_SENDER_BALANCE,
  NEW_STORAGE_SLOT_STATE_GAS,
  OSAKA_EXISTING_PROGRAM_GAS,
  OSAKA_NEW_SLOT_PROGRAM_GAS,
  OSAKA_STORAGE_SET,
  OSAKA_STORAGE_WRITE,
  SENDER_ADDRESS,
  SLOAD_BYTECODE,
  SLOAD_PROGRAM_GAS,
  SSTORE_NEW_SLOT_BYTECODE,
  SSTORE_UPDATE_BYTECODE,
} from './constants'
import { buildLegacyCall } from './helpers'
import type { AccessScenarioDefinition, CostComponents } from './types'

const SLOT0 = `0x${'00'.repeat(32)}` as PrefixedHexString
const VALUE1 = `0x${'00'.repeat(31)}01` as PrefixedHexString

const EXISTING_COMPONENTS = {
  osaka: {
    access: COLD_STORAGE_ACCESS,
    write: OSAKA_STORAGE_WRITE,
    create: 0n,
    createMeter: 'none',
  },
  amsterdam: {
    access: COLD_STORAGE_ACCESS,
    write: AMSTERDAM_STORAGE_WRITE,
    create: 0n,
    createMeter: 'none',
  },
} as const satisfies Record<string, CostComponents>

const READ_COMPONENTS = {
  osaka: {
    access: COLD_STORAGE_ACCESS,
    write: 0n,
    create: 0n,
    createMeter: 'none',
  },
  amsterdam: {
    access: COLD_STORAGE_ACCESS,
    write: 0n,
    create: 0n,
    createMeter: 'none',
  },
} as const satisfies Record<string, CostComponents>

const NEW_SLOT_COMPONENTS = {
  osaka: {
    access: COLD_STORAGE_ACCESS,
    write: 0n,
    create: OSAKA_STORAGE_SET,
    createMeter: 'regular',
  },
  amsterdam: {
    access: COLD_STORAGE_ACCESS,
    write: AMSTERDAM_STORAGE_WRITE,
    create: NEW_STORAGE_SLOT_STATE_GAS,
    createMeter: 'state',
  },
} as const satisfies Record<string, CostComponents>

function callBuilder(_common: Common, gasLimit: bigint) {
  return buildLegacyCall(_common, gasLimit)
}

export const existingSlotScenario: AccessScenarioDefinition = {
  id: '01-existing-slot',
  title: '1. Update existing slot',
  lesson:
    'The slot already holds a value. Amsterdam still charges a touch (same as Osaka) and then a ' +
    'much larger change surcharge. Nothing is created — that meter stays empty.',
  step: 1,
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'contract (slot 0 = 1)',
      address: CONTRACT_ADDRESS,
      nonce: 1n,
      code: SSTORE_UPDATE_BYTECODE,
      storage: [{ slot: SLOT0, value: VALUE1 }],
    },
  ],
  programSummary: [
    {
      label: 'program',
      detail: 'PUSH 2 · PUSH 0 · SSTORE — write 2 into slot 0 (slot already holds 1)',
    },
  ],
  expectedProgramGas: {
    osaka: OSAKA_EXISTING_PROGRAM_GAS,
    amsterdam: AMSTERDAM_EXISTING_PROGRAM_GAS,
  },
  expectedComponents: EXISTING_COMPONENTS,
  expectedAmsterdamStateGas: 0n,
  buildTx: callBuilder,
}

export const readSlotScenario: AccessScenarioDefinition = {
  id: '02-read-slot',
  title: '2. Read the slot',
  lesson:
    'A read is only a touch. Cold SLOAD stays 2,100 on both forks — the expensive jump is the ' +
    'write, not the load.',
  step: 2,
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'contract (slot 0 = 1)',
      address: CONTRACT_ADDRESS,
      nonce: 1n,
      code: SLOAD_BYTECODE,
      storage: [{ slot: SLOT0, value: VALUE1 }],
    },
  ],
  programSummary: [
    {
      label: 'program',
      detail: 'PUSH 0 · SLOAD — read slot 0',
    },
  ],
  expectedProgramGas: {
    osaka: SLOAD_PROGRAM_GAS,
    amsterdam: SLOAD_PROGRAM_GAS,
  },
  expectedComponents: READ_COMPONENTS,
  expectedAmsterdamStateGas: 0n,
  buildTx: callBuilder,
}

export const newSlotScenario: AccessScenarioDefinition = {
  id: '03-new-slot',
  title: '3. Create a new slot',
  lesson:
    'First write to an empty slot adds a create charge. On Amsterdam that create is state gas ' +
    '(about 97,920) — the same meter as EIP-8037. Touch and change still sit on regular gas.',
  step: 3,
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'contract (empty slot 0)',
      address: CONTRACT_ADDRESS,
      nonce: 1n,
      code: SSTORE_NEW_SLOT_BYTECODE,
    },
  ],
  programSummary: [
    {
      label: 'program',
      detail: 'PUSH 1 · PUSH 0 · SSTORE — first write to an empty slot',
    },
  ],
  expectedProgramGas: {
    osaka: OSAKA_NEW_SLOT_PROGRAM_GAS,
    amsterdam: AMSTERDAM_NEW_SLOT_REGULAR_GAS,
  },
  expectedComponents: NEW_SLOT_COMPONENTS,
  expectedAmsterdamStateGas: NEW_STORAGE_SLOT_STATE_GAS,
  buildTx: callBuilder,
}

export const SCENARIO_ORDER = ['01-existing-slot', '02-read-slot', '03-new-slot'] as const

export const SCENARIOS: Record<string, AccessScenarioDefinition> = {
  [existingSlotScenario.id]: existingSlotScenario,
  [readSlotScenario.id]: readSlotScenario,
  [newSlotScenario.id]: newSlotScenario,
}

export function getScenario(id: string): AccessScenarioDefinition {
  const scenario = SCENARIOS[id]
  if (scenario === undefined) {
    throw new Error(`Unknown EIP-8038 scenario: ${id}`)
  }
  return scenario
}
