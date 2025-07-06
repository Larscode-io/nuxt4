<!-- /components/CourtInfoCard.vue -->
<template>
  <div>
    <v-card
      class="court-card"
      elevation="2"
      color="ivory-grey"
    />
    <v-sheet
      color="primary"
      class="court-card__header"
      height="60"
      tile
    >
      <v-row class="fill-height align-center px-4">
        <v-icon
          size="32"
          class="mr-2"
        >
          mdi-gavel
        </v-icon>
        <h2 class="court-card__title">
          Constitutional Court of Belgium
        </h2>
      </v-row>
    </v-sheet>

    <!-- 2) Content slot -->
    <v-card-text class="court-card__body">
      <!-- a dignified accent divider in rajahYellow -->
      <div class="court-card__divider" />

      <!-- Body text in dark grey -->
      <p class="court-card__text">
        <strong>Latest Ruling:</strong>
        The Court has issued a landmark judgment regarding freedom of expression.
        <a
          href="#"
          class="court-card__link"
        >Read more →</a>
      </p>

      <!-- Informational banner in extra-light Sky Blue -->
      <v-sheet
        color="sky-blue-extra-light"
        class="court-card__banner pa-3 mb-4"
        tile
      >
        <v-row class="align-center">
          <v-icon
            size="20"
            color="sky-blue"
            class="mr-2"
          >
            mdi-information
          </v-icon>
          <span class="court-card__banner-text">
            Upcoming Hearing on July 15, 2025
          </span>
        </v-row>
      </v-sheet>

      <!-- 3) Action buttons -->
      <v-row
        class="court-card__actions"
        dense
      >
        <!-- Primary action in Deep Blue -->
        <v-btn
          color="primary"
          class="mr-2"
          variant="elevated"
        >
          View Judgment
        </v-btn>

        <!-- Secondary action in Rajah Yellow (outline style) -->
        <v-btn
          color="rajah-yellow"
          variant="outlined"
        >
          Recent Rulings
        </v-btn>

        <!-- Download PDF in high-contrast PDF Red -->
        <v-spacer />
        <v-btn
          color="pdf-red"
          variant="elevated"
          class="download-btn"
        >
          <v-icon left>
            mdi-file-pdf
          </v-icon>
          Download PDF
        </v-btn>
      </v-row>
    </v-card-text>
  </div>
</template>

<script setup>
// (No script logic is needed for this static example.)
</script>

<style scoped lang="scss">
.court-card {
  max-width: 400px;
  border: 1px solid var(--v-theme-dark-grey);
  border-radius: 8px;
  overflow: hidden;
}

.court-card__header {
  /* primary (#043c72) background; text/icons auto‐contrast to white */
}

.court-card__title {
  color: white;
  font-family: 'Tiempos Headline', serif;
  font-size: 1.25rem;
  margin: 0;
}

.court-card__divider {
  height: 4px;
  width: 60px;
  background-color: var(--v-theme-rajah-yellow);
  margin-bottom: 16px;
}

.court-card__body {
  padding: 16px;
}

.court-card__text {
  color: var(--v-theme-dark-grey);
  font-family: 'Proxima Nova', sans-serif;
  font-size: 0.95rem;
  line-height: 1.5rem;
  margin-bottom: 16px;
}

.court-card__link {
  color: var(--v-theme-sky-blue);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    color: var(--v-theme-sky-blue-extra-light);
    text-decoration: underline;
  }
}

.court-card__banner {
  border-radius: 4px;
}

.court-card__banner-text {
  color: var(--v-theme-sky-blue);
  font-family: 'Proxima Nova', sans-serif;
  font-size: 0.9rem;
}

.court-card__actions {
  /* Align buttons nicely at the bottom */
}

.download-btn {
  background-color: var(--v-theme-pdf-red) !important;
  color: white !important;
}

.download-btn .v-icon {
  color: white !important;
}
</style>
