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
import type { BalScenarioDefinition, PreStateAccount } from './types'

/** Intrinsic gas for an empty-calldata legacy value transfer. */
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
  // Prefer getIntrinsicGas over getMinimumGasLimit(): both match for empty calldata on
  // @ethereumjs/tx 10.1.3+, but getIntrinsicGas survives stale Vite prebundles after
  // dependency bumps (see eip-7928/__tests__/vitePrebundle.spec.ts).
  return probe.getIntrinsicGas()
}

/** Gas limit for a legacy value transfer to a first-touch recipient on Amsterdam (EIP-8037 state gas). */
export function amsterdamValueTransferGasLimit(common: Common): bigint {
  const minGas = legacyEmptyTransferIntrinsicGas(common)
  if (!common.isActivatedEIP(8037)) {
    return minGas
  }
  const stateGas = common.param('stateBytesPerNewAccount') * common.param('costPerStateByte')
  return minGas + stateGas
}

/** Gas limit when the recipient account already exists (no first-touch state gas). */
export function legacyExistingRecipientGasLimit(
  common: Common,
  value: bigint,
  nonce: bigint,
): bigint {
  return createLegacyTx(
    {
      nonce,
      gasLimit: 1n,
      gasPrice: DEFAULT_GAS_PRICE,
      value,
      to: createAddressFromString(RECIPIENT_ADDRESS),
    },
    { common },
  ).getIntrinsicGas()
}

/** Signed legacy transfer tx with Amsterdam-safe gas for a first-touch recipient. */
export function buildFirstTouchLegacyTransfer(common: Common, value: bigint, nonce: bigint) {
  return createLegacyTx(
    {
      nonce,
      gasLimit: amsterdamValueTransferGasLimit(common),
      gasPrice: DEFAULT_GAS_PRICE,
      value,
      to: createAddressFromString(RECIPIENT_ADDRESS),
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
