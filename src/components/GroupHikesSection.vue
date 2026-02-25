<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useGroupHikeStore } from '@/stores/groupHikeStore'
import GroupHikeCard from '@/components/GroupHikeCard.vue'
import GroupHikeFilters from '@/components/group-hikes/GroupHikeFilters.vue'

const route = useRoute()
const store = useGroupHikeStore()

onMounted(async () => {
  store.syncFiltersFromUrl(route.query as Record<string, string>)
  await Promise.all([store.fetchGroupHikes(), store.fetchFeatured(), store.fetchThisWeek()])
})

function onFiltersUpdate(newFilters: typeof store.filters) {
  Object.assign(store.filters, newFilters)
  store.fetchGroupHikes()
  syncUrl()
}

function syncUrl() {
  // store.syncFiltersToUrl is called internally by setFilter; we trigger via store
  store.setFilter('page', 1)
}
</script>

<template>
  <section class="browse-page">
    <!-- Sticky top bar -->
    <header class="page-topbar">
      <RouterLink to="/" class="back-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Explore Map</span>
      </RouterLink>
      <div class="topbar-brand">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 18 L8 7 L12 13 L15 9 L21 18 Z" />
          <path d="M3 18 H21" />
        </svg>
        <span>Kenya Trails</span>
      </div>
    </header>

    <div class="page-container">
      <!-- Header -->
      <div class="page-header">
        <h1>Upcoming Group Hikes</h1>
        <p>Discover and join organized hikes led by trusted guides and hiking clubs across Kenya</p>
      </div>

      <!-- Featured strip -->
      <div v-if="store.featuredHikes.length" class="hikes-strip">
        <h2 class="strip-title">Featured</h2>
        <div class="strip-scroll">
          <GroupHikeCard
            v-for="hike in store.featuredHikes"
            :key="hike.id"
            :hike="hike"
            :featured="true"
            class="strip-card"
          />
        </div>
      </div>

      <!-- This Week strip -->
      <div v-if="store.thisWeekHikes.length" class="hikes-strip">
        <h2 class="strip-title">This Week</h2>
        <div class="strip-scroll">
          <GroupHikeCard
            v-for="hike in store.thisWeekHikes"
            :key="hike.id"
            :hike="hike"
            class="strip-card"
          />
        </div>
      </div>

      <!-- Divider -->
      <div v-if="store.featuredHikes.length || store.thisWeekHikes.length" class="section-divider">
        <h2 class="strip-title">All Upcoming Hikes</h2>
      </div>

      <!-- Filters -->
      <GroupHikeFilters
        v-model="store.filters"
        @update:model-value="onFiltersUpdate"
        @reset="store.resetFilters()"
      />

      <!-- Loading skeletons -->
      <div v-if="store.isLoading && store.groupHikes.length === 0" class="hikes-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton skeleton-img"></div>
          <div class="skeleton-body">
            <div class="skeleton skeleton-line skeleton-line--short"></div>
            <div class="skeleton skeleton-line"></div>
            <div class="skeleton skeleton-line skeleton-line--medium"></div>
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div v-else-if="store.groupHikes.length" class="hikes-grid">
        <GroupHikeCard v-for="hike in store.groupHikes" :key="hike.id" :hike="hike" />
      </div>

      <!-- Empty state -->
      <div v-else-if="!store.isLoading" class="empty-state">
        <div class="empty-icon">🥾</div>
        <p v-if="store.hasActiveFilters" class="empty-title">No hikes match your filters</p>
        <p v-else class="empty-title">No upcoming hikes at the moment</p>
        <p class="empty-sub">{{ store.hasActiveFilters ? 'Try adjusting or clearing your filters.' : 'Check back soon for new hikes!' }}</p>
        <button v-if="store.hasActiveFilters" class="clear-btn" @click="store.resetFilters()">
          Clear filters
        </button>
      </div>

      <!-- Error state -->
      <div v-if="store.error" class="error-state">
        <p>{{ store.error }}</p>
        <button class="retry-btn" @click="store.fetchGroupHikes()">Retry</button>
      </div>

      <!-- Load more -->
      <div v-if="store.hasMore && !store.isLoading && store.groupHikes.length" class="load-more">
        <button class="load-more-btn" :disabled="store.isLoading" @click="store.loadMore()">
          {{ store.isLoading ? 'Loading...' : 'Load More Hikes' }}
        </button>
        <p class="load-more-count">
          Showing {{ store.groupHikes.length }} of {{ store.pagination.total }} hikes
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.browse-page {
  background: var(--color-bg-secondary);
  min-height: 100%;
  box-sizing: border-box;
}

/* ── Sticky topbar ───────────────────────────────── */
.page-topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-5);
  height: 52px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-gray-200);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  text-decoration: none;
  color: var(--color-gray-600);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  padding: 6px var(--space-3) 6px var(--space-2);
  border-radius: var(--radius-full);
  transition: background-color 0.15s ease, color 0.15s ease;
}

.back-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.back-btn:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-gray-700);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  letter-spacing: -0.01em;
  user-select: none;
}

.topbar-brand svg {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-10) var(--space-6) var(--space-16);
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-10);
}

.page-header h1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  margin: 0 0 var(--space-3) 0;
  line-height: var(--leading-tight);
}

.page-header p {
  font-size: var(--text-base);
  color: var(--color-gray-500);
  margin: 0;
  max-width: 560px;
  margin: 0 auto;
}

/* Strips */
.hikes-strip {
  margin-bottom: var(--space-8);
}

.strip-title {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  margin: 0 0 var(--space-4) 0;
}

.strip-scroll {
  display: flex;
  gap: var(--space-5);
  overflow-x: auto;
  padding-bottom: var(--space-3);
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
}

.strip-scroll::-webkit-scrollbar {
  height: 4px;
}

.strip-scroll::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
}

.strip-card {
  flex: 0 0 320px;
}

.section-divider {
  margin-bottom: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}

/* Grid */
.hikes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}

/* Skeleton */
.skeleton-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.skeleton {
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.skeleton-img {
  aspect-ratio: 16 / 9;
  border-radius: 0;
}

.skeleton-body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton-line {
  height: 14px;
  width: 100%;
}

.skeleton-line--short {
  width: 40%;
}

.skeleton-line--medium {
  width: 65%;
}

/* Empty / Error */
.empty-state {
  text-align: center;
  padding: var(--space-16) 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: var(--space-4);
}

.empty-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-gray-700);
  margin: 0 0 var(--space-2) 0;
}

.empty-sub {
  font-size: var(--text-sm);
  color: var(--color-gray-400);
  margin: 0 0 var(--space-6) 0;
}

.clear-btn {
  padding: var(--space-2) var(--space-6);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  background: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  cursor: pointer;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.05);
}

.error-state {
  text-align: center;
  padding: var(--space-8) 0;
  color: var(--color-danger);
}

.retry-btn {
  margin-top: var(--space-3);
  padding: var(--space-2) var(--space-5);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
}

/* Load more */
.load-more {
  margin-top: var(--space-10);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.load-more-btn {
  padding: var(--space-3) var(--space-8);
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  background: none;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out);
}

.load-more-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.load-more-count {
  font-size: var(--text-sm);
  color: var(--color-gray-400);
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .hikes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-container {
    padding: var(--space-6) var(--space-4) var(--space-10);
  }

  .page-header h1 {
    font-size: var(--text-2xl);
  }

  .hikes-grid {
    grid-template-columns: 1fr;
  }

  .strip-card {
    flex: 0 0 280px;
  }
}
</style>
