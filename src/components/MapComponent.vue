<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// Extend Window interface for custom methods
declare global {
  interface Window {
    viewTrailDetail: (trailId: number) => void
  }
}

const mapContainer = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null

// Define Trail interface
interface Trail {
  id: number
  name: string
  coordinates: [number, number] // [longitude, latitude]
  difficulty: string
  distance: string
  elevation: string
}

// Sample trail data - replace with API call later
const trails: Trail[] = [
  {
    id: 1,
    name: 'Mount Kenya Summit',
    coordinates: [37.3068, -0.1521] as [number, number],
    difficulty: 'Hard',
    distance: '12km',
    elevation: '5199m',
  },
  {
    id: 2,
    name: "Hell's Gate Gorge",
    coordinates: [36.3119, -0.8998] as [number, number],
    difficulty: 'Moderate',
    distance: '8km',
    elevation: '1900m',
  },
  {
    id: 3,
    name: 'Karura Forest Trail',
    coordinates: [36.8333, -1.2333] as [number, number],
    difficulty: 'Easy',
    distance: '5km',
    elevation: '1700m',
  },
  {
    id: 4,
    name: 'Aberdare Ranges',
    coordinates: [36.7, -0.4] as [number, number],
    difficulty: 'Hard',
    distance: '15km',
    elevation: '4000m',
  },
]

onMounted(() => {
  // Check if container exists
  if (!mapContainer.value) return

  // Initialize map
  map = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/outdoor-v4/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: [37.0, -1.0] as [number, number], // Center on Kenya
    zoom: 6.7,
    pitch: 35, // Slight tilt for 3D effect
    bearing: 0,
  })

  // Add navigation controls
  map.addControl(new maplibregl.NavigationControl(), 'top-right')

  // Add geolocate control (find user's location)
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    }),
    'top-right',
  )

  // Wait for map to load before adding markers
  map.on('load', () => {
    addTrailMarkers()
  })
})

const addTrailMarkers = () => {
  if (!map) return

  trails.forEach((trail) => {
    // Create custom marker element
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.style.backgroundImage = 'url(https://api.iconify.design/mdi/hiking.svg?color=%23ef4444)'
    el.style.width = '32px'
    el.style.height = '32px'
    el.style.backgroundSize = 'contain'
    el.style.cursor = 'pointer'

    // Create popup content
    const popupContent = `
      <div class="trail-popup">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${trail.name}</h3>
        <div style="display: flex; gap: 12px; margin-bottom: 8px;">
          <span style="font-size: 14px;">📏 ${trail.distance}</span>
          <span style="font-size: 14px;">⛰️ ${trail.elevation}</span>
        </div>
        <div style="margin-bottom: 10px;">
          <span style="display: inline-block; padding: 4px 8px; background: ${getDifficultyColor(trail.difficulty)}; border-radius: 4px; font-size: 12px; color: white;">
            ${trail.difficulty}
          </span>
        </div>
        <button
          onclick="window.viewTrailDetail(${trail.id})"
          style="width: 100%; padding: 8px; background: #10b981; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;"
        >
          View Details
        </button>
      </div>
    `

    // Create popup
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false,
    }).setHTML(popupContent)

    // Add marker to map
    new maplibregl.Marker(el).setLngLat(trail.coordinates).setPopup(popup).addTo(map!)
  })
}

const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    Easy: '#10b981',
    Moderate: '#f59e0b',
    Hard: '#ef4444',
  }
  return colors[difficulty] || '#6b7280'
}

// Make viewTrailDetail available globally for popup button
window.viewTrailDetail = (trailId: number): void => {
  console.log('Viewing trail:', trailId)
  // Navigate to trail detail page - we'll implement this with Vue Router later
  // Example: router.push(`/trail/${trailId}`)
}

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

/* Custom marker hover effect */
:deep(.custom-marker:hover) {
  transform: scale(1.1);
  transition: transform 0.2s ease;
}
</style>

<style>
/* Global styles for popups */
.maplibregl-popup-content {
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  min-width: 250px;
}

.maplibregl-popup-close-button {
  font-size: 20px;
  padding: 0;
  width: 24px;
  height: 24px;
}

.trail-popup button:hover {
  background: #059669;
  transition: background 0.2s ease;
}
</style>
