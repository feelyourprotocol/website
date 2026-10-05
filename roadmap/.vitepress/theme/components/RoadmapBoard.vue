<script setup lang="ts">
import { computed } from 'vue'

import { ROADMAP_HORIZONS, ROADMAP_TRACKS } from '../../../data/roadmap'
import { roadmapIcon } from '../icons'

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
      <div
        v-for="horizon in ROADMAP_HORIZONS"
        :key="horizon.id"
        class="fyp-roadmap__horizon"
        :class="`fyp-roadmap__horizon--${horizon.id}`"
      >
        <component
          :is="roadmapIcon(horizon.icon)"
          v-if="roadmapIcon(horizon.icon)"
          class="fyp-roadmap__horizon-icon"
          aria-hidden="true"
        />
        <span>{{ horizon.label }}</span>
      </div>

      <template v-for="track in tracks" :key="track.id">
        <div class="fyp-roadmap__track-label" :style="{ '--track-accent': track.accent }">
          <component
            :is="roadmapIcon(track.icon)"
            v-if="roadmapIcon(track.icon)"
            class="fyp-roadmap__track-icon"
            aria-hidden="true"
          />
          <span>{{ track.label }}</span>
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
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
