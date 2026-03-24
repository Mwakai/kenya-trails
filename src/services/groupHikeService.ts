import type {
  PublicGroupHike,
  PublicGroupHikeCard,
  GroupHikeFilters,
  PaginatedResponse,
} from '@/types/groupHike'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

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

// Transforms flat API response to the nested PublicGroupHikeCard shape.
// If the item already has the nested shape (has a `dates` object), it is returned as-is.
function transformHike(raw: Record<string, unknown>): PublicGroupHikeCard {
  if (raw.dates && typeof raw.dates === 'object') {
    return raw as unknown as PublicGroupHikeCard
  }

  const isFree = Boolean(raw.is_free)
  const price = raw.price != null ? parseFloat(raw.price as string) : null
  const currency = (raw.price_currency as string) || 'KES'
  const startDate = (raw.start_date as string) || ''
  const endDate = (raw.end_date as string | null) ?? null
  const startTime = (raw.start_time as string) || ''
  const spotsRemaining = (raw.spots_remaining as number | null) ?? null
  const maxParticipants = (raw.max_participants as number | null) ?? null

  const priceFormatted = isFree
    ? 'Free'
    : price != null
      ? `${currency} ${price.toLocaleString()}`
      : 'Free'

  const rawImg = raw.featured_image as {
    thumbnail?: string
    medium?: string
    large?: string
    url?: string
  } | null
  const thumbUrl = rawImg?.thumbnail || (raw.featured_image_thumbnail as string) || ''
  const mediumUrl = rawImg?.medium || (raw.featured_image_medium as string) || ''
  const largeUrl = rawImg?.large || rawImg?.url || mediumUrl || thumbUrl || ''
  const hasFeaturedImage = thumbUrl || mediumUrl || largeUrl
  const featuredImage = hasFeaturedImage
    ? {
        thumbnail: thumbUrl || mediumUrl,
        medium: mediumUrl || thumbUrl,
        large: largeUrl,
      }
    : null

  const rawRegion = raw.region as { slug: string; name: string } | null
  const region = rawRegion && typeof rawRegion === 'object' ? rawRegion : { slug: '', name: '' }

  return {
    id: raw.id as number,
    slug: raw.slug as string,
    title: raw.title as string,
    short_description: (raw.short_description as string | null) ?? null,
    organizer_name: (raw.organizer_name as string | null) ?? null,
    company: (raw.company as PublicGroupHikeCard['company']) ?? null,
    trail: null,
    location: {
      name: (raw.custom_location_name as string) || '',
      latitude: 0,
      longitude: 0,
    },
    region,
    dates: {
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: null,
      is_multi_day: Boolean(raw.is_multi_day),
    },
    date_display: startDate,
    time_display: startTime ? startTime.slice(0, 5) : '',
    datetime_formatted: `${startDate} ${startTime}`,
    capacity: {
      max_participants: maxParticipants,
      spots_remaining: spotsRemaining,
      is_full: maxParticipants != null && spotsRemaining === 0,
    },
    pricing: {
      price,
      currency,
      formatted: priceFormatted,
      notes: null,
      is_free: isFree,
    },
    difficulty: (raw.difficulty as string) || '',
    difficulty_label: (raw.difficulty as string) || '',
    featured_image: featuredImage,
    is_featured: Boolean(raw.is_featured),
    is_recurring: Boolean(raw.is_recurring),
    status: raw.is_cancelled ? 'cancelled' : 'published',
    is_cancelled: Boolean(raw.is_cancelled),
  }
}

function extractList(data: unknown): PublicGroupHikeCard[] {
  let items: unknown[]
  if (Array.isArray(data)) {
    items = data
  } else if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.group_hikes)) items = d.group_hikes
    else if (Array.isArray(d.data)) items = d.data
    else items = []
  } else {
    items = []
  }
  return items.map((item) => transformHike(item as Record<string, unknown>))
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
    const rawItems: unknown[] = Array.isArray(d.group_hikes)
      ? d.group_hikes
      : Array.isArray(d.data)
        ? d.data
        : []
    const items =
      rawItems.length > 0
        ? rawItems.map((item) => transformHike(item as Record<string, unknown>))
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

function transformFullHike(raw: Record<string, unknown>): PublicGroupHike {
  const base = transformHike(raw) as PublicGroupHike

  base.description = (raw.description as string) || ''
  base.meeting_point = (raw.meeting_point as string | null) ?? null
  base.recurring_notes = (raw.recurring_notes as string | null) ?? null
  base.cancellation_reason = (raw.cancellation_reason as string | null) ?? null

  const rawReg = raw.registration as Record<string, unknown> | null
  base.registration =
    rawReg && typeof rawReg === 'object'
      ? {
          url: (rawReg.url as string | null) ?? null,
          deadline: (rawReg.deadline as string | null) ?? null,
          deadline_display: (rawReg.deadline_display as string | null) ?? null,
          notes: (rawReg.notes as string | null) ?? null,
          is_open: Boolean(rawReg.is_open),
        }
      : { url: null, deadline: null, deadline_display: null, notes: null, is_open: false }

  const rawContact = raw.contact as Record<string, unknown> | null
  base.contact =
    rawContact && typeof rawContact === 'object'
      ? {
          name: (rawContact.name as string | null) ?? null,
          email: (rawContact.email as string | null) ?? null,
          phone: (rawContact.phone as string | null) ?? null,
          whatsapp: (rawContact.whatsapp as string | null) ?? null,
        }
      : { name: null, email: null, phone: null, whatsapp: null }

  const rawImages = Array.isArray(raw.images) ? (raw.images as Record<string, unknown>[]) : []
  base.gallery = rawImages.map((img) => ({
    id: img.id as number,
    urls: {
      thumbnail: (img.thumbnail as string) || (img.url as string) || '',
      medium: (img.medium as string) || (img.url as string) || '',
      large: (img.url as string) || (img.medium as string) || '',
    },
    caption: (img.caption as string | null) ?? null,
  }))

  return base
}

export async function getGroupHike(slug: string): Promise<PublicGroupHike> {
  const raw = await apiFetch<unknown>(`/api/public/group-hikes/${slug}`)
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const d = raw as Record<string, unknown>
    const item = d.group_hike ?? raw
    return transformFullHike(item as Record<string, unknown>)
  }
  return transformFullHike(raw as Record<string, unknown>)
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
