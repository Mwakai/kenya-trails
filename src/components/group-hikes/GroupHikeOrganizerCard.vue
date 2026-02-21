<script setup lang="ts">
import type { PublicGroupHike } from '@/types/groupHike'

defineProps<{ hike: PublicGroupHike }>()
</script>

<template>
  <div v-if="hike.company || hike.organizer_name" class="organizer-card">
    <h3 class="card-title">Organizer</h3>

    <div class="organizer-row">
      <!-- Logo -->
      <img
        v-if="hike.company?.logo_thumbnail"
        :src="hike.company.logo_thumbnail"
        :alt="hike.company.name"
        class="org-logo"
      />
      <div v-else class="org-avatar">
        {{ (hike.company?.name ?? hike.organizer_name ?? 'O').charAt(0).toUpperCase() }}
      </div>

      <div class="org-info">
        <div class="org-name-row">
          <span class="org-name">{{ hike.company?.name ?? hike.organizer_name }}</span>
          <span v-if="hike.company?.is_verified" class="verified-badge">
            ✓ Verified
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.organizer-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.card-title {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);
  margin: 0;
}

.organizer-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.org-logo {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  object-fit: cover;
  flex-shrink: 0;
}

.org-avatar {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.org-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.org-name-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.org-name {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
}

.verified-badge {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-primary);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}
</style>
