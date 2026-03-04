import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount, RouterLinkStub } from '@vue/test-utils'

import App from '@/App.vue'
import { EXPLORATIONS } from '@/explorations/REGISTRY'

const DummyView = { template: '<div>dummy</div>' }

function makeRouter() {
  const explorationRoutes = Object.entries(EXPLORATIONS).map(([id, e]) => ({
    path: e.path,
    name: id,
    component: DummyView,
  }))

  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', name: 'home', component: DummyView }, ...explorationRoutes],
  })
}

async function mountApp(router: ReturnType<typeof makeRouter>) {
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
      const wrapper = await mountApp(makeRouter())
      expect(wrapper.find('header').text()).toContain('Feel Your Protocol')
    })

    it('renders subtitle', async () => {
      const wrapper = await mountApp(makeRouter())
      expect(wrapper.find('header').text()).toContain('Interactive Ethereum Protocol Explorations')
    })

    it('exploration dropdown button is rendered', async () => {
      const wrapper = await mountApp(makeRouter())
      const button = wrapper.find('#exploration-navi')
      expect(button.exists()).toBe(true)
      expect(button.text()).toContain('All Explorations')
    })
  })

  describe('Navigation', () => {
    it('navigates to exploration when selected via dropdown', async () => {
      const router = makeRouter()
      const wrapper = await mountApp(router)

      const [firstId, firstExploration] = Object.entries(EXPLORATIONS)[0]

      // Open the listbox
      await wrapper.find('#exploration-navi').trigger('click')
      await flushPromises()

      // Find and click the first exploration option
      const options = wrapper.findAll('li')
      const target = options.find((li) => li.text() === firstId.toUpperCase())
      expect(target).toBeDefined()
      await target!.trigger('click')
      await flushPromises()

      expect(router.currentRoute.value.path).toBe(firstExploration.path)
    })

    it('syncs dropdown label when navigating via router', async () => {
      const router = makeRouter()
      const wrapper = await mountApp(router)

      const [firstId, firstExploration] = Object.entries(EXPLORATIONS)[0]

      await router.push(firstExploration.path)
      await flushPromises()

      const button = wrapper.find('#exploration-navi')
      expect(button.text()).toContain(firstId.toUpperCase())
    })
  })

  describe('Footer', () => {
    it('has Imprint link', async () => {
      const wrapper = await mountApp(makeRouter())
      const links = wrapper.findAllComponents(RouterLinkStub)
      expect(links.some((l) => l.props('to') === '/imprint')).toBe(true)
    })

    it('has GitHub link', async () => {
      const wrapper = await mountApp(makeRouter())
      const ghLink = wrapper.find('footer a[href="https://github.com/feelyourprotocol/website"]')
      expect(ghLink.exists()).toBe(true)
    })
  })
})
