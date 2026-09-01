import { DEFAULT_SENDER_BALANCE, RECIPIENT_ADDRESS, SENDER_ADDRESS } from './constants'
import { buildFirstTouchLegacyTransfer } from './helpers'
import type { TransferScenarioDefinition } from './types'

export const plainTransferScenario: TransferScenarioDefinition = {
  id: '01-plain-transfer',
  title: '1. Plain ETH transfer',
  lesson:
    'A nonzero tx value emits a synthetic ERC-20-style Transfer log from the system address — ' +
    'before any contract logs. Indexers can treat native ETH like a token event.',
  step: 1,
  expectedTransferLogsOnAmsterdam: 1,
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
      detail: `legacy transfer: 1 wei → ${RECIPIENT_ADDRESS}`,
    },
  ],
  buildTransactions(common) {
    return [buildFirstTouchLegacyTransfer(common, 1n, 0n)]
  },
}
