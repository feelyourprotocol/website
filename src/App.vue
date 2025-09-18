<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Footer from './components/Footer.vue';
</script>

<template>
  <header>
    <div class="grid grid-cols-2 pt-2 pb-2 mb-5 border-b-2 border-blue-300">
      <h1 class="font-mono text-lg">
        <RouterLink to="/">feelyourprotocol.org</RouterLink>
      </h1>
      <nav class="font-mono text-right">
        <RouterLink to="/eip-7823-modexp-upper-bounds" class="ml-5">EIP-7823</RouterLink>
        <RouterLink to="/fusaka" class="ml-5">Fusaka</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView class="grid grid-cols-1" />

  <Footer msg="Made with ❤️ and pure dedication" />
</template>

<style scoped></style>
