<script setup lang="ts">
import { ref, type Ref } from 'vue'
import HexDataInputC from '../../components/ui/HexDataInputC.vue'
import { type Examples } from '../../components/lib/general.js'
import blobBase from '../../components/lib/blobs/blob_base.txt?raw'
import blobGnosis from '../../components/lib/blobs/blob_gnosis.txt?raw'
import blobLighter from '../../components/lib/blobs/blob_lighter.txt?raw'
import ExplorationC from '../ExplorationC.vue'
import { INFO } from './info'
import PoweredByC from '../PoweredByC.vue'
import ExamplesC from '../../components/ui/ExamplesC.vue'
import {
  PP_BOX_LAYOUT,
  PP_BOX_TEXT_SMALL,
  PP_BOX_LAYOUT_SINGLE,
  PP_BOX_TABLE_TD,
} from '../../components/lib/layout'
import PPBoxC from '../../components/ui/PPBoxC.vue'
import { trustedSetup } from '@paulmillr/trusted-setups/fast-peerdas.js'
import { KZG as microEthKZG } from 'micro-eth-signer/kzg.js'
import {
  blobsToCellProofs,
  blobsToProofs,
  computeVersionedHash,
  type PrefixedHexString,
} from '@ethereumjs/util'
import ActionButtonC from '../../components/ui/ActionButtonC.vue'
import PPBoxInfoText from '../../components/ui/PPBoxInfoText.vue'
import PPBoxErrorText from '../../components/ui/PPBoxErrorText.vue'

const kzg = new microEthKZG(trustedSetup)

const data: Ref<string> = ref('')
const commitment: Ref<string> = ref('')
const versionedHash: Ref<string> = ref('')
const blobProof: Ref<string> = ref('')
const cellProofs: Ref<string[]> = ref([''])

const errorMsg: Ref<string> = ref('')
const example: Ref<string> = ref('')

const exploration = INFO

/**
 * Examples
 */
const examples: Examples = {
  blob1: {
    title: 'Base L2 Blob | Hash: 0x01ae971... | Block Nr: 23966811 | 2025-12-08',
    values: [blobBase],
  },
  blob2: {
    title: 'Lighter L2 Blob | Hash: 0x015ed6b... | Block Nr: 23967328 | 2025-12-08',
    values: [blobLighter],
  },
  blob3: {
    title: 'Gnosis Chain Blob | Hash: 0x01755da... | Block Nr: 43511951 | 2025-12-06',
    values: [blobGnosis],
  },
}

const poweredBy = exploration.poweredBy

/**
 * Example/URL helper functions
 */
const selectExample = async () => {
  if (example.value === '') {
    return
  }
  data.value = examples[example.value]!.values[0]
  commitment.value = ''
  blobProof.value = ''
  cellProofs.value = ['']

  errorMsg.value = ''
}

/**
 * The data form values changed.
 */
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
/**
 * Initialize the widget either with URL parameters or with a default example.
 */
async function init() {
  example.value = 'blob1'
  await selectExample()
  //await run()
}

await init()
</script>

<template>
  <ExplorationC explorationId="eip-7594" :exploration="exploration">
    <template v-slot:content>
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

        <div :class="PP_BOX_LAYOUT_SINGLE">
          <PPBoxC title="EIP-4844 + EIP-7594" :left="true" class="4844-7594-box">
            <table v-if="commitment !== ''" :class="PP_BOX_TEXT_SMALL">
              <tr>
                <td :class="PP_BOX_TABLE_TD">Commitment</td>
                <td :class="[PP_BOX_TABLE_TD, 'break-all']">{{ commitment }}</td>
              </tr>
              <tr>
                <td :class="PP_BOX_TABLE_TD">Versioned Hash</td>
                <td :class="[PP_BOX_TABLE_TD, 'break-all']">
                  {{ versionedHash }}
                  (<a :href="`https://blobscan.com/blob/${versionedHash}`" target="_blank"
                    >Blobscan</a
                  >)
                </td>
              </tr>
              <tr>
                <td :class="PP_BOX_TABLE_TD">Blob Length</td>
                <td :class="[PP_BOX_TABLE_TD, 'break-all']">{{ data.length }}</td>
              </tr>
            </table>
            <div v-else>
              <PPBoxErrorText v-if="errorMsg !== ''" :text="errorMsg" />
              <PPBoxInfoText v-else text="Press button to compute..." />
            </div>
          </PPBoxC>
        </div>
        <div :class="PP_BOX_LAYOUT">
          <PPBoxC title="EIP-4844 | 1 Blob Proof" :left="true" class="4844-box">
            <p v-if="commitment != ''" :class="PP_BOX_TEXT_SMALL">
              {{ blobProof }}
            </p>
            <PPBoxInfoText v-else text="Same here." />
          </PPBoxC>
          <PPBoxC title="EIP-7594 | 128 Cell Proofs" :left="false" class="7594-box">
            <div v-if="commitment != ''">
              <p
                v-for="(value, index) in cellProofs.slice(0, 4)"
                :class="PP_BOX_TEXT_SMALL"
                :key="index"
              >
                {{ value }}
              </p>
              <p v-if="cellProofs.length > 4" :class="PP_BOX_TEXT_SMALL">...</p>
            </div>
            <PPBoxInfoText v-else text="Same here." />
          </PPBoxC>
        </div>
        <PoweredByC :poweredBy="poweredBy" />
      </div>
    </template>
  </ExplorationC>
</template>
