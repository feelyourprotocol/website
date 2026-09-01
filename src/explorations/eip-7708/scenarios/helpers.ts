import type { Block } from '@ethereumjs/block'
import { createBlock } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'
import { createLegacyTx, type TypedTransaction } from '@ethereumjs/tx'
import { Account, createAccount, createAddressFromString, hexToBytes } from '@ethereumjs/util'
import type { VM } from '@ethereumjs/vm'

import {
  COINBASE_ADDRESS,
  DEFAULT_BLOCK_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
  RECIPIENT_ADDRESS,
  SENDER_PRIVATE_KEY,
} from './constants'
import type { PreStateAccount, TransferScenarioDefinition } from './types'

function legacyEmptyTransferIntrinsicGas(common: Common): bigint {
  const probe = createLegacyTx(
    {
      gasLimit: 1n,
      gasPrice: DEFAULT_GAS_PRICE,
      value: 1n,
      to: createAddressFromString(RECIPIENT_ADDRESS),
    },
    { common },
  )
  return probe.getIntrinsicGas()
}

export function amsterdamValueTransferGasLimit(common: Common): bigint {
  const minGas = legacyEmptyTransferIntrinsicGas(common)
  if (!common.isActivatedEIP(8037)) {
    return minGas
  }
  const stateGas = common.param('stateBytesPerNewAccount') * common.param('costPerStateByte')
  return minGas + stateGas
}

export function buildFirstTouchLegacyTransfer(
  common: Common,
  value: bigint,
  nonce: bigint,
  to = RECIPIENT_ADDRESS,
) {
  return createLegacyTx(
    {
      nonce,
      gasLimit: amsterdamValueTransferGasLimit(common),
      gasPrice: DEFAULT_GAS_PRICE,
      value,
      to: createAddressFromString(to),
    },
    { common },
  ).sign(SENDER_PRIVATE_KEY)
}

export function buildLegacyCall(
  common: Common,
  to: string,
  value: bigint,
  nonce: bigint,
  gasLimit: bigint,
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

export function buildBlock(
  common: Common,
  transactions: TypedTransaction[],
): { block: Block; parentBlock: Block } {
  const parentBlock = createBlock(
    { header: { number: 1n } },
    { common, skipConsensusFormatValidation: true },
  )

  const block = createBlock(
    {
      header: {
        number: 2n,
        gasLimit: DEFAULT_BLOCK_GAS_LIMIT,
        baseFeePerGas: 1n,
        coinbase: createAddressFromString(COINBASE_ADDRESS),
      },
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

export function getScenarioById(
  scenarios: Record<string, TransferScenarioDefinition>,
  id: string,
): TransferScenarioDefinition {
  const scenario = scenarios[id]
  if (scenario === undefined) {
    throw new Error(`Unknown transfer-log scenario: ${id}`)
  }
  return scenario
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
