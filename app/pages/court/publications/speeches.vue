<template>
  <div>
    <BannerImage
      :title="t('menu.court.publications.speeches', 2)"
      :description="t('menu.court.publications.speeches-title-description')"
      :image="img"
      alt=""
    />
    <v-container fluid>
      <v-row
        v-for="{ id, title, filePath } in reports"
        :key="id"
        class="justify-center"
      >
        <v-col
          cols="12"
          md="6"
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
                  color="#FF0000"
                >mdi-file-pdf-box</v-icon>
                <span class="description-text">{{ title }}</span> </v-card-title>
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
import { ApiUrl, DISCOURS_WORDS_FOR_FILTERING } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()
const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

const { data, error } = useLazyFetch<{ id: number, title: string, filePath: string, description: string }[]>(`${baseURL}${ApiUrl.pressGeneralRelease}?lang=${locale.value}`)
if (error.value) {
  console.error(error.value)
}
const reports = computed(() => {
  return data.value
    ? data.value.filter((report: { title: string }) => {
      const title = report.title?.toLowerCase()
      return (
        DISCOURS_WORDS_FOR_FILTERING.map(key =>
          title?.includes(key?.toLowerCase()),
        ).filter(Boolean)?.length > 0
      )
    })
    : []
})

useHead({
  title: t('menu.court.publications.speeches') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('menu.court.publications.speeches-title-description') || '',
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
