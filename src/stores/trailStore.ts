import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import type { TrailMapMarker, Trail, FilterOptions, TrailFilters, Region } from '@/types/trail'
import { fetchMapTrails, fetchTrail as fetchTrailApi, fetchFilterOptions, fetchRegions } from '@/services/trailService'

const defaultFilters = (): TrailFilters => ({
  search: '',
  region: '',
  difficulty: '',
  distance_max: '',
  duration_max: '',
})

export const useTrailStore = defineStore('trail', () => {
  const trails = ref<TrailMapMarker[]>([])
  const currentTrail = ref<Trail | null>(null)
  const filterOptions = ref<FilterOptions | null>(null)
  const regions = ref<Region[]>([])
  const filters = ref<TrailFilters>(defaultFilters())
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeFilterCount = computed(() => {
    return Object.values(filters.value).filter((v) => v !== '').length
  })

  const hasActiveFilters = computed(() => activeFilterCount.value > 0)

  async function loadTrails() {
    loading.value = true
    error.value = null
    try {
      const result = await fetchMapTrails(filters.value)
      trails.value = Array.isArray(result) ? result : []
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load trails'
      trails.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadTrail(idOrSlug: string | number) {
    loading.value = true
    error.value = null
    try {
      currentTrail.value = await fetchTrailApi(idOrSlug)
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load trail'
      currentTrail.value = null
    } finally {
      loading.value = false
    }
  }

  async function loadFilterOptions() {
    try {
      filterOptions.value = await fetchFilterOptions()
    } catch (e) {
      console.error('Failed to load filter options:', e)
    }
  }

  async function loadRegions() {
    try {
      const result = await fetchRegions()
      regions.value = Array.isArray(result) ? result : []
    } catch (e) {
      console.error('Failed to load regions:', e)
    }
  }

  function setFilter(key: keyof TrailFilters, value: string) {
    filters.value[key] = value
    syncFiltersToUrl()
    loadTrails()
  }

  function clearFilters() {
    filters.value = defaultFilters()
    syncFiltersToUrl()
    loadTrails()
  }

  function syncFiltersToUrl() {
    try {
      const router = useRouter()
      const route = useRoute()
      if (route.name !== 'map') return

      const query: Record<string, string> = {}
      Object.entries(filters.value).forEach(([key, value]) => {
        if (value) query[key] = value
      })
      router.replace({ query })
    } catch {
      // Router not available (e.g., during SSR or outside component setup)
    }
  }

  function syncFiltersFromUrl(query: Record<string, string>) {
    const f = defaultFilters()
    if (query.search) f.search = query.search
    if (query.region) f.region = query.region
    if (query.difficulty) f.difficulty = query.difficulty
    if (query.distance_max) f.distance_max = query.distance_max
    if (query.duration_max) f.duration_max = query.duration_max
    filters.value = f
  }

  return {
    trails,
    currentTrail,
    filterOptions,
    regions,
    filters,
    loading,
    error,
    activeFilterCount,
    hasActiveFilters,
    loadTrails,
    loadTrail,
    loadFilterOptions,
    loadRegions,
    setFilter,
    clearFilters,
    syncFiltersFromUrl,
  }
})
