<script setup lang="ts">
import type { BALJSONBlockAccessList } from '@ethereumjs/util'
import { computed } from 'vue'

import { balPathFor, getGroupByField } from './taxonomy'
import { formatIndexBadge, normalizeSlotKey } from './transitions'

const props = defineProps<{
  balJson: BALJSONBlockAccessList
  activePath: string | null
}>()

const emit = defineEmits<{
  hoverPath: [path: string | null]
}>()

function parseAccessIndex(hex: string): number {
  return Number(BigInt(hex))
}

function nodeClass(path: string, field: Parameters<typeof getGroupByField>[0]): string {
  const group = getGroupByField(field)
  const base = `rounded border px-2 py-1 my-0.5 transition-all ${group.classes.jsonTint}`
  if (props.activePath === path) {
    return `${base} ${group.classes.jsonActive}`
  }
  return base
}

function onEnter(path: string) {
  emit('hoverPath', path)
}

function onLeave() {
  emit('hoverPath', null)
}

const sortedAccounts = computed(() =>
  [...props.balJson].sort((a, b) => a.address.localeCompare(b.address)),
)

function sortedBalanceChanges(account: BALJSONBlockAccessList[number]) {
  return [...account.balanceChanges].sort(
    (a, b) => parseAccessIndex(a.blockAccessIndex) - parseAccessIndex(b.blockAccessIndex),
  )
}

function sortedNonceChanges(account: BALJSONBlockAccessList[number]) {
  return [...account.nonceChanges].sort(
    (a, b) => parseAccessIndex(a.blockAccessIndex) - parseAccessIndex(b.blockAccessIndex),
  )
}

function sortedCodeChanges(account: BALJSONBlockAccessList[number]) {
  return [...account.codeChanges].sort(
    (a, b) => parseAccessIndex(a.blockAccessIndex) - parseAccessIndex(b.blockAccessIndex),
  )
}

function storageChangePaths(account: BALJSONBlockAccessList[number]) {
  const entries: Array<{
    slot: string
    slotKey: string
    changes: typeof account.storageChanges
    pathIndex: number
    change: (typeof account.storageChanges)[number]['slotChanges'][number]
  }> = []
  let pathIndex = 0
  for (const slotEntry of account.storageChanges) {
    const sorted = [...slotEntry.slotChanges].sort(
      (a, b) => parseAccessIndex(a.blockAccessIndex) - parseAccessIndex(b.blockAccessIndex),
    )
    for (const change of sorted) {
      entries.push({
        slot: slotEntry.slot,
        slotKey: normalizeSlotKey(slotEntry.slot),
        changes: account.storageChanges,
        pathIndex,
        change,
      })
      pathIndex++
    }
  }
  return entries
}
</script>

<template>
  <div class="font-mono text-xs leading-relaxed text-left overflow-x-auto p-2">
    <div class="text-slate-500 mb-2">[</div>
    <div v-for="(account, ai) in sortedAccounts" :key="account.address" class="ml-3 mb-3">
      <div class="text-slate-600">{</div>

      <div
        class="ml-3 text-slate-800"
        :data-bal-path="`${account.address.toLowerCase()}/address`"
      >
        "address": "{{ account.address }}"
      </div>

      <div v-if="account.balanceChanges.length > 0" class="ml-3 mt-2">
        <div :class="nodeClass('', 'balanceChanges')" class="inline-block mb-1">
          <span class="font-semibold text-slate-700">"balanceChanges"</span>:
        </div>
        <div class="text-slate-500">[</div>
        <div
          v-for="(change, i) in sortedBalanceChanges(account)"
          :key="`bal-${i}`"
          :class="nodeClass(balPathFor(account.address, 'balanceChanges', String(i)), 'balanceChanges')"
          :data-bal-path="balPathFor(account.address, 'balanceChanges', String(i))"
          class="ml-3 cursor-default"
          @mouseenter="onEnter(balPathFor(account.address, 'balanceChanges', String(i)))"
          @mouseleave="onLeave"
        >
          { "blockAccessIndex": "{{ change.blockAccessIndex }}", "postBalance": "{{
            change.postBalance
          }}" }}{{ i < sortedBalanceChanges(account).length - 1 ? ',' : '' }}
          <span class="text-slate-400 ml-2">({{ formatIndexBadge(change.blockAccessIndex) }})</span>
        </div>
        <div class="text-slate-500">]</div>
      </div>

      <div v-if="account.nonceChanges.length > 0" class="ml-3 mt-2">
        <div :class="nodeClass('', 'nonceChanges')" class="inline-block mb-1">
          <span class="font-semibold text-slate-700">"nonceChanges"</span>:
        </div>
        <div class="text-slate-500">[</div>
        <div
          v-for="(change, i) in sortedNonceChanges(account)"
          :key="`nonce-${i}`"
          :class="nodeClass(balPathFor(account.address, 'nonceChanges', String(i)), 'nonceChanges')"
          :data-bal-path="balPathFor(account.address, 'nonceChanges', String(i))"
          class="ml-3 cursor-default"
          @mouseenter="onEnter(balPathFor(account.address, 'nonceChanges', String(i)))"
          @mouseleave="onLeave"
        >
          { "blockAccessIndex": "{{ change.blockAccessIndex }}", "postNonce": "{{ change.postNonce }}"
          }}{{ i < sortedNonceChanges(account).length - 1 ? ',' : '' }}
          <span class="text-slate-400 ml-2">({{ formatIndexBadge(change.blockAccessIndex) }})</span>
        </div>
        <div class="text-slate-500">]</div>
      </div>

      <div v-if="account.codeChanges.length > 0" class="ml-3 mt-2">
        <div :class="nodeClass('', 'codeChanges')" class="inline-block mb-1">
          <span class="font-semibold text-slate-700">"codeChanges"</span>:
        </div>
        <div class="text-slate-500">[</div>
        <div
          v-for="(change, i) in sortedCodeChanges(account)"
          :key="`code-${i}`"
          :class="nodeClass(balPathFor(account.address, 'codeChanges', String(i)), 'codeChanges')"
          :data-bal-path="balPathFor(account.address, 'codeChanges', String(i))"
          class="ml-3 cursor-default truncate max-w-full"
          @mouseenter="onEnter(balPathFor(account.address, 'codeChanges', String(i)))"
          @mouseleave="onLeave"
        >
          { "blockAccessIndex": "{{ change.blockAccessIndex }}", "newCode": "<{{
            change.newCode.length / 2 - 1
          }} bytes>" }}{{ i < sortedCodeChanges(account).length - 1 ? ',' : '' }}
          <span class="text-slate-400 ml-2">({{ formatIndexBadge(change.blockAccessIndex) }})</span>
        </div>
        <div class="text-slate-500">]</div>
      </div>

      <div v-if="account.storageChanges.length > 0" class="ml-3 mt-2">
        <div :class="nodeClass('', 'storageChanges')" class="inline-block mb-1">
          <span class="font-semibold text-slate-700">"storageChanges"</span>:
        </div>
        <div class="text-slate-500">[</div>
        <div
          v-for="(entry, i) in storageChangePaths(account)"
          :key="`store-${entry.pathIndex}`"
          :class="
            nodeClass(
              balPathFor(account.address, 'storageChanges', `${entry.slotKey}/${entry.pathIndex}`),
              'storageChanges',
            )
          "
          :data-bal-path="
            balPathFor(account.address, 'storageChanges', `${entry.slotKey}/${entry.pathIndex}`)
          "
          class="ml-3 cursor-default"
          @mouseenter="
            onEnter(
              balPathFor(account.address, 'storageChanges', `${entry.slotKey}/${entry.pathIndex}`),
            )
          "
          @mouseleave="onLeave"
        >
          slot {{ entry.slot }} → {{ entry.change.postValue }}
          <span class="text-slate-400 ml-2">({{ formatIndexBadge(entry.change.blockAccessIndex) }})</span>
        </div>
        <div class="text-slate-500">]</div>
      </div>

      <div v-if="account.storageReads.length > 0" class="ml-3 mt-2">
        <div :class="nodeClass('', 'storageReads')" class="inline-block mb-1">
          <span class="font-semibold text-slate-700">"storageReads"</span>:
        </div>
        <div class="text-slate-500">[</div>
        <div
          v-for="(slot, i) in account.storageReads"
          :key="`read-${i}`"
          :class="
            nodeClass(
              balPathFor(account.address, 'storageReads', normalizeSlotKey(slot)),
              'storageReads',
            )
          "
          :data-bal-path="balPathFor(account.address, 'storageReads', normalizeSlotKey(slot))"
          class="ml-3 cursor-default"
          @mouseenter="onEnter(balPathFor(account.address, 'storageReads', normalizeSlotKey(slot)))"
          @mouseleave="onLeave"
        >
          "{{ slot }}"{{ i < account.storageReads.length - 1 ? ',' : '' }}
        </div>
        <div class="text-slate-500">]</div>
      </div>

      <div class="text-slate-600">{{ ai < sortedAccounts.length - 1 ? '},' : '}' }}</div>
    </div>
    <div class="text-slate-500">]</div>
  </div>
</template>
