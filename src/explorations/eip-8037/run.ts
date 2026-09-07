import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import type { TxGasDimensionsEstimate } from '@ethereumjs/vm'
import { createVM, estimateTxGasDimensions, runTx } from '@ethereumjs/vm'

import { getScenario } from './scenarios'
import { CLASSIC_GAS_LIMIT, EXECUTION_HEADROOM_GAS_LIMIT } from './scenarios/constants'
import { applyPreState, buildTxBlock } from './scenarios/helpers'
import type { GasLimitMode, HardforkChoice, ScenarioRunResult } from './scenarios/types'

export type { GasLimitMode, HardforkChoice }

const HARD_FORK_LABELS: Record<HardforkChoice, string> = {
  amsterdam: 'Amsterdam (EIP-8037 active)',
  osaka: 'Osaka (baseline)',
}

function commonForHardfork(hardfork: HardforkChoice): Common {
  return new Common({
    chain: Mainnet,
    hardfork: hardfork === 'amsterdam' ? Hardfork.Amsterdam : Hardfork.Osaka,
  })
}

function resolveRecommendedLimit(estimate: TxGasDimensionsEstimate, floor?: bigint): bigint {
  if (floor === undefined) return estimate.recommendedGasLimit
  return floor > estimate.recommendedGasLimit ? floor : estimate.recommendedGasLimit
}

export interface RunScenarioOutput extends ScenarioRunResult {
  estimate: TxGasDimensionsEstimate
  recommendedGasLimit: bigint
  expectedAmsterdamStateGas: bigint
  classicLimitWouldCover: boolean
}

export function displayGasBars(result: RunScenarioOutput): { regular: bigint; state: bigint } {
  if (result.txSuccessful) {
    // `txRegularGas` is only filled when EIP-8037 is active; Osaka uses totalGasSpent.
    const regular = result.txRegularGas > 0n ? result.txRegularGas : result.totalGasSpent
    return { regular, state: result.txStateGas }
  }
  if (result.estimate.estimatedStateGas > 0n) {
    return {
      regular: result.estimate.minimumGasLimit,
      state: result.estimate.estimatedStateGas,
    }
  }
  const state = result.hardforkId === 'amsterdam' ? result.expectedAmsterdamStateGas : 0n
  return { regular: result.estimate.minimumGasLimit, state }
}

export async function runScenario(
  scenarioId: string,
  hardfork: HardforkChoice,
  gasLimitMode: GasLimitMode,
): Promise<RunScenarioOutput> {
  const scenario = getScenario(scenarioId)
  const common = commonForHardfork(hardfork)
  const vm = await createVM({ common })

  await applyPreState(vm, scenario.preState)

  const probe = scenario.buildTx(common, EXECUTION_HEADROOM_GAS_LIMIT)
  const estimate = await estimateTxGasDimensions(vm, probe)
  const recommendedGasLimit = resolveRecommendedLimit(estimate, scenario.recommendedGasLimitFloor)
  const gasLimit = gasLimitMode === 'classic' ? CLASSIC_GAS_LIMIT : recommendedGasLimit
  const classicLimitWouldCover = recommendedGasLimit <= CLASSIC_GAS_LIMIT

  const tx = scenario.buildTx(common, gasLimit)
  const block = buildTxBlock(common)

  let txSuccessful = false
  let exceptionError: string | undefined
  let txRegularGas = 0n
  let txStateGas = 0n
  let totalGasSpent = 0n

  try {
    const res = await runTx(vm, { tx, block })
    exceptionError = res.execResult.exceptionError?.error
    txSuccessful = exceptionError === undefined
    txRegularGas = res.txRegularGas ?? 0n
    txStateGas = res.txStateGas ?? 0n
    totalGasSpent = res.totalGasSpent
  } catch (error) {
    exceptionError = error instanceof Error ? error.message : String(error)
    txSuccessful = false
  }

  return {
    scenarioId,
    hardforkId: hardfork,
    hardforkLabel: HARD_FORK_LABELS[hardfork],
    gasLimitMode,
    gasLimit,
    txSuccessful,
    exceptionError,
    txRegularGas,
    txStateGas,
    totalGasSpent,
    estimate,
    recommendedGasLimit,
    expectedAmsterdamStateGas: scenario.expectedAmsterdamStateGas,
    classicLimitWouldCover,
  }
}
