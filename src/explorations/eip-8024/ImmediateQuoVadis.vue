<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/vue'

import { BYTECODE_STEPPER_CONTEXT } from '@/eComponents/bytecodeStepperEC/bytecodeStepperContext'
import {
  type AnyImmediateBreakdown,
  encodeDupnFromStackDepth,
  encodeExchangeFromStackDepths,
  encodeSwapnFromSwapDepth,
  explainEip8024Immediate,
  formatDupnEncodeResult,
  formatExchangeEncodeResult,
  formatSwapnEncodeResult,
  immediateByteFromRow,
  isEip8024ImmediateOpcode,
  opcodeKindFromByte,
} from '@/eComponents/bytecodeStepperEC/eip8024Immediate'
import type { InstructionRow, RunMode } from '@/eComponents/bytecodeStepperEC/types'
import { TOPIC_COLORS, topicCSSVars, TOPICS } from '@/explorations/TOPICS'

import wizardImage from './wizard_cows.png'

/** Optional props for unit tests; production uses inject from BytecodeStepperEC. */
const props = defineProps<{
  activeInstruction?: InstructionRow
  mode?: RunMode
  bytecodeHex?: string
  example?: string
}>()

const stepperContext = inject(BYTECODE_STEPPER_CONTEXT, null)
const topic = TOPICS.robustness
const cssVars = topicCSSVars(topic.color)

const activeInstruction = computed(
  () => props.activeInstruction ?? stepperContext?.activeInstruction.value,
)
const mode = computed(() => props.mode ?? stepperContext?.mode.value ?? 'idle')
const bytecodeHex = computed(() => props.bytecodeHex ?? stepperContext?.bytecodeHex.value ?? '')
const example = computed(() => props.example ?? stepperContext?.example.value ?? '')

const latched = ref<AnyImmediateBreakdown | null>(null)
const selectedTab = ref(0)

const calcDupnDepth = ref('17')
const calcSwapnDepth = ref('18')
const calcExchangeDepthA = ref('2')
const calcExchangeDepthB = ref('3')

const dupnCalculatorResult = computed(() => {
  const raw = String(calcDupnDepth.value).trim()
  if (raw === '') return { ok: false as const, error: 'Enter a stack depth' }
  const depth = Number(raw)
  if (Number.isNaN(depth)) return { ok: false as const, error: 'Depth must be a number' }
  return encodeDupnFromStackDepth(depth)
})

const swapnCalculatorResult = computed(() => {
  const raw = String(calcSwapnDepth.value).trim()
  if (raw === '') return { ok: false as const, error: 'Enter a swap target depth' }
  const depth = Number(raw)
  if (Number.isNaN(depth)) return { ok: false as const, error: 'Depth must be a number' }
  return encodeSwapnFromSwapDepth(depth)
})

const exchangeCalculatorResult = computed(() => {
  const rawA = String(calcExchangeDepthA.value).trim()
  const rawB = String(calcExchangeDepthB.value).trim()
  if (rawA === '' || rawB === '') {
    return { ok: false as const, error: 'Enter two stack depths' }
  }
  const depthA = Number(rawA)
  const depthB = Number(rawB)
  if (Number.isNaN(depthA) || Number.isNaN(depthB)) {
    return { ok: false as const, error: 'Stack depths must be numbers' }
  }
  return encodeExchangeFromStackDepths(depthA, depthB)
})

watch(
  () => [bytecodeHex.value, example.value] as const,
  () => {
    latched.value = null
    selectedTab.value = 0
  },
)

watch(
  () => [mode.value, activeInstruction.value] as const,
  ([currentMode, instruction]) => {
    if (currentMode !== 'stepping' || !instruction) return
    if (!isEip8024ImmediateOpcode(instruction.opcodeByte)) return

    const kind = opcodeKindFromByte(instruction.opcodeByte)
    const immediate = immediateByteFromRow(instruction.rawBytes)
    if (!kind || immediate === undefined) return

    latched.value = explainEip8024Immediate(kind, immediate)
  },
  { immediate: true },
)

function tabButtonClass(selected: boolean): string[] {
  return [
    'rounded-md px-2.5 py-1 font-mono text-xs transition',
    selected
      ? 'bg-white font-bold e-text shadow-sm ring-1 ring-slate-200'
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
  ]
}
</script>

<template>
  <div
    :style="cssVars"
    :class="[
      'exploration-c bg-white rounded-lg p-4 shadow-sm min-h-[20rem] flex flex-col',
      TOPIC_COLORS[topic.color].classes.borderCard,
    ]"
    aria-label="EIP-8024 immediate decoder"
  >
    <h2 class="text-lg font-bold tracking-tight mb-2 e-text">
      DUPN / SWAPN / EXCHANGE — immediate, quo vadis?
    </h2>
    <p class="font-mono text-xs leading-relaxed text-slate-600 mb-4">
      Where does that mysterious second byte go? Step to a DUPN, SWAPN, or EXCHANGE opcode to decode
      it — or use the calculators below.
    </p>

    <div class="flex flex-1 flex-col min-h-[18rem]">
      <div
        class="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 mb-3 min-h-[3.25rem] flex items-center"
      >
        <p v-if="latched" class="font-mono text-sm font-semibold e-text tracking-wide break-all">
          <span class="text-slate-500 font-normal">{{ latched.opcodeName }}:</span>
          {{ latched.summary }}
        </p>
        <p v-else class="font-mono text-xs text-slate-400 italic">
          Waiting for step mode at a DUPN, SWAPN, or EXCHANGE opcode…
        </p>
      </div>

      <TabGroup
        :selected-index="selectedTab"
        as="div"
        class="flex min-h-0 flex-1 flex-col"
        @change="selectedTab = $event"
      >
        <TabList class="flex flex-wrap gap-1 mb-2">
          <Tab v-slot="{ selected }" as="template">
            <button type="button" :class="tabButtonClass(selected)">🪄 Magic</button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button type="button" :class="tabButtonClass(selected)">🔬 Expert</button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button type="button" :class="tabButtonClass(selected)">🧮 DUPN</button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button type="button" :class="tabButtonClass(selected)">🧮 SWAPN</button>
          </Tab>
          <Tab v-slot="{ selected }" as="template">
            <button type="button" :class="tabButtonClass(selected)">🧮 EXCHANGE</button>
          </Tab>
        </TabList>

        <TabPanels class="flex-1 min-h-[12rem]">
          <TabPanel class="h-full w-full">
            <img
              v-if="latched"
              :src="wizardImage"
              alt="A wizard magically connecting numbered cows — because immediate bytes are a bit magical"
              class="w-full h-auto rounded-md border border-slate-200 shadow-sm"
            />
            <p v-else class="font-mono text-xs text-slate-400 italic py-8 text-center">
              Step to a DUPN, SWAPN, or EXCHANGE opcode for the magic reveal…
            </p>
          </TabPanel>

          <TabPanel class="font-mono text-xs text-slate-700 leading-relaxed space-y-2">
            <template v-if="latched">
              <p class="text-[11px] text-slate-600 mb-2">{{ latched.intro }}</p>
              <div
                v-for="step in latched.expertSteps"
                :key="step.label"
                class="rounded-md bg-slate-50 border border-slate-200 px-2.5 py-2"
              >
                <p class="font-bold e-text text-[11px]">{{ step.label }}</p>
                <p class="text-[11px] text-slate-700 mt-0.5">{{ step.detail }}</p>
              </div>
            </template>
            <p v-else class="font-mono text-xs text-slate-400 italic py-8 text-center">
              Step to a DUPN, SWAPN, or EXCHANGE opcode for the expert walkthrough…
            </p>
          </TabPanel>

          <TabPanel class="font-mono text-xs text-slate-700 leading-relaxed">
            <p class="text-[11px] text-slate-600 mb-3">
              Stack depth to copy (17–235, depth 1 = top). Computes the DUPN immediate byte.
            </p>
            <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center mb-3">
              <label for="calc-dupn-depth" class="text-slate-600">Depth</label>
              <input
                id="calc-dupn-depth"
                v-model="calcDupnDepth"
                type="number"
                min="17"
                class="rounded-md border border-slate-200 bg-white px-2 py-1.5 font-mono text-sm"
              />
            </div>
            <div
              class="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 min-h-[3.25rem] flex items-center"
            >
              <p
                v-if="dupnCalculatorResult.ok"
                class="font-mono text-sm font-semibold e-text tracking-wide break-all"
              >
                {{ formatDupnEncodeResult(dupnCalculatorResult) }}
              </p>
              <p v-else class="font-mono text-xs text-red-600">{{ dupnCalculatorResult.error }}</p>
            </div>
          </TabPanel>

          <TabPanel class="font-mono text-xs text-slate-700 leading-relaxed">
            <p class="text-[11px] text-slate-600 mb-3">
              Stack depth to swap with the top (18+, depth 1 = top). Computes the SWAPN immediate
              byte.
            </p>
            <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center mb-3">
              <label for="calc-swapn-depth" class="text-slate-600">Swap depth</label>
              <input
                id="calc-swapn-depth"
                v-model="calcSwapnDepth"
                type="number"
                min="18"
                class="rounded-md border border-slate-200 bg-white px-2 py-1.5 font-mono text-sm"
              />
            </div>
            <div
              class="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 min-h-[3.25rem] flex items-center"
            >
              <p
                v-if="swapnCalculatorResult.ok"
                class="font-mono text-sm font-semibold e-text tracking-wide break-all"
              >
                {{ formatSwapnEncodeResult(swapnCalculatorResult) }}
              </p>
              <p v-else class="font-mono text-xs text-red-600">{{ swapnCalculatorResult.error }}</p>
            </div>
          </TabPanel>

          <TabPanel class="font-mono text-xs text-slate-700 leading-relaxed">
            <p class="text-[11px] text-slate-600 mb-3">
              Two stack depths (1 = top) to swap with each other. Computes the EXCHANGE immediate
              byte.
            </p>
            <div class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 items-center mb-3">
              <label for="calc-exchange-depth-a" class="text-slate-600">Depth A</label>
              <input
                id="calc-exchange-depth-a"
                v-model="calcExchangeDepthA"
                type="number"
                min="2"
                class="rounded-md border border-slate-200 bg-white px-2 py-1.5 font-mono text-sm"
              />
              <label for="calc-exchange-depth-b" class="text-slate-600">Depth B</label>
              <input
                id="calc-exchange-depth-b"
                v-model="calcExchangeDepthB"
                type="number"
                min="2"
                class="rounded-md border border-slate-200 bg-white px-2 py-1.5 font-mono text-sm"
              />
            </div>
            <div
              class="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 min-h-[3.25rem] flex items-center"
            >
              <p
                v-if="exchangeCalculatorResult.ok"
                class="font-mono text-sm font-semibold e-text tracking-wide break-all"
              >
                {{ formatExchangeEncodeResult(exchangeCalculatorResult) }}
              </p>
              <p v-else class="font-mono text-xs text-red-600">
                {{ exchangeCalculatorResult.error }}
              </p>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  </div>
</template>
