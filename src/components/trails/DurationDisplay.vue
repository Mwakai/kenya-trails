<script setup lang="ts">
import type { Duration } from '@/types/trail'
import { formatDuration } from '@/services/trailService'

const props = defineProps<{
  duration: Duration
}>()

const formatted = formatDuration(props.duration)
</script>

<template>
  <span class="duration-display">
    <!-- Clock icon for hours -->
    <svg
      v-if="duration.type === 'hours'"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
    <!-- Calendar icon for days -->
    <svg
      v-else
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
    {{ formatted }}
  </span>
</template>

<style scoped>
.duration-display {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}
</style>
