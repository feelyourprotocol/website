import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { hexToBytes } from '@ethereumjs/util'
import { flushPromises, mount } from '@vue/test-utils'

import { CANONICAL } from './canonical'
import { DEFAULT_SCENARIO_ID, exampleMeta, examples } from './examples'
import { INFO } from './info'
import MyC from './MyC.vue'
import { receiptLogsToRows } from './receiptAdapter'
import { runScenario } from './run'
import { SCENARIO_ORDER, SCENARIOS } from './scenarios'
import { RECIPIENT_ADDRESS, SENDER_ADDRESS } from './scenarios/constants'

describe('EIP-7708 transfer-log exploration', () => {
  describe('canonical', () => {
    it('defines simulate shape as planned MCP twin with fork comparison', () => {
      expect(CANONICAL.question.changeNature).toBe('new-capability')
      expect(CANONICAL.mcp.shapes).toContain('simulate')
      expect(CANONICAL.mcp.docsStatus).toBe('planned-module')
      expect(CANONICAL.mcp.comparison?.previewForkId).toBe('amsterdam')
    })
  })

  describe('info', () => {
    it('has correct metadata', () => {
      expect(INFO.id).toBe('eip-7708')
      expect(INFO.path).toContain('eip-7708')
      expect(INFO.topic).toBe('ux')
      expect(INFO.timeline).toBe('glamsterdam')
      expect(INFO.rightPanel).toBe(true)
    })
  })

  describe('examples', () => {
    it('lists scenarios in curriculum order', () => {
      expect(Object.keys(examples)).toEqual([...SCENARIO_ORDER])
      expect(DEFAULT_SCENARIO_ID).toBe('01-plain-transfer')
    })

    it('maps each example to scenario metadata', () => {
      for (const id of SCENARIO_ORDER) {
        expect(examples[id]?.values).toEqual([id])
        expect(exampleMeta[id]?.lesson.length).toBeGreaterThan(0)
      }
    })
  })

  describe('receiptAdapter', () => {
    it('returns empty rows for empty receipts', () => {
      expect(receiptLogsToRows([])).toEqual([])
    })

    it('ignores non-EIP-7708 logs without decoration', () => {
      const rows = receiptLogsToRows([
        {
          logs: [
            [
              hexToBytes('0x1111111111111111111111111111111111111111'),
              [hexToBytes('0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef')],
              hexToBytes('0x'),
            ],
          ],
        },
      ])
      expect(rows).toHaveLength(1)
      expect(rows[0]!.decoration).toBeUndefined()
    })
  })

  describe('runScenario', () => {
    it('emits one Transfer log on Amsterdam for plain transfer', async () => {
      const result = await runScenario('01-plain-transfer', 'amsterdam')
      expect(result.transferLogCount).toBe(1)
      expect(result.totalLogCount).toBeGreaterThanOrEqual(1)
      expect(result.receiptLogs.rows[0]?.decoration?.kind).toBe('eth-transfer')
      const transfer = result.receiptLogs.rows.find(
        (row) => row.decoration?.kind === 'eth-transfer',
      )
      expect(transfer).toBeDefined()
      expect(transfer!.decoration).toEqual(
        expect.objectContaining({
          kind: 'eth-transfer',
          from: SENDER_ADDRESS,
          to: RECIPIENT_ADDRESS,
          valueWei: 1n,
        }),
      )
    })

    it('has no EIP-7708 Transfer logs on Osaka for plain transfer', async () => {
      const result = await runScenario('01-plain-transfer', 'osaka')
      expect(result.transferLogCount).toBe(0)
      expect(result.receiptLogs.emptyHint).toContain('Osaka')
    })

    it('logs contract-wallet CALL transfer on Amsterdam', async () => {
      const result = await runScenario('02-contract-wallet', 'amsterdam')
      expect(result.transferLogCount).toBe(1)
    })

    it('stays silent for zero-value on Amsterdam', async () => {
      const result = await runScenario('03-zero-value', 'amsterdam')
      expect(result.transferLogCount).toBe(0)
      expect(result.receiptLogs.emptyHint).toContain('zero-value')
    })

    it('stays silent when inner CALL reverts on Amsterdam', async () => {
      const result = await runScenario('04-reverted-call', 'amsterdam')
      expect(result.transferLogCount).toBe(0)
      expect(result.receiptLogs.emptyHint).toContain('reverted')
    })

    it('matches expected transfer counts for every scenario on Amsterdam', async () => {
      for (const id of SCENARIO_ORDER) {
        const expected = SCENARIOS[id]!.expectedTransferLogsOnAmsterdam
        const result = await runScenario(id, 'amsterdam')
        expect(result.transferLogCount).toBe(expected)
      }
    })
  })

  describe('MyC.vue', () => {
    it('mounts with scenario controls and run action', async () => {
      document.body.innerHTML = '<div id="root"></div><div id="exploration-right-panel"></div>'
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
      expect(wrapper.text()).toContain('Run block')
      expect(wrapper.text()).toContain('Amsterdam')
      const amsterdam = wrapper.find('[aria-pressed="true"]')
      expect(amsterdam.exists()).toBe(true)
      expect(amsterdam.text()).toBe('Amsterdam')
    })

    it('resets hardfork to Amsterdam when the scenario changes', async () => {
      document.body.innerHTML = '<div id="root"></div><div id="exploration-right-panel"></div>'
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
      expect(wrapper.find('[aria-pressed="true"]').text()).toBe('Osaka')

      const next = wrapper.findAll('button').find((b) => b.text().includes('next'))
      await next!.trigger('click')
      expect(wrapper.find('[aria-pressed="true"]').text()).toBe('Amsterdam')
    })
  })
})
