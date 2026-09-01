<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  type HelpHintMode,
  type HelpHintTier,
  type HelpHintTouchFallback,
  resolveHelpHintMode,
} from './helpHint/resolveHelpHintMode'
import { useHelpHintCapabilities } from './helpHint/useHelpHintCapabilities'
import HelpHintInlineUIC from './HelpHintInlineUIC.vue'
import HelpHintPopoverUIC from './HelpHintPopoverUIC.vue'
import HelpHintTooltipUIC from './HelpHintTooltipUIC.vue'

const props = withDefaults(
  defineProps<{
    /** Hint copy. `tooltip` is kept as a backward-compatible alias. */
    text?: string
    tooltip?: string
    mode?: HelpHintMode
    tier?: HelpHintTier
    touchFallback?: HelpHintTouchFallback
    hostClass?: string
    triggerClass?: string
    inlineClass?: string
    popoverLabel?: string
  }>(),
  {
    mode: 'auto',
    tier: 'useful',
    touchFallback: 'inline',
    hostClass: '',
    triggerClass: '',
    inlineClass: '',
  },
)

const triggerRef = ref<HTMLElement | null>(null)
const { canHover } = useHelpHintCapabilities()

const hintText = computed(() => (props.text ?? props.tooltip ?? '').trim())

const displayMode = computed(() =>
  resolveHelpHintMode({
    mode: props.mode,
    tier: props.tier,
    canHover: canHover.value,
    text: hintText.value,
    touchFallback: props.touchFallback,
  }),
)

const hostLayoutClass = computed(() => {
  if (!hintText.value || displayMode.value === 'popover') {
    return 'inline-flex items-center gap-0.5'
  }
  if (displayMode.value === 'inline') return 'flex flex-col gap-1'
  return 'inline-flex'
})
</script>

<template>
  <div class="help-hint-host" :class="[hostLayoutClass, hostClass]">
    <div
      ref="triggerRef"
      class="help-hint-trigger"
      :class="[
        displayMode === 'tooltip' && hintText ? 'relative inline-flex' : 'inline-flex',
        triggerClass,
      ]"
    >
      <slot />
      <HelpHintTooltipUIC
        v-if="displayMode === 'tooltip' && hintText"
        :text="hintText"
        :trigger-el="triggerRef"
      />
    </div>

    <HelpHintPopoverUIC
      v-if="displayMode === 'popover' && hintText"
      :text="hintText"
      :label="popoverLabel"
    />

    <HelpHintInlineUIC
      v-if="displayMode === 'inline' && hintText"
      :text="hintText"
      :hint-class="inlineClass"
    />
  </div>
</template>
