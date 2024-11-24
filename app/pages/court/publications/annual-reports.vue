<template>
  <div>
    <BannerImage
      :title="t('menu.court.publications.annual-reports', 2)"
      :description="t('menu.court.publications.annual-reports-title-description')"
      :image="img"
      alt=""
    />
    <v-container fluid>
      <v-row
        v-for="{ id, filePath, description } in reports"
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
                <v-icon
                  color="rgb(var(--v-theme-pdfRed))"
                >mdi-file-pdf-box</v-icon>
                {{ description }}
              </v-card-title>
            </v-card>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/newsletter-background-opt.png'
import { ApiUrl } from '~/core/constants'

import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

// during development, if the apiBaseUrl is not set in .env, the legacy server URL node04 will be used (nuxt.config.ts).
const { data, error } = useLazyFetch(`${baseURL}${ApiUrl.publicationsAnnualReports}?lang=${locale.value}`)
if (error.value) {
  console.error(error.value)
}
const reports = computed(() => data.value)

useHead({
  title: t('menu.court.publications.annual-reports') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('menu.court.publications.annualReportsTitleDescription') || '',
    },
  ],
})
</script>

<style lang="scss" scoped>
.custom-redtext {
color: rgb(var(--v-theme-pdfRed));
}
</style>
