<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  regions: { slug: string; name: string; trails_count: number }[]
  modelValue: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const selected = computed(() => props.modelValue ? props.modelValue.split(',') : [])

function toggle(slug: string) {
  const next = selected.value.includes(slug)
    ? selected.value.filter((s) => s !== slug)
    : [...selected.value, slug]
  emit('update:modelValue', next.join(','))
}
</script>

<template>
  <div class="region-list">
    <label v-for="region in regions" :key="region.slug" class="region-option">
      <input
        type="checkbox"
        :value="region.slug"
        :checked="selected.includes(region.slug)"
        @change="toggle(region.slug)"
      />
      <span class="region-name">{{ region.name }}</span>
      <span class="region-count">{{ region.trails_count }}</span>
    </label>
  </div>
</template>

<style scoped>
.region-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 180px;
  overflow-y: auto;
}

.region-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 4px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  color: var(--color-gray-700);
}

.region-option:hover {
  background: var(--color-bg-secondary);
}

.region-option input[type='checkbox'] {
  accent-color: var(--color-primary);
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  cursor: pointer;
}

.region-name {
  flex: 1;
}

.region-count {
  font-size: 11px;
  color: var(--color-gray-400);
}
</style>
