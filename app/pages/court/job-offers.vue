<!-- Content based Page -->
<!-- app/pages/court/job-offers.vue -->

<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import img from '@assets/img/newsletter-background-opt.png'

const { locale } = useI18n()
const { t, langCollection } = useLanguage()

const contentPath = ref(`${ContentKeys.presentationJobOffers}`)
const pad = computed(() => `/${locale.value}/${contentPath.value}`)

const { data: page } = useAsyncData(
  () => `job-offers-${locale.value}-${contentPath.value}`,
  () => queryCollection(langCollection[locale.value])
    .path(pad.value)
    .first(),
)
</script>

<template>
  <div>
    <BannerImage
      :title="page?.title || ''"
      :description="t('menu.court.job-offers.title-description')"
      :image="img"
      alt="picture of the court"
    />
    <v-container class="flex-column align-start flex-nowrap">
      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <article v-if="page && page.body">
            <ContentRenderer
              :value="page.body"
              class="nuxt-content content-renderer"
            />
          </article>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
