<script setup lang="ts">
interface Examples {
  [key: string]: {
    title: string
    values: bigint[]
  }
}

const example = defineModel<string>()

defineProps<{
  examples: Examples
  change: () => void
}>()
</script>

<template>
  <select
    v-model="example"
    class="text-blue-900 text-xs border-1 pl-1 pr-1 pt-0.5 pb-0.5 rounded-sm"
    @change="change"
  >
    <option disabled value="">Examples</option>
    <option v-for="(val, key) in examples" :key="key" :value="key">{{ val.title }}</option>
  </select>
</template>
