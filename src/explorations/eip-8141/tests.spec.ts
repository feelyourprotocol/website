import { describe, expect, it } from 'vitest'
import { Common, Hardfork, Mainnet } from '@fyp-8141/common'
import { createFrameEIP8141Tx,type FrameEIP8141TxData } from '@fyp-8141/tx'
import {
  Address,
  bigIntToUnpaddedBytes,
  bytesToHex,
  concatBytes,
  ecrecover,
  hexToBytes,
  publicToAddress,
} from '@fyp-8141/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { isValidExplorationDate } from '@/libs/dates'

import {
  buildVerifyData,
  PRIVATE_KEY,
  runSimpleFrameTx,
  SENDER_ADDR,
} from './custom/runSimpleFrameTx'
import { INFO } from './info'

describe('EIP-8141 Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-8141')
      expect(INFO.path).toContain('eip-8141')
      expect(INFO.topic).toBe('ux')
      expect(INFO.timeline).toBe('research')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })

    it('has a valid added date', () => {
      expect(isValidExplorationDate(INFO.added)).toBe(true)
    })

    it('has required text fields', () => {
      expect(INFO.introText.length).toBeGreaterThan(0)
      expect(INFO.usageText.length).toBeGreaterThan(0)
      expect(INFO.title).toContain('Frame')
    })

    it('has creator attribution', () => {
      expect(INFO.creatorName).toBe('HolgerD77')
      expect(INFO.creatorURL).toBeDefined()
    })

    it('has relevant tags', () => {
      expect(INFO.tags.length).toBe(2)
      expect(INFO.tags).toContain('Account Abstraction')
      expect(INFO.tags).toContain('Post Quantum')
    })
  })

  describe('frame tx execution', () => {
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

    it('sigHash is stable across placeholder and final tx', () => {
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
            hexToBytes(('0x00' + 'c0') as `0x${string}`),
          ],
        ],
      }
      const placeholder = createFrameEIP8141Tx(txData, { common })
      const sigHash1 = placeholder.getHashedMessageToSign()
      const verifyData = buildVerifyData(0x2, sigHash1, PRIVATE_KEY)
      const rawFrames = (placeholder as unknown as { frames: [Uint8Array, Uint8Array, Uint8Array, Uint8Array][] }).frames
      rawFrames[0][3] = verifyData
      const finalTx = createFrameEIP8141Tx({ ...txData, frames: rawFrames }, { common })
      expect(bytesToHex(finalTx.getHashedMessageToSign())).toBe(bytesToHex(sigHash1))
    })

    it('runs a complete frame transaction with value transfer', async () => {
      const result = await runSimpleFrameTx()

      expect(result.txType).toBe(6)
      expect(result.frameCount).toBe(2)
      expect(result.sender).toBe(SENDER_ADDR.toString())
      expect(result.recipientBalance).toBe(BigInt(1000))
    }, 30_000)

    it('reports correct gas accounting and sender state', async () => {
      const result = await runSimpleFrameTx()

      expect(result.totalGasSpent).toBeGreaterThan(0n)
      expect(result.gasLimit).toBeGreaterThan(result.totalGasSpent)
      expect(result.senderNonceAfter).toBe(2n)
    }, 30_000)
  })
})
