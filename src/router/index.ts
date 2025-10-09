import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ImprintView from '@/views/ImprintView.vue'
import { EIPs, HARDFORKS, TOPICS } from '@/views/structure'

function loadRoutes() {
  const homeRs = [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/imprint',
      name: 'imprint',
      component: ImprintView,
    },
  ]

  const eipRs = []
  for (const [name, eip] of Object.entries(EIPs)) {
    eipRs.push({
      path: eip.path,
      name,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/eips/EIP' + eip.num + 'View.vue'),
    })
  }

  const hardforkRs = []
  for (const [name, hardfork] of Object.entries(HARDFORKS)) {
    hardforkRs.push({
      path: hardfork.path,
      name,
      component: () => import('../views/hardforks/' + hardfork.title + 'View.vue'),
    })
  }

  const topicRs = []
  for (const [name, topic] of Object.entries(TOPICS)) {
    topicRs.push({
      path: topic.path,
      name,
      component: () => import('../views/topics/' + topic.title + 'View.vue'),
    })
  }

  return [...homeRs, ...eipRs, ...hardforkRs, ...topicRs]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: loadRoutes(),
})

export default router
