export interface PublicGroupHikeCard {
  id: number
  slug: string
  title: string
  short_description: string | null
  organizer_name: string | null
  company: {
    slug: string
    name: string
    logo_thumbnail: string | null
    is_verified: boolean
  } | null
  trail: {
    slug: string
    name: string
    difficulty: string
    difficulty_label: string
    distance_km: number
    duration_display: string
    region: { slug: string; name: string }
  } | null
  location: {
    name: string
    latitude: number
    longitude: number
  }
  region: { slug: string; name: string }
  dates: {
    start_date: string
    start_time: string
    end_date: string | null
    end_time: string | null
    is_multi_day: boolean
  }
  date_display: string
  time_display: string
  datetime_formatted: string
  capacity: {
    max_participants: number | null
    spots_remaining: number | null
    is_full: boolean
  }
  pricing: {
    price: number | null
    currency: string
    formatted: string
    notes: string | null
    is_free: boolean
  }
  difficulty: string
  difficulty_label: string
  featured_image: {
    thumbnail: string
    medium: string
    large: string
  } | null
  is_featured: boolean
  is_recurring: boolean
  status: 'published' | 'cancelled'
  is_cancelled: boolean
}

export interface PublicGroupHike extends PublicGroupHikeCard {
  description: string
  meeting_point: string | null
  registration: {
    url: string | null
    deadline: string | null
    deadline_display: string | null
    notes: string | null
    is_open: boolean
  }
  contact: {
    name: string | null
    email: string | null
    phone: string | null
    whatsapp: string | null
  }
  gallery: Array<{
    id: number
    urls: { thumbnail: string; medium: string; large: string }
    caption: string | null
  }>
  recurring_notes: string | null
  cancellation_reason: string | null
}

export interface GroupHikeFilters {
  region: string
  difficulty: string
  date_from: string
  date_to: string
  is_free: boolean | null
  search: string
  page: number
  per_page: number
  sort: 'start_date' | 'price'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }
}
