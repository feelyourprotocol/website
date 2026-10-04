import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'

import { CANONICAL } from './canonical'
import { EXPECTED } from './constants'
import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO } from './info'
import MyC from './MyC.vue'
import { runScenario } from './run'
import { getScenario, SCENARIO_ORDER } from './scenarios'

describe('EIP-7778 block gas accounting exploration', () => {
  describe('canonical', () => {
    it('defines a block + transaction twin with Fusaka vs Glamsterdam comparison', () => {
      expect(CANONICAL.question.changeNature).toBe('new-exec-model')
      expect(CANONICAL.question.coreQuestion).toContain('block still count')
      expect(CANONICAL.mcp.shapes).toEqual(['block', 'transaction'])
      expect(CANONICAL.mcp.docsStatus).toBe('runnable')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('glamsterdam')
      expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('fusaka')
      expect(CANONICAL.taxonomy.topic).toBe('robustness')
      expect(CANONICAL.identity.status).toBe('Draft')
      expect(CANONICAL.identity.specDate).toBe('2026-01-28')
      expect(CANONICAL.identity.specUrl).toContain('3929b1aab57b493417eccec7457d1485eccb9768')
    })
  })

  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7778')
      expect(INFO.path).toBe('/eip-7778-block-gas-accounting')
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
      expect(DEFAULT_SCENARIO_ID).toBe('01-clear-slot')
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
      expect(() => getScenario('not-a-scenario')).toThrow(/Unknown EIP-7778 scenario/)
      expect(() => getScenario('')).toThrow(/Unknown EIP-7778 scenario/)
    })
  })

  describe('runScenario', () => {
    it('splits pay and block on a Glamsterdam clear, and matches them on Fusaka', async () => {
      const amsterdam = await runScenario('01-clear-slot', 'glamsterdam')
      expect(amsterdam.txSuccessful).toBe(true)
      expect(amsterdam.pay).toBe(EXPECTED.clear.glamsterdam.pay)
      expect(amsterdam.block).toBe(EXPECTED.clear.glamsterdam.block)
      expect(amsterdam.pay).toBeLessThan(amsterdam.block)

      const fusaka = await runScenario('01-clear-slot', 'fusaka')
      expect(fusaka.txSuccessful).toBe(true)
      expect(fusaka.pay).toBe(EXPECTED.clear.fusaka.pay)
      expect(fusaka.block).toBe(fusaka.pay)
    })

    it('matches pay and block on a rewrite, on both forks', async () => {
      for (const hardfork of ['glamsterdam', 'fusaka'] as const) {
        const result = await runScenario('02-rewrite-slot', hardfork)
        expect(result.txSuccessful).toBe(true)
        expect(result.pay).toBe(EXPECTED.rewrite[hardfork].pay)
        expect(result.block).toBe(result.pay)
      }
    })

    it('keeps a Glamsterdam restore refund off the block, and applies it on Fusaka', async () => {
      const amsterdam = await runScenario('03-put-it-back', 'glamsterdam')
      expect(amsterdam.txSuccessful).toBe(true)
      expect(amsterdam.pay).toBe(EXPECTED.reset.glamsterdam.pay)
      expect(amsterdam.block).toBe(EXPECTED.reset.glamsterdam.block)
      expect(amsterdam.pay).toBeLessThan(amsterdam.block)
      expect(amsterdam.block).toBeGreaterThan(EXPECTED.rewrite.glamsterdam.block)

      const fusaka = await runScenario('03-put-it-back', 'fusaka')
      expect(fusaka.pay).toBe(EXPECTED.reset.fusaka.pay)
      expect(fusaka.block).toBe(fusaka.pay)
      expect(fusaka.pay).toBeLessThan(EXPECTED.rewrite.fusaka.pay)
    })

    it('rejects an unknown scenario before touching the VM', async () => {
      await expect(runScenario('nope', 'glamsterdam')).rejects.toThrow(/Unknown EIP-7778 scenario/)
      await expect(runScenario('', 'fusaka')).rejects.toThrow(/\(empty\)/)
    })
  })

  describe('MyC', () => {
    it('mounts the play path and an idle ledger', async () => {
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
          global: { plugins: [router] },
        },
      )
      await flushPromises()
      await flushPromises()

      expect(wrapper.find('[data-testid="example-select"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="run-tx"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="pay-ledger"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="pay-value"]').text()).toBe('—')
      expect(wrapper.find('[data-testid="block-value"]').text()).toBe('—')
      expect(wrapper.text()).toContain('Clear a slot')
    })
  })
})
