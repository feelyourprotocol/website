<script setup lang="ts">
import { computed } from 'vue'

import {
  blobBreakdown,
  type HardforkChoice,
  payloadSketch,
  perBytePrices,
  type ShapeId,
} from './schedule'

const props = defineProps<{
  shape: ShapeId
  hardfork: HardforkChoice
}>()

const fusaka = perBytePrices('fusaka')
const glamsterdam = perBytePrices('glamsterdam')
const scale = glamsterdam.zeroFloor
const sketch = computed(() => payloadSketch(props.shape))
const breakdown = computed(() => blobBreakdown(props.shape, props.hardfork))
const paysWork = computed(() => props.shape === 'busy')

interface Meter {
  id: 'zero' | 'nonzero'
  label: string
  sample: 'outline' | 'fill'
  work: bigint
  fusaka: bigint
  glamsterdam: bigint
}

const meters: Meter[] = [
  {
    id: 'zero',
    label: 'Zero byte',
    sample: 'outline',
    work: glamsterdam.zeroOrdinary,
    fusaka: fusaka.zeroFloor,
    glamsterdam: glamsterdam.zeroFloor,
  },
  {
    id: 'nonzero',
    label: 'Nonzero byte',
    sample: 'fill',
    work: glamsterdam.nonzeroOrdinary,
    fusaka: fusaka.nonzeroFloor,
    glamsterdam: glamsterdam.nonzeroFloor,
  },
]

const calldataCells = computed(() =>
  sketch.value.kind === 'listed'
    ? []
    : Array.from({ length: sketch.value.count }, (_, index) => index),
)

function pct(value: bigint): string {
  if (scale <= 0n) return '0%'
  const raw = Number((value * 10_000n) / scale) / 100
  return `${Math.max(0, Math.min(100, raw))}%`
}

function forkActive(fork: HardforkChoice): boolean {
  return !paysWork.value && props.hardfork === fork
}

const blobLine = computed(() => {
  const { kind, count } = sketch.value
  if (kind === 'zero') return `These are ${count} zero bytes.`
  if (kind === 'listed') {
    return `This transaction has no calldata. It lists ${count} bytes (an address and a storage key).`
  }
  return `These are ${count} nonzero bytes.`
})

const linkLine = computed(() => {
  const { count, floorEach, workEach } = breakdown.value
  if (props.shape === 'access-list') {
    return props.hardfork === 'glamsterdam'
      ? `On Glamsterdam each of those ${count} bytes still costs ${floorEach}. ${count} × ${floorEach} is the floor below.`
      : `On Fusaka those ${count} listed bytes add nothing to the floor.`
  }
  if (paysWork.value) {
    return `This call does real work, so each byte stays at ${workEach}. ${count} × ${workEach} is the price below.`
  }
  return `On this fork each of these bytes costs ${floorEach}. ${count} × ${floorEach} is the floor below.`
})
</script>

<template>
  <section
    data-testid="byte-price-stage"
    class="mb-4 rounded-lg border e-border overflow-hidden"
    :data-shape="shape"
    :data-paying="paysWork ? 'work' : 'floor'"
    aria-label="Gas for one zero byte and one nonzero byte"
  >
    <div class="px-4 py-3 border-b e-border">
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">Calldata</p>
      <div data-testid="byte-mosaic" :data-kind="sketch.kind" :data-count="sketch.count">
        <p class="text-sm mt-1">{{ blobLine }}</p>
        <div v-if="calldataCells.length" class="mt-2 flex flex-wrap gap-1" aria-hidden="true">
          <span
            v-for="index in calldataCells"
            :key="index"
            data-byte
            class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm font-mono text-[0.65rem] leading-none"
            :class="sketch.kind === 'nonzero' ? 'e-bg-dark' : 'border-2 e-border-dark'"
          >
            {{ sketch.kind === 'zero' ? '0' : '' }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2">
      <article
        v-for="(meter, index) in meters"
        :key="meter.id"
        class="px-4 py-3 min-w-0"
        :class="index === 1 ? 'border-t sm:border-t-0 sm:border-l e-border' : ''"
        :data-testid="`${meter.id}-meter`"
        :data-focus="sketch.kind === meter.id ? 'true' : 'false'"
      >
        <div class="flex items-center gap-2 mb-3">
          <span
            class="w-5 h-5 rounded-sm shrink-0 inline-flex items-center justify-center text-[0.65rem] font-mono leading-none"
            :class="meter.sample === 'fill' ? 'e-bg-dark' : 'border-2 e-border-dark'"
            aria-hidden="true"
          >
            {{ meter.sample === 'outline' ? '0' : '' }}
          </span>
          <h3 class="text-sm font-semibold">{{ meter.label }}</h3>
          <span v-if="sketch.kind === meter.id" class="text-[0.65rem] font-mono opacity-60">
            in these bytes
          </span>
        </div>

        <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-1.5">
          Almost no work
        </p>
        <div class="space-y-2 mb-3">
          <div>
            <div class="flex justify-between text-xs font-mono mb-0.5">
              <span :class="forkActive('glamsterdam') ? 'e-text font-semibold' : 'opacity-60'">
                Glamsterdam
              </span>
              <span
                :data-testid="`${meter.id}-glamsterdam`"
                :data-gas="meter.glamsterdam.toString()"
                :data-active="forkActive('glamsterdam') ? 'true' : 'false'"
              >
                {{ meter.glamsterdam.toString() }}
              </span>
            </div>
            <div class="h-2 rounded-full border e-border overflow-hidden">
              <div
                class="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                :class="forkActive('glamsterdam') ? 'e-bg-dark' : 'e-bg-dark opacity-40'"
                :style="{ width: pct(meter.glamsterdam) }"
              />
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs font-mono mb-0.5">
              <span :class="forkActive('fusaka') ? 'e-text font-semibold' : 'opacity-60'">
                Fusaka
              </span>
              <span
                :data-testid="`${meter.id}-fusaka`"
                :data-gas="meter.fusaka.toString()"
                :data-active="forkActive('fusaka') ? 'true' : 'false'"
              >
                {{ meter.fusaka.toString() }}
              </span>
            </div>
            <div class="h-2 rounded-full border e-border overflow-hidden">
              <div
                class="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                :class="forkActive('fusaka') ? 'e-bg-dark' : 'e-bg-dark opacity-40'"
                :style="{ width: pct(meter.fusaka) }"
              />
            </div>
          </div>
        </div>

        <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45 mb-1.5">
          Real work
        </p>
        <div class="flex justify-between text-xs font-mono mb-0.5">
          <span :class="paysWork ? 'e-text font-semibold' : 'opacity-60'">Either fork</span>
          <span :data-testid="`${meter.id}-work`">{{ meter.work.toString() }}</span>
        </div>
        <div class="h-2 rounded-full border e-border overflow-hidden">
          <div
            class="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
            :class="paysWork ? 'e-bg-dark' : 'e-bg-dark opacity-40'"
            :style="{ width: pct(meter.work) }"
          />
        </div>
      </article>
    </div>

    <p data-testid="byte-price-glance" class="px-4 py-3 border-t e-border text-sm leading-snug">
      {{ linkLine }}
    </p>
  </section>
</template>
