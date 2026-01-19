import { createRouter, createWebHistory } from 'vue-router'
import MapComponent from '@/components/MapComponent.vue'
import GroupHikesSection from '@/components/GroupHikesSection.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'map',
      component: MapComponent,
    },
    {
      path: '/group-hikes',
      name: 'group-hikes',
      component: GroupHikesSection,
    },
  ],
})

export default router
