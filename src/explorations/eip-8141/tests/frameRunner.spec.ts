import { describe, expect, it } from 'vitest'

import { executeFrameExample } from '../custom/frameRunner'
import { FRAME_EXAMPLES } from '../examples'

describe('Frame Runner', () => {
  it('simple-transfer succeeds with 2 frame steps', async () => {
    const result = await executeFrameExample(FRAME_EXAMPLES['simple-transfer'])

    expect(result.success).toBe(true)
    expect(result.txType).toBe(6)
    expect(result.frameSteps).toHaveLength(2)
    expect(result.frameSteps[0].mode).toBe('VERIFY')
    expect(result.frameSteps[0].status).toBe(1)
    expect(result.frameSteps[1].mode).toBe('SENDER')
    expect(result.frameSteps[1].status).toBe(1)
  }, 30_000)

  it('simple-transfer delivers 1000 wei to recipient', async () => {
    const result = await executeFrameExample(FRAME_EXAMPLES['simple-transfer'])
    const recipientAddr = '0x' + 'cc'.repeat(20)

    expect(result.recipientBalances[recipientAddr]).toBe(1000n)
  }, 30_000)

  it('simple-transfer shows approval progression', async () => {
    const result = await executeFrameExample(FRAME_EXAMPLES['simple-transfer'])

    expect(result.frameSteps[0].senderApproved).toBe(true)
    expect(result.frameSteps[0].payerApproved).toBe(true)
  }, 30_000)

  it('verify-failure returns success=false with VERIFY error', async () => {
    const result = await executeFrameExample(FRAME_EXAMPLES['verify-failure'])

    expect(result.success).toBe(false)
    expect(result.error).toContain('VERIFY')
  }, 30_000)

  it('verify-failure has no frame steps (callback not reached for failed VERIFY)', async () => {
    const result = await executeFrameExample(FRAME_EXAMPLES['verify-failure'])

    expect(result.frameSteps).toHaveLength(1)
    expect(result.frameSteps[0].status).toBe(0)
  }, 30_000)

  it('batch-calls succeeds with correct recipient balances', async () => {
    const result = await executeFrameExample(FRAME_EXAMPLES['batch-calls'])

    expect(result.success).toBe(true)
    expect(result.frameSteps).toHaveLength(2)

    const addrA = '0x' + 'a1'.repeat(20)
    const addrB = '0x' + 'b2'.repeat(20)
    const addrC = '0x' + 'c3'.repeat(20)

    expect(result.recipientBalances[addrA]).toBe(100n)
    expect(result.recipientBalances[addrB]).toBe(200n)
    expect(result.recipientBalances[addrC]).toBe(300n)
  }, 30_000)

  it('all successful examples have positive total gas and VERIFY gas', async () => {
    for (const key of ['simple-transfer', 'batch-calls']) {
      const result = await executeFrameExample(FRAME_EXAMPLES[key])
      expect(result.totalGasSpent > 0n, `${key} total gas`).toBe(true)
      const verifyStep = result.frameSteps.find((s) => s.mode === 'VERIFY')
      expect(verifyStep!.gasUsed > 0n, `${key} VERIFY gas`).toBe(true)
    }
  }, 60_000)
})
