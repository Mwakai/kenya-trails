<script setup lang="ts">
import { computed } from 'vue'
import type { PublicGroupHike } from '@/types/groupHike'

const props = defineProps<{ hike: PublicGroupHike }>()

const mapsUrl = computed(() => {
  const { latitude, longitude } = props.hike.location
  if (!latitude || !longitude) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
})
</script>

<template>
  <div v-if="hike.meeting_point || mapsUrl" class="meeting-card">
    <h3 class="card-title">Meeting Point</h3>

    <p v-if="hike.meeting_point" class="meeting-text">{{ hike.meeting_point }}</p>

    <a v-if="mapsUrl" :href="mapsUrl" target="_blank" rel="noopener noreferrer" class="directions-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dir-icon">
        <polygon points="3 11 22 2 13 21 11 13 3 11"/>
      </svg>
      Get Directions
    </a>
  </div>
</template>

<style scoped>
.meeting-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card-title {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);
  margin: 0;
}

.meeting-text {
  font-size: var(--text-sm);
  color: var(--color-gray-700);
  margin: 0;
  line-height: var(--leading-normal);
}

.directions-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-primary);
  text-decoration: none;
  width: fit-content;
  transition: background var(--duration-fast) var(--ease-out);
}

.directions-btn:hover {
  background: var(--color-primary-light);
}

.dir-icon {
  width: 14px;
  height: 14px;
}
</style>
