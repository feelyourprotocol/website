import { createBlock } from '@ethereumjs/block'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createLegacyTx } from '@ethereumjs/tx'
import {
  createAccount,
  createAddressFromPrivateKey,
  createAddressFromString,
  hexToBytes,
} from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

import { type HardforkChoice, isShapeId, type ShapeId } from './pieces'

export type { HardforkChoice, ShapeId }

const SENDER_KEY = hexToBytes(`0x${'20'.repeat(32)}`)
const SENDER = createAddressFromPrivateKey(SENDER_KEY)
const RECIPIENT = createAddressFromPrivateKey(hexToBytes(`0x${'71'.repeat(32)}`))
const GAS_LIMIT = 100_000n
const GAS_PRICE = 1n
const BALANCE = 10n ** 18n

function commonFor(hardfork: HardforkChoice): Common {
  return new Common({
    chain: Mainnet,
    hardfork: hardfork === 'glamsterdam' ? Hardfork.Amsterdam : Hardfork.Osaka,
  })
}

export interface ShapeRun {
  shape: ShapeId
  hardfork: HardforkChoice
  success: boolean
  gasUsed: bigint
  error?: string
}

export async function runShape(shape: string, hardfork: HardforkChoice): Promise<ShapeRun> {
  if (!isShapeId(shape)) {
    throw new Error(`Unknown transaction shape: ${shape === '' ? '(empty)' : shape}`)
  }

  const common = commonFor(hardfork)
  const vm = await createVM({ common })
  await vm.stateManager.putAccount(SENDER, createAccount({ balance: BALANCE }))
  await vm.stateManager.putAccount(RECIPIENT, createAccount({ balance: BALANCE }))

  const to = shape === 'self' ? SENDER : RECIPIENT
  const value = shape === 'zero-value' ? 0n : 1n
  const tx = createLegacyTx(
    { nonce: 0n, gasLimit: GAS_LIMIT, gasPrice: GAS_PRICE, value, to },
    { common },
  ).sign(SENDER_KEY)

  const block = createBlock(
    {
      header: {
        number: 1n,
        gasLimit: 30_000_000n,
        baseFeePerGas: 1n,
        coinbase: createAddressFromString('0x00000000000000000000000000000000000000c1'),
      },
    },
    { common, skipConsensusFormatValidation: true },
  )

  try {
    const res = await runTx(vm, { tx, block })
    const error = res.execResult.exceptionError?.error
    return {
      shape,
      hardfork,
      success: error === undefined,
      gasUsed: res.totalGasSpent,
      error,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return { shape, hardfork, success: false, gasUsed: 0n, error: message }
  }
}
