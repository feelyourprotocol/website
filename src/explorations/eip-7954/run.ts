import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'
import {
  bigIntToBytes,
  createAccount,
  createAddressFromString,
  setLengthLeft,
} from '@ethereumjs/util'

import {
  type DeploymentDimension,
  type DeploymentScenario,
  getScenario,
  GLAMSTERDAM_INITCODE_LIMIT,
  GLAMSTERDAM_RUNTIME_LIMIT,
} from './scenarios'

export type HardforkChoice = 'fusaka' | 'glamsterdam'

export interface DeploymentOutcome {
  hardfork: HardforkChoice
  accepted: boolean
  error?: string
  deployedCodeBytes: number
}

export interface RunScenarioOutput {
  scenarioId: string
  fusaka: DeploymentOutcome
  glamsterdam: DeploymentOutcome
}

const CALLER = createAddressFromString('0x00000000000000000000000000000000000000ee')
const DEPLOY_GAS_LIMIT = 200_000_000n

function assertTeachingSize(dimension: DeploymentDimension, sizeBytes: number): void {
  const largestBoundary =
    dimension === 'runtime-code' ? GLAMSTERDAM_RUNTIME_LIMIT : GLAMSTERDAM_INITCODE_LIMIT
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes <= 0 || sizeBytes > largestBoundary + 1) {
    throw new Error(
      `Deployment size must be a positive whole number no larger than ${largestBoundary + 1} bytes`,
    )
  }
}

/** Build compact initcode that returns `runtimeSize` zero bytes as deployed code. */
function buildRuntimeReturnInitcode(runtimeSize: number): Uint8Array {
  const sizeWord = setLengthLeft(bigIntToBytes(BigInt(runtimeSize)), 32)
  return Uint8Array.from([0x7f, ...sizeWord, 0x60, 0x00, 0xf3])
}

export function buildDeploymentInitcode(
  dimension: DeploymentDimension,
  sizeBytes: number,
): Uint8Array {
  assertTeachingSize(dimension, sizeBytes)
  return dimension === 'runtime-code'
    ? buildRuntimeReturnInitcode(sizeBytes)
    : new Uint8Array(sizeBytes)
}

function humanDeploymentError(error: string | undefined): string | undefined {
  if (error?.includes('code size to deposit exceeds')) return 'runtime code exceeds the limit'
  if (error?.includes('initcode exceeds')) return 'initcode exceeds the limit'
  return error
}

async function runOnFork(
  scenario: DeploymentScenario,
  hardfork: HardforkChoice,
): Promise<DeploymentOutcome> {
  const common = new Common({
    chain: Mainnet,
    hardfork: hardfork === 'glamsterdam' ? Hardfork.Amsterdam : Hardfork.Osaka,
  })
  const evm = await createEVM({ common })
  await evm.stateManager.putAccount(
    CALLER,
    createAccount({ nonce: 0n, balance: 10_000_000_000_000_000_000n }),
  )

  const result = await evm.runCall({
    caller: CALLER,
    data: buildDeploymentInitcode(scenario.dimension, scenario.sizeBytes),
    gasLimit: DEPLOY_GAS_LIMIT,
  })
  const error = humanDeploymentError(result.execResult.exceptionError?.error)

  return {
    hardfork,
    accepted: error === undefined,
    error,
    deployedCodeBytes: error === undefined ? result.execResult.returnValue.length : 0,
  }
}

/** Load EthereumJS so the first comparison is not a cold createEVM. */
export function warmExecution(): Promise<void> {
  return Promise.all([
    createEVM({ common: new Common({ chain: Mainnet, hardfork: Hardfork.Osaka }) }),
    createEVM({ common: new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam }) }),
  ]).then(() => undefined)
}

export async function runScenario(scenarioId: string): Promise<RunScenarioOutput> {
  const scenario = getScenario(scenarioId)
  const [fusaka, glamsterdam] = await Promise.all([
    runOnFork(scenario, 'fusaka'),
    runOnFork(scenario, 'glamsterdam'),
  ])
  return { scenarioId, fusaka, glamsterdam }
}
