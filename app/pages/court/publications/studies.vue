<script setup lang="ts">
import { computed } from 'vue'
import type { PubStudiesData } from '@core/constants'
import { ApiUrl } from '@core/constants'
import img from '@assets/img/newsletter-background-opt.png'
import BannerImage from '@/components/BannerImage.vue'

const { t, locale } = useLanguage()
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

function desc(record: PubStudiesData): string {
  switch (locale.value) {
    case 'fr': return record.title_f
    case 'nl': return record.title_n
    case 'de': return record.title_d || ''
    case 'en': return record.title_e || ''
    default: return record.title_n
  }
}
interface Record {
  id: number
  filePath: string
  description: string
}

const url = `${ApiUrl.publicationsStudies}?lang=${locale.value}`
const { data, error, status, refresh } = await useFetch(url, {
  transform: (data: PubStudiesData[]): Record[] => {
    return data.map((item: PubStudiesData) => {
      return {
        id: item._k1_Studie_id,
        filePath: item.filename,
        description: desc(item),
      }
    })
  },
})

if (error.value) {
  console.error(error.value)
}
const studies = computed(() => data.value)

useHead({
  title: t('menu.court.publications.studies') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('menu.court.publications.studies-title-description') || '',
    },
  ],
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.court.publications.studies')"
      :description="t('menu.court.publications.studies-title-description')"
      :image="img"
      alt=""
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
        <v-row
          v-for="{ id, filePath, description } in studies"
          :key="id"
          class="justify-center"
        >
          <v-col
            cols="12"
            md="6"
          >
            <a
              :href="`${baseURL}${filePath}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-card class="d-flex flex-column justify-center">
                <v-card-title>
                  <v-icon color="var(--pdf-red)">mdi-file-pdf-box</v-icon>
                  <span class="description-text">{{ description }}</span>
                </v-card-title>
              </v-card>
            </a>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.description-text {
  white-space: normal;
  word-break: break-word;
}
</style>
