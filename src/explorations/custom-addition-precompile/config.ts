import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

export const config: PrecompileConfig = {
  explorationId: 'custom-addition-precompile',
  defaultExample: 'simple',
  values: [
    { title: 'A', urlParam: 'a', expectedLen: 32n },
    { title: 'B', urlParam: 'b', expectedLen: 32n },
  ],
}
