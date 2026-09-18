<script setup lang="ts">
import { computed } from 'vue'
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid'

import InfoPanelUIC from '@/eComponents/ui/InfoPanelUIC.vue'
import { eipLabelFromId, formatSpecDate, testReleaseNameFromUrl } from '@/libs/specSnapshot'

import type { Exploration } from './REGISTRY'

const props = defineProps<{
  exploration: Exploration
}>()

const eipLabel = computed(() => eipLabelFromId(props.exploration.id))
const updatedLabel = computed(() =>
  props.exploration.specDate ? formatSpecDate(props.exploration.specDate) : undefined,
)
const testReleaseLabel = computed(() => {
  if (props.exploration.testReleaseName) return props.exploration.testReleaseName
  if (props.exploration.testReleaseUrl) {
    return testReleaseNameFromUrl(props.exploration.testReleaseUrl)
  }
  return undefined
})
const isPinnedCommit = computed(() =>
  /^https:\/\/github\.com\/ethereum\/EIPs\/blob\/[0-9a-f]{40}\//.test(props.exploration.infoURL),
)
</script>

<template>
  <InfoPanelUIC label="Spec" aria-label="Spec snapshot used by this exploration" test-id="spec-pin">
    <p class="text-xs font-bold tracking-tight e-text">Spec snapshot</p>
    <p class="mt-1 text-xs leading-snug text-slate-500">
      <template v-if="isPinnedCommit">
        This widget was built from the following EIP snapshot:
      </template>
      <template v-else>
        This widget uses the live EIP page. A commit pin lands when a test release is aligned.
      </template>
    </p>

    <dl class="mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs">
      <dt class="font-mono text-slate-400">Spec</dt>
      <dd class="min-w-0">
        <a
          :href="exploration.infoURL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex max-w-full items-center gap-1 font-semibold e-text hover:underline"
          data-testid="spec-pin-url"
        >
          <span class="truncate">{{ eipLabel }}</span>
          <ArrowTopRightOnSquareIcon class="size-3.5 shrink-0" aria-hidden="true" />
        </a>
      </dd>

      <dt class="font-mono text-slate-400">Updated</dt>
      <dd class="min-w-0 text-slate-700" data-testid="spec-pin-date">
        {{ updatedLabel ?? 'Not pinned' }}
      </dd>

      <dt class="font-mono text-slate-400">Status</dt>
      <dd class="min-w-0 font-semibold text-slate-700" data-testid="spec-pin-status">
        {{ exploration.specStatus ?? 'Not recorded' }}
      </dd>

      <dt class="font-mono text-slate-400">Tests</dt>
      <dd class="min-w-0" data-testid="spec-pin-tests">
        <a
          v-if="exploration.testReleaseUrl && testReleaseLabel"
          :href="exploration.testReleaseUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex max-w-full items-center gap-1 font-semibold e-text hover:underline"
          data-testid="spec-pin-test-release"
        >
          <span class="break-all">{{ testReleaseLabel }}</span>
          <ArrowTopRightOnSquareIcon class="size-3.5 shrink-0" aria-hidden="true" />
        </a>
        <span v-else class="text-slate-500">No matching test release yet.</span>
      </dd>
    </dl>
  </InfoPanelUIC>
</template>
