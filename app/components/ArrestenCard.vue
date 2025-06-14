<!-- /components/ArrestenCard.vue -->
<template>
  <v-card
    class="arresten-card"
    elevation="2"
    color="rajah-yellow"
  >
    <!-- Achtergrond watermark: weegschaal-icoon -->
    <v-icon
      class="arresten-card__watermark"
      size="128"
      color="rajah-yellow"
    >
      mdi-scale-balance
    </v-icon>

    <!-- DATE & ARREST-NUMMER RIJ -->
    <div class="arresten-card__header">
      <span class="arresten-card__date">{{ formattedDate }}</span>
      <a
        :href="`/arresten/${arrestNumber}`"
        class="arresten-card__link-arrest"
        @click.prevent="onArrestClick"
      >
        Arrest nr. {{ arrestNumber }}
      </a>
    </div>

    <!-- TITEL -->
    <div class="arresten-card__title">
      {{ title }}
    </div>

    <!-- OPTIONELE BULLETPOINTS -->
    <ul v-if="bulletPoints && bulletPoints.length" class="arresten-card__list">
      <li v-for="(item, idx) in bulletPoints" :key="idx">
        {{ item }}
      </li>
    </ul>

    <!-- LEES VERDER → -->
    <div class="arresten-card__footer">
      <a :href="`/arresten/${arrestNumber}`" class="arresten-card__read-more">
        Lees verder →
      </a>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props:
 *  • dateString:   ISO date string (bijv. "2025-06-05")
 *  • arrestNumber: nummer van het arrest (bijv. "85/2025")
 *  • title:        Titel of korte omschrijving van het arrest
 *  • bulletPoints: Optionele array met korte opsommingsteksten
 */
interface Props {
  dateString:  string
  arrestNumber: string
  title:        string
  bulletPoints?: string[]
}

const props = defineProps<Props>()
const { dateString, arrestNumber, title, bulletPoints } = toRefs(props)

// Formatteer de datum naar "DD/MM/YYYY"
const formattedDate = computed(() => {
  const d = new Date(dateString.value)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
})

// Optionele functie wanneer iemand op de arrest-link klikt
// Hier kan je router.push(…) of window.location = … doen
function onArrestClick(event: Event) {
  // Bijvoorbeeld navigeren naar detailpagina (zonder page-reload):
  // router.push({ name: 'arresten-detail', params: { id: arrestNumber.value } })
  // In dit voorbeeld volgt de link gewoon, dus `prevent` is optioneel.
  return
}
</script>

<style scoped lang="scss">
/* ─────────────────────── ALGEMENE STYLING ─────────────────────── */

.arresten-card {
  position: relative;
  max-width: 360px;
  border-radius: 8px;
  overflow: hidden;
  padding: 16px;
  background-color: var(--v-theme-rajah-yellow); /* #fcbf60 */
  color: var(--v-theme-dark-grey);
  font-family: 'Proxima Nova', sans-serif;
}

/* Watermark-weegschaal: groot en licht, onder andere content */
.arresten-card__watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.08; /* heel licht */
}

/* ───────────────────── HEADER (datum + arrest-link) ───────────────────── */
.arresten-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.arresten-card__date {
  font-size: 0.75rem;
  color: var(--v-theme-dark-grey);
}

.arresten-card__link-arrest {
  font-size: 0.75rem;
  color: var(--v-theme-dark-grey);
  text-decoration: none;
  border-bottom: 1px solid var(--v-theme-dark-grey);
  padding-bottom: 2px;
}

.arresten-card__link-arrest:hover {
  color: var(--v-theme-primary);
  border-color: var(--v-theme-primary);
}

/* ───────────────────── TITEL ───────────────────── */
.arresten-card__title {
  font-size: 1rem;
  font-family: 'Tiempos Headline', serif;
  font-weight: 600;
  color: var(--v-theme-dark-grey);
  margin-bottom: 8px;
  line-height: 1.4;
}

/* ───────────────────── OPTIONELE BULLETLIST ───────────────────── */
.arresten-card__list {
  list-style-type: disc;
  padding-left: 1rem;
  margin-bottom: 12px;

  li {
    font-size: 0.85rem;
    color: var(--v-theme-dark-grey);
    margin-bottom: 4px;
  }
}

/* ───────────────────── LEES VERDER FOOTER ───────────────────── */
.arresten-card__footer {
  margin-top: auto;
  text-align: right;
}

.arresten-card__read-more {
  font-size: 0.85rem;
  color: var(--v-theme-dark-grey);
  text-decoration: none;
  font-weight: 500;
}

.arresten-card__read-more:hover {
  color: var(--v-theme-primary);
}

/* ───────────────────── HOVER/FOCUS EFFECT ───────────────────── */
.arresten-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease-in-out;
}
</style>
