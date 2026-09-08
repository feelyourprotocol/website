import { DEFAULT_SENDER_BALANCE, RECIPIENT_ADDRESS, SENDER_ADDRESS } from './constants'
import { buildLegacyValueTx } from './helpers'
import type { GasScenarioDefinition } from './types'

export const fundedRecipientScenario: GasScenarioDefinition = {
  id: '02-funded-recipient',
  title: '2. Funded recipient',
  lesson:
    'The same 1-wei transfer to an account that already holds ETH does not create state. The ' +
    'state-gas bar collapses — 21,000 is enough again, even on Amsterdam.',
  step: 2,
  expectedAmsterdamStateGas: 0n,
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'recipient (funded)',
      address: RECIPIENT_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 1n,
    },
  ],
  txSummary: [
    {
      label: 'tx',
      detail: `legacy transfer: 1 wei → already-alive ${RECIPIENT_ADDRESS}`,
    },
  ],
  buildTx(common, gasLimit) {
    return buildLegacyValueTx(common, gasLimit, 1n, 0n)
  },
}
