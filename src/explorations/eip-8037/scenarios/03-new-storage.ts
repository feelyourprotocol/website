import {
  CONTRACT_ADDRESS,
  DEFAULT_SENDER_BALANCE,
  EXECUTION_HEADROOM_GAS_LIMIT,
  NEW_STORAGE_SLOT_STATE_GAS,
  SENDER_ADDRESS,
  SSTORE_NEW_SLOT_BYTECODE,
} from './constants'
import { buildLegacyCall } from './helpers'
import type { GasScenarioDefinition } from './types'

export const newStorageScenario: GasScenarioDefinition = {
  id: '03-new-storage',
  title: '3. New storage slot',
  lesson:
    'First-touch is not only new accounts. A contract SSTORE into an empty slot charges state ' +
    'gas too (~97,920). The wallet estimator that only looks at the recipient will miss this — ' +
    'run the transaction here to measure both bars (a quick estimate is not enough for SSTORE).',
  step: 3,
  recommendedGasLimitFloor: EXECUTION_HEADROOM_GAS_LIMIT,
  expectedAmsterdamStateGas: NEW_STORAGE_SLOT_STATE_GAS,
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'contract (SSTORE)',
      address: CONTRACT_ADDRESS,
      nonce: 1n,
      code: SSTORE_NEW_SLOT_BYTECODE,
    },
  ],
  txSummary: [
    {
      label: 'tx',
      detail: `legacy CALL → ${CONTRACT_ADDRESS} (PUSH1 1 / PUSH1 0 / SSTORE)`,
    },
  ],
  buildTx(common, gasLimit) {
    return buildLegacyCall(common, CONTRACT_ADDRESS, gasLimit, 0n, 0n)
  },
}
