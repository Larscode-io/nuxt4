<template>
  <v-app>
    <v-container class="pt-8">
      <h1 class="headline">
        Rechtspraak
        <span class="underline"></span>
      </h1>
      <v-row class="mt-6" dense>
        <v-col
          v-for="caseItem in cases"
          :key="caseItem.number"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card class="case-card" elevation="2">
            <v-card-title class="d-flex justify-space-between align-start pa-4">
              <span class="case-date">{{ caseItem.date }}</span>
              <a href="#" class="case-number">{{ caseItem.number }}</a>
            </v-card-title>
            <v-card-text class="pa-4">
              <h3 class="case-title">{{ caseItem.title }}</h3>
              <p class="case-description">{{ caseItem.description }}</p>
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-btn text color="secondary">Lees verder →</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
const cases = [
  {
    date: '05/06/2025',
    number: 'Arrest nr. 85/2025',
    title: 'Beroepen tot vernietiging',
    description: 'Vlaams decreet van 16 juni 2023 « tot wijziging van het Provinciedecreet...'
  },
  {
    date: '28/05/2025',
    number: 'Arrest nr. 84/2025',
    title: 'Prejudiciële vraag',
    description: 'Vlaams decreet van 24 februari 2017 « betreffende onteigening...'
  },
  {
    date: '15/05/2025',
    number: 'Arrest nr. 80/2025',
    title: 'Prejudiciële vraag',
    description: 'Wetboek van economisch recht (artikel XX.194, tweede lid)'
  }
]
</script>

<style scoped>
.headline {
  font-size: 2rem;
  font-weight: bold;
  position: relative;
}
.underline {
  display: block;
  height: 4px;
  width: 3rem;
  background-color: var(--v-theme-secondary);
  margin-top: 0.25rem;
}
.case-card {
  background-color: rgba(252,191,118,0.2); /* rajahExtraLight */
  border-left: 4px solid #FCBF60;        /* accent */
}
.case-date {
  color: #777777; /* darkGrey/text secondary */
  font-size: 0.875rem;
}
.case-number {
  color: var(--v-theme-secondary);
  font-size: 0.875rem;
  text-decoration: none;
}
.case-number:hover {
  text-decoration: underline;
}
.case-title {
  color: #3D3A44; /* textOnRajah */
  margin-bottom: 0.5rem;
}
.case-description {
  color: #333333; /* text primary */
  font-size: 0.875rem;
}
</style>
