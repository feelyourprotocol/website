import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromString } from '@ethereumjs/util'

import {
  DEFAULT_GAS_PRICE,
  DEFAULT_SENDER_BALANCE,
  RECIPIENT_ADDRESS,
  SENDER_ADDRESS,
  SENDER_PRIVATE_KEY,
} from './constants'
import { buildFirstTouchLegacyTransfer, legacyExistingRecipientGasLimit } from './helpers'
import type { BalScenarioDefinition } from './types'

export const twoTransfersScenario: BalScenarioDefinition = {
  id: '05-two-transfers',
  title: '5. Two transactions in one block',
  lesson:
    'This block runs two transfers back-to-back from the same sender. Each access-list ' +
    'entry is tagged with which transaction caused it — tx 1 or tx 2 — so effects from ' +
    'different transactions stay distinguishable. The first transfer pays first-touch state gas; ' +
    'the second reuses the recipient account.',
  step: 5,
  adjustable: false,
  highlightFields: ['balanceChanges', 'nonceChanges'],
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'recipient',
      address: RECIPIENT_ADDRESS,
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `legacy transfer: 1 wei → ${RECIPIENT_ADDRESS}, Amsterdam first-touch gas`,
    },
    {
      label: 'tx 2',
      detail: `legacy transfer: 2 wei → ${RECIPIENT_ADDRESS}, recipient already exists`,
    },
  ],
  buildTransactions(common) {
    const to = createAddressFromString(RECIPIENT_ADDRESS)
    const secondGasLimit = legacyExistingRecipientGasLimit(common, 2n, 1n)
    return [
      buildFirstTouchLegacyTransfer(common, 1n, 0n),
      createLegacyTx(
        {
          nonce: 1n,
          gasLimit: secondGasLimit,
          gasPrice: DEFAULT_GAS_PRICE,
          value: 2n,
          to,
        },
        { common },
      ).sign(SENDER_PRIVATE_KEY),
    ]
  },
}
