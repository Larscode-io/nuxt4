<script setup lang="ts">
import { ref } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl, RoutePathKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

import { range } from '~/core/utilities'
import type { GeneralPressJudgment } from '@/core/constants'
import type { Judgment } from '~/core/constants'

const { t, locale } = useLanguage()
const baseURL = useRuntimeConfig().public.apiBaseUrl
const route = useRoute()

const OLDEST_YEAR = 1985
const currentYear = new Date().getFullYear()
const year = ref<number | null>(Number(route.query.year) || currentYear)
const years = ref(range(OLDEST_YEAR, new Date().getFullYear()).reverse())
if (year.value === null || year.value < OLDEST_YEAR || year.value > currentYear || isNaN(year.value)) {
  year.value = currentYear
}

const selected = ref(year)

const { data: judgments, error, status }
  = useFetch<Judgment[]>(() => `${baseURL}${ApiUrl.judgments}`,
    {
      query: {
        lang: locale.value,
        year,
      },
    })
if (error.value) {
  console.error(error.value)
}

watch(() => year.value, () => {
  navigateTo({ path: RoutePathKeys.judgmentsHome, query: { year: year.value } })
}, {
  immediate: true,
})

const { data }
  = useFetch<GeneralPressJudgment[]>(() => `${baseURL}${ApiUrl.pressReleasesConcerningJudgments}`,
    {
      query: {
        lang: locale.value,
        withArchive: true,
      },
      transform: (data: GeneralPressJudgment[]) => data.filter((release: { nr: string }) => release.nr.split('/')[1] === String(year.value)),
    })
const findRelease = (rid: number) => data.value?.find((release: GeneralPressJudgment) => Number(release.id) === rid) || ''

const download = (filePath: string) => {
  const url = `https://www.const-court.be${filePath}`
  window.open(url, '_blank')
}

console.log(findRelease(5893)?.filePath)
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
          label="Select Year"
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
                  <v-list-item v-if="findRelease(id)">
                    <v-list-item-action>
                      <v-btn
                        @click="findRelease(id) ? download((findRelease(id) as GeneralPressJudgment).filePath) : null"
                      >
                        {{ t('general.message.press-releases') }}
                      </v-btn>
                    </v-list-item-action>
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
