import './main.css'
import { createApp } from 'vue'
import { getCommunityPageSeo } from '@ct/content/pageSeo'
import { applyPageSeo } from '@shared/libs/applyPageSeo'

import App from './App.vue'

applyPageSeo(getCommunityPageSeo())

createApp(App).mount('#app')
