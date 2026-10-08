import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { COVER_COLUMN_IMAGE_HEIGHT } from '@/explorations/layout'

import { CANONICAL } from './canonical'
import { DEFAULT_SHAPE_ID, examples, SHAPE_META } from './examples'
import { INFO } from './info'
import MyC from './MyC.vue'
import { runShape } from './run'
import {
  blobBreakdown,
  callBaseGas,
  chargeExplanation,
  DATA_BYTES,
  floorQuote,
  payloadSketch,
  perBytePrices,
  SHAPE_ORDER,
  undersizedLimitIsInvalid,
} from './schedule'

describe('EIP-7976 calldata floor exploration', () => {
  describe('canonical', () => {
    it('defines a runnable transaction twin against Fusaka', () => {
      expect(CANONICAL.question.changeNature).toBe('repricing')
      expect(CANONICAL.question.coreQuestion).toContain('64')
      expect(CANONICAL.mcp.shapes).toEqual(['transaction'])
      expect(CANONICAL.mcp.docsStatus).toBe('runnable')
      expect(CANONICAL.mcp.comparison?.baselineForkId).toBe('fusaka')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('glamsterdam')
      expect(CANONICAL.taxonomy.topic).toBe('robustness')
      expect(CANONICAL.taxonomy.timeline).toBe('glamsterdam')
      expect(CANONICAL.identity.specDate).toBe('2026-07-07')
      expect(CANONICAL.identity.status).toBe('Review')
    })
  })

  describe('info', () => {
    it('spreads the canonical question onto the page', () => {
      expect(INFO.id).toBe('eip-7976')
      expect(INFO.path).toBe('/eip-7976-calldata-floor-cost')
      expect(INFO.coreQuestion).toBe(CANONICAL.question.coreQuestion)
      expect(INFO.introText).toContain(CANONICAL.question.coreQuestion)
      expect(INFO.imageBoxHeight).toBe(COVER_COLUMN_IMAGE_HEIGHT)
      expect(INFO.mcpDocsStatus).toBe('runnable')
    })
  })

  describe('schedule', () => {
    it('prices 100 zero bytes at 10 on Fusaka and 64 on Glamsterdam', () => {
      const fusaka = floorQuote('zeros', 'fusaka')
      const amsterdam = floorQuote('zeros', 'glamsterdam')
      expect(fusaka.ordinaryCalldata).toBe(4n * BigInt(DATA_BYTES))
      expect(amsterdam.ordinaryCalldata).toBe(4n * BigInt(DATA_BYTES))
      expect(fusaka.floorOnData).toBe(10n * BigInt(DATA_BYTES))
      expect(amsterdam.floorOnData).toBe(64n * BigInt(DATA_BYTES))
      expect(amsterdam.floorCharge).toBeGreaterThan(amsterdam.intrinsic)
      expect(fusaka.floorCharge).toBeGreaterThan(fusaka.intrinsic)
    })

    it('prices 100 nonzero bytes at 40 on Fusaka and 64 on Glamsterdam', () => {
      const fusaka = floorQuote('nonzeros', 'fusaka')
      const amsterdam = floorQuote('nonzeros', 'glamsterdam')
      expect(fusaka.ordinaryCalldata).toBe(16n * BigInt(DATA_BYTES))
      expect(amsterdam.ordinaryCalldata).toBe(16n * BigInt(DATA_BYTES))
      expect(fusaka.floorOnData).toBe(40n * BigInt(DATA_BYTES))
      expect(amsterdam.floorOnData).toBe(64n * BigInt(DATA_BYTES))
    })

    it('puts access-list bytes on the floor only on Glamsterdam', () => {
      const fusaka = floorQuote('access-list', 'fusaka')
      const amsterdam = floorQuote('access-list', 'glamsterdam')
      expect(fusaka.ordinaryCalldata).toBe(0n)
      expect(amsterdam.ordinaryCalldata).toBe(0n)
      expect(fusaka.floorOnData).toBe(0n)
      expect(amsterdam.floorOnData).toBe(64n * 52n)
    })

    it('rejects a gas limit below the floor', () => {
      expect(undersizedLimitIsInvalid('zeros', 'glamsterdam')).toBe(true)
      expect(undersizedLimitIsInvalid('nonzeros', 'fusaka')).toBe(true)
      expect(undersizedLimitIsInvalid('access-list', 'glamsterdam')).toBe(true)
    })
  })

  describe('run', () => {
    it('lets the floor win for data-heavy calls and lose when the call does work', async () => {
      for (const shape of ['zeros', 'nonzeros'] as const) {
        for (const hardfork of ['glamsterdam', 'fusaka'] as const) {
          const result = await runShape(shape, hardfork)
          const quote = floorQuote(shape, hardfork)
          expect(result.success).toBe(true)
          expect(result.floorWon).toBe(true)
          expect(result.gasUsed).toBe(quote.floorCharge)
        }
      }

      for (const hardfork of ['glamsterdam', 'fusaka'] as const) {
        const result = await runShape('busy', hardfork)
        const quote = floorQuote('busy', hardfork)
        expect(result.success).toBe(true)
        expect(result.returnValue.endsWith('01')).toBe(true)
        expect(result.floorWon).toBe(false)
        expect(result.gasUsed).toBeGreaterThan(quote.floorCharge)
        const text = chargeExplanation(quote, result.gasUsed, 'work')
        const data = quote.ordinaryCalldata
        const work = result.gasUsed - callBaseGas(quote) - data
        expect(text).toBe(
          `${callBaseGas(quote).toLocaleString('en-US')} for the call + ${data.toLocaleString('en-US')} for the data + ${work.toLocaleString('en-US')} for the work`,
        )
        expect(callBaseGas(quote) + data + work).toBe(result.gasUsed)
        expect(text).not.toContain(quote.floorOnData.toLocaleString('en-US'))
      }
    })

    it('still charges access-list bytes at the floor rate on Glamsterdam', async () => {
      const amsterdam = await runShape('access-list', 'glamsterdam')
      const fusaka = await runShape('access-list', 'fusaka')
      const amsterdamQuote = floorQuote('access-list', 'glamsterdam')
      const fusakaQuote = floorQuote('access-list', 'fusaka')
      expect(amsterdam.success).toBe(true)
      expect(fusaka.success).toBe(true)
      expect(amsterdam.gasUsed).toBe(amsterdamQuote.intrinsic)
      expect(fusaka.gasUsed).toBe(fusakaQuote.intrinsic)
      expect(amsterdamQuote.floorOnData).toBe(64n * 52n)
      expect(fusakaQuote.floorOnData).toBe(0n)
      expect(amsterdam.gasUsed - 15_000n).toBe(2_900n + 2_000n + 3_328n)
      expect(fusaka.gasUsed - 21_000n).toBe(2_400n + 1_900n)
      expect(chargeExplanation(amsterdamQuote, amsterdam.gasUsed, 'floor', 'access list')).toBe(
        '15,000 for the call + 3,328 for the data + 4,900 for the access list',
      )
      expect(chargeExplanation(fusakaQuote, fusaka.gasUsed, 'floor', 'access list')).toBe(
        '21,000 for the call + 4,300 for the access list',
      )
    })

    it('prices one byte at 64 and 64 on Glamsterdam, 10 and 40 on Fusaka', () => {
      expect(perBytePrices('glamsterdam')).toEqual({
        zeroOrdinary: 4n,
        nonzeroOrdinary: 16n,
        zeroFloor: 64n,
        nonzeroFloor: 64n,
      })
      expect(perBytePrices('fusaka').zeroFloor).toBe(10n)
      expect(perBytePrices('fusaka').nonzeroFloor).toBe(40n)
      expect(payloadSketch('zeros')).toEqual({ kind: 'zero', count: 100 })
      expect(payloadSketch('access-list')).toEqual({ kind: 'listed', count: 52 })
      expect(blobBreakdown('zeros', 'glamsterdam')).toEqual({
        count: 100,
        workEach: 4n,
        floorEach: 64n,
        workTotal: 400n,
        floorTotal: 6_400n,
      })
      expect(blobBreakdown('zeros', 'fusaka').floorEach).toBe(10n)
      expect(blobBreakdown('access-list', 'glamsterdam').floorEach).toBe(64n)
      expect(blobBreakdown('access-list', 'glamsterdam').workEach).toBe(0n)
      const zeros = floorQuote('zeros', 'glamsterdam')
      expect(callBaseGas(zeros)).toBe(15_000n)
      expect(chargeExplanation(zeros, 21_400n)).toBe('15,000 for the call + 6,400 for the data')
      expect(callBaseGas(floorQuote('zeros', 'fusaka'))).toBe(21_000n)
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
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="charged"]').text()).not.toBe('—')
      })
      return wrapper
    }

    it('opens on zero bytes with the floor already charged', async () => {
      const wrapper = await mountWidget()
      expect(wrapper.text()).not.toContain('Run tx')
      expect(wrapper.text()).toContain(SHAPE_META[DEFAULT_SHAPE_ID].title)
      expect(wrapper.find('[data-testid="floor-compare"]').attributes('data-has-run')).toBe('true')
      expect(wrapper.find('[data-testid="ordinary-calldata"]').text()).toBe('400')
      expect(wrapper.find('[data-testid="floor-data"]').text()).toBe('6,400')
      expect(wrapper.find('[data-testid="charged"]').text()).toBe('21,400')
      expect(wrapper.find('[data-testid="charge-hint"]').text()).toBe(
        '15,000 for the call + 6,400 for the data',
      )
      expect(wrapper.find('[data-testid="floor-verdict"]').text()).toBe('The floor set the price.')
      expect(wrapper.find('[data-testid="zero-glamsterdam"]').text()).toBe('64')
      expect(wrapper.find('[data-testid="nonzero-glamsterdam"]').text()).toBe('64')
      expect(wrapper.find('[data-testid="zero-work"]').text()).toBe('4')
      expect(wrapper.find('[data-testid="nonzero-work"]').text()).toBe('16')
      expect(wrapper.text()).toContain('100 × 64')
      expect(wrapper.text()).toContain('100 × 4')
      expect(wrapper.text()).toContain('Almost no work')
      expect(wrapper.text()).not.toContain('Enough work')
      expect(wrapper.text()).not.toContain('Ordinary')
      expect(wrapper.find('[data-testid="byte-mosaic"]').attributes('data-kind')).toBe('zero')
      expect(wrapper.find('[data-testid="byte-mosaic"]').text()).toContain('100 zero bytes')
      expect(wrapper.find('[data-testid="byte-mosaic"]').findAll('[data-byte]')).toHaveLength(100)
      expect(examples[DEFAULT_SHAPE_ID]).toBeDefined()
      expect(SHAPE_ORDER).toHaveLength(4)
    })

    it('shows the Fusaka floor of 10 per zero byte', async () => {
      const wrapper = await mountWidget()
      const fusaka = wrapper.find('[data-testid="hardfork-fusaka"]')
      expect(fusaka.exists()).toBe(true)
      await fusaka.trigger('click')
      await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="charged"]').text()).toBe('22,000')
      })
      expect(wrapper.find('[data-testid="floor-data"]').text()).toBe('1,000')
      expect(wrapper.find('[data-testid="ordinary-calldata"]').text()).toBe('400')
      expect(wrapper.text()).toContain('100 × 10')
      expect(wrapper.find('[data-testid="zero-fusaka"]').text()).toBe('10')
      expect(wrapper.find('[data-testid="zero-fusaka"]').attributes('data-active')).toBe('true')
      expect(wrapper.find('[data-testid="nonzero-fusaka"]').text()).toBe('40')
    })
  })
})
