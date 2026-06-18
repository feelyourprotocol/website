import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { bytesToHex } from '@ethereumjs/util'
import { createVM, runBlock } from '@ethereumjs/vm'

import { applyPreState, buildAmsterdamBlock } from './scenarios/helpers'
import { getScenario } from './scenarios'

import type { PreStateAccount, ScenarioRunResult } from './scenarios/types'

export async function runScenario(scenarioId: string): Promise<ScenarioRunResult> {
  const scenario = getScenario(scenarioId)
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  const vm = await createVM({ common })

  await applyPreState(vm, scenario.preState)

  const transactions = scenario.buildTransactions(common)
  const { block } = buildAmsterdamBlock(common, transactions)

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipBlockValidation: true,
  })

  const bal = result.blockLevelAccessList
  if (bal === undefined) {
    throw new Error('EIP-7928 active but no blockLevelAccessList on RunBlockResult')
  }

  return {
    scenarioId,
    preState: scenario.preState,
    balJson: bal.toJSON(),
    balHash: bytesToHex(bal.hash()),
    gasUsed: result.gasUsed,
    txCount: transactions.length,
  }
}
