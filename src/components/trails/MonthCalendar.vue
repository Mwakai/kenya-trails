<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  bestMonths: number[]
  currentMonth?: number
}>()

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const current = computed(() => props.currentMonth ?? new Date().getMonth() + 1)
</script>

<template>
  <div class="month-calendar" role="list" aria-label="Best months to visit">
    <div
      v-for="(label, index) in months"
      :key="index"
      class="month-cell"
      :class="{
        'month-cell--best': bestMonths.includes(index + 1),
        'month-cell--current': current === index + 1,
      }"
      role="listitem"
      :aria-label="`${label}${bestMonths.includes(index + 1) ? ' - recommended' : ''}${current === index + 1 ? ' - current month' : ''}`"
    >
      <span class="month-label">{{ label }}</span>
    </div>
  </div>
</template>

<style scoped>
.month-calendar {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 4px;
}

.month-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 2px;
  border-radius: var(--radius-sm);
  background: var(--color-gray-100);
  transition: background var(--duration-fast) var(--ease-out);
}

.month-cell--best {
  background: rgba(16, 185, 129, 0.2);
}

.month-cell--best .month-label {
  color: #059669;
  font-weight: var(--font-semibold);
}

.month-cell--current {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.month-label {
  font-size: 11px;
  color: var(--color-gray-500);
  user-select: none;
}

@media (max-width: 480px) {
  .month-calendar {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
