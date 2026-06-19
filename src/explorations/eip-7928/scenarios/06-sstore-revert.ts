import { createLegacyTx } from '@ethereumjs/tx'

import {
  CONTRACT_ADDRESS,
  contractAddress,
  DEFAULT_GAS_PRICE,
  DEFAULT_SENDER_BALANCE,
  SENDER_ADDRESS,
  SENDER_PRIVATE_KEY,
  SSTORE_REVERT_BYTECODE,
} from './constants'
import type { BalScenarioDefinition } from './types'

export const sstoreRevertScenario: BalScenarioDefinition = {
  id: '06-sstore-revert',
  title: '6. Reverted storage write',
  lesson:
    'This contract runs SSTORE and then REVERT — the write never commits. The access list ' +
    'still records that slot 0 was touched, but as a read only, not a write.',
  step: 6,
  adjustable: false,
  highlightFields: ['storageReads'],
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'contract',
      address: CONTRACT_ADDRESS,
      code: SSTORE_REVERT_BYTECODE,
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `legacy call → ${CONTRACT_ADDRESS}, SSTORE then REVERT, gasLimit 200000`,
    },
  ],
  bytecodeSteps: [
    { opcode: 'PUSH1 0x2a', comment: 'value 42' },
    { opcode: 'PUSH1 0x00', comment: 'storage slot 0' },
    { opcode: 'SSTORE', comment: 'attempted write (reverted)' },
    { opcode: 'PUSH1 0 / PUSH1 0 / REVERT', comment: 'undo all state changes' },
  ],
  buildTransactions(common) {
    return [
      createLegacyTx(
        {
          to: contractAddress,
          gasLimit: 200_000n,
          gasPrice: DEFAULT_GAS_PRICE,
        },
        { common },
      ).sign(SENDER_PRIVATE_KEY),
    ]
  },
}
