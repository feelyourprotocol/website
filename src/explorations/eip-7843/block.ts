import type { Block } from '@ethereumjs/block'
import { createBlock } from '@ethereumjs/block'
import type { Common } from '@ethereumjs/common'

/** Lab timestamp chosen so TIMESTAMP ÷ 12 is not 42 (the default slot). */
export const LAB_TIMESTAMP = 1_704_067_200n

export const LAB_TIMESTAMP_DIV_12 = LAB_TIMESTAMP / 12n

export function createLabBlock(common: Common, slotNumber: bigint): Block {
  const header = common.isActivatedEIP(7843)
    ? { number: 1n, timestamp: LAB_TIMESTAMP, gasLimit: 30_000_000n, slotNumber }
    : { number: 1n, timestamp: LAB_TIMESTAMP, gasLimit: 30_000_000n }

  return createBlock({ header }, { common, skipConsensusFormatValidation: true })
}
