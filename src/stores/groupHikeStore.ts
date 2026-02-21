import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import type { PublicGroupHikeCard, PublicGroupHike, GroupHikeFilters } from '@/types/groupHike'
import {
  listGroupHikes,
  getGroupHike,
  getFeaturedHikes,
  getThisWeekHikes,
} from '@/services/groupHikeService'

const defaultFilters = (): GroupHikeFilters => ({
  region: '',
  difficulty: '',
  date_from: '',
  date_to: '',
  is_free: null,
  search: '',
  page: 1,
  per_page: 12,
  sort: 'start_date',
})

export const useGroupHikeStore = defineStore('groupHike', () => {
  const groupHikes = ref<PublicGroupHikeCard[]>([])
  const featuredHikes = ref<PublicGroupHikeCard[]>([])
  const thisWeekHikes = ref<PublicGroupHikeCard[]>([])
  const currentHike = ref<PublicGroupHike | null>(null)
  const filters = ref<GroupHikeFilters>(defaultFilters())
  const pagination = ref({ current_page: 1, last_page: 1, total: 0, per_page: 12 })
  const isLoading = ref(false)
  const isFeaturedLoading = ref(false)
  const isThisWeekLoading = ref(false)
  const error = ref<string | null>(null)

  const activeFilterCount = computed(() => {
    const f = filters.value
    return [f.region, f.difficulty, f.date_from, f.date_to, f.search]
      .filter((v) => v !== '')
      .length + (f.is_free != null ? 1 : 0)
  })

  const hasActiveFilters = computed(() => activeFilterCount.value > 0)
  const hasMore = computed(() => pagination.value.current_page < pagination.value.last_page)

  async function fetchGroupHikes(overrides?: Partial<GroupHikeFilters>) {
    isLoading.value = true
    error.value = null
    try {
      const result = await listGroupHikes({ ...filters.value, ...overrides })
      groupHikes.value = result.data
      pagination.value = result.meta
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load group hikes'
      groupHikes.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFeatured() {
    isFeaturedLoading.value = true
    try {
      featuredHikes.value = await getFeaturedHikes(6)
    } catch {
      featuredHikes.value = []
    } finally {
      isFeaturedLoading.value = false
    }
  }

  async function fetchThisWeek() {
    isThisWeekLoading.value = true
    try {
      thisWeekHikes.value = await getThisWeekHikes()
    } catch {
      thisWeekHikes.value = []
    } finally {
      isThisWeekLoading.value = false
    }
  }

  async function fetchGroupHike(slug: string) {
    isLoading.value = true
    error.value = null
    currentHike.value = null
    try {
      currentHike.value = await getGroupHike(slug)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load group hike'
    } finally {
      isLoading.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value || isLoading.value) return
    isLoading.value = true
    try {
      const nextPage = pagination.value.current_page + 1
      const result = await listGroupHikes({ ...filters.value, page: nextPage })
      groupHikes.value = [...groupHikes.value, ...result.data]
      pagination.value = result.meta
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load more hikes'
    } finally {
      isLoading.value = false
    }
  }

  function setFilter(key: keyof GroupHikeFilters, value: string | number | boolean | null) {
    ;(filters.value as Record<string, unknown>)[key] = value
    filters.value.page = 1
    syncFiltersToUrl()
    fetchGroupHikes()
  }

  function resetFilters() {
    filters.value = defaultFilters()
    syncFiltersToUrl()
    fetchGroupHikes()
  }

  function clearCurrentHike() {
    currentHike.value = null
  }

  function syncFiltersToUrl() {
    try {
      const router = useRouter()
      const route = useRoute()
      if (route.name !== 'group-hikes') return

      const query: Record<string, string> = {}
      const f = filters.value
      if (f.search) query.search = f.search
      if (f.region) query.region = f.region
      if (f.difficulty) query.difficulty = f.difficulty
      if (f.date_from) query.date_from = f.date_from
      if (f.date_to) query.date_to = f.date_to
      if (f.is_free != null) query.is_free = f.is_free ? '1' : '0'
      if (f.sort !== 'start_date') query.sort = f.sort
      router.replace({ query })
    } catch {
      // Router not available
    }
  }

  function syncFiltersFromUrl(query: Record<string, string>) {
    const f = defaultFilters()
    if (query.search) f.search = query.search
    if (query.region) f.region = query.region
    if (query.difficulty) f.difficulty = query.difficulty
    if (query.date_from) f.date_from = query.date_from
    if (query.date_to) f.date_to = query.date_to
    if (query.is_free !== undefined) f.is_free = query.is_free === '1'
    if (query.sort === 'price') f.sort = 'price'
    filters.value = f
  }

  return {
    groupHikes,
    featuredHikes,
    thisWeekHikes,
    currentHike,
    filters,
    pagination,
    isLoading,
    isFeaturedLoading,
    isThisWeekLoading,
    error,
    activeFilterCount,
    hasActiveFilters,
    hasMore,
    fetchGroupHikes,
    fetchFeatured,
    fetchThisWeek,
    fetchGroupHike,
    loadMore,
    setFilter,
    resetFilters,
    clearCurrentHike,
    syncFiltersFromUrl,
  }
})
