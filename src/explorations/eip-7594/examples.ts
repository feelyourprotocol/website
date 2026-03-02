import { type Examples } from '@/components/lib/general.js'
import blobBase from './data/blob_base.txt?raw'
import blobGnosis from './data/blob_gnosis.txt?raw'
import blobLighter from './data/blob_lighter.txt?raw'

export const examples: Examples = {
  blob1: {
    title: 'Base L2 Blob | Hash: 0x01ae971... | Block Nr: 23966811 | 2025-12-08',
    values: [blobBase],
  },
  blob2: {
    title: 'Lighter L2 Blob | Hash: 0x015ed6b... | Block Nr: 23967328 | 2025-12-08',
    values: [blobLighter],
  },
  blob3: {
    title: 'Gnosis Chain Blob | Hash: 0x01755da... | Block Nr: 43511951 | 2025-12-06',
    values: [blobGnosis],
  },
}
