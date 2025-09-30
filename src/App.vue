<script setup lang="ts">
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import SiteFooter from './components/SiteFooter.vue'
import { ref, watch, type Ref } from 'vue'

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
    <div class="grid grid-cols-2 pt-2 pb-2 mb-5 border-b-2 border-blue-300">
      <h1 class="font-mono text-lg">
        <RouterLink to="/">feelyourprotocol.org</RouterLink>
      </h1>
      <nav class="font-mono text-right">
        <select v-model="selectedRoute" @change="navigate">
          <option disabled value="">All EIPs</option>
          <option value="/eip-7883-modexp-gas-cost-increase">EIP-7883</option>
        </select>

        <RouterLink to="/fusaka" class="ml-5">Fusaka</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView class="grid grid-cols-1" />

  <SiteFooter msg="Made with ❤️ and pure dedication" />
</template>

<style scoped></style>
