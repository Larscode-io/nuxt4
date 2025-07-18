<!-- Content based Page -->
<template>
  <BannerImage
    v-if="page"
    :title="page.title"
    :description="page.description"
    :image="img"
    :alt="t('alt.banner.flag')"
  />
  <v-row
    v-if="pending"
    class="d-flex justify-center"
  >
    <div class="col-12 col-md-12">
      <v-skeleton-loader
        class="mx-auto"
        max-width="300"
        type="article"
      />
    </div>
  </v-row>
  <v-row
    v-else-if="error"
    class="d-flex justify-center"
  >
    <div class="col-12 col-md-12">
      <ErrorCard
        :message="t('error.fetchingData')"
        :show-go-home="false"
      />
    </div>
  </v-row>
  <v-row
    v-else
    class="d-flex justify-center"
  >
    <v-col
      cols="12"
      md="8"
      lg="10"
      class="mt-10"
    >
      <section>
        <ContentRenderer :value="page.body" class="pa-4" />
      </section>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAsyncData } from '#app'
import { ContentKeys } from '~/core/constants'
import img from '/img/banner-video.png'
import ErrorCard from '~/components/ErrorCard.vue'

const { t, locale, langCollection } = useLanguage()

const contentPath = ref(`${ContentKeys.mediaVideo}`)
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
.nuxt-content {
  h2 {
    padding-top: 32px;
    padding-bottom: 24px;
    font-size: 2rem;
    font-weight: 600;
    @include tablet-portrait {
      padding-top: 24px;
      padding-bottom: 16px;
      font-size: 1.5rem;
    }
  }
}
</style>
