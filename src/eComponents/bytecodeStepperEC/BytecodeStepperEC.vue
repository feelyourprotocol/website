<script setup lang="ts">
import { computed } from 'vue'
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

import BytecodeStepperResultEC from './BytecodeStepperResultEC.vue'
import { explainInstruction } from './opcodeExplain'
import type { BytecodeStepperConfig } from './types'
import { useBytecodeStepper } from './useBytecodeStepper'

const props = defineProps<{
  config: BytecodeStepperConfig
  examples: Examples
  exploration: Exploration
  evm: EVM
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

await init(props.examples)

const activePc = computed(() => currentSnapshot.value?.pc ?? -1)

const activeInstruction = computed(() =>
  instructions.value.find((row) => row.pc === activePc.value),
)

const stepExplanation = computed(() => {
  if (!activeInstruction.value) return undefined
  return explainInstruction(activeInstruction.value)
})

const displayedStack = computed(() => {
  const stack = currentSnapshot.value?.stack ?? []
  return stack.slice(0, maxStackDisplay)
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

async function onExampleChange() {
  await selectExample(props.examples)
}

function formatStackWord(word: bigint): string {
  return `0x${word.toString(16)}`
}
</script>

<template>
  <ExplorationC :explorationId="config.explorationId" :exploration="exploration" :topic="topic">
    <template #content>
      <div>
        <ExamplesUIC v-model="example" :examples="examples" :change="onExampleChange" />

        <p class="font-mono text-xs font-bold mb-1 text-slate-700">Bytecode</p>
        <HexDataInputUIC v-model="bytecodeHex" rows="4" :formChange="onBytecodeChange" />

        <p v-if="validationErrors.length" class="text-red-500 text-xs font-mono mb-2">
          {{ validationErrors.join(', ') }}
        </p>

        <div class="flex flex-wrap gap-2 mb-4 items-center">
          <ActionButtonUIC text="Run" tooltip="Execute bytecode to completion" :onClick="runAll" />
          <ActionButtonUIC text="Step" tooltip="Execute one opcode at a time" :onClick="stepOnce" />
          <ActionButtonUIC
            text="Reset"
            tooltip="Clear execution state (keeps bytecode)"
            :onClick="reset"
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
                :class="[
                  'grid grid-cols-[2.5rem_1fr_1fr] gap-x-2 py-0.5 px-1 rounded items-baseline',
                  row.pc === activePc ? 'bg-purple-100' : '',
                ]"
              >
                <span :class="row.pc === activePc ? 'text-purple-700 font-bold' : 'text-slate-500'">
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
                <span :class="row.pc === activePc ? 'text-purple-900 font-bold' : 'text-slate-800'">
                  {{ row.name }}
                </span>
              </div>
              <p v-if="instructions.length === 0" class="text-slate-400">
                Enter valid bytecode to disassemble.
              </p>
            </div>
          </div>

          <div>
            <h4 class="font-mono text-xs font-bold mb-2 text-slate-700">Stack</h4>
            <div
              class="font-mono text-xs bg-slate-50 border border-slate-200 rounded-md p-2 min-h-[6rem] max-h-40 overflow-y-auto"
            >
              <div v-for="(word, i) in displayedStack" :key="i" class="py-0.5 break-all">
                [{{ formatStackWord(word) }}]
                <span v-if="i === 0" class="text-purple-600"> ← top</span>
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
</template>
