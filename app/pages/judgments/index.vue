<script setup lang="ts">
import { ref } from 'vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl, RoutePathKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

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

const { data: judgments, error, status, refresh }
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

const transform = (data: GeneralPressJudgment[]) => {
  return data.filter((release: { nr: string }) => release.nr.split('/')[1] === String(year.value))
}

const { data }
  = useLazyFetch<GeneralPressJudgment[]>(() => `${baseURL}${ApiUrl.pressReleasesConcerningJudgments}`,
    {
      query: {
        lang: locale.value,
        withArchive: true,
      },
      transform,
    })

const findRelease = (rid: number): GeneralPressJudgment | undefined => data.value?.find((release: GeneralPressJudgment) => Number(release.id) === rid)
// console.log(findRelease(5893)?.filePath)
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.decisions.judgment', 2)"
      :description="t('menu.decisions.title-description')"
      :image="img"
      :alt="t('alt.banner.courtroom')"
    />
    <v-row v-if="status === 'pending'">
      <v-col>
        <v-skeleton-loader
          v-for="n in 5"
          :key="n"
          type="list-item-two-line"
        />
      </v-col>
    </v-row>

    <v-alert
      v-else-if="error"
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
    <v-container
      v-else
      fluid
    >
      <v-row>
        <v-col
          cols="12"
          md="2"
          xl="3"
        >
          <div class="pa-4">
            <v-select
              v-model="selected"
              :items="years"
              item-value="value"
              :label="`${t('general.message.year-selection')}${t('general.message.colon')}`"
            />
          </div>
        </v-col>
        <v-col
          cols="12"
          md="9"
          class="mx-auto mb-3"
        >
          <v-card
            v-for="{ formatedJudmentDate, courtVerdict, nr, description, availablePart, idsRole, keywords, id } in judgments"
            :id="id"
            :key="id"
            outlined
          >
            <v-list-item>
              <div class="top-infos">
                <div class="d-flex justify-space-between">
                  <p>{{ formatedJudmentDate }}</p>
                  <p>{{ courtVerdict }}</p>
                </div>
              </div>
              <h3
                class="py-4"
              >
                <a
                  :href="findRelease(id)?.filePath"
                  rel="noopener noreferrer"
                  target="_blank"
                  :aria-label="t('aria.label.downloadPdf')"
                >
                  <v-icon
                    color="rgb(var(--v-theme-pdfRed))"
                    large
                  >
                    mdi-file-pdf-box
                  </v-icon>
                </a>
                {{ nr }}
              </h3>
              <span
                class="subtitle my-2"
                v-html="description || t('error.no-data-available')"
              />
              <span
                class="subtitle my-2"
                style="display: block;
                color: rgb(var(--v-theme-pdfRed));"
                v-html="availablePart || t('error.no-data-available')"
              />
              <span
                v-if="idsRole"
                class="py-4"
              >
                <h4> {{
                  `${t('general.message.roll-number')}${t('general.message.colon')} ${idsRole.join(' - ')} `
                }}</h4>
              </span>
              <p class="subtitle my-2">
                {{ `${t('general.message.keywords', 2)}${t('general.message.colon')}` }}
              </p>
              <v-banner
                elevation="3"
                class="subtitle my-2"
              >
                <span v-html="keywords || t('error.noDataAvailable')" />
              </v-banner>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
