<template>
  <v-container
    class="fill-height"
    fluid
  >
    <ContentRenderer
      :value="page?.body || {}"
      class="nuxt-content content-renderer"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ContentKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { locale } = useLanguage()

const contentPath = ref(`${ContentKeys.prize}`)
const { data: page } = await useAsyncData('content', async () => {
  try {
    const collectionName = `pages_${locale.value}`
    const folderName = locale.value
    const doc = await queryCollection(collectionName)
      .path(`/${folderName}/${contentPath.value}`)
      .first()
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
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
