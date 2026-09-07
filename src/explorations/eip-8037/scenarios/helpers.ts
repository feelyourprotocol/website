import type { Block } from '@ethereumjs/block'
import { createBlock } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, createAccount, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'

import {
  COINBASE_ADDRESS,
  DEFAULT_BLOCK_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
  RECIPIENT_ADDRESS,
  SENDER_PRIVATE_KEY,
} from './constants'
import type { PreStateAccount } from './types'

export function formatGas(value: bigint): string {
  return value.toLocaleString('en-US')
}

export function buildLegacyValueTx(common: Common, gasLimit: bigint, value: bigint, nonce: bigint) {
  return createLegacyTx(
    {
      nonce,
      gasLimit,
      gasPrice: DEFAULT_GAS_PRICE,
      value,
      to: createAddressFromString(RECIPIENT_ADDRESS),
    },
    { common },
  ).sign(SENDER_PRIVATE_KEY)
}

export function buildLegacyCall(
  common: Common,
  to: string,
  gasLimit: bigint,
  value: bigint,
  nonce: bigint,
) {
  return createLegacyTx(
    {
      nonce,
      gasLimit,
      gasPrice: DEFAULT_GAS_PRICE,
      value,
      to: createAddressFromString(to),
    },
    { common },
  ).sign(SENDER_PRIVATE_KEY)
}

export async function applyPreState(vm: VM, accounts: PreStateAccount[]): Promise<void> {
  for (const account of accounts) {
    const address = createAddressFromString(account.address)
    const acct =
      account.balance !== undefined || account.nonce !== undefined
        ? createAccount({
            nonce: account.nonce ?? 0n,
            balance: account.balance ?? 0n,
          })
        : new Account()
    await vm.stateManager.putAccount(address, acct)

    if (account.code !== undefined) {
      await vm.stateManager.putCode(address, hexToBytes(account.code))
    }
  }
}

export function buildTxBlock(common: Common): Block {
  return createBlock(
    {
      header: {
        number: 1n,
        gasLimit: DEFAULT_BLOCK_GAS_LIMIT,
        baseFeePerGas: 1n,
        coinbase: createAddressFromString(COINBASE_ADDRESS),
      },
    },
    { common, skipConsensusFormatValidation: true },
  )
}

export function formatPreStateChips(accounts: PreStateAccount[]): string[] {
  return accounts.map((account) => {
    const parts: string[] = [account.label]
    if (account.balance !== undefined) {
      parts.push(`${Number(account.balance) / 1e18} ETH`)
    }
    if (account.code !== undefined) {
      parts.push('code')
    }
    return parts.join(' · ')
  })
}
