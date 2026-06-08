/**
 * Integration tests: verify the old PoC runSimpleFrameTx still works,
 * and the new frameRunner produces consistent results for the same scenario.
 */

import { describe, expect, it } from 'vitest'
import { Common, Hardfork, Mainnet } from '@fyp-8141/common'
import { createFrameEIP8141Tx, type FrameEIP8141TxData } from '@fyp-8141/tx'
import {
  Address,
  bigIntToUnpaddedBytes,
  bytesToHex,
  concatBytes,
  ecrecover,
  publicToAddress,
} from '@fyp-8141/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import {
  buildVerifyData,
  PRIVATE_KEY,
  runSimpleFrameTx,
  SENDER_ADDR,
} from '../custom/runSimpleFrameTx'
import { executeFrameExample } from '../custom/frameRunner'
import { FRAME_EXAMPLES } from '../examples'

describe('Integration', () => {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague, eips: [8141] })

  it('buildVerifyData produces correct ECDSA verify frame data', () => {
    const txData: FrameEIP8141TxData = {
      chainId: 1n,
      nonce: 0n,
      sender: SENDER_ADDR.toString() as `0x${string}`,
      maxPriorityFeePerGas: 1n,
      maxFeePerGas: 100n,
      maxFeePerBlobGas: 0n,
      frames: [
        [new Uint8Array([1]), new Uint8Array(0), bigIntToUnpaddedBytes(50000n), new Uint8Array(0)],
        [
          new Uint8Array([2]),
          new Uint8Array(0),
          bigIntToUnpaddedBytes(200000n),
          new Uint8Array([0x00, 0xc0]),
        ],
      ],
    }
    const tx = createFrameEIP8141Tx(txData, { common })
    const sigHash = tx.getHashedMessageToSign()
    const verifyData = buildVerifyData(0x2, sigHash, PRIVATE_KEY)

    expect(verifyData.length).toBe(66)
    expect(verifyData[0]).toBe(0x20)
    expect([27, 28]).toContain(verifyData[1])

    const v = verifyData[1]
    const r = verifyData.slice(2, 34)
    const s = verifyData.slice(34, 66)
    const hash = keccak_256(concatBytes(sigHash, verifyData.slice(0, 1)))
    const pubKey = ecrecover(hash, BigInt(v), r, s)
    const recovered = new Address(publicToAddress(pubKey))
    expect(bytesToHex(recovered.bytes)).toBe(bytesToHex(SENDER_ADDR.bytes))
  })

  it('PoC runSimpleFrameTx still works', async () => {
    const result = await runSimpleFrameTx()
    expect(result.txType).toBe(6)
    expect(result.frameCount).toBe(2)
    expect(result.recipientBalance).toBe(1000n)
  }, 30_000)

  it('frameRunner simple-transfer matches PoC results', async () => {
    const newResult = await executeFrameExample(FRAME_EXAMPLES['simple-transfer'])
    const pocResult = await runSimpleFrameTx()

    expect(newResult.txType).toBe(pocResult.txType)
    expect(newResult.frameSteps).toHaveLength(pocResult.frameCount)

    const recipientAddr = '0x' + 'cc'.repeat(20)
    expect(newResult.recipientBalances[recipientAddr]).toBe(pocResult.recipientBalance)
  }, 30_000)
})
