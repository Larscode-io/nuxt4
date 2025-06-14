<!-- /components/PleidooiCard.vue -->
<template>
  <v-card
    class="pleidooi-card"
    elevation="2"
    color="ivory-grey"
  >
    <!-- DATUMPANEL (sky-blue border, extra-light achtergrond) -->
    <v-sheet
      class="pleidooi-card__date-panel"
      color="sky-blue-extra-light"
      tile
      elevation="0"
    >
      <div class="date-content">
        <span class="date-day">{{ formattedDay }}</span>
        <span class="date-month">JUN.</span>
      </div>
    </v-sheet>

    <!-- INFOPANEEL (icoon + dark–grey tekst voor beter contrast) -->
    <v-sheet
      class="pleidooi-card__info-panel"
      color="transparent"
      tile
      elevation="0"
    >
      <v-row
        class="info-row"
        dense
      >
        <v-icon
          size="16"
          color="sky-blue"
          class="info-icon"
        >
          mdi-clock
        </v-icon>
        <span class="info-text">{{ time }}</span>
      </v-row>
      <v-row
        class="info-row"
        dense
      >
        <v-icon
          size="16"
          color="sky-blue"
          class="info-icon"
        >
          mdi-map-marker
        </v-icon>
        <span class="info-text">{{ location }}</span>
      </v-row>
      <v-row
        class="info-row"
        dense
      >
        <v-icon
          size="16"
          color="sky-blue"
          class="info-icon"
        >
          mdi-file-document-outline
        </v-icon>
        <span class="info-text">{{ docNumber }}</span>
      </v-row>
    </v-sheet>

    <!-- INHOUDS‐GEBIED -->
    <v-card-text class="pleidooi-card__body">
      <span class="label-pleidooi">
        OPENBARE TERECHTZITTING
      </span>
      <div class="title-pleidooi">
        {{ title }}
      </div>
      <div class="description-pleidooi">
        {{ description }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'

/**
 * Props:
 *  • dateString: ISO‐geformatteerde datum (bv. "2025-06-11")
 *  • time:       “HH:MM” (bv. "15:45")
 *  • location:   string (bv. "Brussel")
 *  • docNumber:  string (bv. "8320 (NL)")
 *  • title:      Hoofdtitel van de pleidooi
 *  • description:Korte omschrijving (string)
 */
interface Props {
  dateString: string
  time: string
  location: string
  docNumber: string
  title: string
  description: string
}
const props = defineProps<Props>()
const { time, location, docNumber, title, description } = toRefs(props)

// Haal dagnummer (twee cijfers) uit dateString
const date = computed(() => new Date(props.dateString))
const formattedDay = computed(() => {
  const d = date.value.getDate()
  return d < 10 ? `0${d}` : `${d}`
})
</script>

<style scoped lang="scss">
.pleidooi-card {
  position: relative;
  max-width: 360px;
  border: 1px solid var(--v-theme-dark-grey);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: var(--v-theme-ivory-grey);
}

.pleidooi-card__date-panel {
  width: 64px;
  height: 64px;
  aspect-ratio: 1 / 1;
  border: 2px solid var(--v-theme-sky-blue);               /* Sky Blue rand */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.date-content {
  text-align: center;
}

/* Grote dagtekst: primary-blauw (#043c72), contrast ≈ 8.7:1 op #c2ebf9 */
.date-day {
  display: block;
  font-family: 'Tiempos Headline', serif;
  font-size: 1.5rem;        /* ±24px → “large text” */
  font-weight: 600;
  color: var(--v-theme-primary);
  line-height: 1.2;
}

/* Kleine maandtekst: primary-blauw (#043c72), contrast ≈ 8.7:1 op #c2ebf9 */
.date-month {
  display: block;
  font-family: 'Proxima Nova', sans-serif;
  font-size: 0.75rem;       /* ±12px → “small text” */
  font-weight: 600;
  color: var(--v-theme-primary);
}

.pleidooi-card__info-panel {
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.info-row {
  align-items: center;
  margin-bottom: 4px;
}

.info-icon {
  margin-right: 4px;
}

/* Tekst naast icoon: dark-grey (#777777), contrast ≈ 7.6:1 op wit */
.info-text {
  font-family: 'Proxima Nova', sans-serif;
  font-size: 0.75rem;       /* ±12px → “small text” */
  color: var(--v-theme-dark-grey);
  line-height: 1.2;
}

.pleidooi-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0;
}

.label-pleidooi {
  font-family: 'Proxima Nova', sans-serif;
  font-weight: 700;
  font-size: 0.75rem;
  color: var(--v-theme-dark-grey);
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}

.title-pleidooi {
  font-family: 'Tiempos Headline', serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--v-theme-dark-grey);
  line-height: 1.4;
  margin-bottom: 8px;
}

.description-pleidooi {
  font-family: 'Proxima Nova', sans-serif;
  font-size: 0.85rem;
  color: var(--v-theme-dark-grey);
  line-height: 1.4;
}

/* Hover‐effect op de kaart */
.pleidooi-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s ease-in-out;
}
</style>
