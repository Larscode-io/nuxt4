<!-- /pages/announcements.vue -->
<template>
  <v-app>
    <v-main>
      <v-container class="py-8 px-4">
        <h1 class="mb-6">Aankondigingen van Uitspraken & Pleidooien</h1>

        <v-row dense>
          <!-- Uitspraken Card Example -->
          <v-col cols="12" sm="6" class="mb-6">
            <UitsprakenCard
              dateString="2025-06-05"
              title="De beroepen tot vernietiging van het Vlaamse decreet ..."
            />
          </v-col>

          <!-- Pleidooi Card Example -->
          <v-col cols="12" sm="6" class="mb-6">
            <PleidooiCard
              dateString="2025-06-11"
              time="15:45"
              location="Brussel"
              docNumber="8320 (NL)"
              title="Openbare terechtzitting"
              description="Het beroep tot vernietiging van de wet van 15 mei 2024 « tot invoering van een Samenleving… »"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
</script>

<style scoped>
h1 {
  font-family: 'Tiempos Headline', serif;
  font-size: 2rem;
  color: var(--v-theme-primary);
  margin-bottom: 1rem;
}
</style>
