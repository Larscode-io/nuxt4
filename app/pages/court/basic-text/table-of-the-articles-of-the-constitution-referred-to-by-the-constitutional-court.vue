<!-- API based page -->
<script setup lang="ts">
import { ApiUrl } from '@core/constants'
import img from '~/assets/img/newsletter-background-opt.png'

const { locale } = useI18n()
const { t } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

// `${ApiUrl.arcticlesConstReferredByConstCourt}?lang=${lang}&page=${page}&per-page=${perPage}`
const url = `${baseURL}${ApiUrl.arcticlesConstReferredByConstCourt}?lang=${locale.value}`
const { data } = await useFetch(url)
</script>

<template>
  <v-container
    class="flex-column align-start flex-nowrap"
    fluid
  >
    <BannerImage
      :title="t('general.message.article-const-referred-const-court')"
      :description="t('general.message.article-const-referred-const-court')"
      :image="img"
      alt="picture of the court"
    />
    <div class="d-flex justify-center my-4">
      <v-icon
        size="64"
        color="primary"
      >
        mdi-office-building-cog
      </v-icon>
      Deze pagina is in ontwikkeling
    </div>
    <template v-if="data">
      <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    </template>
    <template v-else>
      <v-skeleton-loader
        type="article"
        height="120px"
      />
    </template>
  </v-container>
</template>

<style lang="scss" scoped>
</style>
