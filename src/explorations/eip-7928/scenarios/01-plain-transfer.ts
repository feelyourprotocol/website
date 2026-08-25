import { DEFAULT_SENDER_BALANCE, RECIPIENT_ADDRESS, SENDER_ADDRESS } from './constants'
import { buildFirstTouchLegacyTransfer } from './helpers'
import type { BalScenarioDefinition } from './types'

export const plainTransferScenario: BalScenarioDefinition = {
  id: '01-plain-transfer',
  title: '1. Plain ETH transfer',
  lesson:
    'A simple value transfer touches sender and recipient balances and bumps the sender nonce. ' +
    'On Amsterdam, a first-touch recipient also needs enough gas for EIP-8037 state creation — ' +
    '21,000 alone is not enough. EIP-7708 adds a Transfer log in the receipt.',
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
      detail: `legacy transfer: 1 wei → ${RECIPIENT_ADDRESS}, gasLimit sized for Amsterdam first-touch`,
    },
  ],
  buildTransactions(common) {
    return [buildFirstTouchLegacyTransfer(common, 1n, 0n)]
  },
}
