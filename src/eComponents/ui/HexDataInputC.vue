<script setup lang="ts">
const data = defineModel<string>()

defineProps(['rows', 'formChange'])
</script>

<template>
  <textarea @input="formChange" :rows="rows" v-model="data" class="e-textarea"></textarea>
</template>
