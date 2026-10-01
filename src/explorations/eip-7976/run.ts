import { createBlock } from '@ethereumjs/block'
import { bytesToHex, createAccount, createAddressFromString } from '@ethereumjs/util'
import { createVM, runTx } from '@ethereumjs/vm'

import {
  buildTx,
  BUSY_CODE,
  commonFor,
  floorQuote,
  type HardforkChoice,
  isShapeId,
  RECIPIENT,
  SENDER,
  type ShapeId,
} from './schedule'

export type { HardforkChoice, ShapeId }

const BALANCE = 10n ** 18n

export interface ShapeRun {
  shape: ShapeId
  hardfork: HardforkChoice
  success: boolean
  gasUsed: bigint
  returnValue: string
  /** True when the floor, not the work, set the price. */
  floorWon: boolean
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
  if (shape === 'busy') {
    await vm.stateManager.putCode(RECIPIENT, BUSY_CODE)
  }

  const tx = buildTx(shape, hardfork)
  const quote = floorQuote(shape, hardfork)
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
    const gasUsed = res.totalGasSpent
    return {
      shape,
      hardfork,
      success: error === undefined,
      gasUsed,
      returnValue: bytesToHex(res.execResult.returnValue),
      floorWon: error === undefined && gasUsed === quote.floorCharge,
      error,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      shape,
      hardfork,
      success: false,
      gasUsed: 0n,
      returnValue: '0x',
      floorWon: false,
      error: message,
    }
  }
}
