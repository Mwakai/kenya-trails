<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getDifficultyColor } from '@/services/trailService'
import type { PublicGroupHikeCard } from '@/types/groupHike'

const props = defineProps<{
  hike: PublicGroupHikeCard
  featured?: boolean
}>()

const organizerName = computed(
  () => props.hike.company?.name ?? props.hike.organizer_name ?? 'Organizer',
)

const organizerInitial = computed(() => organizerName.value.charAt(0).toUpperCase())

const spotsPercent = computed(() => {
  const { max_participants, spots_remaining } = props.hike.capacity
  if (!max_participants || spots_remaining == null) return null
  return (spots_remaining / max_participants) * 100
})

const spotsColor = computed(() => {
  const pct = spotsPercent.value
  if (pct == null) return ''
  if (pct > 50) return 'spots--green'
  if (pct > 20) return 'spots--amber'
  return 'spots--red'
})

const fallbackGradient = 'linear-gradient(135deg, #064e3b 0%, #10b981 60%, #6ee7b7 100%)'
</script>

<template>
  <div class="hike-card" :class="{ 'hike-card--featured': featured, 'hike-card--cancelled': hike.is_cancelled }">
    <!-- Image -->
    <div class="card-image" :class="{ 'card-image--featured': featured }">
      <img
        v-if="hike.featured_image"
        :src="featured ? hike.featured_image.medium : hike.featured_image.thumbnail"
        :alt="hike.title"
        class="card-img"
        loading="lazy"
      />
      <div v-else class="card-img-fallback" :style="{ background: fallbackGradient }"></div>

      <!-- Cancelled ribbon -->
      <div v-if="hike.is_cancelled" class="cancelled-ribbon">Cancelled</div>

      <!-- Multi-day badge -->
      <div v-if="hike.dates.is_multi_day" class="multi-day-badge">Multi-day</div>

      <!-- Featured badge -->
      <div v-if="hike.is_featured && !featured" class="featured-badge">Featured</div>
    </div>

    <!-- Body -->
    <div class="card-body">
      <!-- Organizer row -->
      <div class="organizer-row">
        <div class="org-info">
          <img
            v-if="hike.company?.logo_thumbnail"
            :src="hike.company.logo_thumbnail"
            :alt="organizerName"
            class="org-logo"
          />
          <div v-else class="org-avatar">{{ organizerInitial }}</div>
          <span class="org-name">{{ organizerName }}</span>
          <span v-if="hike.company?.is_verified" class="verified-check" title="Verified organizer">✓</span>
        </div>
        <span
          class="difficulty-badge"
          :style="{ backgroundColor: getDifficultyColor(hike.difficulty) }"
        >
          {{ hike.difficulty_label || hike.difficulty }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="hike-title">{{ hike.title }}</h3>

      <!-- Date/Time -->
      <div class="meta-row">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span>{{ hike.date_display }} · {{ hike.time_display }}</span>
      </div>

      <!-- Location -->
      <div class="meta-row">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>{{ hike.region.name }}{{ hike.location.name ? ' · ' + hike.location.name : '' }}</span>
      </div>

      <!-- Spots + Price row -->
      <div class="footer-row">
        <span v-if="hike.capacity.spots_remaining != null" class="spots-pill" :class="spotsColor">
          {{ hike.capacity.is_full ? 'Full' : hike.capacity.spots_remaining + ' spots left' }}
        </span>
        <span v-else class="spots-pill spots--open">Open</span>

        <span class="price-label">{{ hike.pricing.formatted }}</span>
      </div>
    </div>

    <!-- Footer CTA -->
    <div class="card-footer">
      <RouterLink
        :to="{ name: 'group-hike-detail', params: { slug: hike.slug } }"
        class="view-btn"
      >
        View Details
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.hike-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

.hike-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.hike-card--cancelled {
  opacity: 0.75;
}

/* Image */
.card-image {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image--featured {
  aspect-ratio: 16 / 8;
}

.card-img,
.card-img-fallback {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cancelled-ribbon {
  position: absolute;
  top: 12px;
  left: -28px;
  background: var(--color-danger);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  padding: 4px 36px;
  transform: rotate(-45deg);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.multi-day-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.65);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  backdrop-filter: blur(4px);
}

.featured-badge {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: var(--color-primary);
  color: white;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  padding: 3px 8px;
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Body */
.card-body {
  flex: 1;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.organizer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
}

.org-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 0;
}

.org-logo {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}

.org-avatar {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.org-name {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  font-weight: var(--font-medium);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.verified-check {
  color: var(--color-primary);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.difficulty-badge {
  padding: 2px 10px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: white;
  white-space: nowrap;
  flex-shrink: 0;
}

.hike-title {
  margin: 0;
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  line-height: var(--leading-tight);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

.meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: var(--color-gray-400);
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: var(--space-2);
}

.spots-pill {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.spots--green {
  background: rgba(16, 185, 129, 0.12);
  color: #065f46;
}

.spots--amber {
  background: rgba(245, 158, 11, 0.12);
  color: #92400e;
}

.spots--red {
  background: rgba(239, 68, 68, 0.12);
  color: #991b1b;
}

.spots--open {
  background: var(--color-bg-secondary);
  color: var(--color-gray-500);
}

.price-label {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
}

/* Footer */
.card-footer {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-gray-100);
}

.view-btn {
  display: block;
  text-align: center;
  padding: var(--space-2) var(--space-4);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  text-decoration: none;
  transition: background var(--duration-fast) var(--ease-out);
}

.view-btn:hover {
  background: var(--color-primary-hover);
}
</style>
