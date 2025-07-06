<template>
  <v-container
    fluid
    class="min-h-screen pa-0 d-block"
  >
    <BannerImage
      :title="t('menu.search.title')"
      :description="t('menu.search.title-description')"
      :image="img"
      class="non-printable"
      :alt="t('alt.banner.books')"
    />

    <v-row
      v-if="loading"
      class="non-printable d-flex"
      justify="center"
    >
      <v-col cols="12">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="article"
        />
      </v-col>
    </v-row>
    <v-row
      v-else-if="asyncError"
      class="non-printable d-flex"
      justify="center"
    >
      <v-col cols="12">
        <ErrorCard
          :message="t('error.fetchingData')"
          :show-go-home="false"
        />
      </v-col>
    </v-row>

    <!-- Main content -->
    <v-row
      v-else
      class="d-flex"
      justify="center"
    >
      <v-col
        cols="12"
        md="4"
        class="non-printable mt-4"
      >
        <SearchTabs active-tab="general.message.judgment" />
      </v-col>
      <v-col
        cols="12"
        md="8"
        class="mt-6"
      >
        <client-only
          :placeholder="t('general.loading')"
          class="non-printable"
        >
          <form @submit.prevent="submit">
            <v-radio-group
              v-model="payload.type"
              inline
              :error="errors.type.length > 0"
              :error-messages="errors.type"
            >
              <v-radio
                v-for="stype in searchTypesForJudgment"
                :key="stype.id"
                class="mr-7 text-gray"
                color="primary"
                :label="stype.label"
                :value="stype.id"
                name="type"
                :disabled="loading"
              />
            </v-radio-group>

            <div v-if="isSearchJudgmentsTypeApplicant">
              <v-select
                v-model="payload.applicantTypes"
                :items="applicantTypesData"
                multiple
                :label="t('general.message.applicant-type')"
                item-value="id"
                item-title="label"
                :error-messages="errors.applicantTypes"
                required
              />
              <v-select
                v-model="payload.applicant"
                :items="applicantListData"
                :label="t('general.message.applicant')"
                item-value="id"
                item-title="label"
                :error-messages="errors.applicant"
                required
              />
            </div>

            <div v-if="isSearchJudgmentsTypeJurisdiction">
              <v-select
                v-model="payload.jurisdiction"
                :items="jurisdictionListData"
                :label="t('general.message.jurisdisction')"
                item-value="id"
                item-title="label"
                :error-messages="errors.jurisdiction"
                required
              />
              <v-select
                v-model="payload.jurisdictionArea"
                :items="jurisdictionAreaListData"
                :label="t('general.message.jurisdisction-area')"
                item-value="id"
                item-title="label"
                :error-messages="errors.jurisdictionArea"
                required
              />
              <div class="d-flex">
                <v-text-field
                  v-model.lazy="payload.referralDecisionDates[0]"
                  v-date-format
                  hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-judgment-start')"
                  persistent-hint
                  :error-messages="errors.referralDecisionDates[0]"
                />
                <span class="px-2" />
                <v-text-field
                  v-model.lazy="payload.referralDecisionDates[1]"
                  v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }"
                  v-date-format
                  hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-judgment-end')"
                  persistent-hint
                  :error-messages="errors.referralDecisionDates[1]"
                />
              </div>
            </div>

            <v-text-field
              v-model="payload.judgmentNumber"
              :label="t('general.message.judgment-number')"
              :error-messages="errors.beOfficialJournalDates[0]"
              required
              hint="XX/YYYY"
              persistent-hint
              :disabled="!isSearchJudgmentsTypeSelected"
            />

            <div v-if="isSearchJudgmentsTypeRollNumber">
              <v-text-field
                v-model="payload.rollNumber"
                :label="t('general.message.roll-number')"
                :error-messages="errors.rollNumber"
                required
              />
            </div>

            <div class="d-flex">
              <v-text-field
                v-model.lazy="payload.judgmentDates[0]"
                v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }"
                v-date-format
                hint="DD/MM/YYYY"
                :label="t('general.message.date-of-judgment-start')"
                persistent-hint
                :error-messages="errors.judgmentDates[0]"
              />
              <span class="px-2" />
              <v-text-field
                v-model.lazy="payload.judgmentDates[1]"
                v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }"
                v-date-format
                hint="DD/MM/YYYY"
                :label="t('general.message.date-of-judgment-end')"
                persistent-hint
                :error-messages="errors.judgmentDates[1]"
              />
            </div>

            <v-select
              v-model="payload.judgmentTypes"
              :items="judgmentTypesFiltered"
              multiple
              :label="t('general.message.judgment-type')"
              item-value="id"
              item-title="label"
              :error-messages="errors.judgmentTypes"
              required
              :disabled="!isSearchJudgmentsTypeSelected"
            />

            <div
              v-if="isSearchJudgmentsTypeRollNumber"
              class="d-flex"
            >
              <v-text-field
                v-model.lazy="payload.beOfficialJournalDates[0]"
                v-date-format
                v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }"
                hint="DD/MM/YYYY"
                :label="t('general.message.date-of-be-official-journal-start')"
                persistent-hint
                :error-messages="errors.beOfficialJournalDates[0]"
              />
              <span class="px-2" />
              <v-text-field
                v-model.lazy="payload.beOfficialJournalDates[1]"
                v-date-format
                v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }"
                hint="DD/MM/YYYY"
                :label="t('general.message.date-of-be-official-journal-end')"
                persistent-hint
                :error-messages="errors.beOfficialJournalDates[1]"
              />
            </div>

            <v-btn
              type="submit"
              class="mr-4 submit-button"
              :loading="loading"
              :aria-label="t('aria.label.submit')"
              @click.prevent="submit"
            >
              {{ t("general.submit") }}
            </v-btn>
            <v-btn
              v-if="hasResults"
              class="mr-4"
              :aria-label="t('aria.label.print')"
              @click.prevent="print('list')"
            >
              <v-icon
                class="mr-2"
                left
              >
                mdi-printer
              </v-icon>
              {{ t("general.message.print-list") }}
            </v-btn>
          </form>
        </client-only>

        <div
          v-if="hasResults"
          ref="list"
          class="print-area"
        >
          <div
            v-for="result in formattedSearchResult"
            :key="result.title"
          >
            <h1 v-if="result.title">
              {{ result.title }}
            </h1>
            <div
              v-for="data in result.data"
              :key="data.title"
            >
              <h2 v-if="data.title">
                {{ data.title }}
              </h2>
              <SearchResultJudgmentCard
                v-for="judgment in data.judgments"
                :key="judgment.id"
                :judgment-number="judgment.nr"
                :judgment-file-path="judgment.filePath"
                :date-of-judgment="judgment.formatedJudmentDate"
                :roll-numbers="judgment.idsRole"
                :judgment-types="judgment.judgmentTypes"
                :date-of-be-official-journal="judgment.formatedBelgianOfficialDate"
                :belgian-official-page="judgment.belgianOfficialPage"
              />
            </div>
          </div>
        </div>

        <div class="mt-6">
          <EmptyComponent v-if="(loaded && !hasResults) || searchError" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import img from '@assets/img/banner-text.png'
import { ApiUrl } from '../../core/constants'
import { groupBy } from '../../core/utilities'
import type {
  JudgmentType,
  ApplicantTable,
  ApplicantCategoryTable,
  Juridisction,
  JuridisctionArea,
} from '../../core/constants'
import SearchResultJudgmentCard from '../../components/SearchResultJudgementCard.vue'
import ErrorCard from '../../components/ErrorCard.vue'
import EmptyComponent from '../../components/EmptyComponent.vue'
import BannerImage from '../../components/BannerImage.vue'
import SearchTabs from '../../components/SearchTabs.vue'
import { printContent } from '../../utils/searchUtils'

const loading = ref(false)
const loaded = ref(false)
const searchError = ref(null)
const searchResponse = ref(null)

enum SearchJudgmentsType {
  rollNumber = 'rollNumber',
  applicant = 'applicant',
  jurisdiction = 'jurisdiction',
}

const { t, locale } = useLanguage()

const payload = reactive({
  type: SearchJudgmentsType.rollNumber,
  judgmentNumber: null,
  rollNumber: null,
  applicant: null,
  jurisdiction: null,
  jurisdictionArea: null,
  referralDecisionDates: ['', ''],
  judgmentTypes: [] as number[],
  judgmentDates: ['', ''],
  applicantTypes: [] as number[],
  beOfficialJournalDates: ['', ''],
})

const errors = ref({
  type: [] as string[],
  applicantTypes: [] as string[],
  applicant: [] as string[],
  jurisdiction: [] as string[],
  jurisdictionArea: [] as string[],
  referralDecisionDates: ['', ''],
  judgmentNumber: [] as string[],
  rollNumber: [] as string[],
  judgmentDates: ['', ''],
  judgmentTypes: [] as string[],
  beOfficialJournalDates: ['', ''],
})

watch(
  () => payload.type,
  () => {
    payload.judgmentNumber = null
    payload.rollNumber = null
    payload.applicant = null
    payload.jurisdiction = null
    payload.jurisdictionArea = null
    payload.referralDecisionDates = ['', '']
    payload.judgmentTypes = []
    payload.judgmentDates = ['', '']
    payload.applicantTypes = []
    payload.beOfficialJournalDates = ['', '']
    searchResponse.value = null
    searchError.value = null
  },
)

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl
const { data: asyncData, error: asyncError } = useAsyncData(() =>
  Promise.all([
    $fetch<JudgmentType[]>(`${baseURL}${ApiUrl.judgmentTypes}?lang=${locale.value}`),
    $fetch<ApplicantTable[]>(`${baseURL}${ApiUrl.applicantList}?lang=${locale.value}`),
    $fetch<ApplicantCategoryTable[]>(`${baseURL}${ApiUrl.applicantTypes}?lang=${locale.value}`),
    $fetch<Juridisction[]>(`${baseURL}${ApiUrl.jurisdictionList}?lang=${locale.value}`),
    $fetch<JuridisctionArea[]>(`${baseURL}${ApiUrl.jurisdictionAreaList}?lang=${locale.value}`),
  ]).then(([a, b, c, d, e]) => ({
    judgmentTypes: a,
    applicantList: b,
    applicantTypes: c,
    jurisdictionList: d,
    jurisdictionAreaList: e,
  })),
)

const judgmentTypesData = computed(() => asyncData.value?.judgmentTypes ?? [])
const applicantListData = computed(() => asyncData.value?.applicantList ?? [])
const applicantTypesData = computed(() => asyncData.value?.applicantTypes ?? [])
const jurisdictionListData = computed(() => asyncData.value?.jurisdictionList ?? [])
const jurisdictionAreaListData = computed(() => asyncData.value?.jurisdictionAreaList ?? [])

const isSearchJudgmentsTypeSelected = computed(() => !!payload.type)
const isSearchJudgmentsTypeRollNumber = computed(() => payload.type === SearchJudgmentsType.rollNumber)
const isSearchJudgmentsTypeApplicant = computed(() => payload.type === SearchJudgmentsType.applicant)
const isSearchJudgmentsTypeJurisdiction = computed(() => payload.type === SearchJudgmentsType.jurisdiction)

const searchTypesForJudgment = [
  { id: SearchJudgmentsType.rollNumber, label: t('general.message.roll-number') },
  { id: SearchJudgmentsType.applicant, label: t('general.message.applicant') },
  { id: SearchJudgmentsType.jurisdiction, label: t('general.message.jurisdisction') },
]

const judgmentTypesFiltered = computed(() => {
  if (isSearchJudgmentsTypeRollNumber.value) {
    return judgmentTypesData.value.slice(0, 7)
  }
  if (isSearchJudgmentsTypeJurisdiction.value) {
    return judgmentTypesData.value.filter((type) => !(type.id === 1 || type.id === 2 || type.id === 4))
  }
  return judgmentTypesData.value
})

const formattedSearchResult = computed(() => {
  if (!searchResponse.value || !Array.isArray(searchResponse.value)) return []
  const groupedByFirst = groupBy(searchResponse.value, 'firstLevelTitle')
  const results: unknown[] = []
  for (const [key, val] of Object.entries(groupedByFirst)) {
    const secondLevel = groupBy(val, 'secondLevelTitle')
    const subResult = []
    for (const [subKey, subVal] of Object.entries(secondLevel)) {
      subResult.push({ title: subKey, judgments: subVal })
    }
    results.push({ title: key, data: subResult })
  }
  return results
})

const hasResults = computed(() => formattedSearchResult.value.length > 0)

async function submit() {
  loading.value = true
  loaded.value = false
  searchError.value = null
  searchResponse.value = null

  try {
    const formatDates = (dates: string[]) => dates.map((d) => d ? d.split('/').reverse().join('-') : '')

    const { data: response, error } = await cPost(
      `${ApiUrl.searchJudgmentByRollNumberApplicantJurisdiction}?lang=${locale.value}`,
      {
        ...payload,
        judgmentDates: formatDates(payload.judgmentDates),
        beOfficialJournalDates: formatDates(payload.beOfficialJournalDates),
        referralDecisionDates: formatDates(payload.referralDecisionDates),
      },
    )

    if (error.value) {
      throw error.value
    }

    if (!response.value) {
      throw new Error('No data received')
    }

    searchResponse.value = response.value
    loaded.value = true
  }
  catch (err) {
    searchError.value = err || new Error('fout in judgment search page')
  }
  finally {
    loading.value = false
  }
}

const print = () => {
  printContent('.print-area')
}
</script>

<style scoped lang="scss">
.d-flex {
  max-width: 1260px !important;
  margin: auto;
  margin-bottom: 40px;
}

.submit-button {
  background: $indigo !important;
  color: white;
}
</style>
