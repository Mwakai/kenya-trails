<script setup lang="ts">
import type { PublicGroupHike } from '@/types/groupHike'

defineProps<{ hike: PublicGroupHike }>()
</script>

<template>
  <div class="hero" :class="{ 'hero--cancelled': hike.is_cancelled }">
    <!-- Cancelled banner -->
    <div v-if="hike.is_cancelled" class="cancelled-banner">
      <strong>This hike has been cancelled</strong>
      <span v-if="hike.cancellation_reason"> — {{ hike.cancellation_reason }}</span>
    </div>

    <!-- Image -->
    <div class="hero-image">
      <img
        v-if="hike.featured_image"
        :src="hike.featured_image.large"
        :alt="hike.title"
        class="hero-img"
      />
      <div
        v-else
        class="hero-img-fallback"
        style="background: linear-gradient(135deg, #064e3b 0%, #10b981 60%, #6ee7b7 100%)"
      ></div>

      <!-- Overlays -->
      <div class="hero-overlay"></div>

      <div class="hero-badges">
        <span v-if="hike.dates.is_multi_day" class="badge badge--multi">Multi-day</span>
        <span v-if="hike.is_featured" class="badge badge--featured">Featured</span>
        <span v-if="hike.is_recurring" class="badge badge--recurring">Recurring</span>
      </div>

      <div class="hero-content">
        <p class="hero-date">{{ hike.date_display }}</p>
        <h1 class="hero-title">{{ hike.title }}</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  width: 100%;
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: var(--space-6);
}

.cancelled-banner {
  background: var(--color-danger);
  color: white;
  text-align: center;
  padding: var(--space-3) var(--space-5);
  font-size: var(--text-sm);
}

.hero-image {
  position: relative;
  height: 400px;
}

.hero-img,
.hero-img-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%, transparent 100%);
}

.hero-badges {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-end;
}

.badge {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  padding: 4px 10px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge--multi {
  background: rgba(0,0,0,0.6);
  color: white;
  backdrop-filter: blur(4px);
}

.badge--featured {
  background: var(--color-primary);
  color: white;
}

.badge--recurring {
  background: rgba(99, 102, 241, 0.85);
  color: white;
}

.hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-6);
}

.hero-date {
  font-size: var(--text-sm);
  color: rgba(255,255,255,0.8);
  margin: 0 0 var(--space-2) 0;
  font-weight: var(--font-medium);
}

.hero-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: white;
  margin: 0;
  line-height: var(--leading-tight);
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.hero--cancelled .hero-img,
.hero--cancelled .hero-img-fallback {
  filter: grayscale(60%);
}

@media (max-width: 768px) {
  .hero-image {
    height: 260px;
  }

  .hero-title {
    font-size: var(--text-2xl);
  }
}
</style>
