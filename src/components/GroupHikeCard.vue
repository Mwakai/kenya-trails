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
        <span class="detail-icon">📍</span>
        <span>{{ hike.trail }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-icon">📅</span>
        <span>{{ hike.date }} at {{ hike.time }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-icon">👥</span>
        <span>{{ hike.spotsLeft }} spots left of {{ hike.capacity }}</span>
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
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hike-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.organization {
  display: flex;
  align-items: center;
  gap: 10px;
}

.org-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.org-name {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.difficulty-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.hike-title {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.hike-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #4b5563;
}

.detail-icon {
  font-size: 16px;
}

.hike-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.signup-btn {
  padding: 10px 24px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s ease;
}

.signup-btn:hover {
  background: #059669;
}
</style>
