<script setup lang="ts">
import { computed } from 'vue'

import { type Topic, TOPIC_COLORS, topicCSSVars } from '@/explorations/TOPICS'

import { shortAddress, shortTopic } from './format'
import type { ReceiptLogDecoration, ReceiptLogsPanelConfig, ReceiptLogsViewState } from './types'

const props = defineProps<{
  topic: Topic
  state: ReceiptLogsViewState | null
  hasRun: boolean
  config?: ReceiptLogsPanelConfig
}>()

const title = computed(() => props.config?.title ?? 'Receipt logs')
const idleHint = computed(
  () => props.config?.idleHint ?? 'Run a scenario to populate the transaction receipt log list.',
)
const emptyRunHint = computed(
  () =>
    props.state?.emptyHint ?? props.config?.emptyRunHint ?? 'No logs in the receipt for this run.',
)

function decorationLabel(decoration: ReceiptLogDecoration): string {
  if (decoration.kind === 'eth-transfer') return 'ETH Transfer (EIP-7708)'
  if (decoration.kind === 'eth-burn') return 'ETH Burn (EIP-7708)'
  return decoration.label
}

function isHighlighted(decoration: ReceiptLogDecoration | undefined): boolean {
  if (!decoration || !props.state?.focusKind) return false
  return decoration.kind === props.state.focusKind
}
</script>

<template>
  <div
    :style="topicCSSVars(topic.color)"
    :class="[
      'exploration-c receipt-logs-panel bg-white rounded-lg p-4 shadow-sm min-h-[20rem]',
      TOPIC_COLORS[topic.color].classes.borderCard,
    ]"
    data-testid="receipts-panel"
  >
    <div class="flex flex-wrap items-baseline justify-between gap-2 mb-1">
      <h2 class="text-lg font-bold tracking-tight e-text">{{ title }}</h2>
      <span v-if="state" class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">
        {{ state.hardforkLabel }}
      </span>
    </div>

    <p v-if="hasRun && state" class="text-xs font-mono opacity-50 mb-3 leading-relaxed">
      {{ state.rows.length }} log{{ state.rows.length === 1 ? '' : 's' }} in the receipt
    </p>
    <p v-else class="text-xs font-mono opacity-50 mb-3 leading-relaxed">
      {{ idleHint }}
    </p>

    <div
      v-if="hasRun && state && state.rows.length > 0"
      class="space-y-2 max-h-[70vh] overflow-y-auto"
    >
      <article
        v-for="row in state.rows"
        :key="row.index"
        :class="[
          'rounded-md border p-3 text-sm',
          isHighlighted(row.decoration) ? 'e-border-dark e-bg-medium' : 'e-border e-bg-light',
        ]"
        data-testid="receipts-log-row"
        :data-log-decoration="row.decoration?.kind ?? 'none'"
        :data-log-index="row.index"
      >
        <div class="flex flex-wrap items-center gap-2 mb-2">
          <span class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">
            log #{{ row.index + 1 }}
            <template v-if="row.txIndex > 0"> · tx {{ row.txIndex + 1 }}</template>
          </span>
          <span
            v-if="row.decoration"
            class="text-[0.65rem] font-mono px-2 py-0.5 rounded-full border e-border e-bg-medium"
          >
            {{ decorationLabel(row.decoration) }}
          </span>
        </div>

        <template v-if="row.decoration?.kind === 'eth-transfer'">
          <dl class="grid grid-cols-1 gap-1.5 font-mono text-xs">
            <div class="flex flex-wrap gap-x-2">
              <dt class="opacity-50">from</dt>
              <dd class="e-text break-all">{{ row.decoration.from }}</dd>
            </div>
            <div class="flex flex-wrap gap-x-2">
              <dt class="opacity-50">to</dt>
              <dd class="e-text break-all">{{ row.decoration.to }}</dd>
            </div>
            <div class="flex flex-wrap gap-x-2">
              <dt class="opacity-50">value</dt>
              <dd class="e-text">{{ row.decoration.valueLabel }}</dd>
            </div>
            <div v-if="row.decoration.emitterNote" class="flex flex-wrap gap-x-2">
              <dt class="opacity-50">emitter</dt>
              <dd class="opacity-70">{{ row.decoration.emitterNote }}</dd>
            </div>
          </dl>
        </template>

        <template v-else-if="row.decoration?.kind === 'eth-burn'">
          <dl class="grid grid-cols-1 gap-1.5 font-mono text-xs">
            <div class="flex flex-wrap gap-x-2">
              <dt class="opacity-50">account</dt>
              <dd class="e-text break-all">{{ row.decoration.account }}</dd>
            </div>
            <div class="flex flex-wrap gap-x-2">
              <dt class="opacity-50">value</dt>
              <dd class="e-text">{{ row.decoration.valueLabel }}</dd>
            </div>
          </dl>
        </template>

        <template v-else-if="row.decoration?.kind === 'custom'">
          <dl class="grid grid-cols-1 gap-1.5 font-mono text-xs">
            <div
              v-for="field in row.decoration.fields"
              :key="field.key"
              class="flex flex-wrap gap-x-2"
            >
              <dt class="opacity-50">{{ field.key }}</dt>
              <dd class="e-text break-all">{{ field.value }}</dd>
            </div>
          </dl>
        </template>

        <details class="mt-2 group">
          <summary
            class="text-[0.65rem] font-mono uppercase tracking-widest opacity-40 cursor-pointer"
          >
            Raw log
          </summary>
          <dl class="mt-2 space-y-1 font-mono text-[0.65rem] opacity-70 break-all">
            <div>
              <span class="opacity-50">address </span>{{ shortAddress(row.raw.address, 8, 6) }}
            </div>
            <div v-for="(topic, topicIndex) in row.raw.topics" :key="topicIndex">
              <span class="opacity-50">topic[{{ topicIndex }}] </span>{{ shortTopic(topic) }}
            </div>
            <div><span class="opacity-50">data </span>{{ row.raw.data || '0x' }}</div>
          </dl>
        </details>
      </article>
    </div>

    <div
      v-else-if="hasRun"
      class="rounded-md border border-dashed e-border e-bg-medium px-4 py-10 text-center"
    >
      <p class="text-sm font-mono opacity-55">{{ emptyRunHint }}</p>
    </div>

    <div v-else class="rounded-md border border-dashed e-border e-bg-medium px-4 py-10 text-center">
      <p class="text-sm font-mono opacity-45">Waiting for execution…</p>
    </div>
  </div>
</template>
