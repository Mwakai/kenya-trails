<script setup lang="ts">
import { ref, computed } from 'vue'
import GroupHikeCard, { type GroupHike } from './GroupHikeCard.vue'

type DifficultyFilter = 'All' | 'Easy' | 'Moderate' | 'Hard'
type SortOption = 'date' | 'price-low' | 'price-high'

const activeFilter = ref<DifficultyFilter>('All')
const activeSort = ref<SortOption>('date')
const searchQuery = ref('')

const difficultyFilters: DifficultyFilter[] = ['All', 'Easy', 'Moderate', 'Hard']

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date', label: 'Date (Soonest)' },
  { value: 'price-low', label: 'Price (Low to High)' },
  { value: 'price-high', label: 'Price (High to Low)' },
]

// Sample data - replace with API call later
const groupHikes: GroupHike[] = [
  {
    id: 1,
    organization: 'Hiking Kenya',
    title: 'Mount Longonot Sunrise Hike',
    date: 'Sat, Feb 8, 2026',
    time: '5:30 AM',
    trail: 'Mount Longonot National Park',
    difficulty: 'Moderate',
    capacity: 30,
    spotsLeft: 12,
    price: 2500,
    description:
      'Experience a breathtaking sunrise from the rim of Mount Longonot crater. The hike includes a full crater rim walk with stunning views of the Rift Valley.',
    signupUrl: '#',
  },
  {
    id: 2,
    organization: 'Nairobi Hikers',
    title: 'Karura Forest Nature Walk',
    date: 'Sun, Feb 9, 2026',
    time: '7:00 AM',
    trail: 'Karura Forest',
    difficulty: 'Easy',
    capacity: 25,
    spotsLeft: 8,
    price: 500,
    description:
      'A relaxing morning walk through the beautiful Karura Forest. Perfect for beginners and families. Includes a visit to the waterfall and caves.',
    signupUrl: '#',
  },
  {
    id: 3,
    organization: 'Adventure Seekers KE',
    title: "Hell's Gate Cycling & Gorge Walk",
    date: 'Sat, Feb 15, 2026',
    time: '6:00 AM',
    trail: "Hell's Gate National Park",
    difficulty: 'Moderate',
    capacity: 20,
    spotsLeft: 5,
    price: 3500,
    description:
      "Cycle through the park with zebras and giraffes, then explore the dramatic gorge on foot. Bikes and guide included in the price.",
    signupUrl: '#',
  },
  {
    id: 4,
    organization: 'Kenya Mountain Club',
    title: 'Mount Kenya - Point Lenana',
    date: 'Fri-Sun, Feb 21-23, 2026',
    time: '6:00 AM',
    trail: 'Mount Kenya (Sirimon Route)',
    difficulty: 'Hard',
    capacity: 15,
    spotsLeft: 3,
    price: 18000,
    description:
      "A 3-day expedition to Point Lenana (4,985m), the third highest peak of Mount Kenya. Includes accommodation, meals, guide, and porters.",
    signupUrl: '#',
  },
  {
    id: 5,
    organization: 'Hiking Kenya',
    title: 'Ngong Hills Traverse',
    date: 'Sat, Feb 22, 2026',
    time: '6:30 AM',
    trail: 'Ngong Hills',
    difficulty: 'Moderate',
    capacity: 35,
    spotsLeft: 20,
    price: 1500,
    description:
      'Traverse all seven hills of the iconic Ngong Hills with panoramic views of the Rift Valley and Nairobi. A classic Kenya hiking experience.',
    signupUrl: '#',
  },
  {
    id: 6,
    organization: 'Wild Trails Africa',
    title: 'Aberdare Elephant Hill Hike',
    date: 'Sun, Mar 1, 2026',
    time: '5:00 AM',
    trail: 'Aberdare National Park',
    difficulty: 'Hard',
    capacity: 12,
    spotsLeft: 7,
    price: 4500,
    description:
      'Challenge yourself with this demanding hike through the Aberdare moorlands. Chance to spot elephants, buffalos, and rare birdlife.',
    signupUrl: '#',
  },
]

const parseDate = (dateStr: string): Date => {
  // Handle multi-day format like "Fri-Sun, Feb 21-23, 2026"
  const cleanDate = dateStr.replace(/\w+-\w+,\s*/, '').replace(/-\d+/, '')
  return new Date(cleanDate)
}

const filteredHikes = computed(() => {
  let hikes = [...groupHikes]

  // Search
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    hikes = hikes.filter(
      (hike) =>
        hike.title.toLowerCase().includes(query) ||
        hike.organization.toLowerCase().includes(query) ||
        hike.trail.toLowerCase().includes(query) ||
        hike.description.toLowerCase().includes(query),
    )
  }

  // Filter by difficulty
  if (activeFilter.value !== 'All') {
    hikes = hikes.filter((hike) => hike.difficulty === activeFilter.value)
  }

  // Sort
  switch (activeSort.value) {
    case 'date':
      hikes.sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      break
    case 'price-low':
      hikes.sort((a, b) => a.price - b.price)
      break
    case 'price-high':
      hikes.sort((a, b) => b.price - a.price)
      break
  }

  return hikes
})
</script>

<template>
  <section class="group-hikes-section">
    <div class="section-container">
      <div class="section-header">
        <h2>Upcoming Group Hikes</h2>
        <p>Join organized hikes led by experienced guides from trusted organizations</p>
      </div>

      <div class="search-bar">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, organization, or location..."
          class="search-input"
        />
      </div>

      <div class="controls">
        <div class="filters">
          <span class="control-label">Difficulty:</span>
          <button
            v-for="filter in difficultyFilters"
            :key="filter"
            :class="['filter-btn', { active: activeFilter === filter }]"
            @click="activeFilter = filter"
          >
            {{ filter }}
          </button>
        </div>

        <div class="sort">
          <label for="sort-select" class="control-label">Sort by:</label>
          <select id="sort-select" v-model="activeSort" class="sort-select">
            <option v-for="option in sortOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>

      <div class="hikes-grid">
        <GroupHikeCard v-for="hike in filteredHikes" :key="hike.id" :hike="hike" />
      </div>

      <p v-if="filteredHikes.length === 0" class="no-results">
        No hikes found. Try adjusting your search or filters.
      </p>
    </div>
  </section>
</template>

<style scoped>
.group-hikes-section {
  background: var(--color-bg-secondary);
  padding: var(--space-16) var(--space-5);
  min-height: 100%;
  box-sizing: border-box;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-10);
}

.section-header h2 {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
  margin: 0 0 var(--space-3) 0;
  line-height: var(--leading-tight);
}

.section-header p {
  font-size: var(--text-base);
  color: var(--color-gray-500);
  margin: 0;
  line-height: var(--leading-normal);
}

.search-bar {
  margin-bottom: var(--space-6);
}

.search-input {
  width: 100%;
  padding: var(--space-3) var(--space-5);
  border: 2px solid var(--color-gray-200);
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  color: var(--color-gray-800);
  transition: border-color var(--duration-fast) var(--ease-out),
    box-shadow var(--duration-fast) var(--ease-out);
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--color-gray-400);
}

.search-input:hover {
  border-color: var(--color-gray-300);
}

.search-input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;
}

.filters {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.control-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-600);
}

.sort {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.sort-select {
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--color-gray-200);
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out);
}

.sort-select:hover,
.sort-select:focus {
  border-color: var(--color-primary);
  outline: none;
}

.filter-btn {
  padding: var(--space-2) var(--space-5);
  border: 2px solid var(--color-gray-200);
  background: var(--color-bg-primary);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-600);
  cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-out),
    color var(--duration-fast) var(--ease-out),
    background var(--duration-fast) var(--ease-out);
}

.filter-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.filter-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.no-results {
  text-align: center;
  color: var(--color-gray-500);
  font-size: var(--text-base);
  padding: var(--space-10) 0;
}

.hikes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .group-hikes-section {
    padding: var(--space-10) var(--space-4);
  }

  .section-header h2 {
    font-size: var(--text-2xl);
  }

  .hikes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
