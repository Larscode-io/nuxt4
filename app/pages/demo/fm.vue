 <!-- demo for this api: http://localhost:3000/nuxt/api/fm/publications/example -->

<script setup lang="ts">
const url = '/api/v1/publications/example'
const { data, error, status, refresh } = await useLazyFetch(url)

if (error.value) {
  console.error(error.value)
}
const brochures = computed(() => data.value.brochures)
</script>

<template>
  <div>
    <v-container>
      <h1>Filemaker API demo page (direct Filemaker databank query)</h1>
      <div v-if="status === 'pending'">
        <v-row>
          <v-col>
            <v-skeleton-loader type="list-item-two-line" />
          </v-col>
        </v-row>
      </div>
      <div v-else-if="error">
        <v-alert
          type="error"
          dismissible
        >
          <v-row>
            <v-col>
              <p>Error: {{ error.message }}</p>
            </v-col>
            <v-col class="d-flex justify-end">
              <v-btn
                color="primary"
                @click="refresh"
              >
                Retry
              </v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </div>
      <div v-else>
        <v-row>
          <v-col cols="8">
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
          <v-col cols="4">
            <v-card>
              <v-card-title>Token expire date</v-card-title>
              <v-card-text>{{ data?.expires }}</v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
