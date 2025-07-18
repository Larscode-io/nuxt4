<template>
  <v-container class="flex-column align-start flex-nowrap" fluid>
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <ContentRenderer :value="page.body" class="section-content" />
      </v-col>
    </v-row>
    <v-row class="mt-5" justify="center">
      <v-col cols="12" md="10" lg="8">
        <img :src="imageSrc" alt="Save the date" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAsyncData } from '#app'
import { ContentKeys } from '~/core/constants'

const { t, locale, langCollection } = useLanguage()

const contentPath = ref(`${ContentKeys.mediaRonde}`)
const pad = computed(() => `/${locale.value}/${contentPath.value}`)

const { data: page, pending, error } = useAsyncData(
  `content-${locale.value}-${contentPath.value}`,
  async () => {
    try {
      return await queryCollection(langCollection[locale.value]).path(pad.value).first()
    } catch (err) {
      console.error('Error fetching page content:', err)
      return null
    }
  }
)

const lang = computed(() => {
  const localeMap: { [key: string]: string } = {
    de: 'NL',
    en: 'FR',
  }
  return localeMap[locale.value] || locale.value.toUpperCase()
})

const imageSrc = computed(() =>
  `/img/ronde/RVDR-PDEDD_Save%20the%20date-${lang.value}.png`
)
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
  @include mobile {
    padding: 32px;
  }
}
</style>
