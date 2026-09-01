import { DEFAULT_SENDER_BALANCE, RECIPIENT_ADDRESS, SENDER_ADDRESS } from './constants'
import { buildFirstTouchLegacyTransfer } from './helpers'
import type { TransferScenarioDefinition } from './types'

export const zeroValueScenario: TransferScenarioDefinition = {
  id: '03-zero-value',
  title: '3. Zero-value transfer',
  lesson:
    'Zero-value moves are intentionally silent — no Transfer log. Filters that only watch ' +
    'ERC-20 events stay quiet when nothing actually moved.',
  step: 3,
  expectedTransferLogsOnAmsterdam: 0,
  emptyAmsterdamHint: 'Correct — zero-value transfers do not emit EIP-7708 logs.',
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
      detail: `legacy transfer: 0 wei → ${RECIPIENT_ADDRESS}`,
    },
  ],
  buildTransactions(common) {
    return [buildFirstTouchLegacyTransfer(common, 0n, 0n)]
  },
}
