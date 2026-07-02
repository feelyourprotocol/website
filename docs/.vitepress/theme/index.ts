import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

import './custom.css'

/** Community docs — "Builder's Workshop" skin (see custom.css). */
export default {
  extends: DefaultTheme,
  setup() {
    onMounted(() => {
      document.documentElement.classList.add('fyp-site-docs')
    })
  },
} satisfies Theme
