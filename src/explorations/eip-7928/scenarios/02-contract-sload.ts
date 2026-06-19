import { createLegacyTx } from '@ethereumjs/tx'

import {
  CONTRACT_ADDRESS,
  contractAddress,
  DEFAULT_GAS_PRICE,
  DEFAULT_SENDER_BALANCE,
  RETRIEVE_BYTECODE,
  SENDER_ADDRESS,
  SENDER_PRIVATE_KEY,
  SLOT_0,
  VALUE_42,
} from './constants'
import type { BalScenarioDefinition } from './types'

export const contractSloadScenario: BalScenarioDefinition = {
  id: '02-contract-sload',
  title: '2. Contract read (SLOAD)',
  lesson:
    'The contract is already deployed with slot 0 set to 42. This call only reads that slot — ' +
    'the access list records which slot was read, with no storage writes.',
  step: 2,
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
      code: RETRIEVE_BYTECODE,
      storage: [[SLOT_0, VALUE_42]],
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `legacy call → ${CONTRACT_ADDRESS}, empty calldata, gasLimit 100000`,
    },
  ],
  bytecodeSteps: [
    { opcode: 'PUSH1 0x00', comment: 'storage slot 0' },
    { opcode: 'SLOAD', comment: 'read slot → stack' },
    { opcode: 'PUSH1 0x00', comment: 'memory offset' },
    { opcode: 'MSTORE', comment: 'write 32-byte word to memory' },
    { opcode: 'PUSH1 0x20 / PUSH1 0x00 / RETURN', comment: 'return memory[0:32]' },
  ],
  buildTransactions(common) {
    return [
      createLegacyTx(
        {
          to: contractAddress,
          gasLimit: 100_000n,
          gasPrice: DEFAULT_GAS_PRICE,
        },
        { common },
      ).sign(SENDER_PRIVATE_KEY),
    ]
  },
}
