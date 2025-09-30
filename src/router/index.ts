import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/eip-7883-modexp-gas-cost-increase',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/eips/EIP7883View.vue'),
    },
    {
      path: '/fusaka',
      name: 'fusaka',
      component: () => import('../views/FusakaView.vue'),
    },
  ],
})

export default router
