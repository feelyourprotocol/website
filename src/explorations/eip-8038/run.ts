import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createVM, runTx } from '@ethereumjs/vm'

import { PROGRAM_GAS_LIMIT } from './constants'
import { applyPreState, buildTxBlock } from './helpers'
import { getScenario } from './scenarios'
import type { CostComponents, HardforkChoice, ScenarioRunResult } from './types'

export type { HardforkChoice }

const HARD_FORK_LABELS: Record<HardforkChoice, string> = {
  amsterdam: 'Amsterdam (EIP-8038 active)',
  osaka: 'Osaka (baseline)',
}

function commonForHardfork(hardfork: HardforkChoice): Common {
  return new Common({
    chain: Mainnet,
    hardfork: hardfork === 'amsterdam' ? Hardfork.Amsterdam : Hardfork.Osaka,
  })
}

export interface RunScenarioOutput extends ScenarioRunResult {
  expectedProgramGas: bigint
  expectedAmsterdamStateGas: bigint
}

/** Idle breakdown — spec components so the table is populated before Run. */
export function previewComponents(scenarioId: string, hardfork: HardforkChoice): CostComponents {
  return getScenario(scenarioId).expectedComponents[hardfork]
}

export function programGasFromExec(executionGasUsed: bigint, stateGasSpilled: bigint): bigint {
  if (stateGasSpilled > executionGasUsed) return 0n
  return executionGasUsed - stateGasSpilled
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

  let programSuccessful = false
  let exceptionError: string | undefined
  let programGas = 0n
  let stateGas = 0n

  try {
    const res = await runTx(vm, { tx, block })
    exceptionError = res.execResult.exceptionError?.error
    programSuccessful = exceptionError === undefined
    stateGas = res.txStateGas ?? res.execResult.stateGasSpilled ?? 0n
    programGas = programGasFromExec(res.execResult.executionGasUsed, stateGas)
  } catch (error) {
    exceptionError = error instanceof Error ? error.message : String(error)
    programSuccessful = false
  }

  return {
    scenarioId,
    hardforkId: hardfork,
    hardforkLabel: HARD_FORK_LABELS[hardfork],
    programSuccessful,
    exceptionError,
    programGas,
    stateGas,
    components: scenario.expectedComponents[hardfork],
    expectedProgramGas: scenario.expectedProgramGas[hardfork],
    expectedAmsterdamStateGas: scenario.expectedAmsterdamStateGas,
  }
}
