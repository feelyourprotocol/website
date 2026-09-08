import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount, RouterLinkStub } from '@vue/test-utils'

import { EXPLORATIONS, getTopicExplorationIds } from '@/explorations/REGISTRY'
import { Tag } from '@/explorations/TAGS'
import { TOPICS } from '@/explorations/TOPICS'

import TopicView from '../TopicView.vue'

const topicId = Object.keys(TOPICS)[0]
const topic = TOPICS[topicId]
const explorationIds = getTopicExplorationIds(topicId)

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: topic.path, name: topicId, component: TopicView },
    { path: '/all', name: 'all', component: TopicView },
  ],
})

async function mountTopicView(routeName = topicId, query: Record<string, string> = {}) {
  await router.push({ name: routeName, query })
  await router.isReady()
  return mount(TopicView, {
    global: {
      plugins: [router],
      stubs: { RouterLink: RouterLinkStub },
    },
  })
}

function catalogCards(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('.exploration-preview-c')
}

describe('TopicView', () => {
  it('renders catalog preview cards for the topic', async () => {
    const wrapper = await mountTopicView()
    expect(catalogCards(wrapper)).toHaveLength(explorationIds.length)
  })

  it('catalog cards display titles and core questions', async () => {
    const wrapper = await mountTopicView()
    for (const id of explorationIds) {
      expect(wrapper.text()).toContain(EXPLORATIONS[id].title)
      expect(wrapper.text()).toContain(EXPLORATIONS[id].coreQuestion)
    }
    expect(wrapper.text()).not.toContain(EXPLORATIONS[explorationIds[0]!].introText)
  })

  it('catalog cards link to correct paths', async () => {
    const wrapper = await mountTopicView()
    const links = wrapper.findAllComponents(RouterLinkStub)
    for (const id of explorationIds) {
      expect(links.some((l) => l.props('to') === EXPLORATIONS[id].path)).toBe(true)
    }
  })

  it('shows topic intro text in the page header', async () => {
    const wrapper = await mountTopicView()
    expect(wrapper.text()).toContain(topic.title)
    expect(topic.introText === undefined || wrapper.text().includes(topic.introText)).toBe(true)
  })

  it('filters explorations by timeline query param', async () => {
    const timeline = EXPLORATIONS[explorationIds[0]!].timeline
    const wrapper = await mountTopicView(topicId, { timeline })
    const expected = explorationIds.filter((id) => EXPLORATIONS[id].timeline === timeline)
    expect(catalogCards(wrapper)).toHaveLength(expected.length)
  })

  it('shows all explorations when no timeline query param', async () => {
    const wrapper = await mountTopicView()
    expect(catalogCards(wrapper)).toHaveLength(explorationIds.length)
  })

  it('shows no-explorations message for non-matching timeline', async () => {
    const wrapper = await mountTopicView(topicId, { timeline: 'nonexistent' })
    expect(catalogCards(wrapper)).toHaveLength(0)
    expect(wrapper.text()).toContain('No explorations here yet')
  })

  it('filters explorations by tag query param', async () => {
    const firstTag = EXPLORATIONS[explorationIds[0]!].tags[0]!
    const tagKey = Object.entries(Tag).find(([, v]) => v === firstTag)![0]
    const wrapper = await mountTopicView(topicId, { tag: tagKey })
    const expected = explorationIds.filter((id) => EXPLORATIONS[id].tags.includes(firstTag))
    expect(catalogCards(wrapper)).toHaveLength(expected.length)
  })

  it('filters explorations by both timeline and tag', async () => {
    const timeline = EXPLORATIONS[explorationIds[0]!].timeline
    const firstTag = EXPLORATIONS[explorationIds[0]!].tags[0]!
    const tagKey = Object.entries(Tag).find(([, v]) => v === firstTag)![0]
    const wrapper = await mountTopicView(topicId, { timeline, tag: tagKey })
    const expected = explorationIds.filter(
      (id) => EXPLORATIONS[id].timeline === timeline && EXPLORATIONS[id].tags.includes(firstTag),
    )
    expect(catalogCards(wrapper)).toHaveLength(expected.length)
  })

  describe('/all catalog', () => {
    it('lists every exploration in a responsive grid', async () => {
      const wrapper = await mountTopicView('all')
      expect(wrapper.text()).toContain('All explorations')
      expect(catalogCards(wrapper)).toHaveLength(Object.keys(EXPLORATIONS).length)
      expect(wrapper.find('[data-testid="exploration-catalog-grid"]').exists()).toBe(true)
    })

    it('offers clear filters when a tag is active', async () => {
      const firstTag = EXPLORATIONS[explorationIds[0]!].tags[0]!
      const tagKey = Object.entries(Tag).find(([, v]) => v === firstTag)![0]
      const wrapper = await mountTopicView('all', { tag: tagKey })
      expect(wrapper.text()).toContain('Clear filters')
      const clear = wrapper
        .findAllComponents(RouterLinkStub)
        .find((l) => l.props('to') === '/all' && l.text().includes('Clear filters'))
      expect(clear).toBeDefined()
    })
  })
})
