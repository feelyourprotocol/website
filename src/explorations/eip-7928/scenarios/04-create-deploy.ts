import { createLegacyTx } from '@ethereumjs/tx'
import { hexToBytes } from '@ethereumjs/util'

import {
  CREATE_DEPLOY_INIT_BYTECODE,
  CREATE_DEPLOYED_ADDRESS,
  DEFAULT_GAS_PRICE,
  DEFAULT_SENDER_BALANCE,
  SENDER_ADDRESS,
  SENDER_PRIVATE_KEY,
} from './constants'
import type { BalScenarioDefinition } from './types'

export const createDeployScenario: BalScenarioDefinition = {
  id: '04-create-deploy',
  title: '4. Contract deploy (CREATE)',
  lesson:
    'The sender broadcasts a contract-creation transaction with no recipient address. ' +
    'Init code runs once, returns runtime bytecode, and a new account appears at a ' +
    'deterministic address — the access list records the deployed code.',
  step: 4,
  adjustable: false,
  highlightFields: ['codeChanges'],
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `legacy CREATE, init code → ${CREATE_DEPLOYED_ADDRESS}, gasLimit 500000`,
    },
  ],
  bytecodeSteps: [
    { opcode: 'PUSH1 size / PUSH1 offset / CODECOPY', comment: 'init: copy runtime into memory' },
    { opcode: 'PUSH1 size / PUSH1 0 / RETURN', comment: 'init: return runtime as contract code' },
    { opcode: 'PUSH1 0x2a / PUSH1 0x00 / SSTORE / STOP', comment: 'runtime deployed on-chain' },
  ],
  buildTransactions(common) {
    return [
      createLegacyTx(
        {
          data: hexToBytes(CREATE_DEPLOY_INIT_BYTECODE),
          gasLimit: 500_000n,
          gasPrice: DEFAULT_GAS_PRICE,
        },
        { common },
      ).sign(SENDER_PRIVATE_KEY),
    ]
  },
}
