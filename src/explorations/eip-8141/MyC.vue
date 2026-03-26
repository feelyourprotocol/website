<script setup lang="ts">
import { ref } from 'vue'

import ActionButtonUIC from '@/eComponents/ui/ActionButtonUIC.vue'
import ResultBoxUIC from '@/eComponents/ui/resultBox/ResultBoxUIC.vue'
import ExplorationC from '@/explorations/ExplorationC.vue'
import PoweredByC from '@/explorations/PoweredByC.vue'
import { TOPICS } from '@/explorations/TOPICS'

import { type FrameTxResult, runSimpleFrameTx } from './custom/runSimpleFrameTx'
import { INFO as exploration } from './info'

const topic = TOPICS[exploration.topic]

const result = ref<FrameTxResult | null>(null)
const errorMsg = ref('')

async function run() {
  errorMsg.value = ''
  try {
    result.value = await runSimpleFrameTx()
  } catch (e: unknown) {
    errorMsg.value = e instanceof Error ? e.message : String(e)
  }
}

function formatWei(value: string | bigint): string {
  const wei = BigInt(value)
  const eth = Number(wei) / 1e18
  if (eth > 0) return `${wei} wei (${eth.toFixed(6)} ETH)`
  return `${wei} wei`
}
</script>

<template>
  <ExplorationC explorationId="eip-8141" :exploration="exploration" :topic="topic">
    <template #content>
      <div class="mt-3 text-right">
        <ActionButtonUIC
          tooltip="Runs a full EIP-8141 frame transaction in-browser"
          text="RUN FRAME TX"
          :onClick="run"
        />
      </div>

      <div class="e-grid-single">
        <ResultBoxUIC
          title="EIP-8141 Simple Frame Transaction"
          :left="true"
          :error-text="!result && errorMsg !== '' ? errorMsg : undefined"
          :info-text="!result && errorMsg === '' ? 'Press button to execute...' : undefined"
        >
          <table v-if="result" class="e-result-text-sm">
            <tbody>
              <tr>
                <td class="p-3 font-semibold" colspan="2">Transaction</td>
              </tr>
              <tr>
                <td class="p-3">Tx Type</td>
                <td class="p-3 break-all">{{ result.txType }} (Frame Transaction)</td>
              </tr>
              <tr>
                <td class="p-3">Frame Count</td>
                <td class="p-3 break-all">{{ result.frameCount }}</td>
              </tr>
              <tr>
                <td class="p-3">Gas Limit</td>
                <td class="p-3 break-all">{{ result.gasLimit }}</td>
              </tr>
              <tr>
                <td class="p-3">Transfer Value</td>
                <td class="p-3 break-all">{{ result.transferValue }} wei</td>
              </tr>
              <tr>
                <td class="p-3 font-semibold" colspan="2">Execution Result</td>
              </tr>
              <tr>
                <td class="p-3">Total Gas Spent</td>
                <td class="p-3 break-all">{{ result.totalGasSpent }}</td>
              </tr>
              <tr>
                <td class="p-3">Gas Refund</td>
                <td class="p-3 break-all">{{ result.gasRefund }}</td>
              </tr>
            </tbody>
          </table>
        </ResultBoxUIC>
      </div>

      <div v-if="result" class="e-grid-double">
        <ResultBoxUIC title="Sender" :left="true">
          <table class="e-result-text-sm">
            <tbody>
              <tr>
                <td class="p-3">Address</td>
                <td class="p-3 break-all">{{ result.sender }}</td>
              </tr>
              <tr>
                <td class="p-3">Balance Before</td>
                <td class="p-3 break-all">{{ formatWei(result.initialBalance) }}</td>
              </tr>
              <tr>
                <td class="p-3">Balance After</td>
                <td class="p-3 break-all">{{ formatWei(result.senderBalanceAfter) }}</td>
              </tr>
              <tr>
                <td class="p-3">Nonce After</td>
                <td class="p-3 break-all">{{ result.senderNonceAfter }}</td>
              </tr>
            </tbody>
          </table>
        </ResultBoxUIC>
        <ResultBoxUIC title="Recipient" :left="false">
          <table class="e-result-text-sm">
            <tbody>
              <tr>
                <td class="p-3">Address</td>
                <td class="p-3 break-all">{{ result.recipient }}</td>
              </tr>
              <tr>
                <td class="p-3">Balance</td>
                <td class="p-3 break-all">{{ formatWei(result.recipientBalance) }}</td>
              </tr>
            </tbody>
          </table>
        </ResultBoxUIC>
      </div>

      <PoweredByC
        :poweredBy="exploration.poweredBy"
        :creatorName="exploration.creatorName"
        :creatorURL="exploration.creatorURL"
      />
    </template>
  </ExplorationC>
</template>
