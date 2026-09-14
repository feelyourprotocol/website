import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'

import { CANONICAL } from './canonical'
import {
  AMSTERDAM_EXISTING_PROGRAM_GAS,
  AMSTERDAM_STORAGE_WRITE,
  COLD_STORAGE_ACCESS,
  NEW_STORAGE_SLOT_STATE_GAS,
  OSAKA_EXISTING_PROGRAM_GAS,
  SLOAD_PROGRAM_GAS,
} from './constants'
import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO } from './info'
import MyC from './MyC.vue'
import { programGasFromExec, runScenario } from './run'
import { getScenario, SCENARIO_ORDER } from './scenarios'

describe('EIP-8038 state-access gas exploration', () => {
  describe('canonical', () => {
    it('defines a repricing twin with Osaka vs Amsterdam comparison', () => {
      expect(CANONICAL.question.changeNature).toBe('repricing')
      expect(CANONICAL.mcp.shapes).toContain('simulate')
      expect(CANONICAL.mcp.shapes).toContain('transaction')
      expect(CANONICAL.mcp.docsStatus).toBe('runnable')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('amsterdam')
      expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('osaka')
      expect(CANONICAL.taxonomy.topic).toBe('robustness')
      expect(CANONICAL.taxonomy.timeline).toBe('glamsterdam')
    })
  })

  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-8038')
      expect(INFO.path).toBe('/eip-8038-state-access-gas')
      expect(INFO.topic).toBe('robustness')
      expect(INFO.timeline).toBe('glamsterdam')
      expect(INFO.coreQuestion).toBe(CANONICAL.question.coreQuestion)
      expect(INFO.introText).toContain(CANONICAL.question.coreQuestion)
      expect(INFO.imageBoxHeight).toBe(COVER_COLUMN_IMAGE_HEIGHT)
      expect(INFO.rightPanel).toBeUndefined()
    })
  })

  describe('examples', () => {
    it('lists scenarios in curriculum order', () => {
      expect(Object.keys(examples)).toEqual([...SCENARIO_ORDER])
      expect(DEFAULT_SCENARIO_ID).toBe('01-existing-slot')
    })

    it('maps each example to scenario metadata', () => {
      for (const id of SCENARIO_ORDER) {
        expect(examples[id]?.values).toEqual([id])
        expect(exampleMeta[id]?.lesson.length).toBeGreaterThan(0)
      }
    })
  })

  describe('getScenario', () => {
    it('throws a usable error for unknown ids', () => {
      expect(() => getScenario('not-a-scenario')).toThrow(/Unknown EIP-8038 scenario/)
      expect(() => getScenario('')).toThrow(/Unknown EIP-8038 scenario/)
    })
  })

  describe('programGasFromExec', () => {
    it('subtracts spilled state gas from the call total', () => {
      expect(programGasFromExec(110_026n, 97_920n)).toBe(12_106n)
    })

    it('does not go negative when spill is larger than used', () => {
      expect(programGasFromExec(100n, 200n)).toBe(0n)
    })
  })

  describe('runScenario', () => {
    it('charges the write jump on an existing slot (Amsterdam vs Osaka)', async () => {
      const amsterdam = await runScenario('01-existing-slot', 'amsterdam')
      const osaka = await runScenario('01-existing-slot', 'osaka')
      expect(amsterdam.programSuccessful).toBe(true)
      expect(osaka.programSuccessful).toBe(true)
      expect(amsterdam.programGas).toBe(AMSTERDAM_EXISTING_PROGRAM_GAS)
      expect(osaka.programGas).toBe(OSAKA_EXISTING_PROGRAM_GAS)
      expect(amsterdam.components.write).toBe(AMSTERDAM_STORAGE_WRITE)
      expect(amsterdam.components.access).toBe(COLD_STORAGE_ACCESS)
      expect(osaka.components.access).toBe(COLD_STORAGE_ACCESS)
      expect(amsterdam.stateGas).toBe(0n)
    })

    it('keeps SLOAD program gas the same on both forks', async () => {
      const amsterdam = await runScenario('02-read-slot', 'amsterdam')
      const osaka = await runScenario('02-read-slot', 'osaka')
      expect(amsterdam.programSuccessful).toBe(true)
      expect(osaka.programSuccessful).toBe(true)
      expect(amsterdam.programGas).toBe(SLOAD_PROGRAM_GAS)
      expect(osaka.programGas).toBe(SLOAD_PROGRAM_GAS)
      expect(amsterdam.components.write).toBe(0n)
      expect(amsterdam.components.create).toBe(0n)
    })

    it('meters a new slot create as state gas on Amsterdam', async () => {
      const amsterdam = await runScenario('03-new-slot', 'amsterdam')
      const osaka = await runScenario('03-new-slot', 'osaka')
      expect(amsterdam.programSuccessful).toBe(true)
      expect(osaka.programSuccessful).toBe(true)
      expect(amsterdam.stateGas).toBe(NEW_STORAGE_SLOT_STATE_GAS)
      expect(osaka.stateGas).toBe(0n)
      expect(amsterdam.components.createMeter).toBe('state')
      expect(osaka.components.createMeter).toBe('regular')
    })

    it('rejects unknown scenario ids without crashing the helper', async () => {
      await expect(runScenario('nope', 'amsterdam')).rejects.toThrow(/Unknown EIP-8038 scenario/)
    })
  })

  describe('MyC.vue', () => {
    it('mounts with scenario controls and run action', async () => {
      document.body.innerHTML = '<div id="root"></div>'
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/', component: { template: '<div />' } }],
      })
      await router.push('/')

      const wrapper = mount(
        {
          components: { MyC },
          template: '<Suspense><MyC /></Suspense>',
        },
        {
          attachTo: document.getElementById('root')!,
          global: {
            plugins: [router],
            stubs: {
              ExplorationC: {
                template: '<div><slot name="content" /></div>',
              },
              PoweredByC: true,
            },
          },
        },
      )
      await flushPromises()
      await flushPromises()
      expect(wrapper.text()).toContain('Run')
      expect(wrapper.text()).toContain('Amsterdam')
      const amsterdam = wrapper.find('[aria-pressed="true"]')
      expect(amsterdam.exists()).toBe(true)
      expect(amsterdam.text()).toBe('Amsterdam')
      expect(wrapper.find('[data-testid="cost-breakdown"]').attributes('data-has-run')).toBe(
        'false',
      )
      expect(wrapper.text()).toContain('Run the program to fill touch, change, and create')
      const breakdown = wrapper.find('[data-testid="cost-breakdown"]')
      expect(breakdown.text()).toContain('—')
      expect(breakdown.text()).toContain('Touch')
      expect(breakdown.text()).toContain('Change')
      expect(breakdown.text()).toContain('Create')
    })

    it('resets hardfork when the scenario changes', async () => {
      document.body.innerHTML = '<div id="root"></div>'
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/', component: { template: '<div />' } }],
      })
      await router.push('/')

      const wrapper = mount(
        {
          components: { MyC },
          template: '<Suspense><MyC /></Suspense>',
        },
        {
          attachTo: document.getElementById('root')!,
          global: {
            plugins: [router],
            stubs: {
              ExplorationC: {
                template: '<div><slot name="content" /></div>',
              },
              PoweredByC: true,
            },
          },
        },
      )
      await flushPromises()
      await flushPromises()

      const osaka = wrapper.findAll('button').find((b) => b.text() === 'Osaka')
      expect(osaka).toBeDefined()
      await osaka!.trigger('click')
      expect(wrapper.find('[data-testid="hardfork-osaka"]').attributes('aria-pressed')).toBe('true')

      await wrapper.find('[data-testid="example-select"]').trigger('click')
      await flushPromises()
      await wrapper.find('[data-testid="example-02-read-slot"]').trigger('click')
      await flushPromises()
      expect(wrapper.find('[data-testid="hardfork-amsterdam"]').attributes('aria-pressed')).toBe(
        'true',
      )
    })
  })
})
