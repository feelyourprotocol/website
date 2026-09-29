/**
 * Video-readiness contract for the EIP-2780 exploration.
 *
 * The video pipeline drives Playwright against
 * `/eip-2780-intrinsic-transaction-gas?fyp-video=1&example=<key>`.
 */
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import MyC from './MyC.vue'
import { SHAPE_ORDER } from './pieces'

async function mountWithQuery(query: Record<string, string> = {}) {
  document.body.innerHTML = '<div id="root"></div>'
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  await router.push({ path: '/', query })

  const wrapper = mount(
    {
      components: { MyC },
      template: '<Suspense><MyC /></Suspense>',
    },
    {
      attachTo: document.getElementById('root')!,
      global: {
        plugins: [router],
      },
    },
  )
  await flushPromises()
  await flushPromises()
  return wrapper
}

describe('EIP-2780 video-readiness contract', () => {
  it('mounts the hooks the playbook clicks', async () => {
    const wrapper = await mountWithQuery({ 'fyp-video': '1', example: 'send-eth' })

    expect(wrapper.find('[data-testid="exploration-ready"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="example-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-glamsterdam"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-fusaka"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="run-tx"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="piece-ledger"]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('exposes an example item for every shape when the dropdown opens', async () => {
    const wrapper = await mountWithQuery()
    await wrapper.find('[data-testid="example-select"]').trigger('click')
    await flushPromises()

    for (const id of SHAPE_ORDER) {
      expect(document.querySelector(`[data-testid="example-${id}"]`)).not.toBeNull()
    }
    wrapper.unmount()
  })

  it('honours ?example=self', async () => {
    const wrapper = await mountWithQuery({ example: 'self' })
    expect(wrapper.find('[data-testid="example-select"]').text()).toContain('Send ETH to yourself')
    wrapper.unmount()
  })
})
