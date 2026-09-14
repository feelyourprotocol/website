import type { Block } from '@ethereumjs/block'
import { createBlock } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import { Account, createAccount, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'

import {
  COINBASE_ADDRESS,
  CONTRACT_ADDRESS,
  DEFAULT_BLOCK_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
  SENDER_PRIVATE_KEY,
} from './constants'
import type { PreStateAccount } from './types'

export function formatGas(value: bigint): string {
  return value.toLocaleString('en-US')
}

export function buildLegacyCall(common: Common, gasLimit: bigint) {
  return createLegacyTx(
    {
      nonce: 0n,
      gasLimit,
      gasPrice: DEFAULT_GAS_PRICE,
      value: 0n,
      to: createAddressFromString(CONTRACT_ADDRESS),
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

    for (const slot of account.storage ?? []) {
      await vm.stateManager.putStorage(address, hexToBytes(slot.slot), hexToBytes(slot.value))
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
    if (account.storage !== undefined && account.storage.length > 0) {
      parts.push('slot already set')
    }
    if (account.code !== undefined) {
      parts.push('code')
    }
    return parts.join(' · ')
  })
}
