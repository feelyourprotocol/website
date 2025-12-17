<script setup lang="ts">
import { useRoute } from 'vue-router'
import { EIPs, type EIP } from './lib/structure'

const route = useRoute()
// @ts-expect-error route.name doesn't seem to be properly typed
const eip: EIP = EIPs[route.name]
</script>

<template>
  <div class="grid grid-cols-1">
    <p class="flex justify-end text-sm items-center mb-3">
      <span class="ml-5 text-3xl">EIP-{{ eip.num }}</span>
    </p>
  </div>

  <div class="grid md:grid-cols-2 gap-4">
    <Suspense>
      <slot></slot>
    </Suspense>
  </div>
</template>
