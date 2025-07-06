<!-- /pages/arresten.vue -->
<template>
  <v-app>
    <v-main>
      <v-container class="py-8 px-4">
        <h1 class="arresten-page__title">
          Recentelijke Arresten
        </h1>

        <!-- Eerste arrest: drie kartonnen naast elkaar -->
        <v-row
          dense
          class="mb-8"
        >
          <!-- Originele ArrestenCard (gele kaart) -->
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-6"
          >
            <ArrestenCard
              date-string="2025-06-05"
              arrest-number="85/2025"
              title="Beroepen tot vernietiging van het Vlaamse decreet van 16 juni 2023 …"
              :bullet-points="[
                'Vernietiging (Vlaams decreet 16/06/2023)',
                'Beëindiging Provinciedecreet van 2005',
              ]"
            />
          </v-col>

          <!-- Nieuwe ArrestenCard2 (donker + goud + ivoor) -->
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-6"
          >
            <ArrestenCard2
              date-string="2025-06-05"
              arrest-number="85/2025"
              title="Beroepen tot vernietiging van het Vlaamse decreet van 16 juni 2023 …"
              :bullet-points="[
                'Vernietiging (Vlaams decreet 16/06/2023)',
                'Beëindiging Provinciedecreet van 2005',
              ]"
            />
          </v-col>

          <!-- Nieuwe ArrestenCard3 (donkerblauw + gele lintband) -->
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-6"
          >
            <ArrestenCard3
              date-string="2025-06-05"
              arrest-number="85/2025"
              title="Beroepen tot vernietiging van het Vlaamse decreet van 16 juni 2023 …"
              :bullet-points="[
                'Vernietiging (Vlaams decreet 16/06/2023)',
                'Beëindiging Provinciedecreet van 2005',
              ]"
            />
          </v-col>
        </v-row>

        <!-- Tweede arrest: opnieuw de drie versies -->
        <v-row dense>
          <!-- Originele ArrestenCard -->
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-6"
          >
            <ArrestenCard
              date-string="2025-05-28"
              arrest-number="84/2025"
              title="Prejudiciële vraag over onteigening voor het algemeen nut ..."
              :bullet-points="[
                'Prejudiciële vraag behoeft geen antwoord',
              ]"
            />
          </v-col>

          <!-- ArrestenCard2 -->
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-6"
          >
            <ArrestenCard2
              date-string="2025-05-28"
              arrest-number="84/2025"
              title="Prejudiciële vraag over onteigening voor het algemeen nut …"
              :bullet-points="[
                'Prejudiciële vraag behoeft geen antwoord',
              ]"
            />
          </v-col>

          <!-- ArrestenCard3 -->
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
            class="mb-6"
          >
            <ArrestenCard3
              date-string="2025-05-28"
              arrest-number="84/2025"
              title="Prejudiciële vraag over onteigening voor het algemeen nut …"
              :bullet-points="[
                'Prejudiciële vraag behoeft geen antwoord',
              ]"
            />
          </v-col>
        </v-row>

        <!-- Derde arrest: ArrestenCard4 -->
        <v-row dense>
          <v-col
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ArrestenCard4
              date-string="2025-06-05"
              arrest-number="85/2025"
              title="Beroepen tot vernietiging van het Vlaamse decreet..."
              :bullet-points="[
                'Vernietiging (Vlaams decreet 16/06/2023)',
                'Beëindiging Provinciedecreet 2005',
              ]"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import ArrestenCard from '@/components/ArrestenCard.vue'
import ArrestenCard2 from '@/components/ArrestenCard2.vue'
import ArrestenCard3 from '@/components/ArrestenCard3.vue'
import ArrestenCard4 from '@/components/ArrestenCard4.vue'
</script>

<style scoped>
.arresten-page__title {
  font-family: 'Tiempos Headline', serif;
  color: var(--v-theme-primary);
  font-size: 2rem;
  margin-bottom: 16px;
}
</style>
