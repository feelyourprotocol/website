import { createLegacyTx } from '@ethereumjs/tx'
import { createAddressFromString } from '@ethereumjs/util'

import {
  DEFAULT_GAS_PRICE,
  DEFAULT_SENDER_BALANCE,
  RECIPIENT_ADDRESS,
  SENDER_ADDRESS,
  SENDER_PRIVATE_KEY,
} from './constants'
import type { BalScenarioDefinition } from './types'

export const plainTransferScenario: BalScenarioDefinition = {
  id: '01-plain-transfer',
  title: '1. Plain ETH transfer',
  lesson:
    'A simple value transfer touches sender and recipient balances and bumps the sender nonce. ' +
    'No contract code or storage is involved.',
  step: 1,
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
      detail: `legacy transfer: 1 wei → ${RECIPIENT_ADDRESS}, gasLimit 21000`,
    },
  ],
  buildTransactions(common) {
    return [
      createLegacyTx(
        {
          gasLimit: 21000n,
          gasPrice: DEFAULT_GAS_PRICE,
          value: 1n,
          to: createAddressFromString(RECIPIENT_ADDRESS),
        },
        { common },
      ).sign(SENDER_PRIVATE_KEY),
    ]
  },
}
