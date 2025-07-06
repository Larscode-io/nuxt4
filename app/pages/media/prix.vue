<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import img from '~/assets/img/prize/prize-banner.jpg'

// ⚠️ This may warn in dev due to useRoute() inside useI18n()
// It's safe as we only use it after route has resolved
const { locale } = useI18n()
const { langCollection } = useLanguage()

const pageName = import.meta.url.split('/').pop()?.split('?')[0]?.replace('.vue', '') ?? 'page'
if (!pageName || pageName === 'page') {
  console.error(
    'No page name found: Detected missing pageKey in useAsyncData. This can cause cache overlap between pages. Use a unique key for each page/component.',
  )
  throw new Error('Page name not found or is invalid.')
}
const { data: page, pending } = useAsyncData(
  () => `${pageName}-${locale.value}`,
  () => queryCollection(langCollection[locale.value])
    .path(`/${locale.value}/${ContentKeys.prize}`)
    .first(),
)

const { data: images } = useAsyncData(
  () => `carrousel-images-${locale.value}`,
  () => $fetch<string[]>(`/api/carrousel-images?lang=${locale.value}`),
)

const getImagePath = (imageName: string) => {
  const url = `${useRuntimeConfig().app.baseURL}prize/carrousel/${imageName}`
  return url
}
</script>

<template>
  <div>
    <BannerImage
      v-if="!pending && page"
      :title="page?.title || ''"
      :description="page?.description"
      :image="img"
      alt=""
    />
    <article>
      <div class="col-12 col-md-9">
        <ContentRenderer
          :value="page?.body || {}"
          class="nuxt-content content-renderer"
        />
      </div>
    </article>
    <div class="carousel-container">
      <v-carousel
        v-if="(images ?? []).length > 0"
        hide-delimiter-background
        show-arrows="hover"
        cycle
        interval="5000"
        transition="fade-transition"
        class="carousel-red"
      >
        <v-carousel-item
          v-for="(imageName, index) in images"
          :key="index"
          class="carousel-red mb-16"
        >
          <v-img
            :src="getImagePath(imageName)"
            :alt="`Afbeelding ${index + 1}`"
            loading="lazy"
            contain
            height="500"
          />
          <v-btn
            icon
            variant="tonal"
            size="small"
            class="position-absolute top-0 right-0 ma-2"
            :href="getImagePath(imageName)"
            :download="imageName"
            target="_blank"
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </v-carousel-item>
      </v-carousel>
    </div>
  </div>
</template>

<style scoped lang="scss">
// Optional: remove padding from container
.container {
  padding: 0 !important;
}

// Optional responsive helpers
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
  margin: 80px auto;

  @include mobile {
    margin-bottom: 80px;
    width: 100%;
  }
// Carousel arrow and dot color override for Vuetify 3
::v-deep(.v-carousel) {
  .v-btn--icon {
    color: rgb(0, 255, 145) !important;
  }

  .v-carousel__controls__prev,
  .v-carousel__controls__next {
    color: red !important;
  }

  .v-carousel__controls {
    background-color: transparent !important;
    box-shadow: none !important;
  }
}

// Limit carousel width and center it
.carousel-container {
  max-width: 520px; // Adjust this value slightly larger than the largest image width
  margin: 0 auto;
}
  }
</style>
