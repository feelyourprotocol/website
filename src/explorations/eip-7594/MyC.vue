<script setup lang="ts">
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { computed, ref } from 'vue'
import {
  blobsToCellProofs,
  blobsToProofs,
  computeVersionedHash,
  type PrefixedHexString,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ExamplesUIC from '@/eComponents/ui/ExamplesUIC.vue'
import HexDataInputUIC from '@/eComponents/ui/HexDataInputUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'

import { examples } from './examples'
import { INFO as exploration } from './info'

const kzg = new microEthKZG(trustedSetup)

const data = ref('')
const commitment = ref('')
const versionedHash = ref('')
const blobProof = ref('')
const cellProofs = ref<string[]>([])

const errorMsg = ref('')
const example = ref('')

const topic = TOPICS[exploration.topic]
const hasResult = computed(() => commitment.value !== '')

function selectExample() {
  if (example.value === '') {
    return
  }
  data.value = examples[example.value]!.values[0]
  commitment.value = ''
  versionedHash.value = ''
  blobProof.value = ''
  cellProofs.value = []

  errorMsg.value = ''
}

function onDataInputFormChange() {
  example.value = ''
  errorMsg.value = ''

  commitment.value = ''
  versionedHash.value = ''
  blobProof.value = ''
  cellProofs.value = []
}

async function run() {
  try {
    const blobHex = `0x${data.value}` as PrefixedHexString
    commitment.value = kzg.blobToKzgCommitment(data.value)
    const blobCommitmentVersion = 0x01
    versionedHash.value = computeVersionedHash(
      commitment.value as PrefixedHexString,
      blobCommitmentVersion,
    )
    blobProof.value = blobsToProofs(
      kzg,
      [blobHex],
      [commitment.value as PrefixedHexString],
    )?.[0] ?? ''
    cellProofs.value = blobsToCellProofs(kzg, [blobHex])
  } catch (error) {
    errorMsg.value = error instanceof Error ? error.message : String(error)
  }
}

async function init() {
  example.value = 'blob1'
  await selectExample()
}

await init()
</script>

<template>
  <ExplorationC explorationId="eip-7594" :exploration="exploration" :topic="topic">
    <template #content>
      <div class="mt-3 text-right">
        <ActionButtonUIC
          tooltip="This is a bit slow (> 10 seconds)"
          text="COMMIT/PROOF/RUN"
          :onClick="run"
          class="run-button"
        />
      </div>
      <div>
        <ExamplesUIC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputUIC v-model="data" rows="6" :formChange="onDataInputFormChange" />

        <div class="e-grid-single">
          <ResultBoxUIC
            title="EIP-4844 + EIP-7594"
            :left="true"
            class="eip-4844-7594-box"
            :error-text="!hasResult && errorMsg !== '' ? errorMsg : undefined"
            :info-text="
              !hasResult && errorMsg === '' ? 'Press button to compute...' : undefined
            "
          >
            <table v-if="hasResult" class="e-result-text-sm">
              <tr>
                <td class="p-3">Commitment</td>
                <td class="p-3 break-all">{{ commitment }}</td>
              </tr>
              <tr>
                <td class="p-3">Versioned Hash</td>
                <td class="p-3 break-all">
                  {{ versionedHash }}
                  (<a :href="`https://blobscan.com/blob/${versionedHash}`" target="_blank"
                    >Blobscan</a
                  >)
                </td>
              </tr>
              <tr>
                <td class="p-3">Blob Length</td>
                <td class="p-3 break-all">{{ data.length }}</td>
              </tr>
            </table>
          </ResultBoxUIC>
        </div>
        <div class="e-grid-double">
          <ResultBoxUIC
            title="EIP-4844 | 1 Blob Proof"
            :left="true"
            class="eip-4844-box"
            :info-text="!hasResult ? 'Same here.' : undefined"
          >
            <p v-if="hasResult" class="e-result-text-sm">
              {{ blobProof }}
            </p>
          </ResultBoxUIC>
          <ResultBoxUIC
            title="EIP-7594 | 128 Cell Proofs"
            :left="false"
            class="eip-7594-box"
            :info-text="!hasResult ? 'Same here.' : undefined"
          >
            <div v-if="hasResult">
              <p
                v-for="(value, index) in cellProofs.slice(0, 4)"
                class="e-result-text-sm"
                :key="index"
              >
                {{ value }}
              </p>
              <p v-if="cellProofs.length > 4" class="e-result-text-sm">...</p>
            </div>
          </ResultBoxUIC>
        </div>
        <PoweredByC :poweredBy="exploration.poweredBy" />
      </div>
    </template>
  </ExplorationC>
</template>
