/**
 * Stable selectors used by the EIP-7954 video playbook.
 */
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'

import { DEFAULT_SCENARIO_ID } from './examples'
import MyC from './MyC.vue'
import { SCENARIO_ORDER } from './scenarios'

async function mountWithExample(example: string) {
  document.body.innerHTML = '<div id="root"></div><div id="exploration-right-panel"></div>'
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  await router.push({ path: '/', query: { 'fyp-video': '1', example } })

  const wrapper = mount(
    {
      components: { MyC },
      template: '<Suspense><MyC /></Suspense>',
    },
    {
      attachTo: document.getElementById('root')!,
      global: {
        plugins: [router],
        stubs: { PoweredByC: true },
      },
    },
  )
  await flushPromises()
  await flushPromises()
  return wrapper
}

describe('EIP-7954 video-readiness contract', () => {
  it('exposes the widget and result hooks used by the playbook', async () => {
    const wrapper = await mountWithExample(DEFAULT_SCENARIO_ID)

    expect(wrapper.find('[data-testid="exploration-ready"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="example-select"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="run-deployment"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="deployment-results"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="outcome-fusaka"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="outcome-glamsterdam"]').exists()).toBe(true)
  })

  it('exposes every scenario through the example picker', async () => {
    const wrapper = await mountWithExample(DEFAULT_SCENARIO_ID)
    await wrapper.find('[data-testid="example-select"]').trigger('click')
    await flushPromises()

    for (const id of SCENARIO_ORDER) {
      expect(document.querySelector(`[data-testid="example-${id}"]`)).not.toBeNull()
    }
  })

  it('honours a non-default scenario deep link', async () => {
    const wrapper = await mountWithExample('03-runtime-too-large')

    expect(wrapper.find('[data-testid="example-select"]').text()).toContain('64 KiB + 1')
  })
})
