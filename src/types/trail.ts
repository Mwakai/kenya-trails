export interface Duration {
  type: 'hours' | 'days'
  min: number
  max: number | null
  display: string
}

export interface Season {
  is_year_round: boolean
  best_months: number[]
  best_months_display: string
  notes: string | null
  current_month_rating: number | null
  recommendation: string | null
}

export interface Requirements {
  requires_guide: boolean
  requires_permit: boolean
  permit_info: string | null
  accommodation_types: string[]
}

export interface ItineraryDay {
  day: number
  title: string
  description: string
  distance_km: number | null
  elevation_gain_m: number | null
  start_point: string | null
  end_point: string | null
  accommodation: string | null
}

export interface Region {
  slug: string
  name: string
  trails_count: number
}

export interface FeaturedImage {
  id: number
  url: string
  variants: {
    full: string
    large: string
    medium: string
    small: string
    thumbnail: string
  }
}

export interface TrailMapMarker {
  id: number
  name: string
  slug: string
  coordinates: [number, number]
  difficulty: string
  distance_km: number
  elevation_gain_m: number
  image_url: string | null
  region: {
    id: number
    slug: string
    name: string
  }
  duration: Duration
  is_multi_day: boolean
}

export interface Trail extends TrailMapMarker {
  description: string
  location_name: string | null
  season: Season | null
  requirements: Requirements | null
  itinerary: ItineraryDay[] | null
  imageGradient: string
}

export interface FilterOptions {
  regions: Region[]
  difficulties: { value: string; label: string; trails_count: number }[]
  duration_types: { value: string; label: string }[]
  amenities: string[]
}

export interface TrailFilters {
  search: string
  region: string       // comma-separated slugs for multi-select
  difficulty: string
  distance_max: string // max km, empty = no filter
  duration_max: string // max hours, empty = no filter
}
