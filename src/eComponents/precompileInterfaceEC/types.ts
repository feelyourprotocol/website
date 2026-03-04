import type { Hardfork } from '@ethereumjs/common'

export interface PrecompileValueDef {
  title: string
  urlParam?: string
  expectedLen?: bigint
  initialHex?: string
  showBigInt?: boolean
  showInput?: boolean
}

export interface PrecompileConfig {
  explorationId: string
  precompileAddress: string
  preHardfork: Hardfork
  postHardfork: Hardfork
  defaultExample: string
  showBigInt?: boolean
  values: PrecompileValueDef[]
  assembleData?: (hexVals: string[], byteLengths: bigint[]) => string
  parseData?: (data: string, byteLengths: bigint[]) => void
}
