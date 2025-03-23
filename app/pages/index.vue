<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import { RoutePathKeys, ApiUrl, MediaType,
} from '@/core/constants'
import type { GeneralPressJudgment, GeneralPressRelease, Judgment, Pleading, Decision } from '@/core/constants'

const { localePath } = useLanguage()

const { getImage } = useImageLoader()

definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl
const { t, locale } = useLanguage()

const goToJudgmentPage = (id: number, year: string) => {
  navigateTo(localePath(RoutePathKeys.judgmentsHome) + `?year=${year}` + `&id=${id}`)
}
const goToMediaPage = (id: number, type: MediaType) => {
  navigateTo(localePath(RoutePathKeys.mediaPressReleasesConcerningTheJudgments) + '?with-archive=true' + `&id=${id}`)
}
// const goToMailings = ({ mailinfo }) => {
const goToMailings = ({ mailinfo }: { mailinfo: string }) => {
  const dest = localePath(RoutePathKeys.informed)
  navigateTo({ path: dest, query: { mailinfo: mailinfo } })
}
</script>

<template>
  <div>
    <span class="index-banner" />
    <v-container>
      <div class="mt-2 title-container">
        <h2 class="title-h2">
          {{ t('menu.decisions.title') }}
        </h2>
      </div>

      <DecisionBox
        :api-url="`${baseURL}${ApiUrl.judgments}?lang=${locale}`"
        :max-items="6"
      >
        <template
          #item="{ year: thisYearOrPreviousYear, item: { id, formatedJudmentDate, nr, courtVerdict, description, availablePart } }: { item: Judgment }"
        >
          <v-card class="equal-height-card highlighted-card libra-image d-flex flex-column">
            <div class="flex-grow-1">
              <v-card-text>
                <v-row>
                  <v-col cols="5">
                    <span>{{ formatedJudmentDate }}</span>
                  </v-col>
                  <v-col
                    cols="7"
                    class="d-flex justify-end"
                  >
                    <span>{{ t('general.message.add-judgment-number-label') }} {{ nr }}</span>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-title>{{ courtVerdict }}</v-card-title>
              <v-card-text>{{ description }}</v-card-text>
            </div>
            <v-card-title>{{ availablePart }}</v-card-title>
            <v-card-actions>
              <v-btn @click="goToJudgmentPage(id, thisYearOrPreviousYear)">
                {{ t('general.message.read-more') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </DecisionBox>

      <div class="mt-9 title-container ">
        <h2 class="title-h2">
          {{ t('general.message.latest-press-release') }}
        </h2>
      </div>
      <MediaCard
        :api-url-press="`${baseURL}${ApiUrl.pressGeneralRelease}?lang=${locale}`"
        :api-url-judgments="`${baseURL}${ApiUrl.pressReleasesConcerningJudgments}?lang=${locale}&withArchive=false`"
        :max-items="3"
        class="mediaCard"
      >
        <template #default="{ items }">
          <v-container class="pa-0 ma-0">
            <v-row>
              <v-col
                v-for="(item, index) in items"
                :key="item.id"
                cols="12"
                md="4"
                class="pa-0 ma-0"
              >
                <v-card
                  class="pa-4 ma-4 elevation-2 hover-effect"
                  max-width="388"
                  :aria-labelledby="`artDate${item.id} arrestNr${item.id} publicationTitle${item.id}`"
                  :style="{ position: 'relative', overflow: 'visible' }"
                >
                  <v-img
                    :src="getImage(`media-${index}`)"
                    :alt="`Dynamic Image media-${index}`"
                    height="320px"
                    class="mb-4 mx-auto"
                    max-width="100%"
                    cover
                    style="transform: translateY(-40px);"
                  />
                  <div class="d-flex justify-space-between mb-4">
                    <p :id="`artDate${item.id}`">
                      {{ item.formatedJudmentDate }}
                    </p>
                    <p
                      v-if="item.type === MediaType.pressReleaseForJudgments"
                      :id="`arrestNr${item.id}`"
                      :aria-label="item.ariaLabelReference"
                    >
                      {{ t('general.message.add-judgment-number-label') }}
                      {{ item.nr }}
                    </p>
                    <p v-else>
                      {{ t('general.message.general-press-releases') }}
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
                    {{ item.shortDescription }}
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
      </MediaCard>

      <div class="mt-2 title-container">
        <h2 class="title-h2">
          {{ t('menu.agenda.title') }}
        </h2>
      </div>

      <AgendaCard
        :api-url="`${baseURL}${ApiUrl.pressJudgment}?lang=${locale}`"
        :max-items="0"
      >
        <template #item="{ item: { day, month, shortDescription, id, joinedcases } }: { item: Decision }">
          <v-card class="hammer-image equal-height-card">
            <v-card-text>
              <v-row>
                <v-col
                  cols="4"
                  class="date-box1 d-flex flex-column align-center justify-center"
                >
                  <div class="day1">
                    {{ day }}
                  </div>
                  <div class="month1">
                    {{ month }}
                  </div>
                </v-col>
                <v-col
                  cols="8"
                  class="d-flex flex-column"
                >
                  <v-row>
                    <v-card-title class="font-weight-bold">
                      {{ t('menu.decisions.title2') }}
                    </v-card-title>
                  </v-row>
                  <v-row>
                    <v-card-text>
                      <v-icon class="mr-1 ray">
                        mdi-file-document-outline
                      </v-icon> {{ id }}
                    </v-card-text>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-text>
              <div>{{ shortDescription }}</div>
            </v-card-text>
            <v-card-text v-if="joinedcases.length !== 0">
              <v-icon
                class="mr-1"
                color="primary"
              >
                mdi-link-variant
              </v-icon> {{ joinedcases }}
            </v-card-text>
          </v-card>
        </template>
      </AgendaCard>

      <PleadingCard
        :api-url="`${baseURL}${ApiUrl.pressPleadings}?lang=${locale}`"
        :max-items="0"
      >
        <template #item="{ item: { id, processingLanguage, day, month, hora, shortDescription } }: { item: Pleading } ">
          <v-card
            class="equal-height-card "
            :style="{ maxWidth: '300px' }"
            @click="gotoMediaPage(id)"
          >
            <v-card-text>
              <v-row>
                <!-- Date Box -->
                <v-col
                  cols="4"
                  class="date-box d-flex flex-column align-center justify-center"
                >
                  <div class="day">
                    {{ day }}
                  </div>
                  <div class="month">
                    {{ month }}
                  </div>
                </v-col>

                <!-- Time and Location -->
                <v-col
                  cols="6"
                  class="d-flex flex-column indi"
                >
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-1">
                      mdi-clock-time-four-outline
                    </v-icon>
                    <span>{{ hora || '14-17h' }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-1">
                      mdi-map-marker
                    </v-icon>
                    {{ t('general.brussels') }}
                  </div>
                  <div class="d-flex align-center">
                    <v-icon class="mr-1">
                      mdi-file-document-outline
                    </v-icon>
                    {{ id }} ({{ processingLanguage }})
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-title class="font-weight-bold">
              {{ t('general.message.public-hearing') }}
            </v-card-title>
            <v-card-text>
              <div>{{ shortDescription }}</div>
            </v-card-text>
          </v-card>
        </template>
      </PleadingCard>
    </v-container>
    <NewsletterSection
      fluid
      class="ma-0 pa-0"
      @mail-submitted="goToMailings"
    />
  </div>
</template>

<style scoped lang="scss">
.index-banner {
  display: block;
  height: 60vh;
  background-image: url('~~/app/assets/img/banner-index.jpeg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 90%;
  background-attachment: fixed;
  margin: 0;

  // General tablet settings because fixed background-attachment often is not supported
  @media (max-width: 1366px) {
    background-attachment: scroll;
  }
  // Specific settings for normal iPad in landscape mode
  @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
    background-position: 50% 50%; // Center the image vertically
  }

  // Specific settings for iPad Pro in landscape mode
  @media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
    background-position: 50% 70%;
  }

  // Specific settings for smartphones
  @media (max-width: 768px) {
    background-image: url('~~/app/assets/img/banner-index-small.jpg');
    background-position: 30% 90%;
  }
}

.prDesc {
  position: relative;
}

.btt {
  position: absolute;
  top: 0;
  right: 0;
}

.highlighted-card {
  background-color: $rajahLight !important;
  color: $textOnRajah !important;
}

.hammer-image {
  background-image: url('~~/app/assets/img/hammer.svg');
  background-position: top right;
  background-size: contain;
  background-repeat: no-repeat;
}

.libra-image {
  background: url('~~/app/assets/img/libra.svg') no-repeat;
  background-position: 124%;
}

.equal-height-card {
  max-width: 100%;
  overflow: hidden;
}

.v-card {
  max-width: 100%;
  box-sizing: border-box;
}

.equal-height-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.date-box1 {
  background: $rajahExtraLight;
  border: 4px solid $rajahYellow;
  border-radius: 4px;
  margin-right: 8px;
  color: $textOnRajah;
  margin-top: 5px;
  padding-top: 5px;
  max-width: 80px;
  /* Adjust as necessary */
  min-width: 80px;

  p:first-of-type {
    font-size: 2.5rem;
    margin: 0;
    line-height: 32px;
    padding: 11px 0 2px 0;
  }

  p:last-of-type {
    font-size: 1.25rem;
    margin: 0;
    text-transform: uppercase;
  }
}

.date-box {
  background: $indigoExtraLight;
  border: 4px solid $indigoExtraLight;
  border-radius: 4px;
  margin-right: 8px;
  color: $indigo;
  margin-top: 5px;
  padding-top: 5px;
  max-width: 80px;
  /* Adjust as necessary */
  min-width: 80px;

  p:first-of-type {
    font-size: 2.5rem;
    margin: 0;
    line-height: 32px;
    padding: 11px 0 2px 0;
  }

  p:last-of-type {
    font-size: 1.25rem;
    margin: 0;
    text-transform: uppercase;
  }
}

.day1 {
  font-size: 32px;
  font-weight: bold;
}

.month1 {
  font-size: 16px;
  text-transform: uppercase;
}
.ray {
  color: $rajahYellow;
}
.day {
  font-size: 32px;
  font-weight: bold;
}

.month {
  font-size: 16px;
  text-transform: uppercase;
}

.indi {
  color: $indigo;
}
.v-card-title {
  font-weight: bold;
}

.media-card-title {
  white-space: normal;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
}

.v-card-text {
  padding: 8px 16px;
}

.v-card-actions {
  display: flex;
  justify-content: flex-end;
}

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
