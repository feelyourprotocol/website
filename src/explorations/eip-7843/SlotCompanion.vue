<script setup lang="ts">
import { computed, watch } from 'vue'

import SegmentedToggleUIC from '@/eComponents/ui/SegmentedToggleUIC.vue'
import { TOPIC_COLORS, topicCSSVars, TOPICS } from '@/explorations/TOPICS'
import { useCompanionStatusPublisher } from '@/libs/companionStatus'

import { LAB_TIMESTAMP_DIV_12 } from './block'
import { DEFAULT_SLOT, parseSlotNumber } from './parseSlot'
import type { HardforkChoice } from './types'

const slotInput = defineModel<string>('slotInput', { required: true })
const hardfork = defineModel<HardforkChoice>('hardfork', { required: true })

const topic = TOPICS.robustness
const cssVars = topicCSSVars(topic.color)
const setCompanionStatus = useCompanionStatusPublisher()

const SLOT_PRESETS = [
  { value: '0', label: '0', testId: 'slot-preset-0' },
  { value: '42', label: '42', testId: 'slot-preset-42' },
  { value: '32', label: '32', testId: 'slot-preset-32' },
]

const hardforkOptions = [
  { value: 'amsterdam', label: 'Amsterdam', testId: 'hardfork-amsterdam' },
  { value: 'osaka', label: 'Osaka', testId: 'hardfork-osaka' },
]

const parsed = computed(() => parseSlotNumber(slotInput.value))
const appliedSlot = computed(() => (parsed.value.ok ? parsed.value.value : DEFAULT_SLOT))
const presetValue = computed(() => {
  if (!parsed.value.ok) return ''
  const asString = parsed.value.value.toString()
  return SLOT_PRESETS.some((option) => option.value === asString) ? asString : ''
})

function onPreset(value: string) {
  slotInput.value = value
}

watch(
  [hardfork, appliedSlot, parsed],
  () => {
    if (!parsed.value.ok) {
      setCompanionStatus({ label: parsed.value.error, state: 'idle' })
      return
    }
    if (hardfork.value === 'osaka') {
      setCompanionStatus({
        label: 'SLOTNUM is invalid on Osaka',
        state: 'active',
      })
      return
    }
    setCompanionStatus({
      label: `SLOTNUM pushes ${appliedSlot.value.toString()}`,
      state: 'active',
    })
  },
  { immediate: true },
)
</script>

<template>
  <div
    :style="cssVars"
    :class="[
      'exploration-c bg-white rounded-lg p-4 shadow-sm min-h-[20rem] flex flex-col',
      TOPIC_COLORS[topic.color].classes.borderCard,
    ]"
    aria-label="Beacon slot controls"
  >
    <h2 class="text-lg font-bold tracking-tight mb-2 e-text">Beacon slot</h2>
    <p class="font-mono text-xs leading-relaxed text-slate-600 mb-4">
      The consensus layer writes this number on the block. <code>SLOTNUM</code> reads it. Dividing
      the timestamp by 12 is a different number — and it breaks if slot length changes.
    </p>

    <p class="font-mono text-xs font-bold mb-1 text-slate-700">Fork</p>
    <div class="mb-4">
      <SegmentedToggleUIC
        v-model="hardfork"
        :options="hardforkOptions"
        group-label="Execution fork"
        test-id="slot-hardfork"
      />
    </div>

    <p class="font-mono text-xs font-bold mb-1 text-slate-700">Slot on this block</p>
    <div class="mb-2">
      <SegmentedToggleUIC
        :model-value="presetValue"
        :options="SLOT_PRESETS"
        group-label="Example slots"
        test-id="slot-presets"
        @update:model-value="onPreset"
      />
    </div>
    <label class="sr-only" for="slot-number-input">Beacon slot number</label>
    <input
      id="slot-number-input"
      v-model="slotInput"
      class="e-input mb-2"
      inputmode="numeric"
      autocomplete="off"
      data-testid="slot-number-input"
      aria-describedby="slot-number-error"
    />
    <p
      v-if="!parsed.ok"
      id="slot-number-error"
      class="font-mono text-xs text-red-600 mb-3"
      data-testid="slot-number-error"
    >
      {{ parsed.error }}
    </p>
    <p v-else id="slot-number-error" class="sr-only"></p>

    <div
      class="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 mt-auto min-h-[6.5rem] flex flex-col justify-center gap-1"
      data-testid="slot-readout"
    >
      <p v-if="hardfork === 'osaka'" class="font-mono text-sm font-semibold e-text">
        SLOTNUM is not a valid opcode on Osaka.
      </p>
      <template v-else>
        <p class="font-mono text-sm font-semibold e-text" data-testid="slot-readout-push">
          SLOTNUM pushes {{ appliedSlot.toString() }}
        </p>
        <p class="font-mono text-xs text-slate-600">
          Timestamp ÷ 12 on this block is {{ LAB_TIMESTAMP_DIV_12.toString() }} — not the slot.
        </p>
      </template>
    </div>
  </div>
</template>
