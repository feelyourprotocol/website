import { createRouter, createWebHistory } from 'vue-router'
import { EXPLORATIONS, TOPICS } from '@/views/lib/structure'

function loadRoutes() {
  // Use Vite's glob imports so production builds can resolve lazy routes
  // This is important to keep the routes statically analyzable for cypress e2e tests
  const baseViews = import.meta.glob('../views/*View.vue')

  const homeRs = [
    {
      path: '/',
      name: 'home',
      component: baseViews['../views/HomeView.vue'],
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: baseViews['../views/ImprintView.vue'],
    },
  ]

  const explorationRs = []
  for (const [name, exploration] of Object.entries(EXPLORATIONS)) {
    explorationRs.push({
      path: exploration.path,
      name,
      component: baseViews['../views/ExplorationView.vue'],
    })
  }

  const topicRs = []
  for (const [name, topic] of Object.entries(TOPICS)) {
    topicRs.push({
      path: topic.path,
      name,
      component: baseViews['../views/TopicView.vue'],
    })
  }

  return [...homeRs, ...explorationRs, ...topicRs]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: loadRoutes(),
})

export default router
