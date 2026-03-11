import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, type ExecResult, getActivePrecompiles, type PrecompileInput } from '@ethereumjs/evm'
import {
  bigIntToBytes,
  bytesToBigInt,
  createAddressFromString,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'

const CUSTOM_PRECOMPILE_ADDRESS = '0x0000000000000000000000000000000000ff0001'
const ADDITION_GAS = 15n

function additionPrecompile(input: PrecompileInput): ExecResult {
  const a = bytesToBigInt(input.data.subarray(0, 32))
  const b = bytesToBigInt(input.data.subarray(32, 64))
  const sum = (a + b) % (2n ** 256n)
  return {
    executionGasUsed: ADDITION_GAS,
    returnValue: setLengthLeft(bigIntToBytes(sum), 32),
  }
}

export interface RunResult {
  execResult: ExecResult
  a: bigint
  b: bigint
  sum: bigint
}

export async function run(data: string): Promise<RunResult> {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague })
  const address = createAddressFromString(CUSTOM_PRECOMPILE_ADDRESS)
  const evm = await createEVM({
    common,
    customPrecompiles: [{ address, function: additionPrecompile }],
  })

  const precompileFunc = getActivePrecompiles(common, [
    { address, function: additionPrecompile },
  ]).get(CUSTOM_PRECOMPILE_ADDRESS.slice(2))!

  const callData = {
    data: hexToBytes(`0x${data}`),
    gasLimit: BigInt(5000000),
    common,
    _EVM: evm,
  }
  const execResult = await precompileFunc(callData)

  const a = bytesToBigInt(hexToBytes(`0x${data.substring(0, 64)}`))
  const b = bytesToBigInt(hexToBytes(`0x${data.substring(64, 128)}`))
  const sum = (a + b) % (2n ** 256n)

  return { execResult, a, b, sum }
}
