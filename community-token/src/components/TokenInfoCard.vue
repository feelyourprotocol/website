<script setup lang="ts">
import { TOKEN_INFO_FIELDS } from '@ct/content/token'
</script>

<template>
  <section id="token-info" class="ct-section-anchor ct-card p-5 md:p-6">
    <div class="mb-4 flex items-baseline justify-between gap-3">
      <h2 class="font-mono text-sm font-bold uppercase tracking-[0.15em] text-slate-600">
        Which Token
      </h2>
      <span
        class="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[0.65rem] text-slate-500"
      >
        reference
      </span>
    </div>

    <dl class="grid gap-3 sm:grid-cols-2">
      <div
        v-for="field in TOKEN_INFO_FIELDS"
        :key="field.label"
        class="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5"
      >
        <dt class="font-mono text-[0.65rem] uppercase tracking-wider text-slate-400">
          {{ field.label }}
        </dt>
        <dd class="mt-1 font-mono text-sm text-slate-700">
          <a
            v-if="field.href"
            :href="field.href"
            target="_blank"
            rel="noopener"
            class="underline decoration-slate-300 underline-offset-2 hover:text-purple-700"
          >
            {{ field.value }}
          </a>
          <span v-else>{{ field.value }}</span>
        </dd>
      </div>
    </dl>
  </section>
</template>
