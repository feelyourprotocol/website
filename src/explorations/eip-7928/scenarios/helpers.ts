import { createBlock } from '@ethereumjs/block'
import type { Block } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import type { TypedTransaction } from '@ethereumjs/tx'
import { Account, createAccount, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'

import { DEFAULT_BLOCK_GAS_LIMIT } from './constants'
import type { BalScenarioDefinition, PreStateAccount } from './types'

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

    if (account.storage !== undefined) {
      for (const [slot, value] of account.storage) {
        await vm.stateManager.putStorage(address, hexToBytes(slot), hexToBytes(value))
      }
    }
  }
}

export function buildAmsterdamBlock(
  common: Common,
  transactions: TypedTransaction[],
): { block: Block; parentBlock: Block } {
  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const block = createBlock(
    {
      header: { number: 2n, gasLimit: DEFAULT_BLOCK_GAS_LIMIT, baseFeePerGas: 1n },
      transactions,
    },
    {
      common,
      skipConsensusFormatValidation: true,
      calcDifficultyFromHeader: parentBlock.header,
    },
  )

  return { block, parentBlock }
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
    if (account.storage !== undefined && account.storage.length > 0) {
      parts.push(`${account.storage.length} storage slot(s)`)
    }
    return parts.join(' · ')
  })
}

export function getScenarioById(
  scenarios: Record<string, BalScenarioDefinition>,
  id: string,
): BalScenarioDefinition {
  const scenario = scenarios[id]
  if (scenario === undefined) {
    throw new Error(`Unknown BAL scenario: ${id}`)
  }
  return scenario
}
