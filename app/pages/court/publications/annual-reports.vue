<template>
  <v-container
    class="flex-column align-start flex-nowrap"
    fluid
  >
    <BannerImage
      :title="t('menu.court.publications.annual-reports', 2)"
      :description="t('menu.court.publications.annual-reports-title-description')"
      :image="img"
      alt=""
    />
    <v-row
      v-for="{ id, filePath, description } of reports"
      :key="id"
      class="d-flex flex-column"
      align="start"
      justify="center"
    >
      <a
        :href="`${baseURL}${filePath}`"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-card>
          <v-card-title>{{ description }}</v-card-title>
        </v-card>
      </a>
    </v-row>
  </v-container>
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
.container {
  padding: 0 !important;
  @include mobile {
    padding: 32px;
  }
}
.d-flex {
  max-width: 1260px !important;
  margin: auto;
  margin-bottom: 80px;
  @include mobile {
    width: 100%;
    margin-bottom: 40px;
  }
}
</style>
