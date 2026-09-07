/**
 * Video-readiness contract for the EIP-8037 exploration.
 *
 * The video pipeline (`website/video/`) drives Playwright against
 * `/eip-8037-state-creation-gas?fyp-video=1&example=<key>` and expects a
 * stable set of `data-testid` hooks to be present. This spec locks that
 * contract so it does not silently regress. See `.cursor/skills/video-short/`.
 */
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import MyC from './MyC.vue'
import { SCENARIO_ORDER } from './scenarios'

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
        stubs: {
          PoweredByC: true,
        },
      },
    },
  )
  await flushPromises()
  await flushPromises()
  return wrapper
}

describe('EIP-8037 video-readiness contract', () => {
  it('mounts with exploration-ready + example-select + hardfork + gas-limit + run-tx', async () => {
    const wrapper = await mountWithQuery()

    expect(wrapper.find('[data-testid="exploration-ready"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="example-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-amsterdam"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-osaka"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gas-limit-classic"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="gas-limit-recommended"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="run-tx"]').exists()).toBe(true)
  })

  it('exposes an example-<key> item for every scenario when the dropdown opens', async () => {
    const wrapper = await mountWithQuery()

    await wrapper.find('[data-testid="example-select"]').trigger('click')
    await flushPromises()

    for (const id of SCENARIO_ORDER) {
      expect(document.querySelector(`[data-testid="example-${id}"]`)).not.toBeNull()
    }
  })

  it('honours ?example=<key> for deep-link selection', async () => {
    const wrapper = await mountWithQuery({ example: '02-funded-recipient' })

    const selectButton = wrapper.find('[data-testid="example-select"]')
    expect(selectButton.text()).toContain('Funded recipient')
  })
})
