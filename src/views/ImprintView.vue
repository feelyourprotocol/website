<script setup lang="ts"></script>

<template>
  <main>
    <div class="grid grid-cols-1 mb-3">
      <p class="text-right text-3xl">
        <span class="ml-3">IMPRINT</span>
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div class="bg-slate-800 text-white bg-clip-border p-6 rounded-xl font-mono text-xs">
        <h3 class="font-bold text-lg">CONTRIBUTIONS 👾</h3>

        <p class="mt-2 text-slate-300">
          Questions? Ideas? Suggestions?<br />
          Reach out!
        </p>
        <p class="mt-5 text-slate-300">This website is open for contributions on GitHub.</p>

        <h3 class="font-bold text-lg mt-8">ACKNOWLEDGEMENTS ❤️</h3>

        <p class="mt-2 text-slate-300">This site uses the following libraries & tools:</p>

        <h4 class="font-bold text-sm mt-5">Ethereum</h4>
        <ul class="mt-2 text-slate-300">
          <li class="m-1">
            <a
              href="https://github.com/ethereumjs/ethereumjs-monorepo"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >EthereumJS</a
            >
          </li>
          <li class="m-1">
            <a
              href="https://paulmillr.com/noble/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Noble Crypto</a
            >
          </li>
        </ul>

        <h4 class="font-bold text-sm mt-5">Tooling</h4>
        <ul class="mt-2 text-slate-300">
          <li class="m-1">
            <a
              href="https://vuejs.org/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Vue.js (+ Vitest/Cypress/ESlint)</a
            >
          </li>
          <li class="m-1">
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Tailwind</a
            >
          </li>
        </ul>

        <h4 class="font-bold text-sm mt-5">Design</h4>
        <ul class="mt-2 text-slate-300">
          <li class="m-1">
            <a
              href="https://www.midjourney.com"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Midjourney (dancers)</a
            >
          </li>
        </ul>
      </div>

      <div class="border-slate-300 border-2 bg-clip-border p-6 rounded-xl text-xs font-mono">
        <h3 class="font-bold text-lg text-slate-800">CONTACT 👋</h3>

        <p class="mt-5">Holger Drewes</p>
        <p class="mt-2">
          Gutenberg Digital Hub coworking<br />
          Taunusstr. 59-61<br />
          55118 Mainz
        </p>
        <p class="mt-4">Contact: Holger.Drewes with Gmail, Twitter or GitHub</p>

        <div class="mt-10">
          <h3 class="font-bold text-lg text-slate-800">DATA 🐠</h3>

          <p class="mt-3">
            This website is a personal/developer project and does not collect any personal data, use
            cookies, or employ analytics.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
