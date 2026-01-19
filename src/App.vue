<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarComponent from './components/NavbarComponent.vue'
</script>

<template>
  <div class="app">
    <NavbarComponent />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow: auto;
}
</style>
