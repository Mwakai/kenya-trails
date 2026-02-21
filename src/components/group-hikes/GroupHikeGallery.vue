<script setup lang="ts">
import { ref, computed } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import type { PublicGroupHike } from '@/types/groupHike'

const props = defineProps<{ hike: PublicGroupHike }>()

const lightboxVisible = ref(false)
const lightboxIndex = ref(0)

const MAX_VISIBLE = 6

const visibleItems = computed(() => props.hike.gallery.slice(0, MAX_VISIBLE))
const extraCount = computed(() => Math.max(0, props.hike.gallery.length - MAX_VISIBLE))

const lightboxImgs = computed(() =>
  props.hike.gallery.map((g) => ({
    src: g.urls.large,
    title: g.caption ?? '',
  })),
)

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxVisible.value = true
}
</script>

<template>
  <div v-if="hike.gallery.length" class="gallery-section">
    <h3 class="gallery-title">Gallery</h3>
    <div class="gallery-grid">
      <button
        v-for="(item, index) in visibleItems"
        :key="item.id"
        class="gallery-item"
        :class="{ 'gallery-item--more': index === MAX_VISIBLE - 1 && extraCount > 0 }"
        @click="openLightbox(index)"
      >
        <img :src="item.urls.medium" :alt="item.caption ?? 'Gallery image'" class="gallery-img" loading="lazy" />
        <div v-if="index === MAX_VISIBLE - 1 && extraCount > 0" class="more-overlay">
          +{{ extraCount }} more
        </div>
      </button>
    </div>

    <VueEasyLightbox
      :visible="lightboxVisible"
      :imgs="lightboxImgs"
      :index="lightboxIndex"
      @hide="lightboxVisible = false"
    />
  </div>
</template>

<style scoped>
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.gallery-title {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);
  margin: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}

.gallery-item {
  position: relative;
  aspect-ratio: 4/3;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-gray-100);
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--duration-normal) var(--ease-out);
}

.gallery-item:hover .gallery-img {
  transform: scale(1.05);
}

.more-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.55);
  color: white;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(2px);
}

@media (max-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
