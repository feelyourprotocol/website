import { describe, expect, it } from 'vitest'

import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO } from './info'
import { runScenario } from './run'
import { SCENARIO_ORDER, SCENARIOS } from './scenarios'
import {
  COINBASE_ADDRESS,
  CREATE_DEPLOYED_ADDRESS,
  DEFAULT_GAS_PRICE,
  RECIPIENT_ADDRESS,
  SENDER_ADDRESS,
  SSTORE_42_BYTECODE,
} from './scenarios/constants'
import { getGroupByField, TRIGGER_GROUPS } from './taxonomy'
import {
  buildTriggerGroups,
  formatBalanceTransition,
  formatEth,
  formatIndexBadge,
  formatSlotValue,
} from './transitions'

const LEGACY_TRANSFER_GAS = 21_000n
const LEGACY_TRANSFER_FEE = LEGACY_TRANSFER_GAS * DEFAULT_GAS_PRICE
const LEGACY_PRIORITY_FEE = LEGACY_TRANSFER_GAS * (DEFAULT_GAS_PRICE - 1n)

describe('EIP-7928 BAL Exploration', () => {
  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7928')
      expect(INFO.path).toContain('eip-7928')
      expect(INFO.topic).toBe('scaling')
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
      expect(formatEth(1_000_000_000_000_000_000n)).toBe('1 ETH')
      expect(formatEth(1n)).toBe('1 wei')
      expect(formatIndexBadge('0x01')).toBe('tx 1')
      expect(formatIndexBadge('0x02')).toBe('tx 2')
      expect(formatIndexBadge('0x00')).toBe('system')
      expect(formatSlotValue('0x2a')).toBe('42')
    })

    it('shows sub-ETH balances with enough precision for gas deductions', () => {
      const postSender = 1_000_000_000_000_000_000n - LEGACY_TRANSFER_FEE - 1n
      expect(formatEth(postSender)).toContain('0.999999')
      expect(formatEth(postSender)).not.toBe('1 ETH')
      expect(formatBalanceTransition(1_000_000_000_000_000_000n, postSender)).toBe(
        `1 ETH → ${formatEth(postSender)}`,
      )
    })
  })

  describe('runScenario', () => {
    it('runs plain transfer with balance and nonce BAL entries', async () => {
      const result = await runScenario('01-plain-transfer')
      expect(result.balHash).toMatch(/^0x[0-9a-f]+$/i)
      expect(result.preState.length).toBe(2)
      expect(result.txCount).toBe(1)
      expect(result.balJson.length).toBeGreaterThan(0)

      const hasBalance = result.balJson.some((a) => a.balanceChanges.length > 0)
      const hasNonce = result.balJson.some((a) => a.nonceChanges.length > 0)
      expect(hasBalance).toBe(true)
      expect(hasNonce).toBe(true)
    })

    it('records 1 wei on the recipient and fees on coinbase for plain transfer', async () => {
      const result = await runScenario('01-plain-transfer')

      const recipient = result.balJson.find(
        (a) => a.address.toLowerCase() === RECIPIENT_ADDRESS.toLowerCase(),
      )
      expect(recipient?.balanceChanges).toHaveLength(1)
      expect(BigInt(recipient!.balanceChanges[0]!.postBalance)).toBe(1n)

      const coinbase = result.balJson.find(
        (a) => a.address.toLowerCase() === COINBASE_ADDRESS.toLowerCase(),
      )
      expect(coinbase?.balanceChanges).toHaveLength(1)
      expect(BigInt(coinbase!.balanceChanges[0]!.postBalance)).toBe(LEGACY_PRIORITY_FEE)

      const sender = result.balJson.find(
        (a) => a.address.toLowerCase() === SENDER_ADDRESS.toLowerCase(),
      )
      expect(BigInt(sender!.balanceChanges[0]!.postBalance)).toBe(
        1_000_000_000_000_000_000n - LEGACY_TRANSFER_FEE - 1n,
      )
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

    it('records codeChanges on CREATE deploy', async () => {
      const result = await runScenario('04-create-deploy')
      const deployed = result.balJson.find(
        (a) => a.address.toLowerCase() === CREATE_DEPLOYED_ADDRESS.toLowerCase(),
      )
      expect(deployed).toBeDefined()
      expect(deployed!.codeChanges).toHaveLength(1)
      expect(deployed!.codeChanges[0]!.newCode.toLowerCase()).toBe(
        SSTORE_42_BYTECODE.toLowerCase(),
      )
      expect(deployed!.codeChanges[0]!.blockAccessIndex).toBe('0x01')
    })

    it('tags each change with the transaction index in a two-tx block', async () => {
      const result = await runScenario('05-two-transfers')
      expect(result.txCount).toBe(2)

      const sender = result.balJson.find(
        (a) => a.address.toLowerCase() === SENDER_ADDRESS.toLowerCase(),
      )
      expect(sender?.balanceChanges.map((c) => c.blockAccessIndex)).toEqual(['0x01', '0x02'])
      expect(sender?.nonceChanges.map((c) => c.blockAccessIndex)).toEqual(['0x01', '0x02'])

      const recipient = result.balJson.find(
        (a) => a.address.toLowerCase() === RECIPIENT_ADDRESS.toLowerCase(),
      )
      expect(recipient?.balanceChanges).toHaveLength(2)
      expect(recipient?.balanceChanges[0]!.blockAccessIndex).toBe('0x01')
      expect(BigInt(recipient!.balanceChanges[0]!.postBalance)).toBe(1n)
      expect(recipient?.balanceChanges[1]!.blockAccessIndex).toBe('0x02')
      expect(BigInt(recipient!.balanceChanges[1]!.postBalance)).toBe(3n)
    })

    it('records storageReads but not storageChanges when SSTORE reverts', async () => {
      const result = await runScenario('06-sstore-revert')
      const contract = result.balJson.find(
        (a) =>
          a.address.toLowerCase() ===
          SCENARIOS['06-sstore-revert'].preState[1]!.address.toLowerCase(),
      )
      expect(contract).toBeDefined()
      expect(contract!.storageReads.length).toBeGreaterThan(0)
      expect(contract!.storageChanges.length).toBe(0)
    })
  })

  describe('buildTriggerGroups', () => {
    it('describes plain transfer value flow matching the scenario', async () => {
      const result = await runScenario('01-plain-transfer')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const valueFlow = groups.find((g) => g.group.id === 'valueFlow')!
      const byLabel = Object.fromEntries(valueFlow.items.map((item) => [item.addressLabel, item]))

      expect(byLabel.sender?.summary).toBe(
        formatBalanceTransition(
          1_000_000_000_000_000_000n,
          1_000_000_000_000_000_000n - LEGACY_TRANSFER_FEE - 1n,
        ),
      )
      expect(byLabel.recipient?.summary).toBe('0 ETH → 1 wei')
      expect(byLabel.coinbase?.summary).toBe(
        formatBalanceTransition(0n, LEGACY_PRIORITY_FEE),
      )
      expect(byLabel.sender?.indexBadge).toBe('tx 1')
    })

    it('produces human-readable value flow transitions', async () => {
      const result = await runScenario('01-plain-transfer')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const valueFlow = groups.find((g) => g.group.id === 'valueFlow')
      expect(valueFlow).toBeDefined()
      expect(valueFlow!.items.length).toBeGreaterThan(0)
      expect(valueFlow!.items[0]!.summary).toMatch(/→/)
      expect(valueFlow!.items[0]!.balPath).toContain('balanceChanges')
    })

    it('includes state peeks for SLOAD scenario', async () => {
      const result = await runScenario('02-contract-sload')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const peeks = groups.find((g) => g.group.id === 'statePeeks')
      expect(peeks!.items.length).toBeGreaterThan(0)
      expect(peeks!.items[0]!.summary).toMatch(/read slot/)
      expect(peeks!.items[0]!.addressLabel).toBe('contract')
    })

    it('includes state imprints for SSTORE scenario', async () => {
      const result = await runScenario('03-sstore-write')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const imprints = groups.find((g) => g.group.id === 'stateImprints')
      expect(imprints!.items.length).toBeGreaterThan(0)
      expect(imprints!.items[0]!.summary).toMatch(/→/)
      expect(imprints!.items[0]!.addressLabel).toBe('contract')
    })

    it('includes contract births for CREATE deploy', async () => {
      const result = await runScenario('04-create-deploy')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const births = groups.find((g) => g.group.id === 'contractBirths')!
      expect(births.items).toHaveLength(1)
      expect(births.items[0]!.summary).toBe('deployed (6 bytes)')
      expect(births.items[0]!.addressLabel).toBe('deployed contract')
      expect(births.items[0]!.indexBadge).toBe('tx 1')
    })

    it('labels each transfer with tx 1 and tx 2 in a two-tx block', async () => {
      const result = await runScenario('05-two-transfers')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const valueFlow = groups.find((g) => g.group.id === 'valueFlow')!
      const recipientItems = valueFlow.items.filter((i) => i.addressLabel === 'recipient')
      expect(recipientItems).toHaveLength(2)
      expect(recipientItems[0]!.indexBadge).toBe('tx 1')
      expect(recipientItems[0]!.summary).toBe('0 ETH → 1 wei')
      expect(recipientItems[1]!.indexBadge).toBe('tx 2')
      expect(recipientItems[1]!.summary).toBe('1 wei → 3 wei')

      const ticks = groups.find((g) => g.group.id === 'counterTicks')!
      expect(ticks.items).toHaveLength(2)
      expect(ticks.items[0]!.indexBadge).toBe('tx 1')
      expect(ticks.items[0]!.summary).toBe('nonce 0 → 1')
      expect(ticks.items[1]!.indexBadge).toBe('tx 2')
      expect(ticks.items[1]!.summary).toBe('nonce 1 → 2')
    })

    it('includes state peeks but no imprints when SSTORE reverts', async () => {
      const result = await runScenario('06-sstore-revert')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const peeks = groups.find((g) => g.group.id === 'statePeeks')!
      const imprints = groups.find((g) => g.group.id === 'stateImprints')!
      expect(peeks.items.length).toBeGreaterThan(0)
      expect(peeks.items[0]!.addressLabel).toBe('contract')
      expect(peeks.items[0]!.summary).toMatch(/read slot/)
      expect(imprints.items).toHaveLength(0)
    })

    it('labels counter ticks with the sender on plain transfer', async () => {
      const result = await runScenario('01-plain-transfer')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const ticks = groups.find((g) => g.group.id === 'counterTicks')!
      expect(ticks.items).toHaveLength(1)
      expect(ticks.items[0]!.summary).toBe('nonce 0 → 1')
      expect(ticks.items[0]!.addressLabel).toBe('sender')
    })

    it('assigns stable balPath keys for cross-highlight', async () => {
      const result = await runScenario('01-plain-transfer')
      const groups = buildTriggerGroups(result.balJson, result.preState)
      const paths = groups.flatMap((g) => g.items.map((i) => i.balPath))
      expect(new Set(paths).size).toBe(paths.length)
    })
  })
})
