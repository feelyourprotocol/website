import { Common, type Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, type ExecResult, getActivePrecompiles, type PrecompileInput } from '@ethereumjs/evm'
import { createAddressFromString, hexToBytes, type PrefixedHexString } from '@ethereumjs/util'

type PrecompileFunc = (input: PrecompileInput) => Promise<ExecResult> | ExecResult

export interface StandardRunResult {
  pre?: ExecResult
  post: ExecResult
}

export async function runPrecompile(
  data: PrefixedHexString,
  preHF: Hardfork,
  postHF: Hardfork,
  precompile: string,
): Promise<StandardRunResult> {
  const gasLimit = BigInt(5000000)
  const dataBytes = hexToBytes(data)

  const commonPre = new Common({ chain: Mainnet, hardfork: preHF })
  const evmPre = await createEVM({ common: commonPre })
  const precompilePre = getActivePrecompiles(commonPre).get(precompile.padStart(40, '0'))!

  const commonPost = new Common({ chain: Mainnet, hardfork: postHF })
  const evmPost = await createEVM({ common: commonPost })
  const precompilePost = getActivePrecompiles(commonPost).get(precompile.padStart(40, '0'))!

  let pre: ExecResult | undefined
  if (precompilePre) {
    pre = await precompilePre({ data: dataBytes, gasLimit, common: commonPre, _EVM: evmPre })
  }

  const post = await precompilePost({
    data: dataBytes,
    gasLimit,
    common: commonPost,
    _EVM: evmPost,
  })

  return { pre, post }
}

/**
 * Creates a `run` function for the standard pre/post hardfork comparison pattern.
 * The returned function is compatible with the `PrecompileInterfaceEC` `run` prop
 * and returns the result directly (captured automatically by the composable).
 */
export function useStandardPrecompileRun(
  preHF: Hardfork,
  postHF: Hardfork,
  precompileAddress: string,
) {
  async function run(data: PrefixedHexString): Promise<StandardRunResult> {
    return runPrecompile(data, preHF, postHF, precompileAddress)
  }

  return { run }
}

/**
 * Runs a custom precompile function against the EVM.
 * Handles all EVM setup boilerplate (Common, EVM instance, call data assembly).
 *
 * @param data - `0x`-prefixed hex input data
 * @param precompileFn - The precompile implementation function
 * @param address - `0x`-prefixed hex address to register the precompile at
 * @param hardfork - Hardfork context (defaults to Prague)
 * @returns The raw `ExecResult` from the precompile execution
 */
export async function runCustomPrecompile(
  data: PrefixedHexString,
  precompileFn: PrecompileFunc,
  address: string,
  hardfork: Hardfork = 'prague' as Hardfork,
): Promise<ExecResult> {
  const common = new Common({ chain: Mainnet, hardfork })
  const addr = createAddressFromString(address)
  const evm = await createEVM({
    common,
    customPrecompiles: [{ address: addr, function: precompileFn }],
  })

  const fn = getActivePrecompiles(common, [{ address: addr, function: precompileFn }]).get(
    address.slice(2).padStart(40, '0').toLowerCase(),
  )!

  return fn({
    data: hexToBytes(data),
    gasLimit: BigInt(5000000),
    common,
    _EVM: evm,
  })
}
