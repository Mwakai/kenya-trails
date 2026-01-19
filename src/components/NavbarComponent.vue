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
  padding: 0 var(--space-6);
  background-color: var(--color-bg-dark);
  color: white;
  height: 64px;
  position: relative;
}

.navbar-brand h1 {
  margin: 0;
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
}

.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
  z-index: 20;
}

.menu-toggle .bar {
  display: block;
  width: 24px;
  height: 2px;
  background-color: white;
  border-radius: var(--radius-sm);
  transition: transform var(--duration-slow) var(--ease-in-out),
    opacity var(--duration-slow) var(--ease-in-out);
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
  gap: var(--space-2);
}

.nav-link {
  padding: var(--space-2) var(--space-4);
  color: var(--color-gray-300);
  text-decoration: none;
  font-weight: var(--font-medium);
  border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out);
}

.nav-link:hover {
  background-color: var(--color-gray-700);
  color: white;
}

.nav-link.router-link-active {
  background-color: var(--color-primary);
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
    background-color: var(--color-bg-dark);
    padding: 0;
    gap: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height var(--duration-slow) var(--ease-in-out),
      padding var(--duration-slow) var(--ease-in-out);
    box-shadow: var(--shadow-lg);
  }

  .navbar-links.open {
    max-height: 200px;
    padding: var(--space-2) 0;
  }

  .nav-link {
    padding: var(--space-4) var(--space-6);
    border-radius: 0;
    text-align: left;
  }

  .nav-link:hover {
    background-color: var(--color-gray-700);
  }

  .nav-link.router-link-active {
    background-color: var(--color-primary-hover);
  }
}
</style>
