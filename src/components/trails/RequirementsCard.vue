<script setup lang="ts">
import { computed } from 'vue'
import type { Requirements } from '@/types/trail'

const props = defineProps<{
  requirements: Requirements
}>()

const hasContent = computed(() => {
  return (
    props.requirements.requires_guide ||
    props.requirements.requires_permit ||
    props.requirements.accommodation_types.length > 0
  )
})
</script>

<template>
  <div v-if="hasContent" class="requirements-card">
    <div class="req-grid">
      <div v-if="requirements.requires_guide" class="req-item">
        <div class="req-icon req-icon--required">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
        <div>
          <span class="req-label">Guide Required</span>
        </div>
      </div>

      <div v-if="requirements.requires_permit" class="req-item">
        <div class="req-icon req-icon--required">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <div>
          <span class="req-label">Permit Required</span>
          <span v-if="requirements.permit_info" class="req-info">{{ requirements.permit_info }}</span>
        </div>
      </div>

      <div v-if="requirements.accommodation_types.length > 0" class="req-item">
        <div class="req-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
        </div>
        <div>
          <span class="req-label">Accommodation</span>
          <span class="req-info">{{ requirements.accommodation_types.join(', ') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.requirements-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-5);
}

.req-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.req-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

.req-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--color-gray-200);
  color: var(--color-gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.req-icon--required {
  background: rgba(245, 158, 11, 0.15);
  color: #d97706;
}

.req-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-gray-800);
}

.req-info {
  display: block;
  font-size: var(--text-xs);
  color: var(--color-gray-500);
  margin-top: 2px;
}
</style>
