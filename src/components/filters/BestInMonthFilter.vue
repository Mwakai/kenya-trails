<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  months: { month: number; name: string; best_trail_count: number }[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const currentMonth = computed(() => new Date().getMonth() + 1)

const currentMonthName = computed(() => {
  const m = props.months.find((m) => m.month === currentMonth.value)
  return m?.name ?? ''
})
</script>

<template>
  <select
    class="filter-select"
    :value="modelValue"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <option value="">Any Time</option>
    <option :value="String(currentMonth)" class="highlight-option">
      Good Now ({{ currentMonthName }})
    </option>
    <option disabled>---</option>
    <option
      v-for="month in months"
      :key="month.month"
      :value="String(month.month)"
    >
      {{ month.name }} ({{ month.best_trail_count }})
    </option>
  </select>
</template>

<style scoped>
.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-gray-700);
  background: var(--color-bg-primary);
  cursor: pointer;
  min-width: 150px;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}
</style>
