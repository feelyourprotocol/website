<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { ref, watch, type Ref } from 'vue'
import { EIPs } from './views/lib/structure'

const router = useRouter()
const route = useRoute()
const selectedRoute: Ref<string> = ref(route.path.includes('eip-') ? route.path : '')

watch(
  () => route.path,
  (newPath) => {
    selectedRoute.value = newPath.includes('eip-') ? newPath : ''
  },
)

const navigate = () => {
  router.push(selectedRoute.value)
}
</script>

<template>
  <header>
    <div class="grid grid-cols-2 pt-2 pb-2 mt-1 mb-2">
      <h1>
        <RouterLink to="/" class="text-2xl md:text-4xl font-bold text-blue-900"
          >Feel Your Protocol</RouterLink
        >
      </h1>
      <nav class="font-mono text-sm text-right flex justify-end items-center">
        <select
          v-model="selectedRoute"
          @change="navigate"
          class="text-sm ml-6 border-1 p-1 rounded-sm"
          id="eip-navi"
        >
          <option disabled value="">All Explorations</option>
          <option v-for="[id, eip] in Object.entries(EIPs)" :key="id" :value="eip.path">
            EIP-{{ eip.num }}
          </option>
        </select>
      </nav>
    </div>
  </header>

  <RouterView class="grid grid-cols-1" />

  <footer class="grid grid-cols-2 pt-2 mt-10 mb-2">
    <h3 class="font-mono text-xs">
      Made with ❤️ and pure dedication by
      <a href="https://x.com/HolgerD77" target="_blank" rel="noopener">HolgerD77</a>
    </h3>

    <h3 class="font-mono text-xs text-right">
      <RouterLink to="/imprint">Imprint</RouterLink>
      <a
        href="https://github.com/feelyourprotocol/website"
        target="_blank"
        rel="noopener"
        class="ml-3"
        >GitHub</a
      >
    </h3>
  </footer>
</template>
