<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const isMenuOpen = ref(false)
const router = useRouter()

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

router.afterEach(() => {
  closeMenu()
})
</script>

<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <h1>Kenya Trails</h1>
    </div>

    <button class="menu-toggle" :class="{ active: isMenuOpen }" @click="toggleMenu">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <div class="navbar-links" :class="{ open: isMenuOpen }">
      <RouterLink to="/" class="nav-link">Explore Map</RouterLink>
      <RouterLink to="/group-hikes" class="nav-link">Group Hikes</RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background-color: #1f2937;
  color: white;
  height: 64px;
  position: relative;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 20;
}

.menu-toggle .bar {
  display: block;
  width: 24px;
  height: 2px;
  background-color: white;
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.menu-toggle.active .bar:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.menu-toggle.active .bar:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active .bar:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.navbar-links {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  color: #d1d5db;
  text-decoration: none;
  font-weight: 500;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.nav-link:hover {
  background-color: #374151;
  color: white;
}

.nav-link.router-link-active {
  background-color: #10b981;
  color: white;
}

@media (max-width: 640px) {
  .menu-toggle {
    display: flex;
  }

  .navbar-links {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #1f2937;
    padding: 0;
    gap: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .navbar-links.open {
    max-height: 200px;
    padding: 8px 0;
  }

  .nav-link {
    padding: 16px 24px;
    border-radius: 0;
    text-align: left;
  }

  .nav-link:hover {
    background-color: #374151;
  }

  .nav-link.router-link-active {
    background-color: #059669;
  }
}
</style>
