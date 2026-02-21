import type { PublicGroupHike, PublicGroupHikeCard, GroupHikeFilters, PaginatedResponse } from '@/types/groupHike'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

async function apiFetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== '' && value !== undefined && value !== null) {
        url.searchParams.set(key, value)
      }
    })
  }
  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`)
  }
  const json = await response.json()
  return json.data ?? json
}

function extractList(data: unknown): PublicGroupHikeCard[] {
  if (Array.isArray(data)) return data as PublicGroupHikeCard[]
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.group_hikes)) return d.group_hikes as PublicGroupHikeCard[]
    if (Array.isArray(d.data)) return d.data as PublicGroupHikeCard[]
  }
  return []
}

export async function listGroupHikes(
  filters?: Partial<GroupHikeFilters>,
): Promise<PaginatedResponse<PublicGroupHikeCard>> {
  const params: Record<string, string> = {}
  if (filters) {
    if (filters.search) params.search = filters.search
    if (filters.region) params.region = filters.region
    if (filters.difficulty) params.difficulty = filters.difficulty
    if (filters.date_from) params.date_from = filters.date_from
    if (filters.date_to) params.date_to = filters.date_to
    if (filters.is_free != null) params.is_free = filters.is_free ? '1' : '0'
    if (filters.page && filters.page > 1) params.page = String(filters.page)
    if (filters.per_page) params.per_page = String(filters.per_page)
    if (filters.sort) params.sort = filters.sort
  }

  const raw = await apiFetch<unknown>('/api/public/group-hikes', params)

  // Handle { group_hikes: [], meta: {} } or { data: [], meta: {} } or PaginatedResponse directly
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const d = raw as Record<string, unknown>
    const items = Array.isArray(d.group_hikes)
      ? (d.group_hikes as PublicGroupHikeCard[])
      : Array.isArray(d.data)
        ? (d.data as PublicGroupHikeCard[])
        : extractList(raw)
    const meta = (d.meta as PaginatedResponse<PublicGroupHikeCard>['meta']) ?? {
      current_page: 1,
      last_page: 1,
      total: items.length,
      per_page: items.length,
    }
    return { data: items, meta }
  }

  const items = extractList(raw)
  return {
    data: items,
    meta: { current_page: 1, last_page: 1, total: items.length, per_page: items.length },
  }
}

export async function getGroupHike(slug: string): Promise<PublicGroupHike> {
  const raw = await apiFetch<unknown>(`/api/public/group-hikes/${slug}`)
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const d = raw as Record<string, unknown>
    if (d.group_hike) return d.group_hike as PublicGroupHike
  }
  return raw as PublicGroupHike
}

export async function getFeaturedHikes(limit?: number): Promise<PublicGroupHikeCard[]> {
  const params: Record<string, string> = {}
  if (limit) params.limit = String(limit)
  const raw = await apiFetch<unknown>('/api/public/group-hikes/featured', params)
  return extractList(raw)
}

export async function getThisWeekHikes(): Promise<PublicGroupHikeCard[]> {
  const raw = await apiFetch<unknown>('/api/public/group-hikes/this-week')
  return extractList(raw)
}

export async function getHikesByTrail(trailSlug: string): Promise<PublicGroupHikeCard[]> {
  const raw = await apiFetch<unknown>(`/api/public/group-hikes/by-trail/${trailSlug}`)
  return extractList(raw)
}
