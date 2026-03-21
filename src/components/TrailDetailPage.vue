<script setup lang="ts">
import { watch, ref, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTrailStore } from '@/stores/trailStore'
import { getDifficultyColor, formatDuration } from '@/services/trailService'
import { getHikesByTrail } from '@/services/groupHikeService'
import SeasonIndicator from '@/components/trails/SeasonIndicator.vue'
import MultiDayBadge from '@/components/trails/MultiDayBadge.vue'
import MonthCalendar from '@/components/trails/MonthCalendar.vue'
import RequirementsCard from '@/components/trails/RequirementsCard.vue'
import ItineraryTimeline from '@/components/trails/ItineraryTimeline.vue'
import GroupHikeCard from '@/components/GroupHikeCard.vue'
import type { PublicGroupHikeCard } from '@/types/groupHike'

const route = useRoute()
const router = useRouter()
const store = useTrailStore()

const miniMapContainer = ref<HTMLElement | null>(null)
let miniMap: maplibregl.Map | null = null
let marker: maplibregl.Marker | null = null

const trailGroupHikes = ref<PublicGroupHikeCard[]>([])
const groupHikesLoading = ref(false)

function initMiniMap() {
  if (!miniMapContainer.value || !store.currentTrail) return

  miniMap = new maplibregl.Map({
    container: miniMapContainer.value,
    style: `https://api.maptiler.com/maps/outdoor-v4/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: store.currentTrail.coordinates,
    zoom: 11,
    interactive: false,
  })

  marker = new maplibregl.Marker({ color: getDifficultyColor(store.currentTrail.difficulty) })
    .setLngLat(store.currentTrail.coordinates)
    .addTo(miniMap)
}

// Load trail when route param changes
watch(
  () => route.params.id,
  (id) => {
    if (id) store.loadTrail(id as string)
  },
  { immediate: true },
)

// Fetch group hikes for this trail when trail slug is known
watch(
  () => store.currentTrail,
  async (trail) => {
    if (!trail) return
    groupHikesLoading.value = true
    try {
      trailGroupHikes.value = await getHikesByTrail(trail.slug)
    } catch {
      trailGroupHikes.value = []
    } finally {
      groupHikesLoading.value = false
    }
  },
)

// Init mini map when container available and trail loaded
watch([miniMapContainer, () => store.currentTrail], ([el, trail]) => {
  if (el && trail && !miniMap) initMiniMap()
})

// Update mini map when trail changes (if already initialized)
watch(
  () => store.currentTrail,
  (trail) => {
    if (!trail || !miniMap) return
    miniMap.setCenter(trail.coordinates)
    if (marker) {
      marker.setLngLat(trail.coordinates)
    }
  },
)

onUnmounted(() => {
  if (miniMap) {
    miniMap.remove()
    miniMap = null
    marker = null
  }
})
</script>

<template>
  <!-- Loading -->
  <div v-if="store.loading" class="loading-state">
    <p>Loading trail...</p>
  </div>

  <!-- Error / Not found -->
  <div v-else-if="store.error || !store.currentTrail" class="not-found">
    <h2>Trail not found</h2>
    <p>{{ store.error || "The trail you're looking for doesn't exist." }}</p>
    <button class="back-btn" @click="router.push({ name: 'map' })">Back to Map</button>
  </div>

  <div v-else class="trail-detail">
    <!-- Hero section -->
    <section
      class="hero"
      :style="{
        background: store.currentTrail.image_url
          ? `url(${store.currentTrail.image_url}) center/cover no-repeat`
          : store.currentTrail.imageGradient,
      }"
    >
      <div v-if="store.currentTrail.image_url" class="hero-overlay"></div>
      <button class="hero-back" @click="router.back()">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back
      </button>
      <div class="hero-content">
        <div class="hero-badges">
          <MultiDayBadge
            :is-multi-day="store.currentTrail.is_multi_day"
            :duration-display="formatDuration(store.currentTrail.duration)"
          />
          <SeasonIndicator
            v-if="store.currentTrail.season"
            :is-year-round="store.currentTrail.season.is_year_round"
            :is-good-now="false"
            :best-months-display="store.currentTrail.season.best_months_display"
          />
        </div>
        <h1 class="hero-title">{{ store.currentTrail.name }}</h1>
        <div class="hero-meta">
          <router-link
            :to="{ name: 'map', query: { region: store.currentTrail.region.slug } }"
            class="hero-region"
          >
            {{ store.currentTrail.region.name }}
          </router-link>
          <span
            class="difficulty-pill"
            :style="{ backgroundColor: getDifficultyColor(store.currentTrail.difficulty) }"
          >
            {{ store.currentTrail.difficulty }}
          </span>
        </div>
      </div>
    </section>

    <!-- Stats bar -->
    <section class="stats-bar">
      <div class="stat">
        <span class="stat-label">Distance</span>
        <span class="stat-value">{{ store.currentTrail.distance_km }} km</span>
      </div>
      <div class="stat">
        <span class="stat-label">Duration</span>
        <span class="stat-value">{{ formatDuration(store.currentTrail.duration) }}</span>
      </div>
      <div class="stat">
        <span class="stat-label">Elevation Gain</span>
        <span class="stat-value">{{ store.currentTrail.elevation_gain_m }}m</span>
      </div>
    </section>

    <!-- Description -->
    <section class="content-section">
      <h2>About this trail</h2>
      <div class="description-text" v-html="store.currentTrail.description"></div>
    </section>

    <!-- Best Time to Visit -->
    <section v-if="store.currentTrail.season" class="content-section">
      <h2>Best Time to Visit</h2>
      <MonthCalendar :best-months="store.currentTrail.season.best_months" />
      <div class="season-info">
        <p v-if="store.currentTrail.season.recommendation" class="season-recommendation">
          {{ store.currentTrail.season.recommendation }}
        </p>
        <p v-if="store.currentTrail.season.notes" class="season-notes">
          {{ store.currentTrail.season.notes }}
        </p>
        <p v-if="store.currentTrail.season.is_year_round" class="season-year-round">
          This trail can be hiked year-round.
        </p>
      </div>
    </section>

    <!-- Requirements & Logistics -->
    <section v-if="store.currentTrail.requirements" class="content-section">
      <h2>Requirements &amp; Logistics</h2>
      <RequirementsCard :requirements="store.currentTrail.requirements" />
    </section>

    <!-- Day-by-Day Itinerary -->
    <section
      v-if="store.currentTrail.itinerary && store.currentTrail.itinerary.length > 0"
      class="content-section"
    >
      <h2>Day-by-Day Itinerary</h2>
      <ItineraryTimeline :itinerary="store.currentTrail.itinerary" />
    </section>

    <!-- Location mini-map -->
    <section class="content-section">
      <h2>Location</h2>
      <p class="location-text">Located in {{ store.currentTrail.region.name }} region</p>
      <div ref="miniMapContainer" class="mini-map"></div>
    </section>

    <!-- Upcoming Group Hikes for this trail -->
    <section class="content-section group-hikes-section">
      <div class="section-header-row">
        <h2>Upcoming Group Hikes</h2>
        <router-link :to="{ name: 'group-hikes' }" class="see-all-link">
          See all
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </router-link>
      </div>

      <div v-if="groupHikesLoading" class="hikes-scroll">
        <div v-for="n in 3" :key="n" class="hike-skeleton">
          <div class="skeleton-img skeleton"></div>
          <div class="skeleton-body">
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line skeleton-line--short"></div>
          </div>
        </div>
      </div>

      <div v-else-if="trailGroupHikes.length" class="hikes-scroll">
        <GroupHikeCard
          v-for="hike in trailGroupHikes"
          :key="hike.id"
          :hike="hike"
          class="hike-scroll-card"
        />
      </div>

      <div v-else class="no-hikes">
        <p>No upcoming group hikes for this trail.</p>
        <router-link :to="{ name: 'group-hikes' }" class="cta-btn">Browse All Hikes</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  color: var(--color-gray-500);
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-16);
  text-align: center;
  color: var(--color-gray-600);
}

.not-found h2 {
  font-size: var(--text-2xl);
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.not-found p {
  margin: 0 0 var(--space-6) 0;
}

.back-btn {
  padding: var(--space-2) var(--space-6);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.back-btn:hover {
  background: var(--color-primary-hover);
}

/* Detail layout */
.trail-detail {
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: var(--space-16);
}

/* Hero */
.hero {
  position: relative;
  padding: var(--space-16) var(--space-6) var(--space-10);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  color: white;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 60%);
  border-radius: inherit;
}

.hero-back {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  z-index: 1;
  transition: background var(--duration-fast) var(--ease-out);
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
}

.hero-back svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.hero-back:hover {
  background: rgba(0, 0, 0, 0.55);
}

.hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.hero-badges {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.hero-title {
  margin: 0;
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.hero-region {
  font-size: var(--text-base);
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.hero-region:hover {
  text-decoration: underline;
}

.difficulty-pill {
  display: inline-block;
  padding: 2px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: white;
}

/* Stats bar */
.stats-bar {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  overflow-x: auto;
}

.stat {
  flex: 1;
  min-width: 0;
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-label {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

/* Content sections */
.content-section {
  padding: 0 var(--space-6) var(--space-6);
}

.content-section h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  margin: var(--space-4) 0 var(--space-3) 0;
}

.description-text {
  font-size: var(--text-base);
  color: var(--color-gray-600);
  line-height: var(--leading-relaxed);
  margin: 0;
}

/* Season info */
.season-info {
  margin-top: var(--space-3);
}

.season-recommendation {
  font-size: var(--text-sm);
  color: var(--color-gray-700);
  font-weight: var(--font-medium);
  margin: 0 0 var(--space-2) 0;
}

.season-notes {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-2) 0;
}

.season-year-round {
  font-size: var(--text-sm);
  color: var(--color-primary-hover);
  font-weight: var(--font-medium);
  margin: 0;
}

/* Location */
.location-text {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-3) 0;
}

.mini-map {
  width: 100%;
  height: 250px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

/* CTA */
.cta-section {
  margin: 0 var(--space-6);
  padding: var(--space-8);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  text-align: center;
}

.cta-section h2 {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  margin: 0 0 var(--space-2) 0;
}

.cta-section p {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-5) 0;
}

.cta-btn {
  display: inline-block;
  padding: var(--space-3) var(--space-8);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: background var(--duration-fast) var(--ease-out);
}

.cta-btn:hover {
  background: var(--color-primary-hover);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-bar {
    flex-wrap: wrap;
  }

  .stat {
    flex: 0 0 calc(50% - var(--space-2));
  }

  .hero-title {
    font-size: var(--text-2xl);
  }
}

@media (max-width: 480px) {
  .stat {
    flex: 0 0 100%;
  }
}

/* Group hikes section */
.group-hikes-section {
  border-top: 1px solid var(--color-gray-200);
  padding-top: var(--space-6);
}

.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.section-header-row h2 {
  margin: 0;
}

.see-all-link {
  font-size: var(--text-sm);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.see-all-link svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.see-all-link:hover {
  text-decoration: underline;
}

.hikes-scroll {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-3);
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
}

.hikes-scroll::-webkit-scrollbar {
  height: 4px;
}

.hikes-scroll::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
}

.hike-scroll-card {
  flex: 0 0 300px;
}

.hike-skeleton {
  flex: 0 0 280px;
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-gray-100) 25%,
    var(--color-gray-50) 50%,
    var(--color-gray-100) 75%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
}

@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.skeleton-img {
  height: 160px;
}

.skeleton-body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton-line {
  height: 13px;
  border-radius: var(--radius-sm);
}

.skeleton-line--short {
  width: 55%;
}

.no-hikes {
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--color-gray-500);
}

.no-hikes p {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--text-sm);
}
</style>
