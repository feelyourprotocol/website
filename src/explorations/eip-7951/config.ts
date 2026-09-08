import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

export const config: PrecompileConfig = {
  explorationId: 'eip-7951',
  defaultExample: 'valid',
  showBigInt: false,
  values: [
    { title: 'Hash', urlParam: 'hash', expectedLen: 32n },
    { title: 'R', urlParam: 'sigr', expectedLen: 32n },
    { title: 'S', urlParam: 'sigs', expectedLen: 32n },
    { title: 'Pub key X', urlParam: 'pubx', expectedLen: 32n },
    { title: 'Pub key Y', urlParam: 'puby', expectedLen: 32n },
  ],
}
