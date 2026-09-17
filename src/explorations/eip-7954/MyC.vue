<script setup lang="ts">
import { computed, ref } from 'vue'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import WidgetChromeUIC from '@/eComponents/ui/WidgetChromeUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'
import { resolveInitialExample } from '@/libs/exampleFromQuery'
import { useExplorationExampleQuery } from '@/libs/useExplorationExampleQuery'

import DeploymentResultView from './DeploymentResultView.vue'
import { DEFAULT_SCENARIO_ID, examples } from './examples'
import { INFO as exploration } from './info'
import { runScenario, type RunScenarioOutput, warmExecution } from './run'
import { getScenario } from './scenarios'

const topic = TOPICS[exploration.topic]
const exampleQuery = useExplorationExampleQuery()

const example = ref(resolveInitialExample(examples, DEFAULT_SCENARIO_ID, exampleQuery))
const errorMsg = ref('')
const result = ref<RunScenarioOutput | null>(null)
const scenario = computed(() => getScenario(example.value))

function resetRunState() {
  result.value = null
  errorMsg.value = ''
}

async function runDeployment(): Promise<void> {
  errorMsg.value = ''
  try {
    result.value = await runScenario(example.value)
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : String(error)
    result.value = null
  }
}

void warmExecution()
</script>

<template>
  <ExplorationC asPageTitle explorationId="eip-7954" :exploration="exploration" :topic="topic">
    <template #content>
      <WidgetChromeUIC>
        <template #examples>
          <ExamplesUIC
            v-model="example"
            :examples="examples"
            :change="resetRunState"
            select-min-width-class="min-w-[16rem] max-md:min-w-0 justify-between"
          />
        </template>
        <template #run>
          <ActionButtonUIC
            test-id="run-deployment"
            text="Deploy"
            tooltip="Try the same deployment on Fusaka and Glamsterdam"
            :onClick="runDeployment"
          />
        </template>
      </WidgetChromeUIC>

      <DeploymentResultView :scenario="scenario" :result="result" />
      <ResultBoxUIC v-if="errorMsg" title="Error" :left="true" :errorText="errorMsg" />

      <PoweredByC
        :poweredBy="exploration.poweredBy"
        :creatorName="exploration.creatorName"
        :creatorURL="exploration.creatorURL"
      />
    </template>
  </ExplorationC>
</template>
