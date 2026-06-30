import './custom.css'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import Changelog from './components/Changelog.vue'
import RoadmapBoard from './components/RoadmapBoard.vue'
import Timeline from './components/Timeline.vue'

/**
 * Roadmap theme — the default VitePress theme with a Feel Your Protocol skin
 * (see `custom.css`) plus a few globally-registered building blocks so the
 * Markdown pages can drop in `<Timeline />`, `<RoadmapBoard />` and
 * `<Changelog :entries="…" />` without per-page imports.
 */
export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Timeline', Timeline)
    app.component('RoadmapBoard', RoadmapBoard)
    app.component('Changelog', Changelog)
  },
} satisfies Theme
