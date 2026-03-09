import { ref } from 'vue'
import { Common, type Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM, type ExecResult, getActivePrecompiles } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'

export async function runPrecompile(
  data: string,
  preHF: Hardfork,
  postHF: Hardfork,
  precompile: string,
): Promise<{ pre?: ExecResult; post: ExecResult }> {
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
 * Convenience composable for the standard pre/post hardfork comparison pattern.
 * Returns a `run` function compatible with the `PrecompileInterfaceEC` `run` prop,
 * plus reactive refs for both results.
 */
export function useStandardPrecompileRun(
  preHF: Hardfork,
  postHF: Hardfork,
  precompileAddress: string,
) {
  const execResultPre = ref<ExecResult | undefined>()
  const execResultPost = ref<ExecResult | undefined>()

  async function run(data: string) {
    const results = await runPrecompile(data, preHF, postHF, precompileAddress)
    execResultPre.value = results.pre
    execResultPost.value = results.post
  }

  return { run, execResultPre, execResultPost }
}
