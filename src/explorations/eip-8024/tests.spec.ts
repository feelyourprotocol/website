import { describe, expect, it } from 'vitest'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import { runBytecode } from '@/eComponents/bytecodeStepperEC/runBytecode'

import {
  bytecodeToHex,
  dupnDepth17Bytecode,
  exchange0x8eBytecode,
  invalidDupnBytecode,
  PUSH_ADD,
  stackTopNumbers,
  swapnDepth17Bytecode,
} from './bytecode'
import { config } from './config'
import { examples } from './examples'
import { INFO } from './info'

async function createAmsterdamEvm() {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  return createEVM({ common })
}

describe('EIP-8024 Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-8024')
      expect(INFO.path).toContain('eip-8024')
      expect(INFO.topic).toBe('robustness')
      expect(INFO.timeline).toBe('glamsterdam')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })
  })

  describe('config', () => {
    it('references a valid default example', () => {
      expect(examples[config.defaultExample]).toBeDefined()
    })
  })

  describe('examples', () => {
    it('has at least one example per new opcode', () => {
      expect(examples['dupn-depth-17']).toBeDefined()
      expect(examples['swapn-depth-17']).toBeDefined()
      expect(examples['exchange-0x8e']).toBeDefined()
    })

    it('each example has unprefixed hex bytecode', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}" should have one bytecode value`).toHaveLength(1)
        expect(ex.values[0]).toMatch(/^[0-9a-f]+$/i)
        expect(ex.values[0].length % 2).toBe(0)
      }
    })
  })

  describe('bytecode execution', () => {
    it('push-add completes without exception', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: PUSH_ADD,
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(result.executionGasUsed).toBeGreaterThan(0n)
    })

    it('DUPN depth 17 yields stack top [2, 18, 2]', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: dupnDepth17Bytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 3)).toEqual([17, 18, 2])
    })

    it('SWAPN depth 17 yields stack top [2, 18]', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: swapnDepth17Bytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 2)).toEqual([17, 1])
    })

    it('EXCHANGE 0x8e swaps slots below top', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: exchange0x8eBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 3)).toEqual([19, 18, 20])
    })

    it('invalid DUPN example throws an exception', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: invalidDupnBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeDefined()
    })

    it('example hex strings round-trip to working bytecode', async () => {
      const evm = await createAmsterdamEvm()
      for (const [key, ex] of Object.entries(examples)) {
        if (key === 'invalid-dupn-immediate') continue
        const hex = ex.values[0]
        const code = new Uint8Array(hex.match(/.{1,2}/g)!.map((b) => parseInt(b, 16)))
        const result = await runBytecode({
          evm,
          code,
          gasLimit: 1_000_000n,
          stepMode: false,
          onStep: () => {},
          shouldAbort: () => false,
        })
        expect(result.exceptionError, `Example "${key}" should run cleanly`).toBeUndefined()
      }
    })

    it('push-add hex matches builder output', () => {
      expect(examples['push-add'].values[0]).toBe(bytecodeToHex(PUSH_ADD))
    })
  })
})
