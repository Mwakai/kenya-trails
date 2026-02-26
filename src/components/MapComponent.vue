<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, createApp } from 'vue'
import type { App } from 'vue'
import { RouterLink, useRouter, useRoute } from 'vue-router'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useTrailStore } from '@/stores/trailStore'
import TrailFilters from '@/components/filters/TrailFilters.vue'
import TrailPopup from '@/components/TrailPopup.vue'
import type { TrailMapMarker } from '@/types/trail'

const router = useRouter()
const route = useRoute()
const store = useTrailStore()
const mapContainer = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null
let markers: maplibregl.Marker[] = []
let popupApps: App[] = []

function createPopupElement(trail: TrailMapMarker): HTMLElement {
  const container = document.createElement('div')
  const app = createApp(TrailPopup, {
    trail,
    onViewDetail: (slug: string) => router.push({ name: 'trail-detail', params: { id: slug } }),
  })
  app.mount(container)
  popupApps.push(app)
  return container
}

function clearMarkers() {
  markers.forEach((m) => m.remove())
  markers = []
  popupApps.forEach((app) => app.unmount())
  popupApps = []
}

function addTrailMarkers() {
  if (!map || !Array.isArray(store.trails)) return
  clearMarkers()

  store.trails.forEach((trail) => {
    const el = document.createElement('div')
    el.className = 'custom-marker'
    el.style.backgroundImage = 'url(https://api.iconify.design/mdi/hiking.svg?color=%23ef4444)'
    el.style.width = '32px'
    el.style.height = '32px'
    el.style.backgroundSize = 'contain'
    el.style.cursor = 'pointer'

    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: true,
      closeOnClick: false,
      maxWidth: '300px',
    }).setDOMContent(createPopupElement(trail))

    const marker = new maplibregl.Marker(el)
      .setLngLat(trail.coordinates)
      .setPopup(popup)
      .addTo(map!)

    markers.push(marker)
  })
}

watch(() => store.trails, addTrailMarkers)

watch(
  () => store.filters,
  (filters) => {
    const query: Record<string, string> = {}
    Object.entries(filters).forEach(([key, value]) => {
      if (value) query[key] = value
    })
    router.replace({ query })
  },
  { deep: true },
)

onMounted(async () => {
  if (!mapContainer.value) return

  map = new maplibregl.Map({
    container: mapContainer.value,
    style: `https://api.maptiler.com/maps/outdoor-v4/style.json?key=${import.meta.env.VITE_MAPTILER_KEY}`,
    center: [37.0, -1.0] as [number, number],
    zoom: 6.7,
    pitch: 35,
    bearing: 0,
  })

  map.addControl(new maplibregl.NavigationControl(), 'top-right')
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }),
    'top-right',
  )

  map.on('load', () => {
    addKenyaMask()
    addTrailMarkers()
  })

  // Sync filters from URL on mount
  const query = route.query as Record<string, string>
  store.syncFiltersFromUrl(query)

  await Promise.all([store.loadFilterOptions(), store.loadRegions(), store.loadTrails()])
})

const addKenyaMask = async () => {
  if (!map) return

  try {
    const response = await fetch('/nominatim/search?country=Kenya&polygon_geojson=1&format=json')
    const data = await response.json()

    if (!data[0]?.geojson) return

    const kenyaGeometry = data[0].geojson
    const worldBounds = [
      [-180, -90],
      [-180, 90],
      [180, 90],
      [180, -90],
      [-180, -90],
    ]

    const kenyaCoords =
      kenyaGeometry.type === 'MultiPolygon'
        ? kenyaGeometry.coordinates[0][0]
        : kenyaGeometry.coordinates[0]

    map.addSource('kenya-mask', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [worldBounds, kenyaCoords],
        },
      },
    })

    map.addLayer({
      id: 'kenya-mask-layer',
      type: 'fill',
      source: 'kenya-mask',
      paint: {
        'fill-color': '#1f2937',
        'fill-opacity': 0.6,
      },
    })

    map.addSource('kenya-border', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: kenyaGeometry,
      },
    })

    map.addLayer({
      id: 'kenya-border-layer',
      type: 'line',
      source: 'kenya-border',
      paint: {
        'line-color': '#10b981',
        'line-width': 2.5,
        'line-opacity': 1,
      },
    })
  } catch (error) {
    console.error(error)
  }
}

onUnmounted(() => {
  clearMarkers()
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-page">
    <div class="map-container">
      <div ref="mapContainer" class="map"></div>
      <div v-if="store.loading" class="map-loading">Loading trails...</div>
      <div v-if="store.error" class="map-error">{{ store.error }}</div>
      <TrailFilters />

      <!-- Brand chip -->
      <div class="map-brand">
        <svg
          class="brand-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 18 L8 7 L12 13 L15 9 L21 18 Z" />
          <path d="M3 18 H21" />
        </svg>
        <span>Kenya Trails</span>
      </div>

      <!-- Group Hikes FAB -->
      <RouterLink to="/group-hikes" class="map-fab">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span>Group Hikes</span>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.map-page {
  height: 100%;
}

.map-container {
  height: 100%;
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

.map-loading {
  position: absolute;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-bg-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-size: var(--text-sm);
  color: var(--color-gray-600);
  z-index: 10;
}

.map-error {
  position: absolute;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  background: #fef2f2;
  color: var(--color-danger);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  font-size: var(--text-sm);
  z-index: 10;
}

/* ── Brand chip ─────────────────────────────────── */
.map-brand {
  position: absolute;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: white;
  padding: 7px var(--space-4);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  letter-spacing: -0.01em;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
}

.brand-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

/* ── Group Hikes FAB ────────────────────────────── */
@keyframes fab-enter {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fab-pulse {
  0%,
  100% {
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.45);
  }
  50% {
    box-shadow:
      0 4px 28px rgba(16, 185, 129, 0.75),
      0 0 0 8px rgba(16, 185, 129, 0.12);
  }
}

.map-fab {
  position: absolute;
  bottom: var(--space-8);
  right: var(--space-5);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: var(--space-2);
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.45);
  animation:
    fab-enter 0.4s var(--ease-out) 0.6s both,
    fab-pulse 2.8s ease-in-out 1.2s 3;
  transition:
    transform 0.18s var(--ease-out),
    background-color 0.18s var(--ease-out),
    box-shadow 0.18s var(--ease-out);
}

.map-fab svg {
  width: 17px;
  height: 17px;
  flex-shrink: 0;
}

.map-fab:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(16, 185, 129, 0.55);
  animation: none;
}

.map-fab:active {
  transform: translateY(0);
}

@media (max-width: 480px) {
  .map-fab span {
    display: none;
  }

  .map-fab {
    padding: var(--space-3);
    border-radius: 50%;
    bottom: var(--space-6);
    right: var(--space-4);
  }

  .map-fab svg {
    width: 20px;
    height: 20px;
  }
}

:deep(.custom-marker) {
  transition: transform var(--duration-normal) var(--ease-out);
}

:deep(.custom-marker:hover) {
  transform: scale(1.1);
}
</style>

<style>
.maplibregl-popup-content {
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  min-width: 250px;
}
</style>
