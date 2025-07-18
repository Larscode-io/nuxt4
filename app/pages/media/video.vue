<template>
  <v-container class="flex-column align-start flex-nowrap " fluid >
    <BannerImage
      v-if="page"
      :title="page.title"
      :description="page.description"
      :image="img"
      :alt="t('alt.banner.flag')"
    />
    <!-- <VideoWithSubtitles video-id="FILM1" /> -->
    <v-row
      v-if="pending"
      class="d-flex"
      justify="center"
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
      class="d-flex"
      justify="center"
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
      class="d-flex"
      justify="center"
    >
      <div class="mt-10 col-12 col-md-14">
        <section>
          <ContentRenderer :value="page.body" class="section-content" />
        </section>
      </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAsyncData } from '#app'
import { ContentKeys } from '~/core/constants'
import img from '/img/banner-video.png'
import ErrorCard from '~/components/ErrorCard.vue'

const { t, locale, langCollection } = useLanguage()

// Define the content path and locale-based path
const contentPath = ref(`${ContentKeys.mediaVideo}`)
const pad = computed(() => `/${locale.value}/${contentPath.value}`)

// Fetch the page content
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
