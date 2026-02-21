<script setup lang="ts">
import type { ItineraryDay } from '@/types/trail'

defineProps<{
  day: ItineraryDay
  dayNumber: number
}>()
</script>

<template>
  <div class="day-card">
    <div class="day-header">
      <span class="day-badge">Day {{ dayNumber }}</span>
      <h4 class="day-title">{{ day.title }}</h4>
    </div>

    <p class="day-description">{{ day.description }}</p>

    <div v-if="day.distance_km || day.elevation_gain_m" class="day-stats">
      <span v-if="day.distance_km" class="day-stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18"/><path d="M6 6l12 12"/></svg>
        {{ day.distance_km }} km
      </span>
      <span v-if="day.elevation_gain_m" class="day-stat">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
        +{{ day.elevation_gain_m }}m
      </span>
    </div>

    <div v-if="day.start_point || day.end_point" class="day-route">
      <span v-if="day.start_point" class="route-point">
        <span class="route-dot route-dot--start"></span>
        {{ day.start_point }}
      </span>
      <span v-if="day.start_point && day.end_point" class="route-arrow">&rarr;</span>
      <span v-if="day.end_point" class="route-point">
        <span class="route-dot route-dot--end"></span>
        {{ day.end_point }}
      </span>
    </div>

    <div v-if="day.accommodation" class="day-accommodation">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
      {{ day.accommodation }}
    </div>
  </div>
</template>

<style scoped>
.day-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
}

.day-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.day-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  background: var(--color-primary);
  color: white;
  white-space: nowrap;
}

.day-title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-gray-800);
}

.day-description {
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  margin: 0 0 var(--space-3) 0;
}

.day-stats {
  display: flex;
  gap: var(--space-4);
  margin-bottom: var(--space-3);
}

.day-stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  font-weight: var(--font-medium);
}

.day-route {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
  font-size: var(--text-xs);
  color: var(--color-gray-600);
}

.route-point {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.route-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.route-dot--start {
  background: var(--color-primary);
}

.route-dot--end {
  background: var(--color-danger);
}

.route-arrow {
  color: var(--color-gray-400);
}

.day-accommodation {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  padding: 3px 8px;
  background: var(--color-gray-100);
  border-radius: var(--radius-sm);
}
</style>
