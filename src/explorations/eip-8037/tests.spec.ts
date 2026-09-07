import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'

import { CANONICAL } from './canonical'
import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO } from './info'
import MyC from './MyC.vue'
import { displayGasBars, previewGasBars, runScenario } from './run'
import { getScenario, SCENARIO_ORDER } from './scenarios'
import {
  CLASSIC_GAS_LIMIT,
  FIRST_TOUCH_STATE_GAS,
  NEW_STORAGE_SLOT_STATE_GAS,
} from './scenarios/constants'

describe('EIP-8037 state-creation gas exploration', () => {
  describe('canonical', () => {
    it('defines simulate twin with Osaka vs Amsterdam comparison', () => {
      expect(CANONICAL.question.changeNature).toBe('new-exec-model')
      expect(CANONICAL.mcp.shapes).toContain('simulate')
      expect(CANONICAL.mcp.docsStatus).toBe('runnable')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('amsterdam')
      expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('osaka')
      expect(CANONICAL.taxonomy.topic).toBe('robustness')
    })
  })

  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-8037')
      expect(INFO.path).toContain('eip-8037')
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
      expect(DEFAULT_SCENARIO_ID).toBe('01-first-touch')
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
      expect(() => getScenario('not-a-scenario')).toThrow(/Unknown EIP-8037 scenario/)
      expect(() => getScenario('')).toThrow(/Unknown EIP-8037 scenario/)
    })
  })

  describe('previewGasBars', () => {
    it('uses classic execution and Amsterdam state expectations per scenario', () => {
      for (const scenarioId of SCENARIO_ORDER) {
        const scenario = getScenario(scenarioId)
        const amsterdam = previewGasBars(scenario, 'amsterdam')
        expect(amsterdam.regular).toBe(CLASSIC_GAS_LIMIT)
        expect(amsterdam.state).toBe(scenario.expectedAmsterdamStateGas)

        const osaka = previewGasBars(scenario, 'osaka')
        expect(osaka.regular).toBe(CLASSIC_GAS_LIMIT)
        expect(osaka.state).toBe(0n)
      }
    })
  })

  describe('displayGasBars', () => {
    const matrix: Array<{
      scenarioId: (typeof SCENARIO_ORDER)[number]
      hardfork: 'amsterdam' | 'osaka'
      gasLimitMode: 'classic' | 'recommended'
    }> = [
      { scenarioId: '01-first-touch', hardfork: 'amsterdam', gasLimitMode: 'recommended' },
      { scenarioId: '01-first-touch', hardfork: 'amsterdam', gasLimitMode: 'classic' },
      { scenarioId: '01-first-touch', hardfork: 'osaka', gasLimitMode: 'classic' },
      { scenarioId: '02-funded-recipient', hardfork: 'amsterdam', gasLimitMode: 'classic' },
      { scenarioId: '02-funded-recipient', hardfork: 'osaka', gasLimitMode: 'classic' },
      { scenarioId: '03-new-storage', hardfork: 'amsterdam', gasLimitMode: 'recommended' },
      { scenarioId: '03-new-storage', hardfork: 'osaka', gasLimitMode: 'recommended' },
    ]

    it.each(matrix)(
      'returns non-zero execution gas for $scenarioId on $hardfork ($gasLimitMode)',
      async ({ scenarioId, hardfork, gasLimitMode }) => {
        const result = await runScenario(scenarioId, hardfork, gasLimitMode)
        const bars = displayGasBars(result)
        expect(bars.regular).toBeGreaterThan(0n)
      },
    )

    const successfulMatrix = matrix.filter(
      ({ scenarioId, hardfork, gasLimitMode }) =>
        !(
          scenarioId === '01-first-touch' &&
          hardfork === 'amsterdam' &&
          gasLimitMode === 'classic'
        ),
    )

    it.each(successfulMatrix)(
      'keeps measured bar totals within spent gas on successful $scenarioId / $hardfork ($gasLimitMode)',
      async ({ scenarioId, hardfork, gasLimitMode }) => {
        const result = await runScenario(scenarioId, hardfork, gasLimitMode)
        expect(result.txSuccessful).toBe(true)
        const bars = displayGasBars(result)
        expect(bars.regular + bars.state).toBeLessThanOrEqual(result.totalGasSpent)
      },
    )
  })

  describe('runScenario', () => {
    it('charges first-touch state gas on Amsterdam with recommended gasLimit', async () => {
      const result = await runScenario('01-first-touch', 'amsterdam', 'recommended')
      expect(result.txSuccessful).toBe(true)
      expect(result.estimate.estimatedStateGas).toBe(FIRST_TOUCH_STATE_GAS)
      expect(result.txStateGas).toBe(FIRST_TOUCH_STATE_GAS)
      expect(result.recommendedGasLimit).toBeGreaterThan(CLASSIC_GAS_LIMIT)
      expect(result.classicLimitWouldCover).toBe(false)
      const bars = displayGasBars(result)
      expect(bars.state).toBe(FIRST_TOUCH_STATE_GAS)
    })

    it('does not charge state gas on Osaka for first-touch', async () => {
      const result = await runScenario('01-first-touch', 'osaka', 'classic')
      expect(result.txSuccessful).toBe(true)
      expect(result.estimate.estimatedStateGas).toBe(0n)
      expect(result.txStateGas).toBe(0n)
      expect(result.classicLimitWouldCover).toBe(true)
      expect(displayGasBars(result).regular).toBe(CLASSIC_GAS_LIMIT)
      expect(displayGasBars(result).state).toBe(0n)
    })

    it('fails first-touch on Amsterdam at gasLimit 21000', async () => {
      const result = await runScenario('01-first-touch', 'amsterdam', 'classic')
      expect(result.txSuccessful).toBe(false)
      expect(result.gasLimit).toBe(CLASSIC_GAS_LIMIT)
      expect(result.exceptionError?.toLowerCase()).toMatch(/out of gas|intrinsic|gas/)
      const bars = displayGasBars(result)
      expect(bars.state).toBe(FIRST_TOUCH_STATE_GAS)
    })

    it('collapses state gas for a funded recipient on Amsterdam', async () => {
      const result = await runScenario('02-funded-recipient', 'amsterdam', 'classic')
      expect(result.txSuccessful).toBe(true)
      expect(result.estimate.estimatedStateGas).toBe(0n)
      expect(result.txStateGas).toBe(0n)
    })

    it('charges new-storage state gas on Amsterdam SSTORE', async () => {
      const result = await runScenario('03-new-storage', 'amsterdam', 'recommended')
      expect(result.txSuccessful).toBe(true)
      expect(result.estimate.estimatedStateGas).toBe(0n)
      expect(result.txStateGas).toBe(NEW_STORAGE_SLOT_STATE_GAS)
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
      expect(wrapper.text()).toContain('Run tx')
      expect(wrapper.text()).toContain('Amsterdam')
      expect(wrapper.text()).toContain('Recommended')
      const amsterdam = wrapper.find('[aria-pressed="true"]')
      expect(amsterdam.exists()).toBe(true)
      expect(amsterdam.text()).toBe('Amsterdam')
      expect(wrapper.find('[data-testid="gas-bars"]').attributes('data-has-run')).toBe('false')
      expect(wrapper.text()).toContain('Run tx to fill execution and state bars')
      const gasBars = wrapper.find('[data-testid="gas-bars"]')
      expect(gasBars.text()).toContain('—')
      expect(gasBars.text()).not.toMatch(/Execution[\s\S]*183,600/)
    })

    it('resets hardfork and gas limit when the scenario changes', async () => {
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

      const classic = wrapper.find('[data-testid="gas-limit-classic"]')
      await classic.trigger('click')
      expect(classic.attributes('aria-pressed')).toBe('true')

      const next = wrapper.findAll('button').find((b) => b.text().includes('next'))
      await next!.trigger('click')
      expect(wrapper.find('[data-testid="hardfork-amsterdam"]').attributes('aria-pressed')).toBe(
        'true',
      )
      expect(wrapper.find('[data-testid="gas-limit-recommended"]').attributes('aria-pressed')).toBe(
        'true',
      )
    })
  })
})
