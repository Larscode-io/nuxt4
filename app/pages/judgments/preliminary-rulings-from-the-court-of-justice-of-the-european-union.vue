<!-- API based page -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import img from '~/assets/img/banner-judgment.png'
import { useLanguage } from '@/composables/useLanguage'
import BannerImage from '~/components/BannerImage.vue'
// import ErrorCard from '~/components/ErrorCard.vue'
// import EmptyComponent from '~/components/EmptyComponent.vue'
import { ApiUrl } from '~/core/constants'
import type { QuestionPreliminaryRuling as Question } from '~/core/types'

const { t, locale } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl

// during development, if the apiBaseUrl is not set in .env, the legacy server URL node04 will be used (nuxt.config.ts).
const { data: questions = ref<Question[]>([]), error } = useLazyFetch<Question[]>(`${baseURL}${ApiUrl.questionsReferred}?lang=${locale.value}`)
if (error.value) {
  console.error(error.value)
}

const hasQuestion = computed(() => (questions.value ?? []).length > 0)

// todo: print, also check in all other pages

const description = t('menu.decisions.preliminary-rulings-from-the-court-of-justice-of-the-eu-title-description') || ''
useHead({
  title: t('menu.decisions.preliminary-rulings-from-the-court-of-justice-of-the-eu-title') || '',
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: description,
    },
  ],
})
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.decisions.preliminary-rulings-from-the-court-of-justice-of-the-eu')"
      :description="t('menu.decisions.preliminary-rulings-from-the-court-of-justice-of-the-eu-title-description')"
      :image="img"
      alt="alt.banner.courtroom"
    />
    <div
      v-if="hasQuestion"
      ref="list"
      class="col-12 col-md-9"
    >
      <v-card
        v-for="question of questions"
        :id="question.id"
        :key="question.id"
        class="mx-auto my-4"
        outlined
      >
        <v-card-title>
          <h3 style="font-size:1rem">
            {{ question.sortId }}. {{ question.title }}
          </h3>
        </v-card-title>
        <v-card-text>
          <ul>
            <li>
              {{ t('general.message.referring-judgment-const-court') }}
              {{ t('general.message.colon') }}
              <a :href="question.referringJudgmentOfTheConstitutionalCourtLink">
                {{ question.referringJudgmentNumberOfTheConstitutionalCourt }}
              </a>
              (
              {{
                `${t('general.message.roll-number', 2)}${t('general.message.colon')} ${question.referringJudgmentOfTheConstitutionalCourtIds[0]
                } `
              }})
              {{ t('general.of') }}
              {{
                question.formatedReferringJudgmentDateOfTheConstitutionalCourt
              }}
            </li>
            <li v-if="question.noticeInTheOfficialJournalLink">
              <a :href="question.noticeInTheOfficialJournalLink">
                {{ t('general.message.notice-official-journal') }}
                {{ t('general.of') }}
                {{ question.formatedNoticeDateInTheOfficialJournal }}
              </a>
              <span v-if="question.noticeInTheOfficialJournalId">
                (
                {{
                  `${t('general.message.case', 2).toLowerCase()}${t('general.message.colon')} ${question.noticeInTheOfficialJournalId} `
                }})
              </span>
            </li>
            <li v-else>
              {{ t('error.notice-official-journal-not-available') }}
            </li>
            <li v-if="question.opinionOfTheAdvocateGeneralLink">
              <a :href="question.opinionOfTheAdvocateGeneralLink">
                {{ t('general.message.opinion-advocate-general') }}
                {{ t('general.of') }}
                {{ question.formatedOpinionDateOfTheAdvocateGeneral }}
              </a>
            </li>
            <li v-else-if="question.opinionOfTheAdvocateGeneralLink === ''">
              {{ t('error.opinion-advocate-general-not-published') }}
            </li>
            <li v-else>
              {{ t('error.opinion-advocate-general-not-available') }}
            </li>

            <li v-if="question.judgmentOfTheCourtOfJusticeLink">
              <a :href="question.judgmentOfTheCourtOfJusticeLink">
                {{ t('general.message.judgment-court-justice') }}
                ({{ question.judgmentNumberOfTheCourtOfJustice }})
                {{ t('general.of') }}
                {{ question.formatedJudgmentDateOfTheCourtOfJustice }}
              </a>
            </li>
            <li v-else>
              {{ t('error.judgment-court-justice-not-delivered') }}
            </li>
            <li
              v-if="question.judgmentNumberOfTheConstitutionalCourt"
              class="green--text"
            >
              {{ t('general.message.judgment-const-court') }}
              {{ t('general.message.colon') }}
              <a
                v-if="question.judgmentOfTheConstitutionalCourtPath"
                :href="question.judgmentOfTheConstitutionalCourtPath"
              >{{ question.judgmentNumberOfTheConstitutionalCourt
              }}</a>
              <span v-else>{{
                question.judgmentNumberOfTheConstitutionalCourt
              }}</span>
              {{ t('general.of') }}
              {{ question.formatedjudgmentDateOfTheConstitutionalCourt }}
            </li>
            <li
              v-else
              class="red--text"
            >
              {{ t('error.judgment-court-court-not-delivered') }}
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

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
.v-card__title {
  font-size: 1rem;
  line-height: 24px;
  word-break: break-word;
}

.v-application .green--text{
  color: #1B5E20 !important;
}

.v-application .red--text{
  color:#c32a3a !important;
}

a{
  text-decoration: none;

}
</style>
