<!-- http://localhost:3000/nuxt/api/fm/getArrestDateMinus10 -->
<!-- http://localhost:3000/nuxt/api/fm/getJuportalData -->

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const arresten = ref([])
const { data: arrestDateMinus10Data } = await useFetch('/api/fm/getArrestDateMinus10')
const { data: juportalData } = await useFetch('/api/fm/getJuportalData')
onMounted(() => {
  if (juportalData.value && juportalData.value.arresten) {
    arresten.value = juportalData.value.arresten
  }
})
</script>

<template>
  <v-container>
    <v-row>
      <v-card>
        <v-card-title>After 10 days limit to publish on Juportal</v-card-title>
        <v-card-text>{{ arrestDateMinus10Data }}</v-card-text>
      </v-card>
    </v-row>
    <v-row>
      <v-card
        v-for="{ recordId } in arresten"
        :key="recordId"
        class="mb-4"
      >
        <v-card-title>Juportal record</v-card-title>
        <v-card-text>{{ recordId }}</v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
