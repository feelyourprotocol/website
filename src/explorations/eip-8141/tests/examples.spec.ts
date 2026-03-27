import { describe, expect, it } from 'vitest'

import { examples, FRAME_EXAMPLES } from '../examples'

describe('EIP-8141 Examples', () => {
  it('has at least 3 example definitions', () => {
    expect(Object.keys(FRAME_EXAMPLES).length).toBeGreaterThanOrEqual(3)
  })

  it('each example has a non-empty title and description', () => {
    for (const [key, def] of Object.entries(FRAME_EXAMPLES)) {
      expect(def.title.length, `${key} title`).toBeGreaterThan(0)
      expect(def.description.length, `${key} description`).toBeGreaterThan(0)
    }
  })

  it('each example has at least one frame', () => {
    for (const [key, def] of Object.entries(FRAME_EXAMPLES)) {
      expect(def.frames.length, `${key} frames`).toBeGreaterThanOrEqual(1)
    }
  })

  it('frame modes are valid', () => {
    const validModes = new Set(['VERIFY', 'SENDER', 'DEFAULT'])
    for (const def of Object.values(FRAME_EXAMPLES)) {
      for (const frame of def.frames) {
        expect(validModes.has(frame.mode), `${def.id} frame mode ${frame.mode}`).toBe(true)
      }
    }
  })

  it('frame gas limits are positive', () => {
    for (const def of Object.values(FRAME_EXAMPLES)) {
      for (const frame of def.frames) {
        expect(frame.gasLimit > 0n, `${def.id}/${frame.label} gas`).toBe(true)
      }
    }
  })

  it('sender balances are positive', () => {
    for (const def of Object.values(FRAME_EXAMPLES)) {
      expect(def.senderBalance > 0n, `${def.id} sender balance`).toBe(true)
    }
  })

  it('verify-failure expects failure', () => {
    expect(FRAME_EXAMPLES['verify-failure'].expectSuccess).toBe(false)
  })

  it('simple-transfer and batch-calls expect success', () => {
    expect(FRAME_EXAMPLES['simple-transfer'].expectSuccess).toBe(true)
    expect(FRAME_EXAMPLES['batch-calls'].expectSuccess).toBe(true)
  })

  it('ExamplesUIC-compatible map has matching keys', () => {
    const frameKeys = Object.keys(FRAME_EXAMPLES)
    const uicKeys = Object.keys(examples)
    expect(uicKeys).toEqual(frameKeys)
  })

  it('ExamplesUIC entries have non-empty titles', () => {
    for (const entry of Object.values(examples)) {
      expect(entry.title.length).toBeGreaterThan(0)
    }
  })
})
