<script setup lang="ts">
import { ref } from 'vue'
import { useTrailStore } from '@/stores/trailStore'
import RegionFilter from './RegionFilter.vue'
import DurationFilter from './DurationFilter.vue'
import DistanceFilter from './DistanceFilter.vue'

const store = useTrailStore()
const open = ref(false)
</script>

<template>
  <div class="filter-panel" :class="{ 'filter-panel--open': open }">
    <!-- Scrollable content -->
    <div class="panel-content">
      <div class="panel-header">
        <span class="panel-title">
          Filters
          <span v-if="store.activeFilterCount > 0" class="active-badge">
            {{ store.activeFilterCount }}
          </span>
        </span>
        <button v-if="store.hasActiveFilters" class="clear-all" @click="store.clearFilters()">
          Clear all
        </button>
      </div>

      <!-- Search -->
      <div class="filter-section">
        <input
          type="text"
          class="search-input"
          placeholder="Search trails..."
          :value="store.filters.search"
          @input="store.setFilter('search', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <!-- Regions -->
      <div v-if="store.regions.length" class="filter-section">
        <h4 class="section-title">Regions</h4>
        <RegionFilter
          :regions="store.regions"
          :model-value="store.filters.region"
          @update:model-value="store.setFilter('region', $event)"
        />
      </div>

      <!-- Difficulty -->
      <div v-if="store.filterOptions?.difficulties?.length" class="filter-section">
        <h4 class="section-title">Difficulty</h4>
        <select
          class="filter-select"
          :value="store.filters.difficulty"
          @change="store.setFilter('difficulty', ($event.target as HTMLSelectElement).value)"
        >
          <option value="">All levels</option>
          <option
            v-for="level in store.filterOptions.difficulties"
            :key="level.value"
            :value="level.value"
          >
            {{ level.label }} ({{ level.trails_count }})
          </option>
        </select>
      </div>

      <!-- Distance -->
      <div class="filter-section">
        <h4 class="section-title">Distance</h4>
        <DistanceFilter
          :model-value="store.filters.distance_max"
          @update:model-value="store.setFilter('distance_max', $event)"
        />
      </div>

      <!-- Duration -->
      <div class="filter-section">
        <h4 class="section-title">Duration</h4>
        <DurationFilter
          :model-value="store.filters.duration_max"
          @update:model-value="store.setFilter('duration_max', $event)"
        />
      </div>
    </div>

    <!-- Toggle button -->
    <button class="panel-toggle" :title="open ? 'Close filters' : 'Open filters'" @click="open = !open">
      <svg
        class="chevron"
        :class="{ 'chevron--open': open }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
      <span v-if="!open && store.activeFilterCount > 0" class="toggle-badge">
        {{ store.activeFilterCount }}
      </span>
    </button>
  </div>
</template>

<style scoped>
.filter-panel {
  position: absolute;
  top: 16px;
  left: 0;
  z-index: 20;
  display: flex;
  align-items: flex-start;
  transform: translateX(-260px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-panel--open {
  transform: translateX(0);
}

.panel-content {
  width: 260px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  background: var(--color-bg-primary);
  border-radius: 0 0 12px 0;
  padding: 16px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.15);
}

.panel-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 36px;
  padding: 14px 0;
  background: var(--color-bg-primary);
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  box-shadow: 4px 2px 12px rgba(0, 0, 0, 0.12);
  color: var(--color-gray-600);
  transition: color 0.15s ease;
}

.panel-toggle:hover {
  color: var(--color-primary);
}

.chevron {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.chevron--open {
  transform: rotate(180deg);
}

.toggle-badge {
  background: var(--color-primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Panel header */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.panel-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-gray-800);
  display: flex;
  align-items: center;
  gap: 6px;
}

.active-badge {
  background: var(--color-primary);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
}

.clear-all {
  background: none;
  border: none;
  font-size: 12px;
  color: var(--color-danger);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.clear-all:hover {
  text-decoration: underline;
}

/* Sections */
.filter-section {
  margin-bottom: 18px;
}

.filter-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-500);
  margin: 0 0 8px 0;
}

.search-input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--color-gray-700);
  background: var(--color-bg-secondary);
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.filter-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  font-size: 13px;
  color: var(--color-gray-700);
  background: var(--color-bg-secondary);
  cursor: pointer;
  box-sizing: border-box;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}
</style>
