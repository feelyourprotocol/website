<script setup lang="ts">
import { computed } from 'vue'

import TooltipC from '@/eComponents/ui/TooltipC.vue'

import { isValidByteInputForm } from './utils'

const val = defineModel<string>()

const props = defineProps<{
  title: string
  input: (event: Event) => void
  len: bigint
  expectedLen: bigint | undefined
  bigIntVal: bigint | undefined
}>()

const errors = computed(() => isValidByteInputForm(val?.value ?? '', props.expectedLen))

const validation = computed(() => {
  return errors.value.length > 0 ? 'text-red-400' : 'text-slate-600'
})

const tooltip = computed(() => {
  if (errors.value.length > 0) {
    return errors.value.join(' | ')
  }
  return ''
})
</script>

<template>
  <div class="precompile-value-input">
    <div class="grid grid-cols-6 items-center">
      <p class="font-bold text-xl col-span-1 e-text">{{ title }}</p>
      <span class="group relative col-span-5">
        <input @input="input" v-model="val" :class="validation" class="e-input text-right" />
        <TooltipC :tooltip="tooltip" />
      </span>

      <p class="col-span-1 text-xs">{{ len }} Bytes</p>
      <p class="text-right font-mono col-span-5 text-xs mt-0.5 break-words w-full overflow-hidden">
        {{ bigIntVal }}
      </p>
    </div>
  </div>
</template>
