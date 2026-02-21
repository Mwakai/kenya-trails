<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { fetchRegions } from '@/services/trailService'
import type { Region } from '@/types/trail'
import type { GroupHikeFilters } from '@/types/groupHike'

const props = defineProps<{
  modelValue: GroupHikeFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GroupHikeFilters]
  'reset': []
}>()

const regions = ref<Region[]>([])
const datePreset = ref<'all' | 'week' | 'month' | 'custom'>('all')

onMounted(async () => {
  try {
    regions.value = await fetchRegions()
  } catch {
    regions.value = []
  }
})

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'hard', label: 'Hard' },
  { value: 'extreme', label: 'Extreme' },
]

let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    update('search', value)
  }, 300)
}

function update(key: keyof GroupHikeFilters, value: string | boolean | null | number) {
  emit('update:modelValue', { ...props.modelValue, [key]: value, page: 1 })
}

function applyDatePreset(preset: typeof datePreset.value) {
  datePreset.value = preset
  if (preset === 'all') {
    update('date_from', '')
    setTimeout(() => update('date_to', ''), 0)
    emit('update:modelValue', { ...props.modelValue, date_from: '', date_to: '', page: 1 })
  } else if (preset === 'week') {
    const today = new Date()
    const end = new Date(today)
    end.setDate(today.getDate() + 7)
    emit('update:modelValue', {
      ...props.modelValue,
      date_from: toDateStr(today),
      date_to: toDateStr(end),
      page: 1,
    })
  } else if (preset === 'month') {
    const today = new Date()
    const end = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
    emit('update:modelValue', {
      ...props.modelValue,
      date_from: toDateStr(today),
      date_to: toDateStr(end),
      page: 1,
    })
  }
}

function toDateStr(d: Date): string {
  return d.toISOString().split('T')[0] ?? ''
}

const showCustomDates = computed(() => datePreset.value === 'custom')

function onReset() {
  datePreset.value = 'all'
  emit('reset')
}

function onFreeChange(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  update('is_free', checked ? true : null)
}
</script>

<template>
  <div class="filters-bar">
    <!-- Search -->
    <div class="filter-group filter-group--search">
      <input
        type="text"
        class="filter-input"
        placeholder="Search hikes..."
        :value="modelValue.search"
        @input="onSearchInput"
      />
    </div>

    <!-- Region -->
    <div class="filter-group">
      <select
        class="filter-select"
        :value="modelValue.region"
        @change="update('region', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">All Regions</option>
        <option v-for="r in regions" :key="r.slug" :value="r.slug">{{ r.name }}</option>
      </select>
    </div>

    <!-- Difficulty -->
    <div class="filter-group">
      <select
        class="filter-select"
        :value="modelValue.difficulty"
        @change="update('difficulty', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">All Levels</option>
        <option v-for="d in difficulties" :key="d.value" :value="d.value">{{ d.label }}</option>
      </select>
    </div>

    <!-- Date preset -->
    <div class="filter-group">
      <select
        class="filter-select"
        :value="datePreset"
        @change="applyDatePreset(($event.target as HTMLSelectElement).value as 'all' | 'week' | 'month' | 'custom')"
      >
        <option value="all">Any Date</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="custom">Custom Range</option>
      </select>
    </div>

    <!-- Custom date range -->
    <template v-if="showCustomDates">
      <div class="filter-group">
        <input
          type="date"
          class="filter-input"
          :value="modelValue.date_from"
          @change="update('date_from', ($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="filter-group">
        <input
          type="date"
          class="filter-input"
          :value="modelValue.date_to"
          @change="update('date_to', ($event.target as HTMLInputElement).value)"
        />
      </div>
    </template>

    <!-- Sort -->
    <div class="filter-group">
      <select
        class="filter-select"
        :value="modelValue.sort"
        @change="update('sort', ($event.target as HTMLSelectElement).value as 'start_date' | 'price')"
      >
        <option value="start_date">Date (Soonest)</option>
        <option value="price">Price (Low → High)</option>
      </select>
    </div>

    <!-- Free only -->
    <label class="free-check">
      <input
        type="checkbox"
        :checked="modelValue.is_free === true"
        @change="onFreeChange"
      />
      Free only
    </label>

    <!-- Clear -->
    <button v-if="modelValue.search || modelValue.region || modelValue.difficulty || modelValue.date_from || modelValue.is_free != null" class="clear-btn" @click="onReset">
      Clear filters
    </button>
  </div>
</template>

<style scoped>
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-6);
}

.filter-group {
  flex: 1;
  min-width: 140px;
}

.filter-group--search {
  flex: 2;
  min-width: 200px;
}

.filter-input,
.filter-select {
  width: 100%;
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-gray-700);
  background: var(--color-bg-secondary);
  box-sizing: border-box;
  height: 38px;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.free-check {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  cursor: pointer;
  white-space: nowrap;
}

.free-check input {
  accent-color: var(--color-primary);
  width: 15px;
  height: 15px;
  cursor: pointer;
}

.clear-btn {
  background: none;
  border: none;
  font-size: var(--text-sm);
  color: var(--color-danger);
  font-weight: var(--font-medium);
  cursor: pointer;
  padding: 0;
  white-space: nowrap;
}

.clear-btn:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .filter-group,
  .filter-group--search {
    min-width: calc(50% - var(--space-3));
    flex: none;
    width: calc(50% - var(--space-3));
  }
}

@media (max-width: 480px) {
  .filter-group,
  .filter-group--search {
    width: 100%;
    min-width: 100%;
  }
}
</style>
