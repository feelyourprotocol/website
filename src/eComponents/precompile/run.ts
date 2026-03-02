import type { Ref } from 'vue'
import { Common, type Hardfork,Mainnet } from '@ethereumjs/common'
import { createEVM, type ExecResult,getActivePrecompiles } from '@ethereumjs/evm'
import { hexToBytes } from '@ethereumjs/util'

type BU = bigint | undefined

export type HEX_5 = [string, string, string, string, string]
export type BIGINT_5 = [bigint, bigint, bigint, bigint, bigint]
export type BIGINT_UNDEFINED_5 = [BU, BU, BU, BU, BU]

export type HEX_6 = [string, string, string, string, string, string]
export type BIGINT_6 = [bigint, bigint, bigint, bigint, bigint, bigint]
export type BIGINT_UNDEFINED_6 = [BU, BU, BU, BU, BU, BU]

export async function runPrecompile(
  data: string,
  preHF: Hardfork,
  postHF: Hardfork,
  precompile: string,
  execResultPre: Ref<ExecResult | undefined>,
  execResultPost: Ref<ExecResult | undefined>,
) {
  const gasLimit = BigInt(5000000)

  const commonPre = new Common({ chain: Mainnet, hardfork: preHF })
  const evmPre = await createEVM({ common: commonPre })
  const precompilePre = getActivePrecompiles(commonPre).get(precompile.padStart(40, '0'))!

  const commonPost = new Common({ chain: Mainnet, hardfork: postHF })
  const evmPost = await createEVM({ common: commonPost })
  const precompilePost = getActivePrecompiles(commonPost).get(precompile.padStart(40, '0'))!

  // Pre-HF run
  if (precompilePre) {
    const callDataPre = {
      data: hexToBytes(`0x${data}`),
      gasLimit,
      common: commonPre,
      _EVM: evmPre,
    }
    execResultPre.value = await precompilePre(callDataPre)
  }

  // Post-HF run
  const callDataPost = {
    data: hexToBytes(`0x${data}`),
    gasLimit,
    common: commonPost,
    _EVM: evmPost,
  }
  execResultPost.value = await precompilePost(callDataPost)
}
