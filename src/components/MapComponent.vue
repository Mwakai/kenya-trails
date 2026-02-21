<template>
  <div class="map-page">
    <div class="map-container">
      <div ref="mapContainer" class="map"></div>
      <div v-if="store.loading" class="map-loading">Loading trails...</div>
      <div v-if="store.error" class="map-error">{{ store.error }}</div>
      <TrailFilters />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, createApp } from 'vue'
import type { App } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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
