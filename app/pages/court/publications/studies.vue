<template>
  <div>
    <BannerImage
      :title="t('menu.court.publications.studies')"
      :description="t('menu.court.publications.studies-title-description')"
      :image="img"
      alt=""
    />
    <v-container fluid>
      <v-row
        v-for="{ id, filePath, description } in studies"
        :key="id"
        class="justify-center"
      >
        <v-col
          cols="12"
          md="8"
        >
          <a
            :href="`${baseURL}${filePath}`"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-card class="d-flex flex-column justify-center">
              <v-card-title class="d-flex align-center">
                <v-icon
                  class="me-2"
                  color="rgb(var(--v-theme-customRed))"
                >mdi-file-pdf-box</v-icon>
                <span class="description-text">{{ description }}</span>
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
const { data, error } = useLazyFetch(`${baseURL}${ApiUrl.publicationsStudies}?lang=${locale.value}`)
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
      content: t('menu.court.publications.studiesTitleDescription') || '',
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
