<script setup lang="ts">
import BreadcrumbNav from '@/components/BreadcrumbNav.vue'
import { getBreadcrumbsForPath } from '@/libs/pageSeo'

const breadcrumbs = getBreadcrumbsForPath('/imprint')
</script>

<template>
  <main>
    <BreadcrumbNav :items="breadcrumbs" />
    <h1 class="sr-only">Imprint</h1>
    <div class="grid grid-cols-1 mb-3">
      <p class="text-right text-3xl tracking-widest text-slate-600">
        <span class="text-purple-500">◆</span>
        <span class="ml-2">IMPRINT</span>
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <div
        class="bg-slate-800 text-white bg-clip-border p-6 rounded-xl font-mono text-xs border-l-3 border-purple-500 neon-glow-permanent"
      >
        <h3 class="font-bold text-lg">ACKNOWLEDGEMENTS ❤️</h3>

        <p class="mt-2 text-slate-300">
          This platform is built with the following open source tools:
        </p>

        <ul class="mt-4 text-slate-300 space-y-1.5">
          <li>
            <a
              href="https://vuejs.org/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Vue.js</a
            >
            — UI framework
          </li>
          <li>
            <a
              href="https://vite.dev/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Vite</a
            >
            — build tooling
          </li>
          <li>
            <a
              href="https://tailwindcss.com/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Tailwind CSS</a
            >
            — styling
          </li>
          <li>
            <a
              href="https://vitepress.dev/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >VitePress</a
            >
            — documentation
          </li>
          <li>
            <a
              href="https://vitest.dev/"
              target="_blank"
              rel="noopener"
              class="underline text-white hover:text-slate-100"
              >Vitest</a
            >
            — unit testing
          </li>
        </ul>

        <p class="mt-6 text-slate-300">
          Ethereum libraries used by individual explorations are credited inline via the
          <span class="text-white">⚡</span> icon on each widget.
        </p>
      </div>

      <div class="border-slate-300 border-2 bg-clip-border p-6 rounded-xl text-xs font-mono">
        <h3 class="font-bold text-lg text-slate-800">ABOUT 👋</h3>

        <p class="mt-4">
          Feel Your Protocol is initiated and maintained by Holger Drewes as part of the broader
          Ethereum open source ecosystem work around the
          <a
            href="https://github.com/ethereumjs/ethereumjs-monorepo"
            target="_blank"
            rel="noopener"
            class="underline hover:text-slate-600"
            >EthereumJS</a
          >
          project.
        </p>

        <p class="mt-3">
          For questions, ideas, or collaboration reach out via
          <a
            href="https://x.com/HolgerD77"
            target="_blank"
            rel="noopener"
            class="underline hover:text-slate-600"
            >X/Twitter</a
          >,
          <a
            href="https://github.com/holgerd77"
            target="_blank"
            rel="noopener"
            class="underline hover:text-slate-600"
            >GitHub</a
          >, or Gmail (Holger.Drewes).
        </p>

        <p class="mt-3 text-slate-400">
          Gutenberg Digital Hub coworking<br />
          Taunusstr. 59-61, 55118 Mainz
        </p>

        <div class="mt-10">
          <h3 class="font-bold text-lg text-slate-800">DATA 🐠</h3>

          <p class="mt-3">
            This website is an open source community developer platform and does not collect any
            personal data, use cookies, or employ analytics.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
