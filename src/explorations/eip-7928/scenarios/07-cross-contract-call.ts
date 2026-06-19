import { createLegacyTx } from '@ethereumjs/tx'

import {
  CALL_FORWARD_BYTECODE,
  CALLER_ADDRESS,
  callerAddress,
  CONTRACT_ADDRESS,
  DEFAULT_GAS_PRICE,
  DEFAULT_SENDER_BALANCE,
  RETRIEVE_BYTECODE,
  SENDER_ADDRESS,
  SENDER_PRIVATE_KEY,
  SLOT_0,
  VALUE_42,
} from './constants'
import type { BalScenarioDefinition } from './types'

export const crossContractCallScenario: BalScenarioDefinition = {
  id: '07-cross-contract-call',
  title: '7. Cross-contract CALL',
  lesson:
    'The sender calls contract A, which CALLs contract B. B reads slot 0 and returns — ' +
    'both contracts appear in the same access list because all state touches in a ' +
    'transaction roll up together, across call frames.',
  step: 7,
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
      label: 'caller',
      address: CALLER_ADDRESS,
      code: CALL_FORWARD_BYTECODE,
    },
    {
      label: 'callee',
      address: CONTRACT_ADDRESS,
      code: RETRIEVE_BYTECODE,
      storage: [[SLOT_0, VALUE_42]],
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `legacy call → ${CALLER_ADDRESS}, forwards CALL to ${CONTRACT_ADDRESS}, gasLimit 300000`,
    },
  ],
  bytecodeSteps: [
    { opcode: 'CALL → callee', comment: 'caller forwards with empty calldata' },
    { opcode: 'PUSH1 0x00 / SLOAD', comment: 'callee reads slot 0' },
    { opcode: 'MSTORE / RETURN', comment: 'callee returns 32-byte word to caller' },
  ],
  buildTransactions(common) {
    return [
      createLegacyTx(
        {
          to: callerAddress,
          gasLimit: 300_000n,
          gasPrice: DEFAULT_GAS_PRICE,
        },
        { common },
      ).sign(SENDER_PRIVATE_KEY),
    ]
  },
}
