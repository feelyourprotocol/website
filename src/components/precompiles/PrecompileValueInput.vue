<script setup lang="ts">
defineProps(['title', 'len', 'hex'])
</script>

<template>
  <div
    class="border-blue-900 border-t-1 bg-blue-300 bg-clip-border pt-1.5 pb-0.5 pl-0.5 pr-0.5 mb-0.5"
  >
    <div class="grid grid-cols-6 items-center">
      <p class="font-bold text-xl col-span-1 text-blue-900">{{ title }}</p>
      <slot></slot>

      <p class="col-span-1 text-xs">{{ len }} Bytes</p>
      <p class="text-right font-mono col-span-5 text-xs mt-0.5 break-words w-full overflow-hidden">
        {{ hex }}
      </p>
    </div>
  </div>
</template>
