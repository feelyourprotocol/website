<script setup lang="ts">
interface Examples {
  [key: string]: {
    title: string
    values: string[]
  }
}

const example = defineModel<string>()

defineProps<{
  examples: Examples
  change: () => void
}>()
</script>

<template>
  <p class="text-right">
    <select v-model="example" class="examples-select e-select" @change="change">
      <option disabled value="">Examples</option>
      <option v-for="(val, key) in examples" :key="key" :value="key">{{ val.title }}</option>
    </select>
  </p>
</template>
