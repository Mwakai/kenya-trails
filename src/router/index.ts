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
    {
      path: '/trail/:id',
      name: 'trail-detail',
      component: () => import('@/components/TrailDetailPage.vue'),
    },
    {
      path: '/group-hikes/:slug',
      name: 'group-hike-detail',
      component: () => import('@/components/GroupHikeDetailPage.vue'),
    },
  ],
})

// Scroll .main-content to top on navigation (scrollBehavior doesn't work with overflow: auto on main)
router.afterEach(() => {
  const main = document.querySelector('.main-content')
  if (main) {
    main.scrollTop = 0
  }
})

export default router
