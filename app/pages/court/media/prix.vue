<template>
  <v-container
    class="fill-height"
    fluid
  >
    <ContentRendererMarkdown
      :value="page.body"
      :components="components"
      class="nuxt-content content-renderer"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'
import FotoComponentPrize from '@/components/FotoComponentPrize'
// // import ErrorCard from '../components/ErrorCard.vue'
import imgX from '~/assets/img/prize/prize-banner.jpg'
import prizeImgCourt from '~/assets/img/prize/court-transparent.png'
import prizeImgFlyer from '~/assets/img/prize/prize-flyer-a4-fr.jpeg'
import prizeImgDeco from '~/assets/img/prize/deco-transparent.png'

import img from '~/assets/img/newsletter-background-opt.png'
import { ContentKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

const route = useRoute()

const contentPath = ref(`${ContentKeys.prize}`)
const { data: page } = await useAsyncData('content', async () => {
  try {
    // const doc = await queryContent(`${locale.value}/${contentPath.value}`)
    const doc = await queryContent(`${locale.value}/prize`)
      .findOne()
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
})
// Define the components to be used in the Markdown renderer
const components = {
  FotoComponentPrize,
}
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
    margin-bottom: 40px;
    width: 100%;
  }
}
.d-flex-img {
  max-width: 500px !important;
  margin: auto;
  margin-top: 80px;
  margin-bottom: 80px;
  @include mobile {
    margin-bottom: 80px;
    width: 100%;
  }
}
</style>
