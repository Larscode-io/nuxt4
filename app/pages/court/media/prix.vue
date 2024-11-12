<template>
  <v-container
    class="fill-height"
    fluid
  >
    <ContentRendererMarkdown
      :value="page?.body || {}"
      :components="components"
      class="nuxt-content content-renderer"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FotoComponentPrize from '~/components/FotoComponentPrize.vue'
// // import ErrorCard from '../components/ErrorCard.vue'
import { ContentKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { locale } = useLanguage()

const contentPath = ref(`${ContentKeys.prize}`)
const { data: page } = await useAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${contentPath.value}`)
      .findOne()
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
})
// The components used in the Markdown renderer
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
