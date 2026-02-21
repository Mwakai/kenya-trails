<script setup lang="ts">
defineProps<{
  isYearRound: boolean
  isGoodNow: boolean
  bestMonthsDisplay?: string
}>()
</script>

<template>
  <div class="season-indicator">
    <span v-if="isGoodNow" class="badge badge--good">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      Good now
    </span>
    <span v-else-if="isYearRound" class="badge badge--year-round">
      Year-round
    </span>
    <span v-else-if="bestMonthsDisplay" class="badge badge--seasonal">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      Best: {{ bestMonthsDisplay }}
    </span>
  </div>
</template>

<style scoped>
.season-indicator {
  display: inline-flex;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  line-height: 1.4;
}

.badge--good {
  background: rgba(16, 185, 129, 0.15);
  color: #059669;
}

.badge--seasonal {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.badge--year-round {
  background: var(--color-gray-100);
  color: var(--color-gray-500);
}
</style>
