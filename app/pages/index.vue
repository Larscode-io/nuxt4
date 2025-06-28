<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
// import type { GeneralPressJudgment, GeneralPressRelease, Judgment, Pleading, Decision } from '@core/constants'
import type { Pleading } from '@core/constants'
import { RoutePathKeys, ApiUrl, MediaType } from '@core/constants'

const localePath = useLocalePath()

const { getImage } = useImageLoader()

definePageMeta({
  layout: 'default',
})

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl
const { t, locale } = useLanguage()

const goToJudgmentPage = (id: number, year: number) => {
  navigateTo(localePath(RoutePathKeys.judgmentsHome) + `?year=${year}` + `&id=${id}`)
}
const goToMediaPage = (id: number, _type: MediaType) => {
  navigateTo(localePath(RoutePathKeys.mediaPressReleasesConcerningTheJudgments) + '?with-archive=true' + `&id=${id}`)
}
const goToMailings = ({ mailinfo }: { mailinfo: string }) => {
  const dest = localePath(RoutePathKeys.informed)
  navigateTo({ path: dest, query: { mailinfo: mailinfo } })
}
</script>

<template>
  <div>
    <span class="index-banner" />
    <v-container max-width="1260px">
      <div class="title-container">
        <h2 class="title-h2">
          {{ t('motd.title') }}
        </h2>
      </div>
      <MessageOfTheDay class="flex-wrap justify-center d-flex mt-2" />
      <div class="-2 title-container">
        <h2 class="title-h2">
          {{ t('menu.decisions.title-recent') }}
        </h2>
      </div>

      <DecisionBox
        :api-url="`${ApiUrl.judgments}?lang=${locale}`"
        :max-items="6"
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
            },
          }"
        >
          <!-- todo: use colors from the design system -->
          <v-card
            class="rounded-lg equal-height-card feather-bg"
            style="background-color: rgba(252,191,118,0.2); border-left: 4px solid #FCBF60;"
            @click="goToJudgmentPage(id, thisYearOrPreviousYear)"
          >
            <v-card-title class="d-flex justify-space-between align-start pa-4">
              <span
                class="text-subtitle-2"
                style="color: #777777;"
              >
                {{ formatedJudmentDate }}
              </span>
              <span
                class="text-subtitle-2 font-medium"
                style="color: var(--v-theme-secondary);"
              >
                {{ t("general.message.add-judgment-number-label") }}
                {{ nr }} →
              </span>
            </v-card-title>

            <v-card-text class=" pa-4">
              <div
                class="text-body-1 font-medium mb-2"
                style="color: #3D3A44;"
              >
                {{ courtVerdict }}
              </div>
              <div
                class="text-subtitle-2 mb-2"
                style="color: #333333; line-height: 1.4;"
                v-html="description"
              />
              <div
                v-if="availablePart"
                class="text-subtitle-2 mb-2"
                style="color: #333333; line-height: 1.4;"
                v-html="availablePart"
              />
            </v-card-text>

            <!-- read-more action -->
            <v-card-actions class="pa-4">
              <v-btn
                text
                color="secondary"
              >
                {{ t("general.message.read-more") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </DecisionBox>

      <v-row justify="center" class="mb-6">
        <v-col
          cols="12"
          md="8"
          lg="8"
          class="d-flex justify-center"
        >
          <Balloon color="logo-color" class="w-100" style="text-align: center;">
            "Het Grondwettelijk Hof is het rechtscollege dat waakt over de inachtneming van de in de Grondwet verankerde grondrechten en de bevoegdheidsverdelende regels door de verschillende wetgevers in België"
          </Balloon>
        </v-col>
      </v-row>

      <div class="mt-9 title-container">
        <h2 class="title-h2">
          {{ t("general.message.latest-press-release") }}
        </h2>
      </div>
      <MediaCard
        :api-url-press="`${ApiUrl.pressGeneralRelease}?lang=${locale}`"
        :api-url-judgments="`${ApiUrl.pressReleasesConcerningJudgments}?lang=${locale}&withArchive=false`"
        :max-items="3"
        style="padding-top: 32px"
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
                    class="mb-4 mx-auto d-none d-md-block"
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
              :api-url="`${ApiUrl.pressJudgment}?lang=${locale}`"
              :max-items="4"
              class="flex-wrap justify-space-between agenda-container"
            >
              <template #item="{ item: { id, type, day, month, shortDescription } }">
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
                          <span v-html="' ' + shortDescription?.split(' ').splice(1).join(' ')"/>
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
        :api-url="`${ApiUrl.pressPleadings}?lang=${locale}`"
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
    height: 40vh;
    background-position: 50% 70%;
    outline: 2px solid orange !important;
    &::after {
      content: "Tablet (≤1366px)";
      position: absolute;
      top: 0;
      left: 0;
      background: orange;
      color: white;
      padding: 2px 8px;
      font-size: 12px;
      z-index: 9999;
    }
  }

  // Normal iPad in landscape mode
  @media (min-width: 768px) and (max-width: 1023.98px) and (orientation: landscape) {
    background-position: 50% 50%;
    height: 35vh;
    outline: 2px solid blue !important;
    &::after {
      content: "iPad Landscape (768-1024px)";
      position: absolute;
      top: 0;
      left: 0;
      background: blue;
      color: white;
      padding: 2px 8px;
      font-size: 12px;
      z-index: 9999;
    }
  }

  // iPad Pro in landscape mode
  @media (min-width: 1024px) and (max-width: 1366px) and (orientation: landscape) {
    background-position: 50% 60%;
    height: 38vh;
    outline: 2px solid green !important;
    &::after {
      content: "iPad Pro Landscape (1024-1366px)";
      position: absolute;
      top: 0;
      left: 0;
      background: green;
      color: white;
      padding: 2px 8px;
      font-size: 12px;
      z-index: 9999;
    }
  }

  // Smartphones
  @media (max-width: 768px) {
    background-image: url("~~/app/assets/img/banner-index-small.jpg");
    background-position: 50% 80%;
    height: 30vh;
    outline: 2px solid red !important;
    &::after {
      content: "Smartphone (≤768px)";
      position: absolute;
      top: 0;
      left: 0;
      background: red;
      color: white;
      padding: 2px 8px;
      font-size: 12px;
      z-index: 9999;
    }
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

.feather-bg {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path fill="rgba(254,201,118,0.2)" d="M403.438 23.08s-70.897 56.757-118.08 70.513s-70.642-15.469-70.642-15.469s14.65 34.485-19.828 69.494c-34.482 35.01-118.112 70.531-118.112 70.531l-2.366 13.93l6.452 8.121L29.36 376.606c-.6 1.101-.593 2.104-.593 3.313c0 18.897 8.252 34.243 20.343 44c12.09 9.758 27.564 14.31 42.938 14.312c15.376.003 30.877-4.555 42.969-14.312s20.343-25.094 20.343-44c.198-1.352-.192-2.316-.687-3.531L99.735 241.76c.059-1.373.239-2.845 1.551-6.002c20.336-15.642 69.497-51.446 106.305-61.696c18.947-5.273 35.577.53 35.015 6.936L215.87 369.577l21.406 30.31c-17.75 7.75-32.593 24.84-37.562 51.344c-56.076 6.195-95.469 20.742-95.469 37.69H416.12c0-16.947-39.392-31.495-95.467-37.69c-4.91-26.6-19.57-44.112-37.187-51.906l21-29.75l-30.737-194.596c4.17-19.161 18.107-42.676 28.875-57.654c16.23-22.415 108.224-65.652 109.659-64.096l-54.938 134.627c-.495 1.216-.885 2.18-.687 3.532c0 18.906 8.251 34.244 20.343 44s27.595 14.315 42.971 14.312c15.374-.003 30.846-4.554 42.936-14.312s20.345-25.103 20.345-44c0-1.21.004-2.212-.595-3.313L430.796 50.763c.97-4.868 3.99-8.561 7.094-12.034l-11.833-14.786zm18.264 56.526l40.936 108.375h-85.155zM90.296 268.138l44.22 108.375H49.36z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px bottom 40px;
  background-size: 192px 192px;
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
  height: 100%;
  display: flex;
  flex-direction: column;
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
    line-clamp: 4;
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
