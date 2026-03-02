import { describe, expect,it } from 'vitest'
import { createMemoryHistory,createRouter } from 'vue-router'
import { mount, RouterLinkStub } from '@vue/test-utils'

import App from '@/App.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'

const DummyView = { template: '<div>dummy</div>' }

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: DummyView }],
})

async function mountApp() {
  router.push('/')
  await router.isReady()
  return mount(App, {
    global: {
      plugins: [router],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

describe('App layout', () => {
  describe('Header', () => {
    it('renders site title', async () => {
      const wrapper = await mountApp()
      expect(wrapper.find('header').text()).toContain('Feel Your Protocol')
    })

    it('renders subtitle', async () => {
      const wrapper = await mountApp()
      expect(wrapper.find('header').text()).toContain(
        'Interactive Ethereum Protocol Explorations',
      )
    })

    it('exploration dropdown lists all explorations', async () => {
      const wrapper = await mountApp()
      const options = wrapper.findAll('#exploration-navi option')
      const explorationCount = Object.keys(EXPLORATIONS).length
      expect(options).toHaveLength(explorationCount + 1) // +1 for disabled placeholder
      for (const id of Object.keys(EXPLORATIONS)) {
        expect(wrapper.find('#exploration-navi').text()).toContain(id.toUpperCase())
      }
    })
  })

  describe('Footer', () => {
    it('has Imprint link', async () => {
      const wrapper = await mountApp()
      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.some((l) => l.props('to') === '/imprint')).toBe(true)
    })

    it('has GitHub link', async () => {
      const wrapper = await mountApp()
      const ghLink = wrapper.find(
        'footer a[href="https://github.com/feelyourprotocol/website"]',
      )
      expect(ghLink.exists()).toBe(true)
    })
  })
})
