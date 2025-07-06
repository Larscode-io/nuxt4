<!-- /components/ArrestenCard2.vue -->
<template>
  <v-card class="arresten-card2" elevation="4">
    <!-- Goldberg datumpaneel (golden circle) -->
    <div class="arresten-card2__date-circle">
      <div class="date-inner">
        <span class="date-day">{{ formattedDay }}</span>
        <span class="date-month">JUN.</span>
      </div>
    </div>

    <!-- Arrest‐nummer (bovenaan rechts) -->
    <a
      :href="`/arresten/${arrestNumber}`"
      class="arresten-card2__link-arrest"
      @click.prevent="onArrestClick"
    >
      Arrest nr. {{ arrestNumber }}
    </a>

    <!-- Titel en omschrijving -->
    <div class="arresten-card2__content">
      <div class="arresten-card2__title">
        {{ title }}
      </div>

      <ul v-if="bulletPoints && bulletPoints.length" class="arresten-card2__list">
        <li v-for="(item, idx) in bulletPoints" :key="idx">
          {{ item }}
        </li>
      </ul>

      <!-- Lees verder → -->
      <div class="arresten-card2__footer">
        <a :href="`/arresten/${arrestNumber}`" class="arresten-card2__read-more">
          Lees verder →
        </a>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'

/**
 * Props:
 *  • dateString:   ISO datum (bv. "2025-06-05")
 *  • arrestNumber: string, bv. "85/2025"
 *  • title:        string, korte titeltekst
 *  • bulletPoints: optionele array van strings
 */
interface Props {
  dateString:   string
  arrestNumber: string
  title:        string
  bulletPoints?: string[]
}

const props = defineProps<Props>()
const { dateString, arrestNumber, title, bulletPoints } = toRefs(props)

// Formatteren naar "DD" en "MM" (vast “JUN.”, kan je lokaliseren)
const date = computed(() => new Date(dateString.value))
const formattedDay = computed(() => {
  const d = date.value.getDate()
  return d < 10 ? `0${d}` : `${d}`
})

// Link‐functie: navigeer bijv. naar detailpagina
function onArrestClick(event: Event) {
  // Hier zou je router.push(…) kunnen gebruiken
  return
}
</script>

<style scoped lang="scss">
/* ────────────────────────────────────────────────────────────────────── */
/*  ARRESTALLEN CARD 2 – DONKER CHARCOAL / GOUDBORDER / IVORY‐TEKST        */
/* ────────────────────────────────────────────────────────────────────── */

.arresten-card2 {
  position: relative;
  max-width: 360px;
  background-color: #2c2c2c; /* Donker charcoal */
  border: 2px solid #d4af37; /* Gouden rand (Gold accent) */
  border-radius: 8px;
  overflow: hidden;
  padding: 16px;
  color: #fafafa; /* Ivory tekstkleur voor algemene leesbaarheid */
  font-family: 'Proxima Nova', sans-serif;
}

/* ─────────────── DATUM CIRCEL ─────────────── */
.arresten-card2__date-circle {
  position: absolute;
  top: -12px;
  left: -12px;
  width: 72px;
  height: 72px;
  background-color: #d4af37; /* Gold */
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.date-inner {
  text-align: center;
  color: #2c2c2c; /* Contrasterende donkerkleuren binnen de cirkel */
}

.date-day {
  display: block;
  font-size: 1.5rem;          /* ±24px, groot en duidelijk */
  font-weight: 700;
}

.date-month {
  display: block;
  font-size: 0.75rem;         /* ±12px, “kleine tekst” */
  font-weight: 600;
}

/* ─────────────── ARREST‐LINK BOVEN RECHTS ─────────────── */
.arresten-card2__link-arrest {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 0.75rem;
  color: #fafafa;             /* Ivory */
  text-decoration: none;
  border-bottom: 1px solid #fafafa;
  padding-bottom: 2px;
}

.arresten-card2__link-arrest:hover {
  color: #d4af37;             /* Gold */
  border-color: #d4af37;
}

/* ─────────────── HOOFDCONTENT ─────────────── */
.arresten-card2__content {
  margin-top: 48px; /* Ruimte onder de datumcirkel */
  padding-right: 8px;
}

.arresten-card2__title {
  font-family: 'Tiempos Headline', serif;
  font-size: 1.125rem;        /* ±18px */
  font-weight: 600;
  color: #d4af37;             /* Gold-tint titel */
  margin-bottom: 8px;
  line-height: 1.4;
}

/* ─────────────── BULLETPOINTS ─────────────── */
.arresten-card2__list {
  list-style-type: disc;
  padding-left: 1.2rem;
  margin-bottom: 12px;

  li {
    font-size: 0.875rem;       /* ±14px */
    color: #fafafa;            /* Ivory */
    margin-bottom: 4px;
    line-height: 1.4;
  }
}

/* ─────────────── LEES VERDER FOOTER ─────────────── */
.arresten-card2__footer {
  text-align: right;
}

.arresten-card2__read-more {
  font-size: 0.875rem;
  color: #fafafa;             /* Ivory */
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dashed #fafafa;
  padding-bottom: 2px;
}

.arresten-card2__read-more:hover {
  color: #d4af37;             /* Gold */
  border-color: #d4af37;
}

/* ─────────────── HOVER EFFECT ─────────────── */
.arresten-card2:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.2s ease-in-out;
}
</style>
