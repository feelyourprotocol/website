import {
  DEFAULT_SENDER_BALANCE,
  FIRST_TOUCH_STATE_GAS,
  RECIPIENT_ADDRESS,
  SENDER_ADDRESS,
} from './constants'
import { buildLegacyValueTx } from './helpers'
import type { GasScenarioDefinition } from './types'

export const firstTouchScenario: GasScenarioDefinition = {
  id: '01-first-touch',
  title: '1. First-touch transfer',
  lesson:
    '1 wei to a brand-new account still costs about 21,000 execution gas — and about 183,600 ' +
    'state gas on Amsterdam to create the account. A wallet that still sends a gas limit of 21,000 ' +
    'runs out of gas.',
  step: 1,
  expectedAmsterdamStateGas: FIRST_TOUCH_STATE_GAS,
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'recipient (empty)',
      address: RECIPIENT_ADDRESS,
    },
  ],
  txSummary: [
    {
      label: 'tx',
      detail: `legacy transfer: 1 wei → ${RECIPIENT_ADDRESS}`,
    },
  ],
  buildTx(common, gasLimit) {
    return buildLegacyValueTx(common, gasLimit, 1n, 0n)
  },
}
