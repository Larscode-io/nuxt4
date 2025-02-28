<template>
  <v-container fluid class="fill-height pa-0 d-block">

    <!-- Banner -->
    <BannerImage :title="t('menu.search.title')" :description="t('menu.search.title-description')" :image="img"
      :alt="t('alt.banner.books')" />

    <v-row class="d-flex" justify="center">

      <!-- Pending / Error states -->
      <v-row v-if="pending" align="flex-start" justify="center">
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
        </v-col>
      </v-row>
      <v-row v-else-if="asyncError" align="flex-start" justify="center">
        <v-col cols="12">
          <ErrorCard :message="t('error.fetchingData')" :show-go-home="false" />
        </v-col>
      </v-row>

      <!-- Main content -->
      <v-row class="d-flex" v-else>
        <v-col cols="12" md="4" class="mt-4">
          <v-tabs color="primary" direction="vertical" class="vertical-tabs" background-color="white" grow>
            <v-tab :text="tab.label" v-for="tab in tabs" :key="tab.id" :to="tab.to" class="tab" ripple />
          </v-tabs>
        </v-col>

        <!-- Right column: Form and Results -->
        <v-col cols="12" md="8" class="mt-6">
          <client-only :placeholder="t('general.loading')">
            <form @submit.prevent="submit">
              <!-- Radio group for search type -->

              <v-radio-group v-model="payload.type" inline :error="errors.type.length > 0" :error-messages="errors.type">
                <v-radio class="mr-2 text-gray" color="primary" v-for="stype in searchTypesForJudgment" :key="stype.id"
                  :label="stype.label" :value="stype.id" name="type" :disabled="loading" />
              </v-radio-group>

              <!-- Applicant fields (if search type is applicant) -->
              <div v-if="isSearchJudgmentsTypeApplicant">
                <v-select v-model="payload.applicantTypes" :items="applicantTypesData" multiple
                  :label="t('general.message.applicant-type')" item-value="id" item-title="label"
                  :error-messages="errors.applicantTypes" required />
                <v-select v-model="payload.applicant" :items="applicantListData" :label="t('general.message.applicant')"
                  item-value="id" item-title="label" :error-messages="errors.applicant" required />
              </div>

              <!-- Jurisdiction fields (if search type is jurisdiction) -->
              <div v-if="isSearchJudgmentsTypeJurisdiction">
                <v-select v-model="payload.jurisdiction" :items="jurisdictionListData"
                  :label="t('general.message.jurisdisction')" item-value="id" item-title="label"
                  :error-messages="errors.jurisdiction" required />
                <v-select v-model="payload.jurisdictionArea" :items="jurisdictionAreaListData"
                  :label="t('general.message.jurisdisction-area')" item-value="id" item-title="label"
                  :error-messages="errors.jurisdictionArea" required />
                <div class="d-flex">
                  <v-text-field v-model.lazy="payload.referralDecisionDates[0]" v-date-format hint="DD/MM/YYYY"
                    :label="t('general.message.date-of-judgment-start')" persistent-hint
                    :error-messages="errors.referralDecisionDates[0]" />
                  <span class="px-2" />
                  <v-text-field v-model.lazy="payload.referralDecisionDates[1]"
                    v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }" v-date-format hint="DD/MM/YYYY"
                    :label="t('general.message.date-of-judgment-end')" persistent-hint
                    :error-messages="errors.referralDecisionDates[1]" />
                </div>
              </div>

              <!-- Common fields -->
              <v-text-field v-model="payload.judgmentNumber" :label="t('general.message.judgment-number')"
                :error-messages="errors.beOfficialJournalDates[0]" required hint="XX/YYYY" persistent-hint
                :disabled="!isSearchJudgmentsTypeSelected" />
              <div v-if="isSearchJudgmentsTypeRollNumber">
                <v-text-field v-model="payload.rollNumber" :label="t('general.message.roll-number')"
                  :error-messages="errors.rollNumber" required />
              </div>
              <div class="d-flex">
                <v-text-field v-model.lazy="payload.judgmentDates[0]" v-date-format
                  v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }" hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-judgment-start')" persistent-hint
                  :error-messages="errors.judgmentDates[0]" />
                <span class="px-2" />
                <v-text-field v-model.lazy="payload.judgmentDates[1]" v-date-format
                  v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }" hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-judgment-end')" persistent-hint
                  :error-messages="errors.judgmentDates[1]" />
              </div>

              <v-select v-model="payload.judgmentTypes" :items="judgmentTypesFiltered" multiple
                :label="t('general.message.judgment-type')" item-value="id" item-title="label"
                :error-messages="errors.judgmentTypes" required :disabled="!isSearchJudgmentsTypeSelected" />
              <div v-if="isSearchJudgmentsTypeRollNumber" class="d-flex">
                <v-text-field v-model.lazy="payload.beOfficialJournalDates[0]" v-date-format 
                  v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }" hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-be-official-journal-start')" persistent-hint
                  :error-messages="errors.beOfficialJournalDates[0]" />
                <span class="px-2" />
                <v-text-field v-model.lazy="payload.beOfficialJournalDates[1]" v-date-format 
                  v-cleave="{ date: true, datePattern: ['d', 'm', 'Y'] }" hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-be-official-journal-end')" persistent-hint
                  :error-messages="errors.beOfficialJournalDates[1]" />
              </div>

              <!-- Submit & Print Buttons -->
              <v-btn type="submit" class="mr-4 submit-button" :loading="loading" :aria-label="t('aria.label.submit')"
                @click.prevent="submit">
                {{ t("general.submit") }}
              </v-btn>
              <v-btn v-if="hasResults" class="mr-4" :aria-label="t('aria.label.print')" @click.prevent="print('list')">
                <v-icon left> mdi-printer </v-icon>
                {{ t("general.message.printList") }}
              </v-btn>
            </form>
          </client-only>

          <!-- Search Results -->
          <div v-if="hasResults" ref="list">
            <div v-for="result in formattedSearchResult" :key="result.title">
              <h1 v-if="result.title">{{ result.title }}</h1>
              <div v-for="data in result.data" :key="data.title">
                <h2 v-if="data.title">{{ data.title }}</h2>
                <search-result-judgment-card v-for="judgment in data.judgments" :key="judgment.id"
                  :judgment-number="judgment.nr" :judgment-file-path="judgment.filePath"
                  :date-of-judgment="judgment.formatedJudmentDate" :roll-numbers="judgment.idsRole"
                  :judgment-types="judgment.judgmentTypes"
                  :date-of-be-official-journal="judgment.formatedBelgianOfficialDate"
                  :belgian-official-page="judgment.belgianOfficialPage" />
              </div>
            </div>
          </div>

          <div class="mt-6">
            <EmptyComponent v-if="(loaded && !hasResults) || searchError" />
          </div>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { ApiUrl, RoutePathKeys } from "../../core/constants";
import { groupBy } from "../../core/utilities";
import type {
  JudgmentType,
  ApplicantTable,
  ApplicantCategoryTable,
  Juridisction,
  JuridisctionArea,
} from "../../core/constants";
import img from '~/assets/img/banner-text.png'

// --- Helper: Create fresh default payload ---
const createDefaultPayload = () => ({
  judgmentNumber: null,
  rollNumber: null,
  applicant: null,
  jurisdiction: null,
  jurisdictionArea: null,
  referralDecisionDates: ["", ""],
  judgmentTypes: [] as number[],
  judgmentDates: ["", ""],
  applicantTypes: [] as number[],
  beOfficialJournalDates: ["", ""],
});

// --- Enums & Translations ---
enum SearchJudgmentsType {
  rollNumber = "rollNumber",
  applicant = "applicant",
  jurisdiction = "jurisdiction",
}

const { t, locale } = useLanguage();
const localePath = useLocalePath();

// --- Reactive Form Payload & Errors ---
const payload = reactive({
  type: SearchJudgmentsType.rollNumber,
  ...createDefaultPayload(),
});

const errors = ref({
  type: [] as string[],
  applicantTypes: [] as string[],
  applicant: [] as string[],
  jurisdiction: [] as string[],
  jurisdictionArea: [] as string[],
  referralDecisionDates: ["", ""],
  judgmentNumber: [] as string[],
  rollNumber: [] as string[],
  judgmentDates: ["", ""],
  judgmentTypes: [] as string[],
  beOfficialJournalDates: ["", ""],
});

// Reset payload when search type changes
watch(
  () => payload.type,
  (val) => {
    Object.assign(payload, { type: val, ...createDefaultPayload() });
    searchResponse = null;
    searchError.value = null;
  }
);

// --- Async Data Fetching ---
const { data: asyncData, error: asyncError, status, refresh } = useAsyncData(() =>
  Promise.all([
    //TODO: replace localhost url with actual api url
    $fetch<JudgmentType[]>(`http://localhost:3000${ApiUrl.judgmentTypes}?lang=${locale.value}`),
    $fetch<ApplicantTable[]>(`http://localhost:3000${ApiUrl.applicantList}?lang=${locale.value}`),
    $fetch<ApplicantCategoryTable[]>(`http://localhost:3000${ApiUrl.applicantTypes}?lang=${locale.value}`),
    $fetch<Juridisction[]>(`http://localhost:3000${ApiUrl.jurisdictionList}?lang=${locale.value}`),
    $fetch<JuridisctionArea[]>(`http://localhost:3000${ApiUrl.jurisdictionAreaList}?lang=${locale.value}`)
  ]).then((
    [judgmentTypesData, applicantListData, applicantTypesData, jurisdictionListData, jurisdictionAreaListData]
  ) => ({
    judgmentTypes: judgmentTypesData,
    applicantList: applicantListData,
    applicantTypes: applicantTypesData,
    jurisdictionList: jurisdictionListData,
    jurisdictionAreaList: jurisdictionAreaListData,
  }))
);

// Expose fetched data as computed properties
const judgmentTypesData = computed(() => asyncData.value?.judgmentTypes ?? []);
const applicantListData = computed(() => asyncData.value?.applicantList ?? []);
const applicantTypesData = computed(() => asyncData.value?.applicantTypes ?? []);
const jurisdictionListData = computed(() => asyncData.value?.jurisdictionList ?? []);
const jurisdictionAreaListData = computed(() => asyncData.value?.jurisdictionAreaList ?? []);

// --- State for Search Results ---
let searchResponse: any = null;
const searchError = ref(null);

const formattedSearchResult = computed(() => {
  if (!searchResponse) return [];
  const grouped = groupBy(searchResponse, "firstLevelTitle");
  const result: any[] = [];
  for (const [key, value] of Object.entries(grouped)) {
    result.push({
      title: key,
      data: Object.entries(groupBy(value, "secondLevelTitle")).map(([subKey, subValue]) => ({
        title: subKey,
        judgments: subValue,
      })),
    });
  }
  return result;
});
const hasResults = computed(() => formattedSearchResult.value.length > 0);

// --- Computed Filtering for judgmentTypes ---
const judgmentTypesFiltered = computed(() => {
  if (isSearchJudgmentsTypeRollNumber.value) {
    return judgmentTypesData.value.slice(0, 7);
  }
  if (isSearchJudgmentsTypeJurisdiction.value) {
    return judgmentTypesData.value.filter(
      (type) => !(type.id === 1 || type.id === 2 || type.id === 4)
    );
  }
  return judgmentTypesData.value;
});

// --- Computed Conditions for Displaying Fields ---
const isSearchJudgmentsTypeSelected = computed(() => !!payload.type);
const isSearchJudgmentsTypeRollNumber = computed(() => payload.type === SearchJudgmentsType.rollNumber);
const isSearchJudgmentsTypeApplicant = computed(() => payload.type === SearchJudgmentsType.applicant);
const isSearchJudgmentsTypeJurisdiction = computed(() => payload.type === SearchJudgmentsType.jurisdiction);

// --- Tabs & Search Type Options ---
const searchTabs = [
  { id: "general.message.judgment", to: RoutePathKeys.searchJudgment },
  { id: "general.message.standard", to: RoutePathKeys.searchStandard },
  { id: "general.message.systematic-table-contents-label", to: RoutePathKeys.searchTableOfContent },
  { id: "general.message.judgment-keywords-summary", to: RoutePathKeys.searchJudgmentKeywordSummary },
  { id: "general.message.full-text-of-judgments", to: RoutePathKeys.searchFullTextJudgment },
  { id: "general.message.keywords-judgments-pending-cases", to: RoutePathKeys.searchJudgmentsAndPendingCases },
];
const tabs = searchTabs.map((tab) => ({
  id: tab.id,
  to: localePath(tab.to),
  label: t(tab.id, 2),
}));

const searchTypesForJudgment = [
  { id: SearchJudgmentsType.rollNumber, label: t("general.message.roll-number") },
  { id: SearchJudgmentsType.applicant, label: t("general.message.applicant") },
  { id: SearchJudgmentsType.jurisdiction, label: t("general.message.jurisdisction") },
];

// --- Placeholder States ---
const pending = computed(() => false);
const loaded = computed(() => true);
const loading = computed(() => false);

// --- Submission & Print Handlers ---
const submit = async () => {
  if (!validateForm()) return;
  console.log("submit", JSON.stringify(payload));
  // Add submission logic here
};

const print = (id: string) => {
  console.log("print", id);
};

const validateForm = (): boolean => {
  errors.value = {
    type: [],
    applicantTypes: [],
    applicant: [],
    jurisdiction: [],
    jurisdictionArea: [],
    referralDecisionDates: ["", ""],
    judgmentNumber: [],
    rollNumber: [],
    judgmentDates: ["", ""],
    judgmentTypes: [],
    beOfficialJournalDates: ["", ""],
  };

  return Object.values(errors.value).every(err => (Array.isArray(err) ? err.every(msg => !msg) : !err));
};
</script>

<style scoped lang="scss">
.d-flex {
  max-width: 1260px !important;
  margin: auto;
  margin-bottom: 40px;

  @include mobile {
    margin-bottom: 24px;
    width: 100%;
  }
}

.fill-height {
  min-height: 100vh;
}

.submit-button {
  background: $indigo !important;
  color: white;
}

.text-grey {
  color: #00000099 !important;
}
</style>
