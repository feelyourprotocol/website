<script setup lang="ts">
const data = defineModel<string>()

defineProps(['rows', 'formChange'])
</script>

<template>
  <textarea
    @input="formChange"
    :rows="rows"
    v-model="data"
    class="block w-full mt-1.5 mb-2 font-mono text-xs rounded-sm text-slate-600 bg-blue-50 p-1"
  ></textarea>
</template>
