import type { TrailMapMarker, Trail, FilterOptions, TrailFilters, Duration } from '@/types/trail'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value)
    })
  }

  const response = await fetch(url.toString())

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()
  return json.data ?? json
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformTrail(raw: any): TrailMapMarker {
  // Region can be a nested object (detail) or flat fields (list)
  const region = raw.region
    ? { id: raw.region.id, slug: raw.region.slug, name: raw.region.name }
    : { id: raw.region_id, slug: raw.region_slug, name: raw.region_name }

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    coordinates: [parseFloat(raw.longitude), parseFloat(raw.latitude)],
    difficulty: raw.difficulty,
    distance_km: parseFloat(raw.distance_km),
    elevation_gain_m: raw.elevation_gain_m,
    image_url: raw.featured_image?.variants?.medium ?? raw.featured_image?.url ?? null,
    region,
    duration: {
      type: raw.duration_type as Duration['type'],
      min: parseFloat(raw.duration_min),
      max: raw.duration_max ? parseFloat(raw.duration_max) : null,
      display: raw.duration_display ?? '',
    },
    is_multi_day: raw.is_multi_day ?? false,
  }
}

export async function fetchMapTrails(filters?: Partial<TrailFilters>): Promise<TrailMapMarker[]> {
  const params: Record<string, string> = {}
  if (filters) {
    if (filters.search) params.search = filters.search
    if (filters.region) params.region = filters.region
    if (filters.difficulty) params.difficulty = filters.difficulty
    if (filters.distance_max) params.distance_max = filters.distance_max
    if (filters.duration_max) params.duration_max = filters.duration_max
  }
  const data = await apiFetch<{ trails: unknown[] }>('/api/public/trails', params)
  const rawTrails = Array.isArray(data) ? data : data.trails ?? []
  return rawTrails.map(transformTrail)
}

export async function fetchTrail(idOrSlug: string | number): Promise<Trail> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await apiFetch(`/api/public/trails/${idOrSlug}`)
  // Detail endpoint wraps in { trail: {...} }
  const raw = data.trail ?? data
  const base = transformTrail(raw)

  return {
    ...base,
    description: raw.description ?? raw.short_description ?? '',
    location_name: raw.location_name ?? null,
    season: {
      is_year_round: raw.is_year_round ?? false,
      best_months: raw.best_months ?? [],
      best_months_display: raw.best_months_display ?? '',
      notes: raw.season_notes ?? null,
      current_month_rating: raw.current_month_rating ?? null,
      recommendation: raw.season_recommendation ?? null,
    },
    requirements:
      raw.requires_guide || raw.requires_permit || raw.accommodation_types?.length
        ? {
            requires_guide: raw.requires_guide ?? false,
            requires_permit: raw.requires_permit ?? false,
            permit_info: raw.permit_info ?? null,
            accommodation_types: raw.accommodation_types ?? [],
          }
        : null,
    itinerary: raw.itinerary_days?.length ? raw.itinerary_days : null,
    imageGradient:
      'linear-gradient(135deg, #1e3a5f 0%, #4a90d9 50%, #87ceeb 100%)',
  }
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
  return apiFetch<FilterOptions>('/api/public/trails/filters')
}

export async function fetchRegions(): Promise<FilterOptions['regions']> {
  const data = await apiFetch<unknown>('/api/public/trails/regions')
  if (Array.isArray(data)) return data as FilterOptions['regions']
  if (data && typeof data === 'object' && 'regions' in data && Array.isArray((data as Record<string, unknown>).regions)) {
    return (data as Record<string, unknown>).regions as FilterOptions['regions']
  }
  return []
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: '#10b981',
    moderate: '#f59e0b',
    hard: '#ef4444',
    Easy: '#10b981',
    Moderate: '#f59e0b',
    Hard: '#ef4444',
  }
  return colors[difficulty] || '#6b7280'
}

export function formatDuration(duration: Duration): string {
  if (duration.display) return duration.display
  const unit = duration.type === 'hours' ? 'hour' : 'day'
  const min = duration.min
  const max = duration.max
  if (!max || min === max) {
    return `${min} ${unit}${min !== 1 ? 's' : ''}`
  }
  return `${min}-${max} ${unit}s`
}
