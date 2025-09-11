<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <div class="grid grid-cols-2">
      <h1 class="font-mono">feelyourprotocol.org</h1>
      <nav class="font-mono">
        <RouterLink to="/" class="m-5">Home</RouterLink>
        <RouterLink to="/eip-7823-modexp-upper-bounds" class="m5">EIP-7823</RouterLink>
        <RouterLink to="/fusaka" class="m-5">Fusaka</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView class="grid grid-cols-1"/>

  <HelloWorld msg="Made with ❤️ and pure dedication" />

</template>

<style scoped>
</style>
