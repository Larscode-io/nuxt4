<!-- API based page -->
<template>
  <div>
    <BannerImage
      :title="t('menu.court.publications.speeches', 2)"
      :description="t('menu.court.publications.speeches-title-description')"
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
          v-for="{ id, title, filePath } in reports"
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
                  <v-icon color="rgb(var(--v-theme-pdfRed))">mdi-file-pdf-box</v-icon>
                  <span class="description-text">{{ title }}</span>
                </v-card-title>
              </v-card>
            </a>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/newsletter-background-opt.png'
import { ApiUrl, DISCOURS_WORDS_FOR_FILTERING } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

interface Record {
  id: number
  title: string
  fileName: string
  filePath: string
}
const url = `${ApiUrl.pressGeneralRelease}?lang=${locale.value}`
const { data, error, status, refresh } = await useFetch<Record[]>(url)

if (error.value) {
  console.error(error.value)
}
const reports = computed(() => {
  return data.value
    ? data.value.filter((report: { title: string }) => {
      const title = report.title?.toLowerCase()
      return (
        DISCOURS_WORDS_FOR_FILTERING.map(key =>
          title?.includes(key?.toLowerCase()),
        ).filter(Boolean)?.length > 0
      )
    })
    : []
})

useHead({
  title: t('menu.court.publications.speeches') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('menu.court.publications.speeches-title-description') || '',
    },
  ],
})
</script>

<style lang="scss" scoped>
.description-text {
  white-space: normal;
  word-break: break-word;
}
</style>
