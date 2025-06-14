<!-- /components/ArrestenCard3.vue -->
<template>
  <v-card
    class="arresten-card3"
    elevation="2"
  >
    <!-- 1) GEEL LINTBAND (ribbon) LINKS BOVEN -->
    <div class="arresten-card3__ribbon">
      <span class="ribbon-text">{{ formattedDate }}</span>
    </div>

    <!-- 2) HOOFDINHOUD (titel, opsomming, link) -->
    <div class="arresten-card3__content">
      <!-- TITEL -->
      <div class="arresten-card3__title">
        {{ title }}
      </div>

      <!-- OPTIONELE BULLETLIST -->
      <ul
        v-if="bulletPoints && bulletPoints.length"
        class="arresten-card3__list"
      >
        <li
          v-for="(item, idx) in bulletPoints"
          :key="idx"
        >
          {{ item }}
        </li>
      </ul>

      <!-- LEES VERDER (arrest-link) ONDERAAN RECHTS -->
      <div class="arresten-card3__footer">
        <a
          :href="`/arresten/${arrestNumber}`"
          class="arresten-card3__read-more"
        >
          Arrest nr. {{ arrestNumber }} →
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
 *  • arrestNumber: bv. "85/2025"
 *  • title:        Korte titeltekst
 *  • bulletPoints: Optionele array met opsommingsteksten
 */
interface Props {
  dateString: string
  arrestNumber: string
  title: string
  bulletPoints?: string[]
}

const props = defineProps<Props>()
const { dateString, arrestNumber, title, bulletPoints } = toRefs(props)

// Formatteren naar "DD/MM/YYYY"
const formattedDate = computed(() => {
  const d = new Date(dateString.value)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
})
</script>

<style scoped lang="scss">
/* ───────────────────────────────────────────────────────────── */
/* ARRESTALLEN CARD 3 – DONKER BLAUW / GEEL LINT / WCAG‐COMPLIANT */
/* ───────────────────────────────────────────────────────────── */

.arresten-card3 {
  position: relative;
  max-width: 360px;
  background-color: #043c72;       /* Donker blauw (primary) */
  border-radius: 8px;
  overflow: hidden;
  padding: 16px;
  color: #ffffff;                  /* Wit voor tekst */
  font-family: 'Proxima Nova', sans-serif;
}

/* ───────────── 1) GEEL LINTBAND LINKS BOVEN ───────────── */
.arresten-card3__ribbon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 24px;
  background-color: #fcbf60;       /* Geelachtig (rajah-yellow) */
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom-right-radius: 8px;
  z-index: 2;
}

.ribbon-text {
  font-size: 0.75rem;               /* ±12px (kleine tekst) */
  font-weight: 600;
  color: #2c2c2c;                   /* Donkergrijs (contrast ≥ 4.7:1) */
}

/* ───────────── 2) HOOFDINHOUD ───────────── */
.arresten-card3__content {
  /* Zorg dat de inhoud onder het lintband valt */
  margin-top: 32px;
}

.arresten-card3__title {
  font-family: 'Tiempos Headline', serif;
  font-size: 1rem;                  /* ±16px (large text) */
  font-weight: 600;
  color: #ffffff;                   /* Wit (contrast ≈ 12:1 op #043c72) */
  margin-bottom: 8px;
  line-height: 1.4;
}

/* ───────────── BULLETLIST (optioneel) ───────────── */
.arresten-card3__list {
  list-style-type: disc;
  padding-left: 1.2rem;
  margin-bottom: 12px;

  li {
    font-size: 0.875rem;            /* ±14px (kleine tekst) */
    color: #ffffff;                 /* Wit (contrast ≈ 12:1) */
    margin-bottom: 4px;
    line-height: 1.4;
  }
}

/* ───────────── 3) LEES VERDER (arrest-link) ───────────── */
.arresten-card3__footer {
  text-align: right;
}

.arresten-card3__read-more {
  font-size: 0.875rem;              /* ±14px */
  color: #fcbf60;                   /* Geel (contrast ≥ 4.7:1 op donkerblauw) */
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #fcbf60;
  padding-bottom: 2px;
}

.arresten-card3__read-more:hover {
  color: #ffffff;                   /* Wit (contrast optimaal) */
  border-color: #ffffff;
}

/* ───────────── HOVER EFFECT ───────────── */
.arresten-card3:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: box-shadow 0.2s ease-in-out;
}
</style>
