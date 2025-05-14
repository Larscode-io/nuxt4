<!-- API based page -->
<script setup lang="ts">
import { computed } from 'vue'
import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/newsletter-background-opt.png'
import { ApiUrl } from '~/core/constants'
import { useFetch } from '#imports'

import type { PubAnnualReportData } from '~/core/constants'

const { t, locale } = useLanguage()
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

interface Record {
  id: number
  filePath: string
  description: string
}

function desc(record: PubAnnualReportData): string {
  switch (locale.value) {
    case 'fr': return record.title_f
    case 'nl': return record.title_n
    case 'de': return record.title_d || ''
    case 'en': return record.title_e || ''
    default: return record.title_n
  }
}

const url = `${ApiUrl.publicationsAnnualReports}?lang=${locale.value}`
const { data, error, status, refresh } = await useFetch(url, {
  transform: (data: PubAnnualReportData[]): Record[] => {
    return data.map((item: PubAnnualReportData) => {
      return {
        id: item._k1_Jaarverslag_id,
        filePath: item.filename,
        description: desc(item),
      }
    })
  },
})
if (error.value) {
  console.error(error.value)
}

// todo: check if this is needed
// const url1 = `${ApiUrl.publicationsAnnualReports2}?lang=${locale.value}`
// const { data: data1 } = await useFetch(url1)
// console.log(data1.value)

const reports = computed(() => data.value)
useHead({
  title: t('menu.court.publications.annual-reports') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('menu.court.publications.annual-reports-title-description') || '',
    },
  ],
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.court.publications.annual-reports', 2)"
      :description="t('menu.court.publications.annual-reports-title-description')"
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
          v-for="{ id, filePath, description } in reports"
          :key="id"
          class="justify-center"
        >
          <v-col
            cols="12"
            md="6"
          >
            // add baseurl and filepath for debugging
            <p>
              {{ filePath }}
              <br>
              {{ baseURL }}
            </p>
            <a
              :href="`${baseURL}${filePath}`"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-card class="d-flex flex-column justify-center">
                <v-card-title>
                  <v-icon color="var(--pdf-red)">mdi-file-pdf-box</v-icon>
                </v-card-title></v-card>
            </a>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
</style>
