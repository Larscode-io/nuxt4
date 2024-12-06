<!-- Content based Page -->
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
          <article v-if="page">
            <ContentRendererMarkdown
              :value="page.body || {}"
              class="nuxt-content content-renderer"
            />
          </article>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import img from '~/assets/img/newsletter-background-opt.png'
import { useLanguage } from '@/composables/useLanguage'
import { ContentKeys } from '~/core/constants'

const { t, locale } = useLanguage()

const { data: page } = await useAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${ContentKeys.presentationJobOffers}`)
      .findOne()
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
})
</script>
