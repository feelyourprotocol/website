<script setup lang="ts">
import DancerView from './DancerView.vue'
import { EIPs } from './lib/structure.js'

const latest = ['eip-7951', 'eip-7883']
</script>

<template>
  <main>
    <div class="grid grid-cols-1 mb-6">
      <p class="text-right text-3xl">
        <span class="ml-3">Let's have a dance.</span>
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <div class="mb-3 p-5 text-2xl">
          In-depth explore upcoming Ethereum protocol updates and selected research.
        </div>

        <div class="bg-blue-200 rounded-xl mb-2 p-5">
          <p class="mb-1.5 text-xl font-bold text-blue-900">For the Community.</p>
          <p>Get a feeling where the protocol is headed and help build the future.</p>
        </div>

        <div class="bg-blue-100 rounded-xl mb-2 p-5">
          <p class="mb-1.5 text-xl font-bold text-blue-900">For Builders.</p>
          <p>Explore how updates play with your smart contracts and tools.</p>
        </div>

        <div class="bg-blue-200 rounded-xl mb-2 p-5">
          <p class="mb-1.5 text-xl font-bold text-blue-900">For Testers.</p>
          <p>Everything covered? Get inspiration for new test cases.</p>
        </div>

        <div class="bg-blue-100 rounded-xl mb-2 p-5">
          <p class="mb-1.5 text-xl font-bold text-blue-900">For Researchers.</p>
          <p>This is your EIP? See if things feel as intended.</p>
        </div>
      </div>

      <div>
        <div class="border-0 border-blue-200 rounded-xl p-5">
          <span class="text-lg rounded-lg border-1 p-1.5"> Latest </span>
          <ul id="latest-navi" class="text-xl text-blue-900 p-1.5 mt-3">
            <li v-for="eipId in latest" :key="eipId" class="mb-1">
              <RouterLink :to="EIPs[eipId].path">
                EIP-{{ EIPs[eipId].num }}: {{ EIPs[eipId].title }}
              </RouterLink>
            </li>
          </ul>
        </div>
        <DancerView nameId="fusaka" :hasBorder="false" />
      </div>
    </div>
  </main>
</template>
