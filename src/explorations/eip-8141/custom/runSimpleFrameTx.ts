/**
 * EIP-8141 Simple Frame Transaction
 *
 * Adapted from the EthereumJS example for browser execution.
 * Demonstrates a basic "Simple Transaction" flow:
 *   Frame 0: VERIFY (mode 1) — ECDSA signature verification + APPROVE
 *   Frame 1: SENDER (mode 2) — RLP-encoded call batch (value transfer)
 */

import { Common, Hardfork, Mainnet } from '@fyp-8141/common'
import { RLP } from '@fyp-8141/rlp'
import { createFrameEIP8141Tx,type FrameEIP8141TxData } from '@fyp-8141/tx'
import {
  Account,
  Address,
  BIGINT_0,
  bigIntToUnpaddedBytes,
  bytesToHex,
  concatBytes,
  hexToBytes,
  privateToPublic,
  publicToAddress,
} from '@fyp-8141/util'
import { createVM, runTx } from '@fyp-8141/vm'
import { secp256k1 } from '@noble/curves/secp256k1.js'
import { keccak_256 } from '@noble/hashes/sha3.js'

export interface FrameTxResult {
  sender: string
  recipient: string
  initialBalance: string
  transferValue: string
  txType: number
  gasLimit: bigint
  frameCount: number
  totalGasSpent: bigint
  gasRefund: bigint
  senderBalanceAfter: bigint
  senderNonceAfter: bigint
  recipientBalance: bigint
}

export const PRIVATE_KEY = hexToBytes(('0x' + 'ab'.repeat(32)) as `0x${string}`)
export const PUBLIC_KEY = privateToPublic(PRIVATE_KEY)
export const SENDER_ADDR = new Address(publicToAddress(PUBLIC_KEY))

export function buildVerifyData(
  scope: number,
  sigHash: Uint8Array,
  privateKey: Uint8Array,
): Uint8Array {
  const byte0 = ((scope & 0xf) << 4) | 0x00
  const dataWithoutSig = new Uint8Array([byte0])
  const hash = keccak_256(concatBytes(sigHash, dataWithoutSig))

  const sigBytes = secp256k1.sign(hash, privateKey.slice(0, 32), {
    format: 'recovered',
    prehash: false,
  })
  const sig = secp256k1.Signature.fromBytes(sigBytes, 'recovered')
  const rBytes = bigIntToUnpaddedBytes(sig.r)
  const sBytes = bigIntToUnpaddedBytes(sig.s)
  const rPadded = new Uint8Array(32)
  rPadded.set(rBytes, 32 - rBytes.length)
  const sPadded = new Uint8Array(32)
  sPadded.set(sBytes, 32 - sBytes.length)
  const v = sig.recovery! + 27

  return concatBytes(new Uint8Array([byte0, v]), rPadded, sPadded)
}

export async function runSimpleFrameTx(): Promise<FrameTxResult> {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Prague, eips: [8141] })
  const vm = await createVM({ common })

  const initialBalance = BigInt('10000000000000000') // 0.01 ETH
  await vm.stateManager.putAccount(SENDER_ADDR, new Account(0n, initialBalance))

  const recipient = new Address(hexToBytes(('0x' + 'cc'.repeat(20)) as `0x${string}`))
  const transferValue = BigInt(1000)

  const senderRlp = RLP.encode([
    [recipient.bytes, bigIntToUnpaddedBytes(transferValue), new Uint8Array(0)],
  ])
  const senderFrameData = concatBytes(new Uint8Array([0x00]), senderRlp)

  const txData: FrameEIP8141TxData = {
    chainId: 1n,
    nonce: 0n,
    sender: SENDER_ADDR.toString() as `0x${string}`,
    maxPriorityFeePerGas: 1n,
    maxFeePerGas: 100n,
    maxFeePerBlobGas: 0n,
    frames: [
      [new Uint8Array([1]), new Uint8Array(0), bigIntToUnpaddedBytes(50000n), new Uint8Array(0)],
      [new Uint8Array([2]), new Uint8Array(0), bigIntToUnpaddedBytes(200000n), senderFrameData],
    ],
  }

  const txPlaceholder = createFrameEIP8141Tx(txData, { common })
  const sigHash = txPlaceholder.getHashedMessageToSign()
  const verifyData = buildVerifyData(0x2, sigHash, PRIVATE_KEY)

  type FrameTuple = [Uint8Array, Uint8Array, Uint8Array, Uint8Array]
  const rawFrames = (txPlaceholder as unknown as { frames: FrameTuple[] }).frames
  rawFrames[0][3] = verifyData

  const tx = createFrameEIP8141Tx({ ...txData, frames: rawFrames }, { common })

  const result = await runTx(vm, {
    tx: tx as Parameters<typeof runTx>[1]['tx'],
    skipBalance: true,
    skipNonce: true,
    skipHardForkValidation: true,
  })

  const senderAfter = await vm.stateManager.getAccount(SENDER_ADDR)
  const recipientAccount = await vm.stateManager.getAccount(recipient)

  return {
    sender: SENDER_ADDR.toString(),
    recipient: bytesToHex(recipient.bytes),
    initialBalance: initialBalance.toString(),
    transferValue: transferValue.toString(),
    txType: tx.type,
    gasLimit: tx.gasLimit,
    frameCount: (tx as unknown as { frames: unknown[] }).frames.length,
    totalGasSpent: result.totalGasSpent,
    gasRefund: result.gasRefund,
    senderBalanceAfter: senderAfter!.balance,
    senderNonceAfter: senderAfter!.nonce,
    recipientBalance: recipientAccount?.balance ?? BIGINT_0,
  }
}
