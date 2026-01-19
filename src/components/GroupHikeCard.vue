<script setup lang="ts">
export interface GroupHike {
  id: number
  organization: string
  organizationLogo?: string
  title: string
  date: string
  time: string
  trail: string
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  capacity: number
  spotsLeft: number
  price: number
  description: string
  signupUrl: string
}

defineProps<{
  hike: GroupHike
}>()

const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    Easy: '#10b981',
    Moderate: '#f59e0b',
    Hard: '#ef4444',
  }
  return colors[difficulty] || '#6b7280'
}

const formatPrice = (price: number): string => {
  if (price === 0) return 'Free'
  return `KSh ${price.toLocaleString()}`
}
</script>

<template>
  <div class="hike-card">
    <div class="card-header">
      <div class="organization">
        <div class="org-avatar">{{ hike.organization.charAt(0) }}</div>
        <span class="org-name">{{ hike.organization }}</span>
      </div>
      <span
        class="difficulty-badge"
        :style="{ backgroundColor: getDifficultyColor(hike.difficulty) }"
      >
        {{ hike.difficulty }}
      </span>
    </div>

    <h3 class="hike-title">{{ hike.title }}</h3>

    <div class="hike-details">
      <div class="detail-row">
        <span class="detail-label">Location:</span>
        <span>{{ hike.trail }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Date:</span>
        <span>{{ hike.date }} at {{ hike.time }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Spots:</span>
        <span>{{ hike.spotsLeft }} left of {{ hike.capacity }}</span>
      </div>
    </div>

    <p class="hike-description">{{ hike.description }}</p>

    <div class="card-footer">
      <span class="price">{{ formatPrice(hike.price) }}</span>
      <a :href="hike.signupUrl" target="_blank" rel="noopener noreferrer" class="signup-btn">
        Sign Up
      </a>
    </div>
  </div>
</template>

<style scoped>
.hike-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  box-shadow: var(--shadow-md);
  transition: transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

.hike-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.organization {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.org-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
}

.org-name {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  font-weight: var(--font-medium);
}

.difficulty-badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: white;
}

.hike-title {
  margin: 0 0 var(--space-4) 0;
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  line-height: var(--leading-tight);
}

.hike-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.detail-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-gray-600);
}

.detail-label {
  font-weight: var(--font-medium);
  color: var(--color-gray-500);
  min-width: 60px;
}

.hike-description {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
  line-height: var(--leading-normal);
  margin: 0 0 var(--space-4) 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-gray-200);
}

.price {
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
}

.signup-btn {
  padding: var(--space-2) var(--space-6);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-sm);
  text-decoration: none;
  transition: background var(--duration-fast) var(--ease-out);
}

.signup-btn:hover {
  background: var(--color-primary-hover);
}
</style>
