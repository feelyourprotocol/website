import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

import Changelog from './components/Changelog.vue'
import Checklist from './components/Checklist.vue'
import IconGrid from './components/IconGrid.vue'
import IconNote from './components/IconNote.vue'
import LaunchFacts from './components/LaunchFacts.vue'
import Motto from './components/Motto.vue'
import RoadmapBoard from './components/RoadmapBoard.vue'
import Timeline from './components/Timeline.vue'
import './custom.css'

/**
 * Roadmap theme — "Strategy HQ" skin (see custom.css) plus globally-
 * registered visualization components for Markdown pages.
 */
export default {
  extends: DefaultTheme,
  setup() {
    onMounted(() => {
      document.documentElement.classList.add('fyp-site-roadmap')
    })
  },
  enhanceApp({ app }) {
    app.component('Timeline', Timeline)
    app.component('RoadmapBoard', RoadmapBoard)
    app.component('Changelog', Changelog)
    app.component('Checklist', Checklist)
    app.component('LaunchFacts', LaunchFacts)
    app.component('IconGrid', IconGrid)
    app.component('IconNote', IconNote)
    app.component('Motto', Motto)
  },
} satisfies Theme
