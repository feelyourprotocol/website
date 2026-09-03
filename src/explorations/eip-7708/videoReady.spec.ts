/**
 * Video-readiness contract for the EIP-7708 exploration.
 *
 * The video pipeline (`website/video/`) drives Playwright against
 * `/eip-7708-eth-transfer-logs?fyp-video=1&example=<key>` and expects a
 * stable set of `data-testid` hooks to be present. This spec locks that
 * contract so it does not silently regress. See `.cursor/skills/video-short/`.
 */
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import MyC from './MyC.vue'
import { SCENARIO_ORDER } from './scenarios'

async function mountWithQuery(query: Record<string, string> = {}) {
  document.body.innerHTML = '<div id="root"></div><div id="exploration-right-panel"></div>'
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

describe('EIP-7708 video-readiness contract', () => {
  it('mounts with exploration-ready + example-select + hardfork toggle + run-block', async () => {
    const wrapper = await mountWithQuery()

    expect(wrapper.find('[data-testid="exploration-ready"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="example-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-amsterdam"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="hardfork-osaka"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="run-block"]').exists()).toBe(true)
  })

  it('mounts the receipt panel via Teleport (idle state, before run)', async () => {
    const wrapper = await mountWithQuery()

    const panel = document.querySelector('[data-testid="receipts-panel"]')
    expect(panel).not.toBeNull()
    expect(panel?.textContent).toContain('Waiting for execution')
    wrapper.unmount()
  })

  it('exposes an example-<key> item for every scenario when the dropdown opens', async () => {
    const wrapper = await mountWithQuery()

    // Headless UI Listbox options are only in the DOM once the trigger opens.
    // Playwright drives the same interaction; we mirror it here so the contract
    // is honest.
    await wrapper.find('[data-testid="example-select"]').trigger('click')
    await flushPromises()

    for (const id of SCENARIO_ORDER) {
      expect(document.querySelector(`[data-testid="example-${id}"]`)).not.toBeNull()
    }
  })

  it('honours ?example=<key> for deep-link selection', async () => {
    const wrapper = await mountWithQuery({ example: '03-zero-value' })

    const selectButton = wrapper.find('[data-testid="example-select"]')
    expect(selectButton.text()).toContain('Zero-value')
  })
})
