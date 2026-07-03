<script setup lang="ts">
import { computed, nextTick, provide, ref, watch } from 'vue'
import type { EVM } from '@ethereumjs/evm'
import { bytesToHex } from '@ethereumjs/util'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import HexDataInputUIC from '@/eComponents/ui/HexDataInputUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import type { Examples } from '@/explorations/REGISTRY'
import type { Exploration } from '@/explorations/REGISTRY'
import { TOPICS } from '@/explorations/TOPICS'

import { BYTECODE_STEPPER_CONTEXT } from './bytecodeStepperContext'
import BytecodeStepperResultEC from './BytecodeStepperResultEC.vue'
import { explainInstruction } from './opcodeExplain'
import { depthFromIndex } from './stackDepth'
import type { BytecodeStepperConfig } from './types'
import { useBytecodeStepper } from './useBytecodeStepper'

const props = defineProps<{
  config: BytecodeStepperConfig
  examples: Examples
  exploration: Exploration
  evm: EVM
  /** Parsed `?example=` query value — pass from exploration MyC when deep-linking. */
  exampleQuery?: string
}>()

const topic = TOPICS[props.exploration.topic]

const {
  bytecodeHex,
  example,
  instructions,
  mode,
  currentSnapshot,
  execResult,
  error,
  validationErrors,
  gasUsed,
  gasLimit,
  maxStackDisplay,
  maxMemoryBytes,
  onBytecodeChange,
  selectExample,
  init,
  runAll,
  stepOnce,
  reset,
} = useBytecodeStepper(props.config, props.evm)

await init(props.examples, props.exampleQuery)

const activePc = computed(() => currentSnapshot.value?.pc ?? -1)

const activeInstruction = computed(() =>
  instructions.value.find((row) => row.pc === activePc.value),
)

provide(BYTECODE_STEPPER_CONTEXT, {
  activeInstruction,
  mode,
  bytecodeHex,
  example,
})

const stepExplanation = computed(() => {
  if (!activeInstruction.value) return undefined
  return explainInstruction(activeInstruction.value)
})

const displayedStack = computed(() => {
  const stack = currentSnapshot.value?.stack ?? []
  return stack.slice(0, maxStackDisplay).map((word, index) => ({
    depth: depthFromIndex(index),
    word,
  }))
})

const stackDepthHint = computed(() => {
  const total = currentSnapshot.value?.stack.length ?? 0
  if (total === 0) return ''
  if (total <= maxStackDisplay) return 'depth 1 = top'
  return `depth 1 = top · showing 1–${maxStackDisplay} of ${total}`
})

const memoryLines = computed(() => {
  const memory = currentSnapshot.value?.memory
  if (!memory || memory.length === 0) return []

  const limit = Math.min(memory.length, maxMemoryBytes)
  const lines: { offset: string; hex: string }[] = []
  for (let offset = 0; offset < limit; offset += 16) {
    const chunk = memory.subarray(offset, Math.min(offset + 16, limit))
    lines.push({
      offset: offset.toString(16).padStart(4, '0'),
      hex:
        bytesToHex(chunk)
          .match(/.{1,2}/g)
          ?.join(' ') ?? '',
    })
  }
  return lines
})

const gasLabel = computed(() => {
  if (gasUsed.value !== undefined) {
    return `Gas used: ${gasUsed.value}`
  }
  if (currentSnapshot.value) {
    return `Gas left: ${currentSnapshot.value.gasLeft}`
  }
  return `Gas limit: ${gasLimit}`
})

const disassemblyPanel = ref<HTMLElement | null>(null)
const stackPanel = ref<HTMLElement | null>(null)
const memoryPanel = ref<HTMLElement | null>(null)

function scrollPanelsToTop() {
  for (const panel of [disassemblyPanel, stackPanel, memoryPanel]) {
    if (panel.value) panel.value.scrollTop = 0
  }
}

function scrollDisassemblyToActivePc() {
  const panel = disassemblyPanel.value
  if (!panel || activePc.value < 0) return
  const row = panel.querySelector(`[data-disassembly-pc="${activePc.value}"]`)
  if (row instanceof HTMLElement) {
    row.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }
}

function scrollStackToRelevantDepths() {
  const panel = stackPanel.value
  if (!panel) return
  const depth = displayedStack.value.length
  const opcode = activeInstruction.value?.opcodeByte
  const opName = activeInstruction.value?.name ?? ''

  if (mode.value === 'finished' || mode.value === 'error' || /^STOP|RETURN|REVERT/i.test(opName)) {
    panel.scrollTop = 0
    return
  }

  // About to run DUPN / SWAPN / EXCHANGE — keep deep stack entries in view (depth 17 area).
  if (opcode === 0xe6 || opcode === 0xe7 || opcode === 0xe8) {
    panel.scrollTop = Math.max(0, panel.scrollHeight - panel.clientHeight)
    return
  }

  if (depth >= 10) {
    panel.scrollTop = Math.max(0, panel.scrollHeight - panel.clientHeight)
    return
  }

  panel.scrollTop = 0
}

function scrollPanelsToExecutionFocus() {
  scrollDisassemblyToActivePc()
  scrollStackToRelevantDepths()
}

watch(activePc, () => {
  void nextTick().then(scrollPanelsToExecutionFocus)
})

watch(
  () => currentSnapshot.value?.stack.length ?? 0,
  () => {
    void nextTick().then(scrollStackToRelevantDepths)
  },
)

async function onExampleChange() {
  await selectExample(props.examples)
  scrollPanelsToTop()
}

async function onBytecodeChangeWrapped() {
  await onBytecodeChange()
  scrollPanelsToTop()
}

async function onReset() {
  await reset()
  scrollPanelsToTop()
}

function formatStackWord(word: bigint): string {
  return `0x${word.toString(16)}`
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <ExplorationC
      asPageTitle
      :explorationId="config.explorationId"
      :exploration="exploration"
      :topic="topic"
    >
      <template #content>
        <div>
          <ExamplesUIC v-model="example" :examples="examples" :change="onExampleChange" />

          <p class="font-mono text-xs font-bold mb-1 text-slate-700">Bytecode</p>
          <HexDataInputUIC v-model="bytecodeHex" rows="4" :formChange="onBytecodeChangeWrapped" />

          <p v-if="validationErrors.length" class="text-red-500 text-xs font-mono mb-2">
            {{ validationErrors.join(', ') }}
          </p>

          <div class="flex flex-wrap gap-2 mb-4 items-center">
            <ActionButtonUIC
              test-id="bytecode-run"
              text="Run"
              tooltip="Execute bytecode to completion"
              :onClick="runAll"
            />
            <ActionButtonUIC
              test-id="bytecode-step"
              text="Step"
              tooltip="Execute one opcode at a time"
              :onClick="stepOnce"
            />
            <ActionButtonUIC
              test-id="bytecode-reset"
              text="Reset"
              tooltip="Clear execution state (keeps bytecode)"
              :onClick="onReset"
            />
            <span class="font-mono text-xs text-slate-600 ml-2">{{ gasLabel }}</span>
            <span v-if="mode !== 'idle'" class="font-mono text-xs text-slate-500">
              ({{ mode }})
            </span>
          </div>

          <p
            v-if="stepExplanation"
            class="font-mono text-xs text-slate-700 mb-4 px-3 py-2.5 bg-purple-50 border border-purple-200 rounded-md leading-relaxed"
          >
            {{ stepExplanation }}
          </p>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <h4 class="font-mono text-xs font-bold mb-2 text-slate-700">Disassembly</h4>
              <div
                ref="disassemblyPanel"
                data-testid="bytecode-disassembly"
                class="font-mono text-xs bg-slate-50 border border-slate-200 rounded-md p-2 max-h-64 overflow-y-auto"
              >
                <div
                  v-if="instructions.length > 0"
                  class="grid grid-cols-[2.5rem_1fr_1fr] gap-x-2 gap-y-0 text-slate-400 border-b border-slate-200 pb-1 mb-1"
                >
                  <span>PC</span>
                  <span>Bytes</span>
                  <span>Opcode</span>
                </div>
                <div
                  v-for="row in instructions"
                  :key="row.pc"
                  :data-disassembly-pc="row.pc"
                  :data-disassembly-active="row.pc === activePc ? 'true' : undefined"
                  :class="[
                    'grid grid-cols-[2.5rem_1fr_1fr] gap-x-2 py-0.5 px-1 rounded items-baseline',
                    row.pc === activePc ? 'bg-purple-100' : '',
                  ]"
                >
                  <span
                    :class="row.pc === activePc ? 'text-purple-700 font-bold' : 'text-slate-500'"
                  >
                    <span v-if="row.pc === activePc" class="text-purple-600">▶</span>
                    <span v-else class="text-transparent">▶</span>
                    {{ row.pc }}
                  </span>
                  <span
                    :class="[
                      'tracking-wide',
                      row.pc === activePc ? 'text-purple-900 font-semibold' : 'text-slate-700',
                    ]"
                  >
                    {{ row.rawBytes }}
                  </span>
                  <span
                    :class="row.pc === activePc ? 'text-purple-900 font-bold' : 'text-slate-800'"
                    :data-disassembly-opcode="row.name ? '' : undefined"
                    :data-disassembly-mnemonic="row.name || undefined"
                  >
                    {{ row.name }}
                  </span>
                </div>
                <p v-if="instructions.length === 0" class="text-slate-400">
                  Enter valid bytecode to disassemble.
                </p>
              </div>
            </div>

            <div>
              <h4 class="font-mono text-xs font-bold mb-2 text-slate-700">
                Stack
                <span v-if="stackDepthHint" class="font-normal text-slate-500">
                  ({{ stackDepthHint }})
                </span>
              </h4>
              <div
                ref="stackPanel"
                data-testid="bytecode-stack"
                class="font-mono text-xs bg-slate-50 border border-slate-200 rounded-md p-2 min-h-[6rem] max-h-40 overflow-y-auto"
              >
                <div
                  v-if="displayedStack.length > 0"
                  class="grid grid-cols-[2.5rem_1fr] gap-x-2 text-slate-400 border-b border-slate-200 pb-1 mb-1"
                >
                  <span>Depth</span>
                  <span>Value</span>
                </div>
                <div
                  v-for="item in displayedStack"
                  :key="item.depth"
                  :data-stack-depth="item.depth"
                  class="grid grid-cols-[2.5rem_1fr] gap-x-2 py-0.5 break-all items-baseline"
                >
                  <span
                    :class="item.depth === 1 ? 'text-purple-600 font-semibold' : 'text-slate-500'"
                  >
                    {{ item.depth }}
                  </span>
                  <span data-stack-value>[{{ formatStackWord(item.word) }}]</span>
                </div>
                <p v-if="displayedStack.length === 0" class="text-slate-400">(empty)</p>
              </div>

              <h4 class="font-mono text-xs font-bold mt-3 mb-2 text-slate-700">
                Memory
                <span v-if="memoryLines.length" class="font-normal text-slate-500">
                  (first {{ maxMemoryBytes }} bytes)
                </span>
              </h4>
              <div
                ref="memoryPanel"
                class="font-mono text-xs bg-slate-50 border border-slate-200 rounded-md p-2 max-h-32 overflow-y-auto"
              >
                <div v-for="line in memoryLines" :key="line.offset" class="py-0.5">
                  {{ line.offset }}: {{ line.hex }}
                </div>
                <p v-if="memoryLines.length === 0" class="text-slate-400">(empty)</p>
              </div>
            </div>
          </div>

          <div class="e-grid-single">
            <BytecodeStepperResultEC :execResult="execResult" :error="error" />
          </div>

          <PoweredByC
            :poweredBy="exploration.poweredBy"
            :creatorName="exploration.creatorName"
            :creatorURL="exploration.creatorURL"
          />
        </div>
      </template>
    </ExplorationC>
    <slot name="below" />
  </div>
</template>
