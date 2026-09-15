import type { PrecompileConfig } from '@/eComponents/precompileInterfaceEC/types'

export const config: PrecompileConfig = {
  explorationId: 'eip-7951',
  defaultExample: 'valid',
  showBigInt: false,
  values: [
    { title: 'Hash', expectedLen: 32n },
    { title: 'R', expectedLen: 32n },
    { title: 'S', expectedLen: 32n },
    { title: 'Pub key X', expectedLen: 32n },
    { title: 'Pub key Y', expectedLen: 32n },
  ],
}
