<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ItineraryDay } from '@/types/trail'
import ItineraryDayCard from './ItineraryDayCard.vue'

const props = defineProps<{
  itinerary: ItineraryDay[]
}>()

const showAll = ref(false)

const visibleDays = computed(() => {
  if (showAll.value || props.itinerary.length <= 2) return props.itinerary
  return props.itinerary.slice(0, 1)
})

const hiddenCount = computed(() => props.itinerary.length - visibleDays.value.length)
</script>

<template>
  <div class="itinerary-timeline">
    <div
      v-for="day in visibleDays"
      :key="day.day"
      class="timeline-item"
    >
      <div class="timeline-line"></div>
      <ItineraryDayCard :day="day" :day-number="day.day" />
    </div>

    <button
      v-if="hiddenCount > 0"
      class="show-all-btn"
      @click="showAll = true"
    >
      Show all {{ itinerary.length }} days
    </button>
  </div>
</template>

<style scoped>
.itinerary-timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  position: relative;
}

.timeline-item {
  position: relative;
  padding-left: var(--space-6);
}

.timeline-line {
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-gray-200);
}

.timeline-item:last-child .timeline-line {
  display: none;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 20px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  z-index: 1;
}

.show-all-btn {
  align-self: center;
  padding: var(--space-2) var(--space-6);
  background: var(--color-bg-secondary);
  color: var(--color-primary);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.show-all-btn:hover {
  background: var(--color-primary-light);
}
</style>
