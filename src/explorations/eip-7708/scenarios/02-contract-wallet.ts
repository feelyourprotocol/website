import {
  DEFAULT_SENDER_BALANCE,
  RECIPIENT_ADDRESS,
  SENDER_ADDRESS,
  WALLET_ADDRESS,
  WALLET_FORWARD_BYTECODE,
} from './constants'
import { buildLegacyCall } from './helpers'
import type { TransferScenarioDefinition } from './types'

export const contractWalletScenario: TransferScenarioDefinition = {
  id: '02-contract-wallet',
  title: '2. Contract wallet sends ETH',
  lesson:
    'When a contract moves ETH via CALL, the Transfer log still appears — even though the tx `to` ' +
    'is the wallet, not the final recipient. Deposits to smart contract wallets become visible.',
  step: 2,
  expectedTransferLogsOnAmsterdam: 1,
  preState: [
    {
      label: 'sender',
      address: SENDER_ADDRESS,
      balance: DEFAULT_SENDER_BALANCE,
      nonce: 0n,
    },
    {
      label: 'wallet',
      address: WALLET_ADDRESS,
      balance: 1_000_000n,
      code: WALLET_FORWARD_BYTECODE,
    },
    {
      label: 'recipient',
      address: RECIPIENT_ADDRESS,
    },
  ],
  txSummary: [
    {
      label: 'tx 1',
      detail: `call wallet → wallet CALLs 1 wei → ${RECIPIENT_ADDRESS}`,
    },
  ],
  buildTransactions(common) {
    return [buildLegacyCall(common, WALLET_ADDRESS, 0n, 0n, 1_000_000n)]
  },
}
