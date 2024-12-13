<script setup lang="ts">
import { ref } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl, RoutePathKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

import { range } from '~/core/utilities'

definePageMeta({
  middleware: ['mid'],
})

const withArchive = ref(true)

const { t, locale } = useLanguage()

const baseURL = useRuntimeConfig().public.apiBaseUrl

const route = useRoute()
console.log(route.query.year)
const currentYear = new Date().getFullYear()
const year = ref(Number(route.query.year) || currentYear)
const OLDEST_YEAR = 1985
if (!year.value || year.value < OLDEST_YEAR || year.value > currentYear || isNaN(year.value)) {
  console.log('redirecting')
}
await navigateTo({ path: RoutePathKeys.judgmentsHome, query: { year: currentYear } })

const years = ref(range(OLDEST_YEAR, new Date().getFullYear()).reverse())

interface LegalCase {
  id: number
  description: string
  availablePart: string
  courtVerdict: string
  fileName: string
  filePath: string
  formatedJudmentDate: string
  idsRole: number[]
  judmentDate: string
  keywords: string
  nr: string
  path: string
  summary: string | null
}
const selected = ref(year)

// during development, if the apiBaseUrl is not set in .env, the legacy server URL node04 will be used (nuxt.config.ts).
const { data: judgments, error, status, refresh } = useFetch<LegalCase[]>(() => `${baseURL}${ApiUrl.judgments}?lang=${locale.value}&year=${year.value}`, {
  watch: [selected],
})
if (error.value) {
  console.error(error.value)
}

watch(() => year.value, () => {
  navigateTo({ path: RoutePathKeys.judgmentsHome, query: { year: year.value } })
  // refresh()
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.decisions.judgment', 2)"
      :description="t('menu.decisions.title-description')"
      :image="img"
      :alt="t('alt.banner.courtroom')"
    />
    <v-row>
      <v-col
        cols="2"
      >
        <v-select
          v-model="selected"
          :items="years"
          item-value="value"
          item-text="text"
          label="Select Year"
          outlined
        />
      </v-col>
      <v-col cols="10">
        <v-container fluid>
          <div v-if="status === 'pending'">
            <v-row>
              <v-col>
                <v-skeleton-loader
                  v-for="n in 5"
                  :key="n"
                  type="list-item-two-line"
                />
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
            <v-row
              v-for="{ id, availablePart, nr, description } in judgments"
              :key="id"
              class="justify-center"
            >
              <v-col
                cols="12"
                md="6"
              >
                <v-card
                  :id="id"
                  class="mx-auto mb-3"
                  outlined
                >
                  <v-list-item>
                    <div class=" mb-3">
                      <v-icon color="rgb(var(--v-theme-pdfRed))">
                        mdi-file-pdf-box
                      </v-icon>

                      <h3> {{ nr }} </h3>
                      <h3> {{ availablePart }} </h3>
                    </div>
                    <v-list-item-title class="headline mb-1">
                      {{
                        description
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        description
                      }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </v-col>
    </v-row>
  </div>
</template>
