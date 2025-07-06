<!-- API based page -->
<script setup lang="ts">
// todo: error card ?
import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/newsletter-background-opt.png'
import { ApiUrl } from '~/core/constants'

import type { PubBrochuresData } from '~/core/constants'

const { t, locale } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

interface Record {
  id: number
  filePath: string
  description: string
}

function desc(record: PubBrochuresData): string {
  switch (locale.value) {
    case 'fr': return record.title_f
    case 'nl': return record.title_n
    case 'de': return record.title_d || ''
    case 'en': return record.title_e || ''
    default: return record.title_n
  }
}

// const { data: brochures, error } = useLazyFetch(`${baseURL}${ApiUrl.publicationsBrochures}?lang=${locale.value}`)

const url = `${ApiUrl.publicationsBrochures}?lang=${locale.value}`
const { data, error, status, refresh } = await useFetch(url, {
  transform: (data: PubBrochuresData[]): Record[] => {
    return data.map((item: PubBrochuresData) => {
      return {
        id: item._k1_Brochure_id,
        filePath: item.filename,
        description: desc(item),
      }
    })
  },
})
const brochures = computed(() => data.value)

if (error.value) {
  console.error(error.value)
}
useHead({
  title: t('menu.court.publications.brochure') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('menu.court.publications.brochure-title-description') || '',
    },
  ],
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.court.publications.brochure')"
      :description="t('menu.court.publications.brochure-title-description')"
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
          v-for="{ id, filePath, description } in brochures"
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
                  {{ description }}
                </v-card-title>
              </v-card>
            </a>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<style lang="scss" scoped></style>
