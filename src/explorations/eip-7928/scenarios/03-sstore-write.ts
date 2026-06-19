import { createLegacyTx } from '@ethereumjs/tx'

import {
  CONTRACT_ADDRESS,
  contractAddress,
  DEFAULT_GAS_PRICE,
  DEFAULT_SENDER_BALANCE,
  SENDER_ADDRESS,
  SENDER_PRIVATE_KEY,
  SSTORE_42_BYTECODE,
} from './constants'
import type { BalScenarioDefinition } from './types'

export const sstoreWriteScenario: BalScenarioDefinition = {
  id: '03-sstore-write',
  title: '3. Storage write (SSTORE)',
  lesson:
    'When the contract writes slot 0, the BAL records storageChanges instead of storageReads. ' +
    'A successful write subsumes any read of the same slot in that transaction.',
  step: 3,
  adjustable: false,
  highlightFields: ['storageChanges'],
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
      code: SSTORE_42_BYTECODE,
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `legacy call → ${CONTRACT_ADDRESS}, executes SSTORE(0, 42), gasLimit 200000`,
    },
  ],
  bytecodeSteps: [
    { opcode: 'PUSH1 0x2a', comment: 'value 42' },
    { opcode: 'PUSH1 0x00', comment: 'storage slot 0' },
    { opcode: 'SSTORE', comment: 'persist to storage' },
    { opcode: 'STOP' },
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
