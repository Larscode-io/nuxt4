<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import { ApiUrl } from '@/core/constants'
import type { GeneralPressJudgment, GeneralPressRelease, Judgment, Pleading, Decision } from '@/core/constants'

definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl
const { t, locale } = useLanguage()

const goToAgendaPageJudgments = (id: number) => {
  console.log(`Navigating to agenda page for judgment with id: ${id}`)
  // Add your navigation logic here
}
const gotoMediaPage = (id: number) => {
  console.log(`Navigating to media page for media with id: ${id}`)
  // Add your navigation logic here
}

const handleMediaCardClick = (id: number, description: string) => {
  if (!description) {
    gotoMediaPage(id)
  }
}

const mediaDisplayMode = ref<('full' | 'short')[]>(Array(20).fill('short'))
const toggleDisplayMediaDisplayMode = (index: number) => {
  mediaDisplayMode.value[index] = mediaDisplayMode.value[index] === 'short' ? 'full' : 'short'
}
</script>

<template>
  <div>
    <span class="index-banner" />
    <v-container>
      <h2>Recent judgments:</h2>
      <DecisionBox
        :api-url="`${baseURL}${ApiUrl.judgments}?lang=${locale}`"
        :max-items="6"
      >
        <template
          #item="{ item: { id, formatedJudmentDate, nr, courtVerdict, description, availablePart } }: { item: Judgment }"
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
              <v-btn @click="goToAgendaPageJudgments(id)">
                {{ t('general.message.read-more') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </DecisionBox>

      <h2>Press releases:</h2>
      <MediaCard
        :api-url-release="`${baseURL}${ApiUrl.pressGeneralRelease}?lang=${locale}`"
        :api-url-judgments="`${baseURL}${ApiUrl.pressReleasesConcerningJudgments}?lang=${locale}&withArchive=false`"
        :max-items="6"
        :display-modes="mediaDisplayMode"
      >
        <template #item="{ title, shortDescription, description, id, displayMode, index } ">
          <v-card class="equal-height-card">
            <v-card-title
              class="media-card-title"
              :style="{ cursor: !description ? 'pointer' : 'default' }"
              @click="!description && gotoMediaPage(id)"
            >
              {{ title }}
            </v-card-title>

            <v-card-text>
              <div :style="{ position: 'relative' }">
                <v-expand-transition>
                  <div>
                    <div v-if="displayMode === 'short'">
                      <div>
                        {{ shortDescription }}
                      </div>
                    </div>
                    <div v-else>
                      <div>
                        {{ description }}
                      </div>
                      <div>
                        <v-btn @click="gotoMediaPage(id)">
                          {{ t('general.message.read-more') }}
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </v-expand-transition>
                <div
                  v-if="description"
                  :style="{ position: 'absolute', top: 0, right: 0 }"
                >
                  <v-btn
                    color="transparent"
                    elevation="0"
                    @click="toggleDisplayMediaDisplayMode(index)"
                  >
                    <v-icon>{{ true ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                  </v-btn>
                </div>
                <div v-else>
                  <v-btn
                    v-if="description"
                    @click="gotoMediaPage(id)"
                  >
                    {{ t('general.message.read-more') }}
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </MediaCard>

      <h2>Decisions:</h2>
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
                      <v-icon
                        class="mr-1 ray"
                      >
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

      <h2>Public hearings:</h2>
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
                    <v-icon
                      class="mr-1"
                    >
                      mdi-clock-time-four-outline
                    </v-icon>
                    <span>{{ hora || '14-17h' }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-icon
                      class="mr-1"
                    >
                      mdi-map-marker
                    </v-icon>
                    {{ t('general.brussels') }}
                  </div>
                  <div class="d-flex align-center">
                    <v-icon
                      class="mr-1"
                    >
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
  </div>
</template>

<style scoped lang="scss">
.full-width-image {
  width: 100%;
  height: auto;
}

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
</style>
