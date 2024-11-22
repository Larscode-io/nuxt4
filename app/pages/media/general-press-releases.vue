<template>
  <div>
    <BannerImage
      :title="t('menu.press-and-media.general-press-releases')"
      :description="t('menu.press-and-media.general-press-releases-title-description')"
      :image="img"
      alt=""
    />
    <v-container fluid>
      <v-row
        v-for="{ id, title, filePath } in releases"
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
                  color="#C90304"
                >mdi-file-pdf-box</v-icon>
                <span class="description-text">{{ title }}</span>
              </v-card-title>
            </v-card>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
// import AnnualReportCard from '../../components/AnnualReportCard.vue'
import img from '~/assets/img/banner-media.png'
import { ApiUrl, DISCOURS_WORDS_FOR_FILTERING } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

// const i18nKeysRef = ref(i18nKeys)

// during development, if the apiBaseUrl is not set in .env, the legacy server URL node04 will be used (nuxt.config.ts).
const { data, error } = useLazyFetch(`${baseURL}${ApiUrl.pressGeneralRelease}?lang=${locale.value}`)
if (error.value) {
  console.error(error.value)
}

const releases = computed(() => {
  return data.value && Array.isArray(data.value)
    ? data.value.filter((release: { title: string }) => {
      const title = release.title?.toLowerCase()
      const hasDiscours
        = DISCOURS_WORDS_FOR_FILTERING.map(key =>
          title?.includes(key?.toLowerCase()),
        ).filter(Boolean)?.length > 0

      return !hasDiscours
    })
    : []
})

// todo: print
useHead({
  title: t('menu.press-and-media.general-press-releases') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: t('menu.press-and-media.general-press-releases-title-description') || '',
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
