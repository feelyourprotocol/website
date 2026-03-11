import { Common, type Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, type ExecResult, getActivePrecompiles } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'

export interface StandardRunResult {
  pre?: ExecResult
  post: ExecResult
}

export async function runPrecompile(
  data: string,
  preHF: Hardfork,
  postHF: Hardfork,
  precompile: string,
): Promise<StandardRunResult> {
  const gasLimit = BigInt(5000000)

  const commonPre = new Common({ chain: Mainnet, hardfork: preHF })
  const evmPre = await createEVM({ common: commonPre })
  const precompilePre = getActivePrecompiles(commonPre).get(precompile.padStart(40, '0'))!

  const commonPost = new Common({ chain: Mainnet, hardfork: postHF })
  const evmPost = await createEVM({ common: commonPost })
  const precompilePost = getActivePrecompiles(commonPost).get(precompile.padStart(40, '0'))!

  let pre: ExecResult | undefined
  if (precompilePre) {
    const callDataPre = {
      data: hexToBytes(`0x${data}`),
      gasLimit,
      common: commonPre,
      _EVM: evmPre,
    }
    pre = await precompilePre(callDataPre)
  }

  const callDataPost = {
    data: hexToBytes(`0x${data}`),
    gasLimit,
    common: commonPost,
    _EVM: evmPost,
  }
  const post = await precompilePost(callDataPost)

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
  async function run(data: string): Promise<StandardRunResult> {
    return runPrecompile(data, preHF, postHF, precompileAddress)
  }

  return { run }
}
