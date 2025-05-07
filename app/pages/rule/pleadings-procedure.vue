<!-- Content based Page -->
<template>
  <div>
    <BannerImage
      :title="t('menu.rule.pleadings-procedure')"
      :description="t('menu.rule.pleadings-procedure-title-description')"
      :image="img"
      :alt="t('alt.banner.judge')"
    />
    <v-container class="flex-column align-start flex-nowrap">
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
import { ContentKeys } from '@/core/constants'
import img from '~/assets/img/newsletter-background-opt.png'

const { t, locale } = useLanguage()

const { data: page } = await useAsyncData('content', async () => {
  try {
    return await queryContent(`${locale.value}/${ContentKeys.rulePleadingsProcedure}`)
      .findOne()
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
})
</script>
