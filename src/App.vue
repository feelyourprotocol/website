<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import SiteFooter from './components/SiteFooter.vue'
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
    <div class="grid grid-cols-2 pt-2 pb-2 mb-5">
      <h1 class="font-mono text-sm md:text-lg ml-4">
        <RouterLink to="/">
          <span style="font-family: 'ItalianoRegular', Times, serif" class="text-4xl md:text-6xl"
            >feelyourprotocol</span
          >
          .org
        </RouterLink>
      </h1>
      <nav class="font-mono text-sm text-right flex justify-end items-center">
        <RouterLink to="/fusaka" class="ml-5">Fusaka</RouterLink>

        <select
          v-model="selectedRoute"
          @change="navigate"
          class="text-xs ml-6 border-1 pl-1 pr-1 pt-0.5 pb-0.5 rounded-sm"
          id="eip-navi"
        >
          <option disabled value="">All EIPs</option>
          <option v-for="[id, eip] in Object.entries(EIPs)" :key="id" :value="eip.path">
            EIP-{{ eip.num }}
          </option>
        </select>
      </nav>
    </div>
  </header>

  <RouterView class="grid grid-cols-1" />

  <SiteFooter />
</template>

<style scoped></style>
