<script setup lang="ts">
defineProps<{
  isMultiDay: boolean
  durationDisplay?: string
}>()
</script>

<template>
  <span v-if="isMultiDay" class="multi-day-badge">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
    Multi-day Trek
    <template v-if="durationDisplay"> &middot; {{ durationDisplay }}</template>
  </span>
</template>

<style scoped>
.multi-day-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  background: rgba(0, 0, 0, 0.55);
  color: white;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
</style>
