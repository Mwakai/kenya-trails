<script setup lang="ts">
import { computed } from 'vue'
import type { TrailMapMarker } from '@/types/trail'
import { getDifficultyColor, formatDuration } from '@/services/trailService'

const props = defineProps<{
  trail: TrailMapMarker
  onViewDetail: (slug: string) => void
}>()

const diffColor = computed(() => getDifficultyColor(props.trail.difficulty))
const duration = computed(() => formatDuration(props.trail.duration))
</script>

<template>
  <div class="popup-wrapper" @click="onViewDetail(trail.slug)">
    <div v-if="trail.image_url" class="popup-image">
      <img :src="trail.image_url" :alt="trail.name" />
    </div>
    <div class="popup-body">
      <div class="popup-name">{{ trail.name }}</div>
      <div class="popup-region">{{ trail.region.name }}</div>
      <div class="popup-meta">
        <span class="popup-difficulty" :style="{ background: diffColor }">{{
          trail.difficulty
        }}</span>
        <span class="popup-stat">{{ trail.distance_km }} km</span>
        <span class="popup-stat">{{ duration }}</span>
      </div>
      <!-- <button class="popup-btn" @click="onViewDetail(trail.slug)">View Details</button> -->
    </div>
  </div>
</template>

<style scoped>
.popup-wrapper {
  display: flex;
  flex-direction: row;
  height: 120px;
  width: 280px;
  overflow: hidden;
  cursor: pointer;
}

.popup-image {
  flex-shrink: 0;
  aspect-ratio: 1 / 1;
  max-height: 120px;
  overflow: hidden;
  border-radius: 8px;
}

.popup-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.popup-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding-left: 10px;
  overflow: hidden;
  justify-content: space-between;
}

.popup-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popup-region {
  font-size: 11px;
  color: #6b7280;
}

.popup-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.popup-difficulty {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 10px;
  color: white;
  font-weight: 600;
  white-space: nowrap;
}

.popup-stat {
  font-size: 11px;
  color: #4b5563;
}

.popup-btn {
  width: 100%;
  padding: 5px 8px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: background 150ms cubic-bezier(0.33, 1, 0.68, 1);
}

.popup-btn:hover {
  background: #059669;
}
</style>
