<script setup lang="ts">
import { computed } from 'vue'

import { ROADMAP_HORIZONS, ROADMAP_TRACKS } from '../../../data/roadmap'

const statusLabel: Record<string, string> = {
  'done': 'Done',
  'in-progress': 'In progress',
  'planned': 'Planned',
}

/** Index a track's items by horizon for cell lookup. */
const tracks = computed(() =>
  ROADMAP_TRACKS.map((track) => ({
    ...track,
    byHorizon: Object.fromEntries(
      ROADMAP_HORIZONS.map((h) => [h.id, track.items.filter((i) => i.horizon === h.id)]),
    ),
  })),
)
</script>

<template>
  <div class="fyp-roadmap">
    <div class="fyp-roadmap__grid" :style="{ '--horizon-count': ROADMAP_HORIZONS.length }">
      <div class="fyp-roadmap__corner" />
      <div v-for="horizon in ROADMAP_HORIZONS" :key="horizon.id" class="fyp-roadmap__horizon">
        {{ horizon.label }}
      </div>

      <template v-for="track in tracks" :key="track.id">
        <div class="fyp-roadmap__track-label">
          <span class="fyp-roadmap__track-swatch" :style="{ '--track-accent': track.accent }" />
          {{ track.label }}
        </div>
        <div
          v-for="horizon in ROADMAP_HORIZONS"
          :key="track.id + horizon.id"
          class="fyp-roadmap__cell"
          :style="{ '--track-accent': track.accent }"
        >
          <div
            v-for="item in track.byHorizon[horizon.id]"
            :key="item.title"
            class="fyp-roadmap__item"
          >
            <div class="fyp-roadmap__item-title">{{ item.title }}</div>
            <div v-if="item.note" class="fyp-roadmap__item-note">{{ item.note }}</div>
            <span class="fyp-roadmap__status" :class="`fyp-roadmap__status--${item.status}`">
              {{ statusLabel[item.status] }}
            </span>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
