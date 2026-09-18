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
    it('defines a repricing twin with Fusaka vs Glamsterdam comparison', () => {
      expect(CANONICAL.question.changeNature).toBe('repricing')
      expect(CANONICAL.mcp.shapes).toContain('simulate')
      expect(CANONICAL.mcp.shapes).toContain('transaction')
      expect(CANONICAL.mcp.docsStatus).toBe('runnable')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('glamsterdam')
      expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('fusaka')
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
    it('charges the write jump on an existing slot (Glamsterdam vs Fusaka)', async () => {
      const glamsterdam = await runScenario('01-existing-slot', 'glamsterdam')
      const fusaka = await runScenario('01-existing-slot', 'fusaka')
      expect(glamsterdam.programSuccessful).toBe(true)
      expect(fusaka.programSuccessful).toBe(true)
      expect(glamsterdam.programGas).toBe(AMSTERDAM_EXISTING_PROGRAM_GAS)
      expect(fusaka.programGas).toBe(OSAKA_EXISTING_PROGRAM_GAS)
      expect(glamsterdam.components.write).toBe(AMSTERDAM_STORAGE_WRITE)
      expect(glamsterdam.components.access).toBe(COLD_STORAGE_ACCESS)
      expect(fusaka.components.access).toBe(COLD_STORAGE_ACCESS)
      expect(glamsterdam.stateGas).toBe(0n)
    })

    it('keeps SLOAD program gas the same on both forks', async () => {
      const glamsterdam = await runScenario('02-read-slot', 'glamsterdam')
      const fusaka = await runScenario('02-read-slot', 'fusaka')
      expect(glamsterdam.programSuccessful).toBe(true)
      expect(fusaka.programSuccessful).toBe(true)
      expect(glamsterdam.programGas).toBe(SLOAD_PROGRAM_GAS)
      expect(fusaka.programGas).toBe(SLOAD_PROGRAM_GAS)
      expect(glamsterdam.components.write).toBe(0n)
      expect(glamsterdam.components.create).toBe(0n)
    })

    it('meters a new slot create as state gas on Glamsterdam', async () => {
      const glamsterdam = await runScenario('03-new-slot', 'glamsterdam')
      const fusaka = await runScenario('03-new-slot', 'fusaka')
      expect(glamsterdam.programSuccessful).toBe(true)
      expect(fusaka.programSuccessful).toBe(true)
      expect(glamsterdam.stateGas).toBe(NEW_STORAGE_SLOT_STATE_GAS)
      expect(fusaka.stateGas).toBe(0n)
      expect(glamsterdam.components.createMeter).toBe('state')
      expect(fusaka.components.createMeter).toBe('regular')
    })

    it('rejects unknown scenario ids without crashing the helper', async () => {
      await expect(runScenario('nope', 'glamsterdam')).rejects.toThrow(/Unknown EIP-8038 scenario/)
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
            },
          },
        },
      )
      await flushPromises()
      await flushPromises()
      expect(wrapper.text()).toContain('Run')
      expect(wrapper.text()).toContain('Glamsterdam')
      const glamsterdam = wrapper.find('[aria-pressed="true"]')
      expect(glamsterdam.exists()).toBe(true)
      expect(glamsterdam.text()).toBe('Glamsterdam')
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
            },
          },
        },
      )
      await flushPromises()
      await flushPromises()

      const fusaka = wrapper.findAll('button').find((b) => b.text() === 'Fusaka')
      expect(fusaka).toBeDefined()
      await fusaka!.trigger('click')
      expect(wrapper.find('[data-testid="hardfork-fusaka"]').attributes('aria-pressed')).toBe(
        'true',
      )

      await wrapper.find('[data-testid="example-select"]').trigger('click')
      await flushPromises()
      await wrapper.find('[data-testid="example-02-read-slot"]').trigger('click')
      await flushPromises()
      expect(wrapper.find('[data-testid="hardfork-glamsterdam"]').attributes('aria-pressed')).toBe(
        'true',
      )
    })
  })
})
