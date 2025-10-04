<script setup lang="ts">
import EIP7883C from '@/components/eips/EIP7883C.vue'
</script>

<template>
  <div class="grid grid-cols-1">
    <p class="text-right text-4xl mb-3">
      <span class="ml-1">Precompiles | 0x05</span>
    </p>
  </div>

  <div class="grid md:grid-cols-2">
    <Suspense>
      <EIP7883C />
    </Suspense>
  </div>
</template>
