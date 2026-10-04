import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createVM, runTx } from '@ethereumjs/vm'

import { PROGRAM_GAS_LIMIT } from './constants'
import { applyPreState, buildTxBlock } from './helpers'
import { getScenario } from './scenarios'
import type { HardforkChoice } from './types'

export type { HardforkChoice }

const HARD_FORK_LABELS: Record<HardforkChoice, string> = {
  glamsterdam: 'Glamsterdam',
  fusaka: 'Fusaka',
}

const commonByFork = new Map<HardforkChoice, Common>()

function commonForHardfork(hardfork: HardforkChoice): Common {
  const cached = commonByFork.get(hardfork)
  if (cached !== undefined) return cached
  const common = new Common({
    chain: Mainnet,
    hardfork: hardfork === 'glamsterdam' ? Hardfork.Amsterdam : Hardfork.Osaka,
  })
  commonByFork.set(hardfork, common)
  return common
}

/** Load EthereumJS so the first Run click is not a cold createVM. */
export function warmExecution(): Promise<void> {
  return Promise.all([
    createVM({ common: commonForHardfork('glamsterdam') }),
    createVM({ common: commonForHardfork('fusaka') }),
  ]).then(() => undefined)
}

export interface RunScenarioOutput {
  scenarioId: string
  hardforkId: HardforkChoice
  hardforkLabel: string
  txSuccessful: boolean
  exceptionError?: string
  /** What the sender pays, after the refund. */
  pay: bigint
  /** What the block counts. Refunds are left in on Glamsterdam. */
  block: bigint
}

export async function runScenario(
  scenarioId: string,
  hardfork: HardforkChoice,
): Promise<RunScenarioOutput> {
  const scenario = getScenario(scenarioId)
  const common = commonForHardfork(hardfork)
  const vm = await createVM({ common })

  await applyPreState(vm, scenario.preState)

  const tx = scenario.buildTx(common, PROGRAM_GAS_LIMIT)
  const block = buildTxBlock(common)

  let txSuccessful = false
  let exceptionError: string | undefined
  let pay = 0n
  let blockCount = 0n

  try {
    const res = await runTx(vm, { tx, block })
    exceptionError = res.execResult.exceptionError?.error
    txSuccessful = exceptionError === undefined
    pay = res.totalGasSpent
    blockCount = res.txRegularGas ?? res.blockGasSpent ?? res.totalGasSpent
  } catch (error) {
    exceptionError = error instanceof Error ? error.message : String(error)
    txSuccessful = false
  }

  return {
    scenarioId,
    hardforkId: hardfork,
    hardforkLabel: HARD_FORK_LABELS[hardfork],
    txSuccessful,
    exceptionError,
    pay,
    block: blockCount,
  }
}
