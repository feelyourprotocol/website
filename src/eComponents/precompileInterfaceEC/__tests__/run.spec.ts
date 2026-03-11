import { describe, expect, it } from 'vitest'
import { Hardfork } from '@ethereumjs/common'

import { runPrecompile, useStandardPrecompileRun } from '../run'

const MODEXP_SIMPLE =
  '0x' +
  '0000000000000000000000000000000000000000000000000000000000000001' +
  '0000000000000000000000000000000000000000000000000000000000000001' +
  '0000000000000000000000000000000000000000000000000000000000000001' +
  '030302'

describe('runPrecompile', () => {
  it('returns pre and post results for ModExp (address 05)', async () => {
    const result = await runPrecompile(MODEXP_SIMPLE, Hardfork.Prague, Hardfork.Osaka, '05')
    expect(result.pre).toBeDefined()
    expect(result.post).toBeDefined()
    expect(result.post.executionGasUsed).toBeTypeOf('bigint')
  })

  it('returns correct gas values for simple ModExp (EIP-7883)', async () => {
    const result = await runPrecompile(MODEXP_SIMPLE, Hardfork.Prague, Hardfork.Osaka, '05')
    expect(result.pre!.executionGasUsed).toBe(200n)
    expect(result.post.executionGasUsed).toBe(500n)
  })

  it('returns gas for secp256r1 precompile (address 100)', async () => {
    const data =
      '0x' +
      '4dfb1eae8ed41e188b8a44a1109d982d01fc24bb85a933e6283e8838e46942fd' +
      'eb3dc5ce2902f162745057efb7a3308eba992c0d843623603516845ffccd3f10' +
      '3b91fedfb22f40063245c621036a040c159f02ae02e6d450ff9b53235e9232c4' +
      'bfa6d0a419b5bc625939cccb8db65a16f7c30c697928660e9da53eda031e80fa' +
      'db5998a893f9b8971a3892aecd132c0eca1bc9622e542f428d8129222f26bdc5'
    const result = await runPrecompile(data, Hardfork.Prague, Hardfork.Osaka, '100')
    expect(result.post).toBeDefined()
    expect(result.post.executionGasUsed).toBeTypeOf('bigint')
  })
})

describe('useStandardPrecompileRun', () => {
  it('returns a run function', () => {
    const { run } = useStandardPrecompileRun(Hardfork.Prague, Hardfork.Osaka, '05')
    expect(run).toBeTypeOf('function')
  })

  it('run returns pre/post results directly', async () => {
    const { run } = useStandardPrecompileRun(Hardfork.Prague, Hardfork.Osaka, '05')

    const result = await run(MODEXP_SIMPLE)

    expect(result.pre).toBeDefined()
    expect(result.post).toBeDefined()
    expect(result.pre!.executionGasUsed).toBe(200n)
    expect(result.post.executionGasUsed).toBe(500n)
  })
})
