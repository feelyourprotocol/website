import type { BalExampleMeta } from './examples'
import type {
  BalHighlightField,
  BalScenarioDefinition,
  PreStateAccount,
  ScenarioRunResult,
} from './scenarios/types'
import { getGroupByField } from './taxonomy'
import { formatEth } from './transitions'

export interface ActorBrief {
  label: string
  shortAddress: string
  lines: string[]
}

export interface TxActionBrief {
  headline: string
  detail: string
}

export interface ScenarioBriefModel {
  title: string
  lesson: string
  actors: ActorBrief[]
  action: TxActionBrief
  bytecodeSteps?: Array<{ opcode: string; comment?: string }>
  watchFor: string[]
  blockFooter?: {
    gasUsed: string
    accountCount: number
    hashShort: string
  }
}

function shortAddress(address: string): string {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function actorLines(account: PreStateAccount): string[] {
  const lines: string[] = []
  if (account.balance !== undefined) {
    lines.push(formatEth(account.balance))
  }
  if (account.nonce !== undefined) {
    lines.push(`nonce ${account.nonce}`)
  }
  if (account.code !== undefined) {
    lines.push('contract code loaded')
  }
  if (account.storage !== undefined && account.storage.length > 0) {
    lines.push(`${account.storage.length} storage slot(s) set`)
  }
  if (lines.length === 0) {
    lines.push('empty account')
  }
  return lines
}

function highlightToGroupName(field: BalHighlightField): string {
  return getGroupByField(field).name
}

function buildAction(scenario: BalScenarioDefinition): TxActionBrief {
  const tx = scenario.txSummary[0]
  if (tx === undefined) {
    return { headline: 'Block execution', detail: '' }
  }

  if (scenario.id === '01-plain-transfer') {
    return {
      headline: 'Sender pays 1 wei to the recipient account',
      detail: 'Legacy transfer · Amsterdam first-touch gas · fees go to coinbase',
    }
  }
  if (scenario.id === '02-contract-sload') {
    return {
      headline: 'Sender calls the contract with empty calldata',
      detail: 'Contract reads slot 0 and returns 42 · no storage write',
    }
  }
  if (scenario.id === '03-sstore-write') {
    return {
      headline: 'Sender calls the contract to run SSTORE',
      detail: 'Slot 0 written with value 42 · 200,000 gas',
    }
  }
  if (scenario.id === '04-create-deploy') {
    return {
      headline: 'Sender deploys a new contract via CREATE',
      detail: 'Init code returns runtime bytecode · new account at deterministic address',
    }
  }
  if (scenario.id === '05-two-transfers') {
    return {
      headline: 'Sender sends two transfers in one block',
      detail: 'tx 1: 1 wei · tx 2: 2 wei to the same recipient · sequential nonces',
    }
  }
  if (scenario.id === '06-sstore-revert') {
    return {
      headline: 'Sender calls a contract that reverts after SSTORE',
      detail: 'Write is rolled back · access list records a read, not a write',
    }
  }
  if (scenario.id === '07-cross-contract-call') {
    return {
      headline: 'Sender calls contract A, which CALLs contract B',
      detail: 'B reads slot 0 and returns · both contracts in one access list',
    }
  }

  return {
    headline: tx.label,
    detail: tx.detail,
  }
}

export function buildScenarioBrief(
  scenario: BalScenarioDefinition,
  meta: BalExampleMeta,
  result?: ScenarioRunResult | null,
): ScenarioBriefModel {
  const brief: ScenarioBriefModel = {
    title: meta.title,
    lesson: meta.lesson,
    actors: scenario.preState.map((account) => ({
      label: account.label.charAt(0).toUpperCase() + account.label.slice(1),
      shortAddress: shortAddress(account.address),
      lines: actorLines(account),
    })),
    action: buildAction(scenario),
    watchFor: meta.highlightFields.map(highlightToGroupName),
  }

  if (scenario.bytecodeSteps !== undefined) {
    brief.bytecodeSteps = scenario.bytecodeSteps
  }

  if (result !== undefined && result !== null) {
    brief.blockFooter = {
      gasUsed: result.gasUsed.toLocaleString(),
      accountCount: result.balJson.length,
      hashShort: `${result.balHash.slice(0, 10)}…${result.balHash.slice(-6)}`,
    }
  }

  return brief
}
