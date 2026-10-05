<script setup lang="ts">
import { TIMELINE_GROUPS, formatTimelineDate } from '../../../data/timeline'
import { roadmapIcon } from '../icons'
</script>

<template>
  <div class="fyp-timeline">
    <section v-for="group in TIMELINE_GROUPS" :key="group.id" class="fyp-timeline__group">
      <div class="fyp-timeline__quarter">{{ group.label }}</div>
      <div class="fyp-timeline__events" role="list">
        <div
          v-for="event in group.events"
          :key="event.id"
          class="fyp-timeline__event"
          :class="{ 'fyp-timeline__event--ahead': !event.done }"
          role="listitem"
        >
          <span class="fyp-timeline__mark" aria-hidden="true">
            <component
              :is="roadmapIcon(event.icon)"
              v-if="roadmapIcon(event.icon)"
              class="fyp-timeline__glyph"
            />
          </span>
          <div class="fyp-timeline__copy">
            <span class="fyp-timeline__date">{{ formatTimelineDate(event.date) }}</span>
            <span class="fyp-timeline__label">{{ event.label }}</span>
            <p v-if="event.note" class="fyp-timeline__note">{{ event.note }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
