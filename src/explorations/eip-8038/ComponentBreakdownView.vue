<script setup lang="ts">
import { computed } from 'vue'

import { formatGas } from './helpers'
import type { CostComponents, HardforkChoice } from './types'

const props = defineProps<{
  hasRun: boolean
  hardfork: HardforkChoice
  fusaka: CostComponents
  glamsterdam: CostComponents
  programGas: bigint
  fusakaProgramGas: bigint
  glamsterdamProgramGas: bigint
  stateGas: bigint
}>()

const rows = computed(() => [
  {
    id: 'touch',
    label: 'Touch',
    hint: 'load the slot',
    fusaka: props.fusaka.access,
    glamsterdam: props.glamsterdam.access,
  },
  {
    id: 'change',
    label: 'Change',
    hint: 'write a new value',
    fusaka: props.fusaka.write,
    glamsterdam: props.glamsterdam.write,
  },
  {
    id: 'create',
    label: 'Create',
    hint: props.glamsterdam.createMeter === 'state' ? 'new slot · state gas' : 'new slot',
    fusaka: props.fusaka.create,
    glamsterdam: props.glamsterdam.create,
    glamsterdamIsState: props.glamsterdam.createMeter === 'state',
  },
])

function cell(value: bigint, hasRun: boolean): string {
  if (!hasRun) return '—'
  if (value === 0n) return '—'
  return formatGas(value)
}

const activeProgram = computed(() =>
  props.hardfork === 'glamsterdam' ? props.glamsterdamProgramGas : props.fusakaProgramGas,
)
</script>

<template>
  <div
    data-testid="cost-breakdown"
    class="rounded-lg border e-border overflow-hidden mb-5"
    :data-has-run="hasRun ? 'true' : 'false'"
  >
    <div
      class="px-4 py-3 border-b e-border flex flex-wrap items-baseline justify-between gap-2 min-h-[2.75rem]"
    >
      <p class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">
        What the opcode pays
      </p>
      <p class="text-xs font-mono opacity-70" data-testid="program-gas">
        Program
        <span :class="hasRun ? 'e-text font-semibold' : 'opacity-40'">
          {{ hasRun ? formatGas(programGas) : '—' }}
        </span>
        <span v-if="hasRun && stateGas > 0n"> · state {{ formatGas(stateGas) }} </span>
      </p>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm min-w-[18rem]">
        <thead>
          <tr class="text-[0.65rem] font-mono uppercase tracking-widest opacity-45">
            <th class="text-left font-normal px-4 py-2">Part</th>
            <th
              class="text-right font-normal px-4 py-2"
              :class="hardfork === 'fusaka' ? 'e-text' : ''"
            >
              Fusaka
            </th>
            <th
              class="text-right font-normal px-4 py-2"
              :class="hardfork === 'glamsterdam' ? 'e-text' : ''"
            >
              Glamsterdam
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="border-t e-border"
            :data-testid="`cost-row-${row.id}`"
          >
            <td class="px-4 py-2.5">
              <p class="font-medium e-text">{{ row.label }}</p>
              <p class="text-[0.65rem] font-mono opacity-50">{{ row.hint }}</p>
            </td>
            <td class="px-4 py-2.5 text-right font-mono" :class="hasRun ? '' : 'opacity-40'">
              {{ cell(row.fusaka, hasRun) }}
            </td>
            <td
              class="px-4 py-2.5 text-right font-mono"
              :class="hasRun ? 'e-text font-semibold' : 'opacity-40'"
            >
              {{ cell(row.glamsterdam, hasRun) }}
              <span
                v-if="hasRun && row.glamsterdamIsState && row.glamsterdam > 0n"
                class="block text-[0.6rem] font-normal opacity-55"
              >
                state gas
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="px-4 py-3 text-[0.65rem] font-mono opacity-55 min-h-[2.5rem] border-t e-border">
      <template v-if="hasRun">
        Program gas is the call (PUSH + opcode), not the 21,000 transaction wrapper. Expected
        {{ formatGas(activeProgram) }}
        on {{ hardfork === 'glamsterdam' ? 'Glamsterdam' : 'Fusaka' }}.
      </template>
      <template v-else>
        Run the program to fill touch, change, and create. The table stays put so the layout does
        not jump.
      </template>
    </p>
  </div>
</template>
