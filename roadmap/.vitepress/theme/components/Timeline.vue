<script setup lang="ts">
import { computed } from 'vue'

import { TIMELINE_EVENTS, TIMELINE_PHASES } from '../../../data/timeline'

/** Group events under their phase, preserving source order. */
const phases = computed(() =>
  TIMELINE_PHASES.map((phase) => ({
    ...phase,
    events: TIMELINE_EVENTS.filter((event) => event.phase === phase.id),
  })),
)
</script>

<template>
  <div class="fyp-timeline">
    <div class="fyp-timeline__track">
      <div
        v-for="phase in phases"
        :key="phase.id"
        class="fyp-timeline__phase"
        :style="{ '--phase-color': phase.color }"
      >
        <div class="fyp-timeline__phase-label">{{ phase.label }}</div>
        <div class="fyp-timeline__phase-range">{{ phase.range }}</div>
        <div class="fyp-timeline__bar" />
        <div class="fyp-timeline__events">
          <div
            v-for="event in phase.events"
            :key="event.date + event.label"
            class="fyp-timeline__event"
            :class="{ 'fyp-timeline__event--done': event.done }"
          >
            <span class="fyp-timeline__dot" />
            <span>
              <span class="fyp-timeline__event-date">{{ event.date }}</span>
              <strong>{{ event.label }}</strong>
              <template v-if="event.note"> — {{ event.note }}</template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
