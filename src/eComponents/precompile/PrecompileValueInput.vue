<script setup lang="ts">
import { computed } from 'vue'
import { isValidByteInputForm } from '@/components/lib/byteFormUtils'
import TooltipC from '@/components/ui/TooltipC.vue'
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
  <div
    class="value-input-{{ num }} border-blue-900 border-t-1 bg-clip-border pt-1.5 pb-0.5 pl-0.5 pr-0.5 mb-0.5"
  >
    <div class="grid grid-cols-6 items-center">
      <p class="font-bold text-xl col-span-1 text-blue-900">{{ title }}</p>
      <span class="group relative col-span-5">
        <input
          @input="input"
          v-model="val"
          :class="validation"
          class="text-right font-mono text-xs bg-blue-50 rounded-xs p-0.5 w-full"
        />
        <TooltipC :tooltip="tooltip" />
      </span>

      <p class="col-span-1 text-xs">{{ len }} Bytes</p>
      <p class="text-right font-mono col-span-5 text-xs mt-0.5 break-words w-full overflow-hidden">
        {{ bigIntVal }}
      </p>
    </div>
  </div>
</template>
