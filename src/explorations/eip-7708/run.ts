import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createVM, runBlock } from '@ethereumjs/vm'

import type { ReceiptLogsViewState } from '@/eComponents/receiptLogsEC/types'

import { countTransferLogs, receiptLogsToRows } from './receiptAdapter'
import { getScenario } from './scenarios'
import { applyPreState, buildBlock } from './scenarios/helpers'
import type { ScenarioRunResult } from './scenarios/types'

export type HardforkChoice = 'glamsterdam' | 'fusaka'

const HARD_FORK_LABELS: Record<HardforkChoice, string> = {
  glamsterdam: 'Glamsterdam (EIP-7708 active)',
  fusaka: 'Fusaka (baseline)',
}

function commonForHardfork(hardfork: HardforkChoice): Common {
  return new Common({
    chain: Mainnet,
    hardfork: hardfork === 'glamsterdam' ? Hardfork.Amsterdam : Hardfork.Osaka,
  })
}

export interface RunScenarioOutput extends ScenarioRunResult {
  receiptLogs: ReceiptLogsViewState
}

export async function runScenario(
  scenarioId: string,
  hardfork: HardforkChoice,
): Promise<RunScenarioOutput> {
  const scenario = getScenario(scenarioId)
  const common = commonForHardfork(hardfork)
  const vm = await createVM({ common })

  await applyPreState(vm, scenario.preState)

  const transactions = scenario.buildTransactions(common)
  const { block } = buildBlock(common, transactions)

  const result = await runBlock(vm, {
    block,
    generate: true,
    skipBlockValidation: true,
  })

  const rows = receiptLogsToRows(result.receipts)
  const transferLogCount = countTransferLogs(rows)

  const txSuccessful =
    result.results.length > 0 &&
    'status' in result.results[0]!.receipt &&
    result.results[0]!.receipt.status === 1

  let emptyHint: string | undefined
  if (rows.length === 0) {
    if (hardfork === 'fusaka') {
      emptyHint =
        'Fusaka has no EIP-7708 transfer logs — compare with Glamsterdam on the same scenario.'
    } else if (scenario.emptyGlamsterdamHint) {
      emptyHint = scenario.emptyGlamsterdamHint
    } else {
      emptyHint = 'No logs in the receipt for this run.'
    }
  }

  const receiptLogs: ReceiptLogsViewState = {
    rows,
    hardforkId: hardfork,
    hardforkLabel: HARD_FORK_LABELS[hardfork],
    emptyHint,
    focusKind: 'eth-transfer',
  }

  return {
    scenarioId,
    hardforkId: hardfork,
    hardforkLabel: HARD_FORK_LABELS[hardfork],
    gasUsed: result.gasUsed,
    txCount: transactions.length,
    transferLogCount,
    totalLogCount: rows.length,
    txSuccessful,
    receiptLogs,
  }
}

export async function runScenarioComparison(scenarioId: string): Promise<{
  glamsterdam: RunScenarioOutput
  fusaka: RunScenarioOutput
}> {
  const [glamsterdam, fusaka] = await Promise.all([
    runScenario(scenarioId, 'glamsterdam'),
    runScenario(scenarioId, 'fusaka'),
  ])
  return { glamsterdam, fusaka }
}
