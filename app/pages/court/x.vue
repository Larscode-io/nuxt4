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
                class="media-card"
                max-width="388"
                :aria-labelledby="`artDate${item.id} arrestNr${item.id} publicationTitle${item.id}`"
                @click="goToMediaPage(item.id, item.type)"
              >
                <img
                  :src="getImage(`media-${index}`)"
                  :alt="`Dynamic Image media-${index}`"
                  height="320px"
                >
                <div class="top-infos">
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
                >
                  {{ item.title }}
                </h3>
                <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                <div
                  class="arrow-hover"
                  @click="navigate(item.id, item.type)"
                >
                  {{ t('general.message.read-more') }}
                  <v-icon>mdi-arrow-right</v-icon>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </MyCard>
  </div>
</template>

<style lang="scss" scoped>
.media-card {
  color: $indigo !important;
  padding: 20px;
  position: relative;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;
  border-radius: 0 !important;
  margin: 80px 16px 20px 16px;

  @include mobile {
    width: calc(100% - 32px);
    margin: 80px auto;
    margin-bottom: 20px;
  }

  .v-img {
    transform: translateY(-80px);
  }

  .top-infos {
    display: flex;
    justify-content: space-between;
    margin-top: -62px;

    p {
      font-size: 1rem;
      line-height: 24px;
    }

    p:first-of-type {
      position: relative;

      &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 2px;
        background-color: $indigo;
      }
    }
  }

  h3 {
    font-size: 1.125rem;
    line-height: 20px;
    text-align: left;
    margin-bottom: 20px;
  }

  .v-list-item__subtitle {
    display: -webkit-box;
    text-align: left;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    -webkit-line-clamp: 4;
    margin-bottom: 16px;
    font-size: 0.875rem;
    line-height: 20px;
    font-weight: 400;
  }

  &:hover,
  &:focus {
    background-color: $indigo !important;
    transition: all 0.3s ease-in-out;
    box-shadow: 8px 8px 24px -5px rgba(0, 101, 202, 0.2);
    cursor: pointer;
    color: white !important;

    .top-infos {
      p:first-of-type {
        &:before {
          background-color: white;
        }
      }
    }

    .arrow-hover {
      &:before {
        margin-right: 8px;
      }

      .v-icon {
        color: white;
      }
    }
  }

  .arrow-hover {
    display: flex;

    .v-icon {
      margin-left: 8px;
      color: $indigo;
      display: flex;
      justify-content: flex-start;
      width: fit-content;
    }
  }
}
</style>
