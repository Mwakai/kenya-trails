<script setup lang="ts">
import { computed } from 'vue'
import type { PublicGroupHike } from '@/types/groupHike'

const props = defineProps<{ hike: PublicGroupHike }>()

const spotsPercent = computed(() => {
  const { max_participants, spots_remaining } = props.hike.capacity
  if (!max_participants || spots_remaining == null) return null
  return Math.round((spots_remaining / max_participants) * 100)
})

const spotsColor = computed(() => {
  const p = spotsPercent.value
  if (p == null) return ''
  if (p > 50) return 'spots--green'
  if (p > 20) return 'spots--amber'
  return 'spots--red'
})

function telHref(phone: string) {
  return 'tel:' + phone.replace(/\s/g, '')
}

function whatsappHref(number: string) {
  const clean = number.replace(/\D/g, '')
  return `https://wa.me/${clean}`
}
</script>

<template>
  <div class="reg-card" :class="{ 'reg-card--closed': !hike.registration.is_open }">
    <!-- Price -->
    <div class="price-section">
      <span class="price">{{ hike.pricing.formatted }}</span>
      <span v-if="hike.pricing.notes" class="price-note">{{ hike.pricing.notes }}</span>
    </div>

    <!-- Spots -->
    <div v-if="hike.capacity.max_participants" class="spots-section">
      <div class="spots-header">
        <span class="spots-label">Spots</span>
        <span class="spots-value" :class="spotsColor">
          {{ hike.capacity.is_full ? 'Full' : `${hike.capacity.spots_remaining} of ${hike.capacity.max_participants} left` }}
        </span>
      </div>
      <div v-if="spotsPercent != null" class="spots-bar">
        <div
          class="spots-fill"
          :class="spotsColor"
          :style="{ width: spotsPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Deadline -->
    <div v-if="hike.registration.deadline_display" class="deadline">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="deadline-icon">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      Register by {{ hike.registration.deadline_display }}
    </div>

    <!-- CTA -->
    <a
      v-if="hike.registration.url && hike.registration.is_open && !hike.is_cancelled"
      :href="hike.registration.url"
      target="_blank"
      rel="noopener noreferrer"
      class="register-btn"
    >
      Register Now
    </a>
    <div v-else-if="hike.is_cancelled" class="status-chip status-chip--cancelled">
      Hike Cancelled
    </div>
    <div v-else-if="hike.capacity.is_full" class="status-chip status-chip--full">
      Fully Booked
    </div>
    <div v-else class="status-chip status-chip--closed">
      Registration Closed
    </div>

    <!-- Registration notes -->
    <p v-if="hike.registration.notes" class="reg-notes">{{ hike.registration.notes }}</p>

    <!-- Contact -->
    <div v-if="hike.contact.phone || hike.contact.email || hike.contact.whatsapp" class="contact-section">
      <p class="contact-label">Contact</p>
      <p v-if="hike.contact.name" class="contact-name">{{ hike.contact.name }}</p>

      <a v-if="hike.contact.phone" :href="telHref(hike.contact.phone)" class="contact-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="contact-icon">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 18"/>
        </svg>
        {{ hike.contact.phone }}
      </a>

      <a v-if="hike.contact.email" :href="'mailto:' + hike.contact.email" class="contact-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="contact-icon">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        {{ hike.contact.email }}
      </a>

      <a
        v-if="hike.contact.whatsapp"
        :href="whatsappHref(hike.contact.whatsapp)"
        target="_blank"
        rel="noopener noreferrer"
        class="contact-link contact-link--whatsapp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" class="contact-icon">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
        WhatsApp
      </a>
    </div>
  </div>
</template>

<style scoped>
.reg-card {
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  border: 2px solid transparent;
}

.reg-card--closed {
  border-color: var(--color-gray-200);
}

.price-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.price {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-gray-800);
}

.price-note {
  font-size: var(--text-sm);
  color: var(--color-gray-400);
}

/* Spots */
.spots-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.spots-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spots-label {
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

.spots-value {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.spots-bar {
  height: 6px;
  background: var(--color-gray-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.spots-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
}

.spots--green { color: #065f46; }
.spots--amber { color: #92400e; }
.spots--red { color: #991b1b; }

.spots-fill.spots--green { background: #10b981; }
.spots-fill.spots--amber { background: #f59e0b; }
.spots-fill.spots--red { background: #ef4444; }

/* Deadline */
.deadline {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-gray-500);
}

.deadline-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: var(--color-warning);
}

/* CTA */
.register-btn {
  display: block;
  text-align: center;
  padding: var(--space-4) var(--space-6);
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  text-decoration: none;
  transition: background var(--duration-fast) var(--ease-out);
}

.register-btn:hover {
  background: var(--color-primary-hover);
}

.status-chip {
  text-align: center;
  padding: var(--space-3) var(--space-5);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.status-chip--cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.status-chip--full, .status-chip--closed {
  background: var(--color-bg-secondary);
  color: var(--color-gray-500);
}

.reg-notes {
  font-size: var(--text-sm);
  color: var(--color-gray-400);
  margin: 0;
  line-height: var(--leading-normal);
}

/* Contact */
.contact-section {
  border-top: 1px solid var(--color-gray-100);
  padding-top: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.contact-label {
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-gray-400);
  margin: 0;
}

.contact-name {
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-gray-700);
  margin: 0;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  color: var(--color-primary);
  text-decoration: none;
}

.contact-link:hover {
  text-decoration: underline;
}

.contact-link--whatsapp {
  color: #25d366;
}

.contact-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}
</style>
