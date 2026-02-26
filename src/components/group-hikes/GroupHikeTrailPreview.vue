<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { getDifficultyColor } from '@/services/trailService'
import type { PublicGroupHike } from '@/types/groupHike'

defineProps<{ trail: NonNullable<PublicGroupHike['trail']> }>()
</script>

<template>
  <div class="trail-preview">
    <h3 class="card-title">Linked Trail</h3>
    <div class="trail-body">
      <div class="trail-main">
        <span class="trail-name">{{ trail.name }}</span>
        <div class="trail-meta">
          <span class="trail-stat">{{ trail.distance_km }} km</span>
          <span class="trail-dot">·</span>
          <span class="trail-stat">{{ trail.duration_display }}</span>
          <span class="trail-dot">·</span>
          <span class="trail-region">{{ trail.region.name }}</span>
        </div>
      </div>
      <div class="trail-right">
        <span
          class="diff-badge"
          :style="{ backgroundColor: getDifficultyColor(trail.difficulty) }"
        >
          {{ trail.difficulty_label || trail.difficulty }}
        </span>
        <RouterLink
          :to="{ name: 'trail-detail', params: { id: trail.slug } }"
          class="view-trail"
        >
          View Trail <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trail-preview {
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

.trail-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.trail-main {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.trail-name {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
}

.trail-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  flex-wrap: wrap;
}

.trail-dot {
  color: var(--color-gray-300);
}

.trail-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-2);
  flex-shrink: 0;
}

.diff-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.view-trail {
  font-size: var(--text-sm);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
}

.view-trail:hover {
  text-decoration: underline;
}
</style>
