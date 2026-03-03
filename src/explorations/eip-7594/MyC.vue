<script setup lang="ts">
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import { ref } from 'vue'
import {
  blobsToCellProofs,
  blobsToProofs,
  computeVersionedHash,
  type PrefixedHexString,
} from '@ethereumjs/util'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'

import ActionButtonC from '@/components/ui/ActionButtonC.vue'
import ExamplesC from '@/components/ui/ExamplesC.vue'
import HexDataInputC from '@/components/ui/HexDataInputC.vue'
import PPBoxC from '@/components/ui/PPBoxC.vue'
import PPBoxErrorText from '@/components/ui/PPBoxErrorText.vue'
import PPBoxInfoText from '@/components/ui/PPBoxInfoText.vue'
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
const cellProofs = ref([''])

const errorMsg = ref('')
const example = ref('')

const topic = TOPICS[exploration.topic]

async function selectExample() {
  if (example.value === '') {
    return
  }
  data.value = examples[example.value]!.values[0]
  commitment.value = ''
  blobProof.value = ''
  cellProofs.value = ['']

  errorMsg.value = ''
}

async function onDataInputFormChange() {
  example.value = ''
  errorMsg.value = ''

  commitment.value = ''
  blobProof.value = ''
  cellProofs.value = ['']
}

async function run() {
  try {
    commitment.value = kzg.blobToKzgCommitment(data.value)
    const blobCommitmentVersion = 0x01
    versionedHash.value = computeVersionedHash(
      commitment.value as PrefixedHexString,
      blobCommitmentVersion,
    )
    blobProof.value = blobsToProofs(
      kzg,
      [`0x${data.value}`],
      [commitment.value as PrefixedHexString],
    )![0]
    cellProofs.value = blobsToCellProofs(kzg, [`0x${data.value}`])
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
        <ActionButtonC
          tooltip="This is a bit slow (> 10 seconds)"
          text="COMMIT/PROOF/RUN"
          :onClick="run"
          class="run-button"
        />
      </div>
      <div>
        <ExamplesC v-model="example" :examples="examples" :change="selectExample" />
        <HexDataInputC v-model="data" rows="6" :formChange="onDataInputFormChange" />

        <div class="e-grid-single">
          <PPBoxC title="EIP-4844 + EIP-7594" :left="true" class="4844-7594-box">
            <table v-if="commitment !== ''" class="e-result-text-sm">
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
            <div v-else>
              <PPBoxErrorText v-if="errorMsg !== ''" :text="errorMsg" />
              <PPBoxInfoText v-else text="Press button to compute..." />
            </div>
          </PPBoxC>
        </div>
        <div class="e-grid-double">
          <PPBoxC title="EIP-4844 | 1 Blob Proof" :left="true" class="4844-box">
            <p v-if="commitment !== ''" class="e-result-text-sm">
              {{ blobProof }}
            </p>
            <PPBoxInfoText v-else text="Same here." />
          </PPBoxC>
          <PPBoxC title="EIP-7594 | 128 Cell Proofs" :left="false" class="7594-box">
            <div v-if="commitment !== ''">
              <p
                v-for="(value, index) in cellProofs.slice(0, 4)"
                class="e-result-text-sm"
                :key="index"
              >
                {{ value }}
              </p>
              <p v-if="cellProofs.length > 4" class="e-result-text-sm">...</p>
            </div>
            <PPBoxInfoText v-else text="Same here." />
          </PPBoxC>
        </div>
        <PoweredByC :poweredBy="exploration.poweredBy" />
      </div>
    </template>
  </ExplorationC>
</template>
