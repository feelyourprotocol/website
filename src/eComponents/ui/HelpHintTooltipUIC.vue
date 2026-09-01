<script setup lang="ts">
import { computed, onUnmounted, ref, toRef, watch } from 'vue'

import { useTooltipPosition } from './helpHint/useTooltipPosition'

const props = defineProps<{
  text: string
  triggerEl?: HTMLElement | null
}>()

const visible = ref(false)
const tooltipEl = ref<HTMLElement | null>(null)
const triggerRef = toRef(props, 'triggerEl')
const { position } = useTooltipPosition(visible, triggerRef, tooltipEl)

const hasText = computed(() => props.text.trim().length > 0)

function show() {
  if (!hasText.value) return
  visible.value = true
}

function hide() {
  visible.value = false
}

function bindTrigger(el: HTMLElement | null | undefined) {
  if (!el || !hasText.value) return
  el.addEventListener('mouseenter', show)
  el.addEventListener('mouseleave', hide)
  el.addEventListener('focusin', show)
  el.addEventListener('focusout', hide)
}

function unbindTrigger(el: HTMLElement | null | undefined) {
  if (!el) return
  el.removeEventListener('mouseenter', show)
  el.removeEventListener('mouseleave', hide)
  el.removeEventListener('focusin', show)
  el.removeEventListener('focusout', hide)
}

watch(
  () => props.triggerEl,
  (el, prev) => {
    unbindTrigger(prev)
    bindTrigger(el)
  },
  { flush: 'post', immediate: true },
)

onUnmounted(() => {
  unbindTrigger(props.triggerEl)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="visible && hasText"
      ref="tooltipEl"
      role="tooltip"
      class="help-hint-tooltip pointer-events-none fixed z-[100] max-w-[min(20rem,calc(100vw-1rem))] rounded bg-slate-700 px-2 py-1 text-center text-xs leading-snug text-white shadow-md"
      :style="{ top: `${position.top}px`, left: `${position.left}px` }"
    >
      {{ text }}
    </div>
  </Teleport>
</template>
