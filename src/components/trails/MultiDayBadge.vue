<script setup lang="ts">
defineProps<{
  isMultiDay: boolean
  durationDisplay?: string
}>()
</script>

<template>
  <span v-if="isMultiDay" class="multi-day-badge">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
    Multi-day Trek
    <template v-if="durationDisplay"> &middot; {{ durationDisplay }}</template>
  </span>
</template>

<style scoped>
.multi-day-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  background: rgba(99, 102, 241, 0.15);
  color: #4f46e5;
}
</style>
