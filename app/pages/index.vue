<script setup lang="ts">
import type { GeneralPressJudgment, GeneralPressRelease, Judgment, Pleading, Decision } from '@core/constants'
import { RoutePathKeys, ApiUrl, MediaType } from '../core/constants'

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
    <v-container max-width="1260px">
      <div class="mt-2 title-container pb-4">
        <h2 class="title-h2">
          {{ t('menu.decisions.title') }}
        </h2>
      </div>

      <DecisionBox
        :api-url="`${baseURL}${ApiUrl.judgments}?lang=${locale}`"
        :max-items="6"
        class="mb-10"
      >
        <template
          #item="{
            year: thisYearOrPreviousYear,
            item: {
              id,
              formatedJudmentDate,
              nr,
              courtVerdict,
              description,
              availablePart,
              title,
            },
          }: {
            item: Judgment,
          }"
        >
          <v-card
            class="equal-height-card highlighted-card libra-image d-flex flex-column"
            @click="goToJudgmentPage(id, thisYearOrPreviousYear)"
          >
            <div class="flex-grow-1">
              <v-card-text>
                <v-row class="top-infos">
                  <v-col cols="5">
                    <span class="judgment-date text-base">{{
                      formatedJudmentDate
                    }}</span>
                  </v-col>
                  <v-col
                    cols="7"
                    class="d-flex justify-end"
                  >
                    <span class="judgment-number text-base">
                      <span>{{
                        t("general.message.add-judgment-number-label")
                      }}</span>
                      {{ nr }}
                      <div class="border-bottom" />
                    </span>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-title class="judgment-verdict font-normal">
                {{ courtVerdict }}
              </v-card-title>
              <v-card-text
                v-if="title"
                class="judgment-title"
              >
                {{ title }}
              </v-card-text>
              <v-card-text
                class="judgment-description"
                v-html="description"
              />
            </div>
            <span class="justify-start">
              <span v-if="availablePart">
                <p
                  class="judgment-available-part"
                  v-html="availablePart"
                />
              </span>
              <span
                v-else
                class="judgment-available-part"
              >
                {{ t("general.message.not-available") }}
              </span>
            </span>
            <v-card-actions class="justify-start">
              <div class="m-4 mt-2 ml-2">
                {{ t("general.message.read-more") }}
                <v-icon class="arrow-hover">
                  mdi-arrow-right
                </v-icon>
              </div>
            </v-card-actions>
          </v-card>
        </template>
      </DecisionBox>

      <div class="mt-9 title-container">
        <h2 class="title-h2">
          {{ t("general.message.latest-press-release") }}
        </h2>
      </div>
      <MediaCard
        :api-url-press="`${baseURL}${ApiUrl.pressGeneralRelease}?lang=${locale}`"
        :api-url-judgments="`${baseURL}${ApiUrl.pressReleasesConcerningJudgments}?lang=${locale}&withArchive=false`"
        :max-items="3"
        class="mb-10 mt-10"
        style="padding-top: 62px"
      >
        <template #default="{ items }">
          <v-container
            fluid
            class="pa-0 ma-0"
          >
            <v-row class="pa-0 ma-0">
              <v-col
                v-for="(item, index) in items"
                :key="item.id"
                xs="12"
                sm="6"
                md="4"
                class="pa-0 ma-0 d-flex justify-center mb-10 mt-10"
              >
                <v-card
                  class="pa-4 ma-4 elevation-2 hover-effect media-card"
                  style="
                    width: 388px;
                    height: 100%;
                    position: relative;
                    overflow: visible;
                  "
                  :aria-labelledby="`artDate${item.id} arrestNr${item.id} publicationTitle${item.id}`"
                >
                  <v-img
                    :src="getImage(`media-${index}`)"
                    :alt="`Dynamic Image media-${index}`"
                    height="320px"
                    class="mb-4 mx-auto"
                    max-width="100%"
                    cover
                    style="transform: translateY(-80px)"
                  />
                  <div
                    class="d-flex justify-space-between mb-4"
                    style="margin-top: -80px"
                  >
                    <div>
                      <p :id="`artDate${item.id}`">
                        {{ item.formatedJudmentDate }}
                      </p>
                      <div class="border-bottom-blue" />
                    </div>
                    <p
                      v-if="item.type === MediaType.pressReleaseForJudgments"
                      :id="`arrestNr${item.id}`"
                      :aria-label="item.ariaLabelReference"
                    >
                      {{ t("general.message.add-judgment-number-label") }}
                      {{ item.nr }}
                    </p>
                    <p v-else>
                      {{ t("general.message.general-press-releases") }}
                    </p>
                  </div>
                  <h3
                    :id="`publicationTitle${item.id}`"
                    :aria-label="
                      item.title
                        + ' '
                        + t('aria.label.description.continueReading')
                    "
                    class="text-h6 mb-4"
                  >
                    {{ item.title }}
                  </h3>
                  <v-list-item-subtitle
                    class="text-truncate-4 mb-4"
                    style="color: #09368e"
                  >
                    {{ item.shortDescription }}
                  </v-list-item-subtitle>
                  <div
                    class="d-flex align-center justify-start"
                    @click="goToMediaPage(item.id, item.type)"
                  >
                    {{ t("general.message.read-more") }}
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

      <div class="mt-10 title-container">
        <h2 class="title-h2">
          {{ t("menu.agenda.title") }}
        </h2>

        <nuxt-link
          class="more-link mr-8"
          :to="localePath(RoutePathKeys.agenda)"
        >
          {{ t("general.message.all-news") }}
        </nuxt-link>
      </div>

      <v-container fluid>
        <v-row>
          <!-- Datepicker Column -->
          <v-col
            cols="12"
            md="3"
          >
            <DatePicker />
          </v-col>
          <!-- Agenda Cards Column with increased offset -->
          <v-col
            cols="12"
            md="7"
            offset-md="2"
          >
            <AgendaCard
              :api-url="`${baseURL}${ApiUrl.pressJudgment}?lang=${locale}`"
              :max-items="4"
              class="flex-wrap justify-space-between agenda-container"
            >
              <template
                #item="{ item: { id, type, day, month, shortDescription } }"
              >
                <v-card
                  class="agenda-card hammer-image equal-height-agenda-card ml-8"
                  @click="goToMediaPage(id, type)"
                >
                  <v-card-text class="pa-0">
                    <v-row no-gutters>
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
                        class="d-flex flex-column pl-3"
                      >
                        <v-card-title class="text-uppercase pa-0 ma-0 mt-1">
                          {{ t("menu.decisions.title2") }}
                        </v-card-title>
                        <v-card-text class="font-weight-bold pa-0 ma-0">
                          <span
                            class="text-capitalize"
                            v-html="shortDescription?.split(' ')[0]"
                          />
                          <span
                            v-html="
                              ' '
                                + shortDescription?.split(' ').splice(1).join(' ')
                            "
                          />
                        </v-card-text>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </template>
            </AgendaCard>
          </v-col>
        </v-row>
      </v-container>

      <PleadingCard
        :api-url="`${baseURL}${ApiUrl.pressPleadings}?lang=${locale}`"
        :max-items="0"
      >
        <template
          #item="{
            item: {
              id,
              type,
              processingLanguage,
              day,
              month,
              hora,
              shortDescription,
            },
          }: {
            item: Pleading,
          }"
        >
          <v-card
            class="session-card equal-height-card ml-3"
            @click="goToMediaPage(id, type)"
          >
            <v-card-text>
              <v-row class="pa-3">
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
                    <span>{{ hora || "14-17h" }}</span>
                  </div>
                  <div class="d-flex align-center mb-2">
                    <v-icon class="mr-1">
                      mdi-map-marker
                    </v-icon>
                    {{ t("general.brussels") }}
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
              {{ t("general.message.public-hearing") }}
            </v-card-title>
            <v-card-text class="pb-4">
              <div>{{ shortDescription }}</div>
            </v-card-text>
          </v-card>
        </template>
      </PleadingCard>
    </v-container>
    <NewsletterSection
      fluid
      class="ma-0 pa-0 pt-10"
      @mail-submitted="goToMailings"
    />
  </div>
</template>

<style scoped lang="scss">
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
  /* ensures grid items stretch to the same height */
}

.grid-item {
  // background-color: #f1f1f1;
  // padding: 16px;
  // border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
}

.index-banner {
  display: block;
  height: 60vh;
  background-image: url("~~/app/assets/img/banner-index.jpeg");
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
    background-image: url("~~/app/assets/img/banner-index-small.jpg");
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

.highlighted-card:hover,
.highlighted-card:focus {
  background-color: $rajahYellow !important;
  transition: all 0.3s ease-in-out;
  box-shadow: 8px 8px 24px -5px rgba(249, 171, 85, 0.4) !important;
  cursor: pointer;
}

.hammer-image {
  background-image: url("~~/app/assets/img/hammer.svg");
  background-position: top right;
  background-size: 20%;
  background-repeat: no-repeat;
}

.libra-image {
  background: url("~~/app/assets/img/libra.svg") no-repeat;
  background-position: 154%;
}

.equal-height-card,
.equal-height-agenda-card {
  max-width: 100% !important;
  overflow: hidden;
  min-height: 150px;
  padding: 4px;
}

.equal-height-agenda-card {
  min-height: 120px;
}

.v-card {
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 0;
}

.equal-height-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.date-box {
  background: $indigoExtraLight;
  border: 4px solid $indigoExtraLight;
  border-radius: 4px;
  margin-right: 8px;
  color: $indigo;
  margin-top: 5px;
  padding-top: 5px;
  max-height: 80px;
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

.ray {
  color: $rajahYellow;
}

.day {
  font-size: 32px;
  font-weight: bold;
}

.month {
  font-size: 20px;
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
  padding: 4px 16px;
}

.border-bottom-blue,
.border-bottom {
  border-bottom: 2px solid;
  border-color: #3d3a44;
  margin-top: -1.5px;
}

.border-bottom-blue {
  border-color: #0065ca;
  border-width: 2px;
}

.media-card {
  /* the old site uses a lighter box-shadow, but it's not in the new one as of yet
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08) !important;
  */

  font-weight: 400;

  .v-list-item-subtitle {
    display: -webkit-box;
    text-align: left;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    -webkit-line-clamp: 4;
    margin-bottom: 16px;
    font-size: 0.875rem;
    line-height: 22px;
  }

  .d-flex,
  .mb-4 {
    color: #0065ca;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
    text-align: left;
    margin-bottom: 20px;
  }
}

.v-card-actions {
  display: flex;
  justify-content: flex-end;
}

.v-row > .v-col > .span {
  position: relative;
}

.hover-effect {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.hover-effect:hover,
.hover-effect:focus {
  background-color: #0065ca !important;
  color: white !important;

  .border-bottom-blue {
    border-color: white !important;
  }

  .d-flex,
  .mb-4 {
    color: white !important;
  }

  .v-list-item-subtitle {
    color: white !important;
  }
}

.arrow-hover {
  margin-left: 4px;
  margin-bottom: 6px;
  color: #3d3a44;
}

.judgment-available-part {
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
  margin-left: 16px;
  margin-right: 20px;
  margin-bottom: -10px;
  font-weight: 800;
  font-size: 14px;
}

.judgment-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: pre-wrap;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  line-height: 20px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 400;
}

.top-infos {
  display: flex;
  margin-top: -4px;
}

.agenda-card {
  width: 360px;
  display: flex;
  background-position: center right;
  height: fit-content;
  padding: 16px;
  margin-bottom: 40px;

  &:focus {
    outline: 2px solid black;
  }
  &:hover,
  &:focus {
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
      0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important;
  }

  .date-box1 {
    background: $rajahExtraLight;
    border: 4px solid $rajahYellow;
    border-radius: 4px;
    margin-right: 8px;
    color: $textOnRajah;
    margin-top: 5px;
    max-height: 80px;
    min-height: 80px;
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
    font-size: 40px;
    font-weight: 400;
    padding-top: 12px;
  }

  .month1 {
    font-size: 16px;
    text-transform: uppercase;
    padding-top: 12px;
  }

  .v-card-title {
    font-size: 16px;
    font-weight: 400 !important;
  }

  .v-card-text {
    font-size: 16px;
    line-height: 20px;
    overflow: hidden;
    white-space: pre-wrap;
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
  }
}

.agenda-container {
  width: 100%;
  max-width: 760px;
  // margin: 0;
  display: flex;
}

.more-link {
  color: $indigo;
}

.session-card {
  max-width: 220px !important;
  min-width: 220px;
  &:focus {
    outline: 2px solid black;
  }
  &:hover,
  &:focus {
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%),
      0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important;
  }

  .v-card-title {
    margin-top: -20px;
    white-space: pre-wrap;
    line-height: 24px;
    hyphens: none;
  }
}
</style>
