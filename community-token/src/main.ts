import './main.css'
import { applyPageSeo } from '@shared/libs/applyPageSeo'
import { createApp } from 'vue'

import App from './App.vue'
import { getCommunityPageSeo } from '@ct/content/pageSeo'

applyPageSeo(getCommunityPageSeo())

createApp(App).mount('#app')
