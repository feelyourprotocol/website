import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

import Layout from './Layout.vue'
import './custom.css'

/** Community docs — "Builder's Workshop" skin (see custom.css). */
export default {
  extends: DefaultTheme,
  Layout,
  setup() {
    onMounted(() => {
      document.documentElement.classList.add('fyp-site-docs')
    })
  },
} satisfies Theme
