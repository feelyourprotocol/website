import { createRouter, createWebHistory } from 'vue-router'
import { EIPs, TOPICS } from '@/views/lib/structure'

function loadRoutes() {
  // Use Vite's glob imports so production builds can resolve lazy routes
  // This is important to keep the routes statically analyzable for cypress e2e tests
  const eipViews = import.meta.glob('../views/eips/*View.vue')
  const topicViews = import.meta.glob('../views/topics/*View.vue')
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

  const eipRs = []
  for (const [name, eip] of Object.entries(EIPs)) {
    eipRs.push({
      path: eip.path,
      name,
      // Lazy-load via statically analyzable glob map
      component: eipViews[`../views/eips/EIP${eip.num}View.vue`],
    })
  }

  const topicRs = []
  for (const [name, topic] of Object.entries(TOPICS)) {
    topicRs.push({
      path: topic.path,
      name,
      // Lazy-load via statically analyzable glob map
      component: topicViews[`../views/topics/${topic.title}View.vue`],
    })
  }

  return [...homeRs, ...eipRs, ...topicRs]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: loadRoutes(),
})

export default router
