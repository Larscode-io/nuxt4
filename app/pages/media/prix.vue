<template>
  <div>
    <ContentPage
      :enable-toc="false"
      :content-path="`${ContentKeys.prize}`"
    >
      <template #extra-content>
        <v-carousel
          v-if="images.length > 0"
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
      </template>
    </ContentPage>
  </div>
</template>

<script setup lang="ts">
import { ContentKeys } from '@core/constants'

const { data: imageList } = await useAsyncData('carrousel-images', async () => {
  try {
    return await $fetch<string[]>('/api/carrousel-images')
  }
  catch (error) {
    console.error('Failed to fetch carousel images:', error)
    return []
  }
})

const images = computed(() => imageList.value || [])

const getImagePath = (imageName: string) => {
  const url = `${useRuntimeConfig().app.baseURL}prize/carrousel/${imageName}`
  return url
}
</script>

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
}

// Carousel arrow and dot color override for Vuetify 3
::v-deep(.v-carousel) {
  .v-btn--icon {
    color: rgb(56, 25, 196) !important;
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
</style>
