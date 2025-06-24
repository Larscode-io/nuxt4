<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { computed } from 'vue'
import img from '@assets/img/banner-media.png'
import { ApiUrl } from '@core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

interface Pleading {
  id: number
  zuluDate: string
  date: string
  processingLanguage: string
  description: string
  day: string
  month: string
  hora: string
  maxOfDates: string
}
interface Judgment {
  distance: number
  id: number
  joinedcases: []
  processingLanguage: string
  description: string
  day: string
  month: string
  nr: string
  master: unknown
  kenmerk: string
  encinz: string
  type: string
  norm: string
  date: string
  formatedJudmentDate: string
  dateLong: string
}

const { data, error, status, refresh } = useAsyncData<[Pleading[], Judgment[]]>(() => {
  return Promise.all([
    $fetch<Pleading[]>(`${ApiUrl.pressPleadings}?lang=${locale.value}`),
    $fetch<Judgment[]>(`${ApiUrl.pressJudgment}?lang=${locale.value}`),
  ])
})

const judgments = computed<Judgment[]>(() => {
  if (data.value && Array.isArray(data.value) && data.value.length > 1) {
    return data.value[1]
  }
  return []
})
const pleadings = computed<Pleading[]>(() => {
  if (data.value && Array.isArray(data.value) && data.value.length > 0) {
    return data.value[0]
  }
  return []
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.agenda.title', 2)"
      :description="t('menu.agenda.upcoming-decisions-title-description')"
      :image="img"
      :alt="t('alt.banner.chest')"
    />
    <v-container fluid>
      <div v-if="status === 'pending'">
        <v-row>
          <v-col>
            <v-skeleton-loader
              v-for="n in 10"
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
        <h2>Pleadings</h2>
        <v-row
          v-for="{ id, availablePart, nr, description } in pleadings"
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
                <v-list-item-content>
                  <div class=" mb-3">
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
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
        <h2>Judgments</h2>
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
                <v-list-item-content>
                  <div class=" mb-3">
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
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>
