/**
 * Video-readiness contract for the EIP-7843 exploration.
 *
 * The video pipeline (`website/video/`) drives Playwright against
 * `/eip-7843-slotnum-opcode?fyp-video=1&example=<key>` and expects a
 * stable set of `data-testid` hooks to be present. See `.cursor/skills/video-short/`.
 */
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { examples } from './examples'
import MyC from './MyC.vue'

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

describe('EIP-7843 video-readiness contract', () => {
  it('mounts with exploration-ready + example-select + stepper + slot companion', async () => {
    const wrapper = await mountWithQuery()

    expect(wrapper.find('[data-testid="exploration-ready"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="example-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bytecode-run"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bytecode-step"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bytecode-disassembly"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="bytecode-stack"]').exists()).toBe(true)

    const panel = document.getElementById('exploration-right-panel')
    expect(panel?.querySelector('[data-testid="slot-number-input"]')).not.toBeNull()
    expect(panel?.querySelector('[data-testid="hardfork-amsterdam"]')).not.toBeNull()
    expect(panel?.querySelector('[data-testid="hardfork-osaka"]')).not.toBeNull()
    expect(panel?.querySelector('[data-testid="slot-readout-push"]')?.textContent).toContain('42')
  })

  it('exposes an example-<key> item for every preset when the dropdown opens', async () => {
    const wrapper = await mountWithQuery()

    await wrapper.find('[data-testid="example-select"]').trigger('click')
    await flushPromises()

    for (const id of Object.keys(examples)) {
      expect(document.querySelector(`[data-testid="example-${id}"]`)).not.toBeNull()
    }
  })

  it('honours ?example=<key> for deep-link selection', async () => {
    const wrapper = await mountWithQuery({ example: 'timestamp-div-12' })

    const selectButton = wrapper.find('[data-testid="example-select"]')
    expect(selectButton.text()).toMatch(/TIMESTAMP|hardcoded/i)
  })
})
