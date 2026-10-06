import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { onMounted } from 'vue'

import Changelog from './components/Changelog.vue'
import ClientTabs from './components/ClientTabs.vue'
import CodeSnippet from './components/CodeSnippet.vue'
import CollapsibleChangelog from './components/CollapsibleChangelog.vue'
import CopyButton from './components/CopyButton.vue'
import DoorStrip from './components/DoorStrip.vue'
import EipHeader from './components/EipHeader.vue'
import EndpointCard from './components/EndpointCard.vue'
import IconGrid from './components/IconGrid.vue'
import IconNote from './components/IconNote.vue'
import LaunchFacts from './components/LaunchFacts.vue'
import LeadQuestion from './components/LeadQuestion.vue'
import PromptCard from './components/PromptCard.vue'
import PromptList from './components/PromptList.vue'
import SpecTable from './components/SpecTable.vue'
import Steps from './components/Steps.vue'
import './custom.css'

/**
 * MCP docs theme — "Machine Room" skin (see custom.css) plus globally
 * registered components for prompts, setup, and EIP catalogue pages.
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
    app.component('CollapsibleChangelog', CollapsibleChangelog)
    app.component('ClientTabs', ClientTabs)
    app.component('CodeSnippet', CodeSnippet)
    app.component('CopyButton', CopyButton)
    app.component('DoorStrip', DoorStrip)
    app.component('EipHeader', EipHeader)
    app.component('EndpointCard', EndpointCard)
    app.component('IconGrid', IconGrid)
    app.component('IconNote', IconNote)
    app.component('LaunchFacts', LaunchFacts)
    app.component('LeadQuestion', LeadQuestion)
    app.component('PromptCard', PromptCard)
    app.component('PromptList', PromptList)
    app.component('SpecTable', SpecTable)
    app.component('Steps', Steps)
  },
} satisfies Theme
