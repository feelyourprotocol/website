/**
 * Video-readiness contract for the EIP-7976 exploration.
 *
 * The video pipeline drives Playwright against
 * `/eip-7976-calldata-floor-cost?fyp-video=1&example=<key>`.
 */
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import MyC from './MyC.vue'
import { SHAPE_ORDER } from './schedule'

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

describe('EIP-7976 video-readiness contract', () => {
  it('mounts the hooks the playbook clicks', async () => {
    const wrapper = await mountWithQuery({ 'fyp-video': '1', example: 'zeros' })

    expect(wrapper.find('[data-testid="exploration-ready"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="example-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="scenario-step-next"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-toggle"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-glamsterdam"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-fusaka"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="byte-price-stage"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="byte-mosaic"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="run-tx"]').exists()).toBe(false)
    expect(wrapper.find('[data-testid="floor-compare"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="ordinary-calldata"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="floor-data"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="charged"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="floor-verdict"]').exists()).toBe(true)
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

  it('honours ?example=busy', async () => {
    const wrapper = await mountWithQuery({ example: 'busy' })
    expect(wrapper.find('[data-testid="example-select"]').text()).toContain(
      'A call that does real work',
    )
    wrapper.unmount()
  })
})
