<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useGroupHikeStore } from '@/stores/groupHikeStore'
import GroupHikeHero from '@/components/group-hikes/GroupHikeHero.vue'
import GroupHikeInfo from '@/components/group-hikes/GroupHikeInfo.vue'
import GroupHikeRegistrationCard from '@/components/group-hikes/GroupHikeRegistrationCard.vue'
import GroupHikeOrganizerCard from '@/components/group-hikes/GroupHikeOrganizerCard.vue'
import GroupHikeMeetingPoint from '@/components/group-hikes/GroupHikeMeetingPoint.vue'
import GroupHikeTrailPreview from '@/components/group-hikes/GroupHikeTrailPreview.vue'
import GroupHikeGallery from '@/components/group-hikes/GroupHikeGallery.vue'
import GroupHikeSimilar from '@/components/group-hikes/GroupHikeSimilar.vue'

const route = useRoute()
const router = useRouter()
const store = useGroupHikeStore()

watch(
  () => route.params.slug,
  (slug) => {
    if (slug) store.fetchGroupHike(slug as string)
  },
  { immediate: true },
)
</script>

<template>
  <div class="detail-page">
    <!-- Loading -->
    <div v-if="store.isLoading" class="detail-container">
      <div class="skeleton-hero skeleton"></div>
      <div class="detail-body">
        <div class="skeleton-block skeleton"></div>
        <div class="skeleton-block skeleton skeleton-block--short"></div>
      </div>
    </div>

    <!-- Error / Not Found -->
    <div v-else-if="store.error || (!store.currentHike && !store.isLoading)" class="error-page">
      <div class="error-content">
        <p class="error-icon">🏔️</p>
        <h2>{{ store.error ? 'Something went wrong' : 'Hike not found' }}</h2>
        <p class="error-sub">{{ store.error ?? 'This group hike does not exist or may have been removed.' }}</p>
        <div class="error-actions">
          <RouterLink :to="{ name: 'group-hikes' }" class="back-btn">
            ← Back to Group Hikes
          </RouterLink>
          <button v-if="store.error" class="retry-btn" @click="store.fetchGroupHike(route.params.slug as string)">
            Retry
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="store.currentHike" class="detail-container">
      <!-- Back nav -->
      <div class="back-nav">
        <button class="back-link" @click="router.back()">
          ← Back
        </button>
        <RouterLink :to="{ name: 'group-hikes' }" class="all-link">
          All Group Hikes
        </RouterLink>
      </div>

      <!-- Hero -->
      <GroupHikeHero :hike="store.currentHike" />

      <!-- Body: left content + right sidebar -->
      <div class="detail-body">
        <!-- Left column -->
        <div class="left-col">
          <GroupHikeInfo :hike="store.currentHike" />
          <GroupHikeOrganizerCard :hike="store.currentHike" />
          <GroupHikeMeetingPoint :hike="store.currentHike" />
          <GroupHikeTrailPreview
            v-if="store.currentHike.trail"
            :trail="store.currentHike.trail"
          />
          <GroupHikeGallery :hike="store.currentHike" />
        </div>

        <!-- Right column (sticky sidebar) -->
        <div class="right-col">
          <div class="sticky-sidebar">
            <GroupHikeRegistrationCard :hike="store.currentHike" />
          </div>
        </div>
      </div>

      <!-- Mobile: bottom bar for registration -->
      <div class="mobile-reg-bar">
        <div class="mobile-reg-content">
          <span class="mobile-price">{{ store.currentHike.pricing.formatted }}</span>
          <a
            v-if="store.currentHike.registration.url && store.currentHike.registration.is_open && !store.currentHike.is_cancelled"
            :href="store.currentHike.registration.url"
            target="_blank"
            rel="noopener noreferrer"
            class="mobile-reg-btn"
          >
            Register Now
          </a>
          <span v-else class="mobile-reg-closed">
            {{ store.currentHike.is_cancelled ? 'Cancelled' : 'Registration Closed' }}
          </span>
        </div>
      </div>

      <!-- Similar hikes -->
      <GroupHikeSimilar :hike="store.currentHike" />
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  background: var(--color-bg-secondary);
  min-height: 100%;
  padding-bottom: var(--space-16);
}

.detail-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: var(--space-6) var(--space-5);
}

/* Back nav */
.back-nav {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.back-link {
  background: none;
  border: none;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-500);
  cursor: pointer;
  padding: 0;
}

.back-link:hover {
  color: var(--color-gray-800);
}

.all-link {
  font-size: var(--text-sm);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-medium);
}

.all-link:hover {
  text-decoration: underline;
}

/* Body layout */
.detail-body {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: var(--space-6);
  align-items: start;
}

.left-col {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-width: 0;
}

.right-col {
  min-width: 0;
}

.sticky-sidebar {
  position: sticky;
  top: var(--space-6);
}

/* Mobile reg bar (hidden on desktop) */
.mobile-reg-bar {
  display: none;
}

/* Skeleton */
.skeleton {
  background: linear-gradient(90deg, var(--color-gray-100) 25%, var(--color-gray-50) 50%, var(--color-gray-100) 75%);
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  border-radius: var(--radius-lg);
}

@keyframes shimmer {
  0% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.skeleton-hero {
  width: 100%;
  height: 400px;
  margin-bottom: var(--space-6);
}

.skeleton-block {
  height: 200px;
  margin-bottom: var(--space-5);
}

.skeleton-block--short {
  height: 120px;
}

/* Error page */
.error-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-10);
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  font-size: 64px;
  margin: 0 0 var(--space-4) 0;
}

.error-content h2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  margin: 0 0 var(--space-3) 0;
}

.error-sub {
  font-size: var(--text-base);
  color: var(--color-gray-500);
  margin: 0 0 var(--space-6) 0;
}

.error-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

.back-btn {
  padding: var(--space-3) var(--space-6);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.retry-btn {
  padding: var(--space-3) var(--space-6);
  background: none;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  color: var(--color-gray-600);
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-body {
    grid-template-columns: 1fr;
  }

  .right-col {
    order: -1;
  }

  .sticky-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .detail-page {
    padding-bottom: 80px;
  }

  .right-col {
    display: none;
  }

  .mobile-reg-bar {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--color-bg-primary);
    border-top: 1px solid var(--color-gray-200);
    padding: var(--space-3) var(--space-5);
    z-index: 30;
    box-shadow: 0 -4px 12px rgba(0,0,0,0.08);
  }

  .mobile-reg-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
    max-width: 600px;
    margin: 0 auto;
  }

  .mobile-price {
    font-size: var(--text-xl);
    font-weight: var(--font-bold);
    color: var(--color-gray-800);
  }

  .mobile-reg-btn {
    padding: var(--space-3) var(--space-6);
    background: var(--color-primary);
    color: white;
    border-radius: var(--radius-md);
    text-decoration: none;
    font-size: var(--text-base);
    font-weight: var(--font-bold);
  }

  .mobile-reg-closed {
    font-size: var(--text-sm);
    color: var(--color-gray-400);
  }

  .skeleton-hero {
    height: 260px;
  }
}
</style>
