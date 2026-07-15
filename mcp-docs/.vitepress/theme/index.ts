import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

import Changelog from './components/Changelog.vue'
import './custom.css'

/**
 * MCP docs theme — "Machine Room" skin (terminal-green, see custom.css) plus
 * globally registered Changelog for per-section micro-versioning.
 */
export default {
  extends: DefaultTheme,
  setup() {
    onMounted(() => {
      document.documentElement.classList.add('fyp-site-mcp')
    })
  },
  enhanceApp({ app }) {
    app.component('Changelog', Changelog)
  },
} satisfies Theme
