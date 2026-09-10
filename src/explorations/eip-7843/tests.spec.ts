import { describe, expect, it } from 'vitest'
import { Common, Hardfork, Mainnet } from '@ethereumjs/common'
import { createEVM } from '@ethereumjs/evm'

import { runBytecode } from '@/eComponents/bytecodeStepperEC/runBytecode'

import { createLabBlock, LAB_TIMESTAMP, LAB_TIMESTAMP_DIV_12 } from './block'
import {
  slotnumBytecode,
  stackTopNumbers,
  timestampAndSlotBytecode,
  timestampDiv12Bytecode,
} from './bytecode'
import { CANONICAL } from './canonical'
import { config } from './config'
import { examples } from './examples'
import { INFO } from './info'
import { parseSlotNumber, UINT64_MAX } from './parseSlot'

async function createAmsterdamEvm() {
  const common = new Common({ chain: Mainnet, hardfork: Hardfork.Amsterdam })
  return { common, evm: await createEVM({ common }) }
}

describe('EIP-7843 Exploration', () => {
  describe('canonical', () => {
    it('defines SLOTNUM capability and fork comparison', () => {
      expect(CANONICAL.question.changeNature).toBe('new-capability')
      expect(CANONICAL.mcp.docsStatus).toBe('runnable')
      expect(CANONICAL.mcp.shapes).toEqual(['block'])
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('amsterdam')
      expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('osaka')
    })
  })

  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7843')
      expect(INFO.path).toBe('/eip-7843-slotnum-opcode')
      expect(INFO.topic).toBe('robustness')
      expect(INFO.timeline).toBe('glamsterdam')
      expect(INFO.rightPanel).toBe(true)
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })

    it('leads intro with the core question', () => {
      expect(INFO.introText).toContain(CANONICAL.question.coreQuestion)
    })
  })

  describe('config', () => {
    it('defaults to the SLOTNUM example', () => {
      expect(config.defaultExample).toBe('slotnum')
      expect(examples.slotnum).toBeDefined()
    })
  })

  describe('examples', () => {
    it('has SLOTNUM, timestamp compare, and divide-by-12 trap', () => {
      expect(examples.slotnum).toBeDefined()
      expect(examples['timestamp-and-slot']).toBeDefined()
      expect(examples['timestamp-div-12']).toBeDefined()
    })

    it('each example has unprefixed hex bytecode', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values, `Example "${key}" should have one bytecode value`).toHaveLength(1)
        expect(ex.values[0]).toMatch(/^[0-9a-f]+$/i)
        expect(ex.values[0].length % 2).toBe(0)
      }
    })
  })

  describe('parseSlotNumber', () => {
    it('accepts the default slot', () => {
      expect(parseSlotNumber('42')).toEqual({ ok: true, value: 42n })
    })

    it('accepts zero', () => {
      expect(parseSlotNumber('0')).toEqual({ ok: true, value: 0n })
    })

    it('rejects empty, junk, decimals, and negatives', () => {
      expect(parseSlotNumber('').ok).toBe(false)
      expect(parseSlotNumber('  ').ok).toBe(false)
      expect(parseSlotNumber('abc').ok).toBe(false)
      expect(parseSlotNumber('4.2').ok).toBe(false)
      expect(parseSlotNumber('-1').ok).toBe(false)
    })

    it('rejects values above uint64', () => {
      const tooBig = (UINT64_MAX + 1n).toString()
      const result = parseSlotNumber(tooBig)
      expect(result.ok).toBe(false)
    })

    it('accepts uint64 max', () => {
      expect(parseSlotNumber(UINT64_MAX.toString())).toEqual({ ok: true, value: UINT64_MAX })
    })
  })

  describe('bytecode execution', () => {
    it('SLOTNUM pushes the header slot', async () => {
      const { common, evm } = await createAmsterdamEvm()
      const slotNumber = 42n
      const result = await runBytecode({
        evm,
        code: slotnumBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        block: createLabBlock(common, slotNumber),
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 1)).toEqual([slotNumber])
    })

    it('changing the slot changes the stack top', async () => {
      const { common, evm } = await createAmsterdamEvm()
      const result = await runBytecode({
        evm,
        code: slotnumBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        block: createLabBlock(common, 99n),
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(stackTopNumbers(result.runState?.stack, 1)).toEqual([99n])
    })

    it('TIMESTAMP and SLOTNUM are different numbers', async () => {
      const { common, evm } = await createAmsterdamEvm()
      const slotNumber = 42n
      const result = await runBytecode({
        evm,
        code: timestampAndSlotBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        block: createLabBlock(common, slotNumber),
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 2)).toEqual([LAB_TIMESTAMP, slotNumber])
    })

    it('TIMESTAMP ÷ 12 is not the slot', async () => {
      const { common, evm } = await createAmsterdamEvm()
      const slotNumber = 42n
      const result = await runBytecode({
        evm,
        code: timestampDiv12Bytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        block: createLabBlock(common, slotNumber),
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeUndefined()
      expect(stackTopNumbers(result.runState?.stack, 1)).toEqual([LAB_TIMESTAMP_DIV_12])
      expect(LAB_TIMESTAMP_DIV_12).not.toBe(slotNumber)
    })

    it('SLOTNUM is invalid on Osaka', async () => {
      const common = new Common({ chain: Mainnet, hardfork: Hardfork.Osaka })
      const evm = await createEVM({ common })
      const result = await runBytecode({
        evm,
        code: slotnumBytecode(),
        gasLimit: 1_000_000n,
        stepMode: false,
        block: createLabBlock(common, 42n),
        onStep: () => {},
        shouldAbort: () => false,
      })
      expect(result.exceptionError).toBeDefined()
    })
  })
})
