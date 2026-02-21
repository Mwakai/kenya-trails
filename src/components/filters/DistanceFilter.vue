<script setup lang="ts">
import { computed } from 'vue'

const MAX = 100

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const sliderValue = computed(() => {
  const v = parseInt(props.modelValue)
  return isNaN(v) || !props.modelValue ? MAX : v
})

const fillPercent = computed(() => ((sliderValue.value - 1) / (MAX - 1)) * 100)

const displayLabel = computed(() =>
  sliderValue.value >= MAX ? 'Any distance' : `Up to ${sliderValue.value} km`,
)

function onInput(e: Event) {
  const v = parseInt((e.target as HTMLInputElement).value)
  emit('update:modelValue', v >= MAX ? '' : String(v))
}
</script>

<template>
  <div class="slider-wrap">
    <div class="slider-header">
      <span class="slider-label">{{ displayLabel }}</span>
    </div>
    <input
      type="range"
      min="1"
      :max="MAX"
      step="1"
      :value="sliderValue"
      :style="{ '--fill': fillPercent + '%' }"
      class="slider"
      @input="onInput"
    />
    <div class="slider-bounds">
      <span>1 km</span>
      <span>100 km</span>
    </div>
  </div>
</template>

<style scoped>
.slider-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider-header {
  display: flex;
  justify-content: flex-end;
}

.slider-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  border-radius: 2px;
  background: linear-gradient(
    to right,
    var(--color-primary) 0%,
    var(--color-primary) var(--fill),
    var(--color-gray-200) var(--fill),
    var(--color-gray-200) 100%
  );
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border: none;
  border-radius: 50%;
  background: var(--color-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.slider-bounds {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-gray-400);
}
</style>
