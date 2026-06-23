<script setup lang="ts">
import { computed } from 'vue'
import type { TreasuryChartSpec } from '@ct/content/treasury'

const props = withDefaults(
  defineProps<{
    spec: TreasuryChartSpec
    compact?: boolean
  }>(),
  { compact: false },
)

const activeSlices = computed(() => props.spec.slices.filter((slice) => slice.eur > 0))

const basisEur = computed(() => props.spec.basis.totalEur)

const earmarkedEur = computed(() => activeSlices.value.reduce((sum, slice) => sum + slice.eur, 0))

type Segment = {
  id: string
  label: string
  eur: number
  color: string
  percent: number
  path: string
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const startPt = polar(cx, cy, r, end)
  const endPt = polar(cx, cy, r, start)
  const large = end - start > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${startPt.x} ${startPt.y} A ${r} ${r} 0 ${large} 0 ${endPt.x} ${endPt.y} Z`
}

const segments = computed((): Segment[] => {
  const basis = basisEur.value
  if (basis <= 0 || activeSlices.value.length === 0) return []

  const earmarked = earmarkedEur.value
  const arcScale = earmarked > basis ? basis / earmarked : 1

  let angle = 0
  return activeSlices.value.map((slice) => {
    const percent = (slice.eur / basis) * 100
    const sweep = ((slice.eur * arcScale) / basis) * 360
    const path = arcPath(50, 50, 42, angle, angle + sweep)
    angle += sweep
    return { ...slice, percent, path }
  })
})

const aiJson = computed(() => JSON.stringify(props.spec, null, 2))

const generatedLabel = computed(() => {
  const [y, m, d] = props.spec.generatedAt.split('-')
  return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
})
</script>

<template>
  <figure class="ct-treasury-chart">
    <figcaption :class="compact ? 'mb-2' : 'mb-3'">
      <h4
        :class="compact ? 'text-xs font-bold text-slate-700' : 'text-sm font-bold text-slate-800'"
      >
        {{ spec.title }}
      </h4>
      <p v-if="!compact" class="mt-0.5 text-xs text-slate-500">
        {{ spec.subtitle }}
      </p>
      <p class="font-mono text-[0.6rem] text-slate-400" :class="compact ? 'mt-0.5' : 'mt-1'">
        <template v-if="compact">As of {{ generatedLabel }}</template>
        <template v-else>
          Basis: {{ spec.basis.description }} ({{ spec.basis.totalEur.toLocaleString('en-GB') }} €)
          · Generated {{ generatedLabel }}
        </template>
      </p>
    </figcaption>

    <div
      v-if="segments.length"
      :class="[
        'flex items-start gap-3',
        compact ? 'flex-row' : 'flex-col items-center gap-4 sm:flex-row sm:items-start',
      ]"
    >
      <svg
        viewBox="0 0 100 100"
        :class="compact ? 'size-32 shrink-0' : 'size-36 shrink-0'"
        role="img"
        :aria-label="spec.title"
      >
        <path
          v-for="segment in segments"
          :key="segment.id"
          :d="segment.path"
          :fill="segment.color"
          class="transition-opacity hover:opacity-90"
        />
        <circle cx="50" cy="50" r="22" fill="white" />
        <text
          x="50"
          y="48"
          text-anchor="middle"
          class="fill-slate-700 font-mono text-[7px] font-bold"
        >
          {{ basisEur.toLocaleString('en-GB') }} €
        </text>
        <text x="50" y="56" text-anchor="middle" class="fill-slate-400 font-mono text-[5px]">
          claimed
        </text>
      </svg>

      <ul
        :class="
          compact
            ? 'min-w-0 flex-1 space-y-1 text-[0.65rem]'
            : 'min-w-0 flex-1 space-y-2 text-xs text-slate-600'
        "
      >
        <li v-for="segment in segments" :key="segment.id" class="flex items-start gap-1.5">
          <span
            class="mt-0.5 size-2 shrink-0 rounded-sm"
            :style="{ backgroundColor: segment.color }"
            aria-hidden="true"
          />
          <span class="inline-flex flex-wrap items-baseline gap-x-1 text-slate-600">
            <span class="text-slate-700">{{ segment.label }}</span>
            <span class="font-mono text-slate-500">
              {{ segment.eur.toLocaleString('en-GB') }} € · {{ segment.percent.toFixed(0) }}%
            </span>
          </span>
        </li>
      </ul>
    </div>

    <p v-else class="text-xs text-slate-500">No allocation data yet.</p>

    <pre
      :id="spec.chartId"
      class="sr-only"
      data-ai-chart
      data-format="application/json"
      aria-hidden="true"
      >{{ aiJson }}</pre
    >
  </figure>
</template>
