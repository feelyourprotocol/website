<script setup lang="ts">
import DancerView from './DancerView.vue'
import EIPC from '@/components/eips/EIPC.vue'
import { EIPs, TOPICS } from './lib/structure.js'

const featured = ['eip-7883', 'eip-7594', 'eip-7951']
</script>

<template>
  <main>
    <p class="text-xl md:text-2xl text-slate-500 mb-10">
      Interactive Ethereum Protocol Explorations.
    </p>

    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <RouterLink to="/fusaka" class="block no-underline">
          <DancerView
            nameId="fusaka"
            :title="TOPICS.fusaka.title"
            :introText="TOPICS.fusaka.introText"
          />
        </RouterLink>
      </div>

      <div>
        <div class="bg-blue-900 text-white rounded-xl mb-4 p-5">
          <p class="mb-2 text-xl font-bold">About the Project</p>
          <p class="text-blue-100 text-sm leading-relaxed">
            Feel Your Protocol is a collaborative open-source project providing interactive
            explorations of upcoming Ethereum protocol changes. Widgets are powered by real EVM and
            cryptography libraries running directly in the browser — no backend needed.
          </p>
          <p class="text-blue-100 text-sm leading-relaxed mt-2">
            Want to contribute?
            <a
              href="https://docs.feelyourprotocol.org"
              target="_blank"
              class="underline text-white hover:text-blue-200"
              >Check the docs</a
            >
            or jump straight into the
            <a
              href="https://github.com/feelyourprotocol/website"
              target="_blank"
              class="underline text-white hover:text-blue-200"
              >code on GitHub</a
            >.
          </p>
        </div>

        <div class="text-right mb-3 mt-6">
          <span class="text-sm rounded-lg border-1 p-1">Latest</span>
        </div>

        <RouterLink
          v-for="eipId in featured"
          :key="eipId"
          :to="EIPs[eipId].path"
          class="block mb-2 no-underline"
        >
          <EIPC
            :title="EIPs[eipId].title"
            :eip="EIPs[eipId].num"
            :introText="EIPs[eipId].introText"
          />
        </RouterLink>
      </div>
    </div>
  </main>
</template>
