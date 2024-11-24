// api/fm/example

<template>
  <div>
    <v-container>
      <h1>Filemaker API demo page (direct Filemaker databank query)</h1>
      <v-row>
        <v-col
          cols="8"
        >
          <v-row
            v-for="item in brochures"
            :key="item.filename"
          >
            <v-col>
              <v-card>
                <v-card-title>{{ item.title_n }}</v-card-title>
                <v-card-text>{{ item.filename }}</v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col
          cols="4"
        >
          <v-card>
            <v-card-title>Token expire date</v-card-title>
            <v-card-text>{{ data.expires }}</v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Brochure {
  title_n: string
  filename: string
}

const brochures = ref<Brochure[]>([])
const url = '/api/fm/example'
const { data } = await useFetch(url)

onMounted(() => {
  if (data.value && data.value.brochures) {
    brochures.value = data.value.brochures
  }
})
</script>
