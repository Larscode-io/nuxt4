<template>
  <v-app>
    <v-main>
      <v-container class="py-8 px-4">
        <!-- Heading to show your heading color (not part of Vuetify) -->
        <h1 class="mb-6">
          Vuetify Theme Test
        </h1>
        <!-- 1) No color prop → “primary” (#043c72) is used automatically, but note v-btn’s default variant is text,
              so if you want that solid fill, set variant="elevated" or explicitly color="primary". -->
        <v-btn
          variant="elevated"
          class="ma-2"
        >
          Default (Primary) Button
        </v-btn>

        <!-- 2) Explicitly using our custom key "sky-blue" (registered above) -->
        <v-btn
          color="sky-blue"
          variant="elevated"
          class="ma-2"
        >
          Sky Blue Button
        </v-btn>

        <!-- 3) <v-alert type="error"> will pull from `error: '#c32a3a'` in your theme -->
        <v-alert
          type="error"
          class="my-4"
        >
          This is an error alert (uses your custom error color).
        </v-alert>

        <!-- 4) Explicitly “pdf-red” as an outlined variant -->
        <v-alert
          color="pdf-red"
          variant="outlined"
          class="my-4"
        >
          Outlined alert in PDF Red
        </v-alert>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
// No extra script logic is needed for this test.
</script>

<style scoped>
h1 {
  font-family: 'Tiempos Headline', sans-serif;
  font-size: 2rem;
  margin-bottom: 1rem;
}
</style>
