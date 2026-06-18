import { describe, expect, it } from 'vitest'

import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO } from './info'
import { runScenario } from './run'
import { SCENARIO_ORDER, SCENARIOS } from './scenarios'
import { TRIGGER_GROUPS, getGroupByField } from './taxonomy'
import {
  buildTriggerGroups,
  formatEth,
  formatIndexBadge,
  formatSlotValue,
} from './transitions'

describe('EIP-7928 BAL Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7928')
      expect(INFO.path).toContain('eip-7928')
      expect(INFO.topic).toBe('robustness')
      expect(INFO.timeline).toBe('glamsterdam')
      expect(INFO.poweredBy.length).toBeGreaterThan(0)
    })
  })

  describe('taxonomy', () => {
    it('defines five trigger groups with literal color classes', () => {
      expect(TRIGGER_GROUPS).toHaveLength(5)
      for (const group of TRIGGER_GROUPS) {
        expect(group.name.length).toBeGreaterThan(0)
        expect(group.triggerLabel.length).toBeGreaterThan(0)
        expect(group.classes.bg).toMatch(/^bg-\w+-\d+$/)
        expect(group.classes.jsonTint).toContain('border')
      }
    })

    it('maps each BAL source field to a group', () => {
      expect(getGroupByField('balanceChanges').id).toBe('valueFlow')
      expect(getGroupByField('storageReads').id).toBe('statePeeks')
    })
  })

  describe('examples', () => {
    it('lists curriculum scenarios in order', () => {
      expect(Object.keys(examples)).toEqual([...SCENARIO_ORDER])
      expect(DEFAULT_SCENARIO_ID).toBe('01-plain-transfer')
    })

    it('maps each example value to a scenario id', () => {
      for (const [key, ex] of Object.entries(examples)) {
        expect(ex.values).toEqual([key])
        expect(SCENARIOS[key]).toBeDefined()
        expect(exampleMeta[key]?.lesson.length).toBeGreaterThan(0)
      }
    })
  })

  describe('transitions', () => {
    it('formats ETH and index badges readably', () => {
      expect(formatEth(1_000_000_000_000_000_000n)).toContain('ETH')
      expect(formatIndexBadge('0x01')).toBe('tx 1')
      expect(formatIndexBadge('0x00')).toBe('system')
      expect(formatSlotValue('0x2a')).toBe('42')
    })
  })

  describe('runScenario', () => {
    it('runs plain transfer with balance and nonce BAL entries', async () => {
      const result = await runScenario('01-plain-transfer')
      expect(result.balHash).toMatch(/^0x[0-9a-f]+$/i)
      expect(result.preState.length).toBeGreaterThan(0)
      expect(result.txCount).toBe(1)
      expect(result.balJson.length).toBeGreaterThan(0)

      const hasBalance = result.balJson.some((a) => a.balanceChanges.length > 0)
      const hasNonce = result.balJson.some((a) => a.nonceChanges.length > 0)
      expect(hasBalance).toBe(true)
      expect(hasNonce).toBe(true)
    })

    it('records storageReads on contract SLOAD', async () => {
      const result = await runScenario('02-contract-sload')
      const contract = result.balJson.find(
        (a) =>
          a.address.toLowerCase() ===
          SCENARIOS['02-contract-sload'].preState[1]!.address.toLowerCase(),
      )
      expect(contract).toBeDefined()
      expect(contract!.storageReads.length).toBeGreaterThan(0)
      expect(contract!.storageChanges.length).toBe(0)
    })

    it('records storageChanges on SSTORE', async () => {
      const result = await runScenario('03-sstore-write')
      const contract = result.balJson.find(
        (a) =>
          a.address.toLowerCase() ===
          SCENARIOS['03-sstore-write'].preState[1]!.address.toLowerCase(),
      )
      expect(contract).toBeDefined()
      expect(contract!.storageChanges.length).toBeGreaterThan(0)
    })
  })

  describe('buildTriggerGroups', () => {
    it('produces human-readable value flow transitions', async () => {
      const result = await runScenario('01-plain-transfer')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const valueFlow = groups.find((g) => g.group.id === 'valueFlow')
      expect(valueFlow).toBeDefined()
      expect(valueFlow!.items.length).toBeGreaterThan(0)
      expect(valueFlow!.items[0]!.summary).toMatch(/→/)
      expect(valueFlow!.items[0]!.summary).toContain('ETH')
      expect(valueFlow!.items[0]!.balPath).toContain('balanceChanges')
    })

    it('includes state peeks for SLOAD scenario', async () => {
      const result = await runScenario('02-contract-sload')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const peeks = groups.find((g) => g.group.id === 'statePeeks')
      expect(peeks!.items.length).toBeGreaterThan(0)
      expect(peeks!.items[0]!.summary).toMatch(/read slot/)
    })

    it('includes state imprints for SSTORE scenario', async () => {
      const result = await runScenario('03-sstore-write')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const imprints = groups.find((g) => g.group.id === 'stateImprints')
      expect(imprints!.items.length).toBeGreaterThan(0)
      expect(imprints!.items[0]!.summary).toMatch(/→/)
    })

    it('assigns stable balPath keys for cross-highlight', async () => {
      const result = await runScenario('01-plain-transfer')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const paths = groups.flatMap((g) => g.items.map((i) => i.balPath))
      expect(new Set(paths).size).toBe(paths.length)
    })
  })
})
