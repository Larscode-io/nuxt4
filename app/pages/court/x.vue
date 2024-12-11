<script setup lang="ts">
import { ApiUrl } from '@/core/constants'
import { useImageLoader } from '~/composables/useImageLoader'

const { getImage } = useImageLoader()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl
const { t, locale } = useLanguage()
definePageMeta({
  layout: 'default',
})
const router = useRouter()
const goToMediaPage = (id, type) => {
  if (type === 'pressReleaseForJudgments') {
    router.push({
      name: 'court-press-release',
      params: { id },
    })
  }
  else {
    router.push({
      name: 'court-press-release',
      params: { id },
    })
  }
}
</script>

<template>
  <div>
    <MyCard
      :api-url-press="`${baseURL}${ApiUrl.pressGeneralRelease}?lang=${locale}`"
      :api-url-judgments="`${baseURL}${ApiUrl.pressReleasesConcerningJudgments}?lang=${locale}&withArchive=false`"
      :max-items="6"
      class="mediaCard"
    >
      <template #default="{ items }">
        <v-container>
          <v-row>
            <v-col
              v-for="(item, index) in items"
              :key="item.id"
              cols="12"
              md="4"
            >
              <v-card
                class="pa-4 ma-4 elevation-2 hover-effect"
                max-width="388"
                :aria-labelledby="`artDate${item.id} arrestNr${item.id} publicationTitle${item.id}`"
                @click="goToMediaPage(item.id, item.type)"
              >
                <img
                  :src="getImage(`media-${index}`)"
                  :alt="`Dynamic Image media-${index}`"
                  height="320px"
                  class="mb-4"
                >
                <div class="d-flex justify-space-between mb-4">
                  <p :id="`artDate${item.id}`">
                    {{ item.date }}
                  </p>
                  <p
                    :id="`arrestNr${item.id}`"
                    :aria-label="item.ariaLabelReference"
                  >
                    {{ t('general.message.add-judgment-number-label') }}
                    {{ item.reference }}
                  </p>
                </div>
                <h3
                  :id="`publicationTitle${item.id}`"
                  :aria-label="item.title + ' ' + t('aria.label.description.continueReading')"
                  class="text-h6 mb-4"
                >
                  {{ item.title }}
                </h3>
                <v-list-item-subtitle class="text-truncate-4 mb-4">
                  {{ item.description }}
                </v-list-item-subtitle>
                <div
                  class="d-flex align-center"
                  @click="goToMediaPage(item.id, item.type)"
                >
                  {{ t('general.message.read-more') }}
                  <v-icon class="ml-2">
                    mdi-arrow-right
                  </v-icon>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </MyCard>
  </div>
</template>

<style scoped>
.hover-effect {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.hover-effect:hover,
.hover-effect:focus {
  background-color: #3f51b5 !important;
  color: white !important;
}
</style>
