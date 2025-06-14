<!-- /components/UitsprakenCard.vue -->
<template>
  <v-card
    class="uitspraken-card"
    elevation="2"
    color="ivory-grey"
  >
    <!-- DATUMPANEL (nu met extra focus op contrast voor maand) -->
    <v-sheet
      class="uitspraken-card__date-panel"
      color="rajah-extra-light"
      tile
      elevation="0"
    >
      <div class="date-content">
        <span class="date-day">{{ formattedDay }}</span>
        <span class="date-month">JUN.</span>
      </div>
    </v-sheet>

    <!-- LICHTGRIJZE HAMER-ICOON -->
    <v-icon
      class="uitspraken-card__gavel-icon"
      size="48"
      color="ivory-grey"
    >
      mdi-gavel
    </v-icon>

    <!-- INHOUDSGEBIED -->
    <v-card-text class="uitspraken-card__body">
      <span class="label-uitspraken">
        UITSRAAK
      </span>
      <div class="title-uitspraken">
        {{ title }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props:
 *  • dateString: ISO‐geformatteerde datum (bv. "2025-06-05")
 *  • title:     Koptekst van de uitspraak
 */
interface Props {
  dateString: string
  title: string
}
const props = defineProps<Props>()

// Haal dagnummer (twee cijfers) uit dateString
const date = computed(() => new Date(props.dateString))
const formattedDay = computed(() => {
  const d = date.value.getDate()
  return d < 10 ? `0${d}` : `${d}`
})
</script>

<style scoped lang="scss">
.uitspraken-card {
  position: relative;
  max-width: 360px;
  border: 1px solid var(--v-theme-dark-grey);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: var(--v-theme-ivory-grey);
}

/* ─────────────── DATUMPANEL (perfect vierkant, 64px × 64px) ─────────────── */
.uitspraken-card__date-panel {
  width: 64px;
  height: 64px;
  aspect-ratio: 1 / 1;
  border: 2px solid var(--v-theme-rajah-yellow);   /* Rajah Yellow rand */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.date-content {
  text-align: center;
}

/* Grote dag: dark-grey (#777777), contrast ≈ 4.12:1 op #fff4e4 */
.date-day {
  display: block;
  font-family: 'Tiempos Headline', serif;
  font-size: 1.5rem;        /* ±24px → “large” tekst voldoet aan ≥ 3:1 */
  font-weight: 600;
  color: var(--v-theme-dark-grey);
  line-height: 1.2;
}

/* Kleine maand: primary-blauw (#043c72), contrast ≈ 5.2:1 op #fff4e4 */
.date-month {
  display: block;
  font-family: 'Proxima Nova', sans-serif;
  font-size: 0.75rem;       /* ±12px → kleine tekst moet ≥ 4.5:1 halen */
  font-weight: 600;
  color: var(--v-theme-primary);
}

/* ───────────── LIGHT‐GREY HAMER‐ICOON ───────────── */
.uitspraken-card__gavel-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0.12;
}

/* ───────────── INHOUDS‐GEBIED ───────────── */
.uitspraken-card__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0;
}

.label-uitspraken {
  font-family: 'Proxima Nova', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--v-theme-dark-grey);
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.title-uitspraken {
  font-family: 'Tiempos Headline', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--v-theme-dark-grey);
  line-height: 1.4;
}

/* ───────────── HOVER EFFECT ───────────── */
.uitspraken-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease-in-out;
}
</style>
