<script setup lang="ts">
import { getDifficultyColor } from '@/services/trailService'
import type { PublicGroupHike } from '@/types/groupHike'

defineProps<{ hike: PublicGroupHike }>()
</script>

<template>
  <div class="info-card">
    <!-- Date & Time -->
    <div class="info-section">
      <h3 class="section-label">Date & Time</h3>
      <div class="info-row">
        <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <div>
          <p class="info-primary">{{ hike.datetime_formatted }}</p>
          <p v-if="hike.dates.is_multi_day && hike.dates.end_date" class="info-secondary">
            Ends {{ hike.dates.end_date }}{{ hike.dates.end_time ? ' at ' + hike.dates.end_time : '' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Location -->
    <div class="info-section">
      <h3 class="section-label">Location</h3>
      <div class="info-row">
        <svg class="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <div>
          <p class="info-primary">{{ hike.region.name }}</p>
          <p v-if="hike.location.name" class="info-secondary">{{ hike.location.name }}</p>
        </div>
      </div>
    </div>

    <!-- Difficulty -->
    <div class="info-section">
      <h3 class="section-label">Difficulty</h3>
      <span
        class="difficulty-pill"
        :style="{ backgroundColor: getDifficultyColor(hike.difficulty) }"
      >
        {{ hike.difficulty_label || hike.difficulty }}
      </span>
    </div>

    <!-- Trail stats -->
    <div v-if="hike.trail" class="info-section">
      <h3 class="section-label">Trail</h3>
      <div class="stats-row">
        <div class="stat">
          <span class="stat-value">{{ hike.trail.distance_km }} km</span>
          <span class="stat-label">Distance</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <span class="stat-value">{{ hike.trail.duration_display }}</span>
          <span class="stat-label">Duration</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div class="info-section">
      <h3 class="section-label">About This Hike</h3>
      <p class="description">{{ hike.description }}</p>
    </div>

    <!-- Recurring notes -->
    <div v-if="hike.is_recurring && hike.recurring_notes" class="info-section">
      <div class="recurring-note">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="recurring-icon">
          <path d="M17 1l4 4-4 4"/>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
          <path d="M7 23l-4-4 4-4"/>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        </svg>
        <span>{{ hike.recurring_notes }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.section-label {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);
  margin: 0;
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.info-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

.info-primary {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-gray-800);
  margin: 0;
}

.info-secondary {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin: 4px 0 0 0;
}

.difficulty-pill {
  display: inline-block;
  padding: 4px 14px;
  border-radius: var(--radius-full);
  color: white;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  width: fit-content;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: var(--space-5);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
}

.stat-label {
  font-size: var(--text-xs);
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-gray-200);
}

.description {
  font-size: var(--text-base);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  margin: 0;
  white-space: pre-line;
}

.recurring-note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

.recurring-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--color-gray-400);
  margin-top: 1px;
}
</style>
