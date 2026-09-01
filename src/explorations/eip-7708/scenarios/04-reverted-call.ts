import {
  DEFAULT_SENDER_BALANCE,
  REVERT_BYTECODE,
  REVERT_CALLEE_ADDRESS,
  REVERT_CALLER_BYTECODE,
  SENDER_ADDRESS,
  WALLET_ADDRESS,
} from './constants'
import { buildLegacyCall } from './helpers'
import type { TransferScenarioDefinition } from './types'

export const revertedCallScenario: TransferScenarioDefinition = {
  id: '04-reverted-call',
  title: '4. Reverted inner CALL',
  lesson:
    'If a value-bearing CALL reverts, the ETH move rolls back — and the Transfer log disappears ' +
    'with it. Only successful nonzero transfers are logged.',
  step: 4,
  expectedTransferLogsOnAmsterdam: 0,
  emptyAmsterdamHint: 'Correct — reverted value transfers leave no EIP-7708 log.',
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'caller contract',
      address: WALLET_ADDRESS,
      balance: 1_000_000n,
      code: REVERT_CALLER_BYTECODE,
    },
    {
      label: 'revert callee',
      address: REVERT_CALLEE_ADDRESS,
      code: REVERT_BYTECODE,
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `call caller → CALL 1 wei to reverting callee (${REVERT_CALLEE_ADDRESS})`,
    },
  ],
  buildTransactions(common) {
    return [buildLegacyCall(common, WALLET_ADDRESS, 0n, 0n, 1_000_000n)]
  },
}
