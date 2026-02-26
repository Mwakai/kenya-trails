<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { listGroupHikes } from '@/services/groupHikeService'
import GroupHikeCard from '@/components/GroupHikeCard.vue'
import type { PublicGroupHike, PublicGroupHikeCard } from '@/types/groupHike'

const props = defineProps<{
  hike: PublicGroupHike
}>()

const similar = ref<PublicGroupHikeCard[]>([])

onMounted(async () => {
  try {
    const result = await listGroupHikes({
      region: props.hike.region.slug,
      per_page: 6,
    })
    similar.value = result.data.filter((h) => h.id !== props.hike.id).slice(0, 4)
  } catch {
    similar.value = []
  }
})
</script>

<template>
  <div v-if="similar.length" class="similar-section">
    <div class="similar-header">
      <h2 class="similar-title">More Hikes in {{ hike.region.name }}</h2>
      <RouterLink :to="{ name: 'group-hikes', query: { region: hike.region.slug } }" class="see-all">
        See all <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </RouterLink>
    </div>
    <div class="similar-scroll">
      <GroupHikeCard v-for="h in similar" :key="h.id" :hike="h" class="similar-card" />
    </div>
  </div>
</template>

<style scoped>
.similar-section {
  margin-top: var(--space-10);
  padding-top: var(--space-8);
  border-top: 1px solid var(--color-gray-200);
}

.similar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.similar-title {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  margin: 0;
}

.see-all {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-primary);
  text-decoration: none;
}

.see-all:hover {
  text-decoration: underline;
}

.similar-scroll {
  display: flex;
  gap: var(--space-5);
  overflow-x: auto;
  padding-bottom: var(--space-3);
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-300) transparent;
}

.similar-scroll::-webkit-scrollbar {
  height: 4px;
}

.similar-scroll::-webkit-scrollbar-thumb {
  background: var(--color-gray-300);
  border-radius: var(--radius-full);
}

.similar-card {
  flex: 0 0 300px;
}

@media (max-width: 640px) {
  .similar-card {
    flex: 0 0 260px;
  }
}
</style>
