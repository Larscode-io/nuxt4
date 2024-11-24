<template>
  <div>
    <v-container>
      <h1>SQL demo page (direct MySQL query)</h1>
      <v-row
        v-for="item in data"
        :key="item.id"
      >
        <v-col>
          <v-card>
            <v-card-title>{{ item.idRole }}</v-card-title>
            <v-card-text>{{ item.dPronFixe }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const url = '/api/sqltest/affzak'
const { data } = await useFetch(url, {
  lazy: true,
})
</script>
  <!-- // .custom-redtext {color: rgb(var(--v-theme-pdfRed)); } -->
  <!-- // :style="{ color: 'rgb(var(--v-theme-pdfRed))' }" -->
  <!-- // in vuetify elements: color="rgb(var(--v-theme-pdfRed))" -->
