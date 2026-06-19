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
    'The contract starts with empty storage. This call writes 42 into slot 0 — ' +
    'the access list records that as a storage write. If the same slot was read earlier in ' +
    'the transaction, only the write is listed.',
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
