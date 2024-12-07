<!-- Content based Page -->
<template>
  <div>
    <BannerImage
      v-if="page"
      :title="page?.title || ''"
      :description="page?.description"
      :image="img"
      alt=""
    />
    <v-container>
      <v-row>
        <v-col>
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
import img from '~/assets/img/banner-media.png'

import { useLanguage } from '@/composables/useLanguage'
import { ContentKeys } from '~/core/constants'

const { locale } = useLanguage()

const { data: page } = await useAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${ContentKeys.disclaimer}`)
      .findOne()
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
})
</script>
