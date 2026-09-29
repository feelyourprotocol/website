import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'

import { CANONICAL } from './canonical'
import { DEFAULT_SHAPE_ID, examples, SHAPE_META } from './examples'
import { INFO } from './info'
import MyC from './MyC.vue'
import {
  FLAT_INTRINSIC_GAS,
  intrinsicPieces,
  RECIPIENT_GAS,
  TX_BASE_GAS,
  VALUE_GAS,
} from './pieces'
import { runShape } from './run'

describe('EIP-2780 intrinsic transaction gas exploration', () => {
  describe('canonical', () => {
    it('defines a runnable transaction twin against Fusaka', () => {
      expect(CANONICAL.question.changeNature).toBe('repricing')
      expect(CANONICAL.question.coreQuestion).toContain('12,000')
      expect(CANONICAL.mcp.shapes).toEqual(['transaction'])
      expect(CANONICAL.mcp.docsStatus).toBe('runnable')
      expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('fusaka')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('glamsterdam')
      expect(CANONICAL.taxonomy.topic).toBe('robustness')
      expect(CANONICAL.taxonomy.timeline).toBe('glamsterdam')
      expect(CANONICAL.identity.specDate).toBe('2026-08-04')
      expect(CANONICAL.identity.status).toBe('Review')
    })
  })

  describe('info', () => {
    it('spreads the canonical question onto the page', () => {
      expect(INFO.id).toBe('eip-2780')
      expect(INFO.path).toBe('/eip-2780-intrinsic-transaction-gas')
      expect(INFO.coreQuestion).toBe(CANONICAL.question.coreQuestion)
      expect(INFO.introText).toContain(CANONICAL.question.coreQuestion)
      expect(INFO.imageBoxHeight).toBe(COVER_COLUMN_IMAGE_HEIGHT)
      expect(INFO.mcpDocsStatus).toBe('runnable')
    })
  })

  describe('schedule', () => {
    it('keeps a normal send at 21,000 as three pieces', () => {
      const pieces = intrinsicPieces('send-eth', 'glamsterdam')
      expect(pieces.base).toBe(TX_BASE_GAS)
      expect(pieces.recipient).toBe(RECIPIENT_GAS)
      expect(pieces.value).toBe(VALUE_GAS)
      expect(pieces.total).toBe(21_000n)
    })

    it('drops recipient and value on a self-send', () => {
      expect(intrinsicPieces('self', 'glamsterdam').total).toBe(12_000n)
      expect(intrinsicPieces('self', 'glamsterdam').recipient).toBeNull()
      expect(intrinsicPieces('self', 'glamsterdam').value).toBeNull()
    })

    it('drops only the value charge on a zero-value call', () => {
      expect(intrinsicPieces('zero-value', 'glamsterdam').total).toBe(15_000n)
      expect(intrinsicPieces('zero-value', 'glamsterdam').value).toBeNull()
    })

    it('stays a flat 21,000 on Fusaka for every shape', () => {
      for (const shape of ['send-eth', 'self', 'zero-value'] as const) {
        const pieces = intrinsicPieces(shape, 'fusaka')
        expect(pieces.split).toBe(false)
        expect(pieces.total).toBe(FLAT_INTRINSIC_GAS)
        expect(pieces.base).toBeNull()
      }
    })
  })

  describe('run', () => {
    it('charges the schedule on Glamsterdam and a flat 21,000 on Fusaka', async () => {
      for (const shape of ['send-eth', 'self', 'zero-value'] as const) {
        const amsterdam = await runShape(shape, 'glamsterdam')
        const fusaka = await runShape(shape, 'fusaka')
        expect(amsterdam.success).toBe(true)
        expect(amsterdam.gasUsed).toBe(intrinsicPieces(shape, 'glamsterdam').total)
        expect(fusaka.success).toBe(true)
        expect(fusaka.gasUsed).toBe(21_000n)
      }
    })

    it('rejects an empty or unknown shape instead of running', async () => {
      await expect(runShape('', 'glamsterdam')).rejects.toThrow(/empty/)
      await expect(runShape('not-a-shape', 'glamsterdam')).rejects.toThrow(/Unknown transaction/)
    })
  })

  describe('MyC.vue', () => {
    async function mountWidget() {
      document.body.innerHTML = '<div id="root"></div>'
      const router = createRouter({
        history: createMemoryHistory(),
        routes: [{ path: '/', component: { template: '<div />' } }],
      })
      await router.push('/')
      const wrapper = mount(
        { components: { MyC }, template: '<Suspense><MyC /></Suspense>' },
        {
          attachTo: document.getElementById('root')!,
          global: {
            plugins: [router],
            stubs: { ExplorationC: { template: '<div><slot name="content" /></div>' } },
          },
        },
      )
      await flushPromises()
      await flushPromises()
      return wrapper
    }

    it('opens on a normal send with the three pieces and an empty measured total', async () => {
      const wrapper = await mountWidget()
      expect(wrapper.text()).toContain('Run tx')
      expect(wrapper.text()).toContain(SHAPE_META[DEFAULT_SHAPE_ID].title)
      expect(wrapper.find('[data-testid="piece-ledger"]').attributes('data-has-run')).toBe('false')
      expect(wrapper.find('[data-testid="piece-base"]').text()).toBe('12,000')
      expect(wrapper.find('[data-testid="piece-recipient"]').text()).toBe('3,000')
      expect(wrapper.find('[data-testid="piece-value"]').text()).toBe('6,000')
      expect(wrapper.find('[data-testid="piece-total"]').text()).toBe('21,000')
      expect(wrapper.find('[data-testid="piece-measured"]').text()).toBe('—')
      expect(examples[DEFAULT_SHAPE_ID]).toBeDefined()
    })

    it('shows a flat 21,000 when Fusaka is selected', async () => {
      const wrapper = await mountWidget()
      const fusaka = wrapper.findAll('button').find((button) => button.text() === 'Fusaka')
      expect(fusaka).toBeDefined()
      await fusaka!.trigger('click')
      expect(wrapper.find('[data-testid="piece-ledger"]').attributes('data-split')).toBe('false')
      expect(wrapper.find('[data-testid="piece-total"]').text()).toBe('21,000')
      expect(wrapper.find('[data-testid="piece-base"]').text()).toContain('flat 21,000')
    })
  })
})
