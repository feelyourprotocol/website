import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

export const config: PrecompileConfig = {
  explorationId: 'eip-7951',
  defaultExample: 'valid',
  showBigInt: false,
  values: [
    { title: 'Hash', urlParam: 'hash', expectedLen: 32n },
    { title: 'SigR', urlParam: 'sigr', expectedLen: 32n },
    { title: 'SigS', urlParam: 'sigs', expectedLen: 32n },
    { title: 'PubX', urlParam: 'pubx', expectedLen: 32n },
    { title: 'PubY', urlParam: 'puby', expectedLen: 32n },
  ],
}
