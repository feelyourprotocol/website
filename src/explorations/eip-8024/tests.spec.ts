import { describe, expect, it } from 'vitest'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import { runBytecode } from '@/eComponents/bytecodeStepperEC/runBytecode'

import {
  dupnBytecode,
  exchangeBytecode,
  invalidDupnBytecode,
  stackTopNumbers,
  swapnBytecode,
} from './bytecode'
import { config } from './config'
import { examples } from './examples'
import { CANONICAL } from './canonical'
import { INFO } from './info'

async function createAmsterdamEvm() {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  return createEVM({ common })
}

describe('EIP-8024 Exploration', () => {
  describe('canonical', () => {
    it('defines stack opcode capability and fork comparison', () => {
      expect(CANONICAL.question.changeNature).toBe('new-capability')
      expect(CANONICAL.mcp.shapes).toContain('simulate')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('amsterdam')
    })
  })

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
    it('defaults to the DUPN example', () => {
      expect(config.defaultExample).toBe('dupn')
      expect(examples.dupn).toBeDefined()
    })

    it('shows enough stack slots for the minimal DUPN demo', () => {
      expect(config.maxStackDisplay).toBeGreaterThanOrEqual(17)
    })
  })

  describe('examples', () => {
    it('has at least one example per new opcode', () => {
      expect(examples.dupn).toBeDefined()
      expect(examples.swapn).toBeDefined()
      expect(examples.exchange).toBeDefined()
    })

    it('each example has unprefixed hex bytecode', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}" should have one bytecode value`).toHaveLength(1)
        expect(ex.values[0]).toMatch(/^[0-9a-f]+$/i)
        expect(ex.values[0].length % 2).toBe(0)
      }
    })

    it('uses compact bytecode for EXCHANGE and invalid DUPN', () => {
      expect(examples.exchange.values[0].length).toBeLessThan(examples.dupn.values[0].length)
      expect(examples['invalid-dupn'].values[0].length).toBeLessThan(examples.dupn.values[0].length)
    })
  })

  describe('bytecode execution', () => {
    it('DUPN copies stack item at depth 17 onto the top', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: dupnBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 3)).toEqual([16, 17, 1])
    })

    it('SWAPN swaps top with stack item at depth 17', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: swapnBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 3)).toEqual([16, 17, 1])
    })

    it('EXCHANGE swaps stack items at depths 2 and 3 on a 4-item stack', async () => {
      const evm = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: exchangeBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 4)).toEqual([1, 3, 2, 4])
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
        if (key === 'invalid-dupn') continue
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
  })
})
