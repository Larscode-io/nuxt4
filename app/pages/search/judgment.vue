<template>
  <v-container fluid class="fill-height pa-0">
    <!-- Banner -->
    <BannerImage
      :title="t('menu.search.title')"
      :description="t('menu.search.title-description')"
      :image="img"
      :alt="t('alt.banner.books')"
    />

    <!-- Pending / Error states -->
    <v-row v-if="pending" align="flex-start" justify="center">
      <v-col cols="12">
        <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
      </v-col>
    </v-row>
    <v-row v-else-if="error" align="flex-start" justify="center">
      <v-col cols="12">
        <ErrorCard :message="t('error.fetchingData')" :show-go-home="false" />
      </v-col>
    </v-row>

    <!-- Main content -->
    <v-row v-else>
      <!-- Left column: Vertical Tabs via a v-list -->
      <v-col cols="12" md="4">
        <v-list nav class="vertical-tabs">
          <v-list-item
            v-for="tab in tabs"
            :key="tab.id"
            :to="tab.to"
            link
          >
            <v-list-item-content>
              <v-list-item-title>{{ tab.label }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <!-- Right column: Form and Results -->
      <v-col cols="12" md="8">
        <client-only :placeholder="t('general.loading')">
          <form @submit.prevent="submit">
            <!-- Radio group for search type -->
            <div class="mb-4">
              <v-radio-group
                v-model="payload.type"
                row
                :error="errors.type.length > 0"
                :error-messages="errors.type"
              >
                <v-radio
                  v-for="stype in searchTypesForJudgment"
                  :key="stype.id"
                  :label="stype.label"
                  :value="stype.id"
                  name="type"
                  :disabled="loading"
                />
              </v-radio-group>
            </div>

            <!-- Applicant fields (if search type is applicant) -->
            <div v-if="isSearchJudgmentsTypeApplicant">
              <v-select
                v-model="payload.applicantTypes"
                :items="applicantTypes"
                multiple
                :label="t('general.message.applicantType')"
                item-value="id"
                item-text="label"
                :error-messages="errors.applicantTypes"
                required
              />
              <v-select
                v-model="payload.applicant"
                :items="applicantList"
                :label="t('general.message.applicant')"
                item-value="id"
                item-text="label"
                :error-messages="errors.applicant"
                required
              />
            </div>

            <!-- Jurisdiction fields (if search type is jurisdiction) -->
            <div v-if="isSearchJudgmentsTypeJurisdiction">
              <v-select
                v-model="payload.jurisdiction"
                :items="jurisdictionList"
                :label="t('general.message.jurisdisction')"
                item-value="id"
                item-text="label"
                :error-messages="errors.jurisdiction"
                required
              />
              <v-select
                v-model="payload.jurisdictionArea"
                :items="jurisdictionAreaList"
                :label="t('general.message.jurisdisctionArea')"
                item-value="id"
                item-text="label"
                :error-messages="errors.jurisdictionArea"
                required
              />
              <div class="d-flex">
                <v-text-field
                  v-model.lazy="payload.referralDecisionDates[0]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d','m','Y']
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.referralDecisionStart')"
                  persistent-hint
                  :error-messages="[errors.referralDecisionDates[0]]"
                />
                <span class="px-2" />
                <v-text-field
                  v-model.lazy="payload.referralDecisionDates[1]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d','m','Y']
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.referralDecisionEnd')"
                  persistent-hint
                  :error-messages="[errors.referralDecisionDates[1]]"
                />
              </div>
            </div>

            <!-- Common fields -->
            <v-text-field
              v-model="payload.judgmentNumber"
              :label="t('general.message.judgmentNumber')"
              :error-messages="errors.judgmentNumber"
              required
              hint="XX/YYYY"
              persistent-hint
              :disabled="!isSearchJudgmentsTypeSelected"
            />
            <div v-if="isSearchJudgmentsTypeRollNumber">
              <v-text-field
                v-model="payload.rollNumber"
                :label="t('general.message.rollNumber')"
                :error-messages="errors.rollNumber"
                required
              />
            </div>
            <div class="d-flex">
              <v-text-field
                v-model.lazy="payload.judgmentDates[0]"
                v-cleave="{
                  date: true,
                  datePattern: ['d','m','Y']
                }"
                hint="DD/MM/YYYY"
                :label="t('general.message.dateOfJudgmentStart')"
                persistent-hint
                :error-messages="[errors.judgmentDates[0]]"
              />
              <span class="px-2" />
              <v-text-field
                v-model.lazy="payload.judgmentDates[1]"
                v-cleave="{
                  date: true,
                  datePattern: ['d','m','Y']
                }"
                hint="DD/MM/YYYY"
                :label="t('general.message.dateOfJudgmentEnd')"
                persistent-hint
                :error-messages="[errors.judgmentDates[1]]"
              />
            </div>
            <v-select
              v-model="payload.judgmentTypes"
              :items="judgmentTypesFiltered"
              multiple
              :label="t('general.message.judgmentType')"
              item-value="id"
              item-text="label"
              :error-messages="errors.judgmentTypes"
              required
              :disabled="!isSearchJudgmentsTypeSelected"
            />
            <div v-if="isSearchJudgmentsTypeRollNumber" class="d-flex">
              <v-text-field
                v-model.lazy="payload.beOfficialJournalDates[0]"
                v-cleave="{
                  date: true,
                  datePattern: ['d','m','Y']
                }"
                hint="DD/MM/YYYY"
                :label="t('general.message.dateOfBeOfficialJournalStart')"
                persistent-hint
                :error-messages="[errors.beOfficialJournalDates[0]]"
              />
              <span class="px-2" />
              <v-text-field
                v-model.lazy="payload.beOfficialJournalDates[1]"
                v-cleave="{
                  date: true,
                  datePattern: ['d','m','Y']
                }"
                hint="DD/MM/YYYY"
                :label="t('general.message.dateOfBeOfficialJournalEnd')"
                persistent-hint
                :error-messages="[errors.beOfficialJournalDates[1]]"
              />
            </div>

            <!-- Submit & Print Buttons -->
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
              <search-result-judgment-card
                v-for="judgment in data.judgments"
                :id="judgment.id"
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
import { ref, watch, onMounted, computed } from "vue";
import { ApiUrl, RoutePathKeys } from "../../core/constants";
import { groupBy, to } from "../../core/utilities";
import type {
  JudgmentType,
  ApplicantTable,
  ApplicantCategoryTable,
  Juridisction,
  JuridisctionArea,
} from "../../core/constants";

enum SearchJudgmentsType {
  rollNumber = "rollNumber",
  applicant = "applicant",
  jurisdiction = "jurisdiction",
}

const { t, locale } = useLanguage();
const localePath = useLocalePath();

// Default payload for each search type
const defaultPayloadByJudgmentsType = {
  [SearchJudgmentsType.rollNumber]: {
    judgmentNumber: "",
    rollNumber: "",
    applicant: "",
    jurisdiction: "",
    jurisdictionArea: "",
    referralDecisionDates: ["", ""],
    judgmentTypes: [] as number[],
    judgmentDates: ["", ""],
    applicantTypes: [] as number[],
    beOfficialJournalDates: ["", ""],
  },
  [SearchJudgmentsType.applicant]: {
    judgmentNumber: "",
    rollNumber: "",
    applicant: "",
    jurisdiction: "",
    jurisdictionArea: "",
    referralDecisionDates: ["", ""],
    judgmentTypes: [] as number[],
    judgmentDates: ["", ""],
    applicantTypes: [] as number[],
    beOfficialJournalDates: ["", ""],
  },
  [SearchJudgmentsType.jurisdiction]: {
    judgmentNumber: "",
    rollNumber: "",
    applicant: "",
    jurisdiction: "",
    jurisdictionArea: "",
    referralDecisionDates: ["", ""],
    judgmentTypes: [] as number[],
    judgmentDates: ["", ""],
    applicantTypes: [] as number[],
    beOfficialJournalDates: ["", ""],
  },
};

// Reactive payload and errors
const payload = reactive({
  type: SearchJudgmentsType.rollNumber,
  ...defaultPayloadByJudgmentsType[SearchJudgmentsType.rollNumber],
});

const errors = ref({
  type: [] as string[],
  applicantTypes: [] as string[],
  applicant: [] as string[],
  jurisdiction: [] as string[],
  jurisdictionArea: [] as string[],
  referralDecisionDates: ["" as string, "" as string],
  judgmentNumber: [] as string[],
  rollNumber: [] as string[],
  judgmentDates: ["" as string, "" as string],
  judgmentTypes: [] as string[],
  beOfficialJournalDates: ["" as string, "" as string],
});

// Computed properties to conditionally show fields
const isSearchJudgmentsTypeSelected = computed(() => !!payload.type);
const isSearchJudgmentsTypeRollNumber = computed(
  () => payload.type === SearchJudgmentsType.rollNumber
);
const isSearchJudgmentsTypeApplicant = computed(
  () => payload.type === SearchJudgmentsType.applicant
);
const isSearchJudgmentsTypeJurisdiction = computed(
  () => payload.type === SearchJudgmentsType.jurisdiction
);

// Minimal custom validation example (expand as needed)
const validateForm = (): boolean => {
  // Reset all errors
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

  return Object.values(errors.value).every(err => {
    if (Array.isArray(err)) {
      return err.every(msg => !msg);
    }
    return !err;
  });
};

const submit = async () => {
  if (!validateForm()) return;
  console.log("submit", JSON.stringify(payload));
  // Add your submission logic here.
};

const print = (id: string) => {
  console.log("print", id);
};

// Data for select fields
const judgmentTypes = ref<JudgmentType[]>([]);
const applicantList = ref<ApplicantTable>([]);
const applicantTypes = ref<ApplicantCategoryTable>([]);
const jurisdictionList = ref<Juridisction[]>([]);
const jurisdictionAreaList = ref<JuridisctionArea[]>([]);

onMounted(async () => {
  const [fetchError, response] = await to(
    Promise.all([
      useFetch<JudgmentType>(`http://localhost:3000${ApiUrl.judgmentTypes}?lang=${locale.value}`),
      useFetch<ApplicantTable>(`http://localhost:3000${ApiUrl.applicantList}?lang=${locale.value}`),
      useFetch<ApplicantCategoryTable>(`http://localhost:3000${ApiUrl.applicantTypes}?lang=${locale.value}`),
      useFetch<Juridisction>(`http://localhost:3000${ApiUrl.jurisdictionList}?lang=${locale.value}`),
      useFetch<JuridisctionArea>(`http://localhost:3000${ApiUrl.jurisdictionAreaList}?lang=${locale.value}`),
    ])
  );
  if (fetchError || !response) throw fetchError;
  const [
    judgmentTypesData,
    applicantListData,
    applicantTypesData,
    jurisdictionListData,
    jurisdictionAreaListData,
  ] = response;
  judgmentTypes.value = judgmentTypesData;
  applicantList.value = applicantListData;
  applicantTypes.value = applicantTypesData;
  jurisdictionList.value = jurisdictionListData;
  jurisdictionAreaList.value = jurisdictionAreaListData;
});

const pending = computed(() => false);
const loaded = computed(() => true);
const loading = computed(() => false);
const searchError = ref(null);

// For displaying search results (if any)
let searchResponse: any = null;
const formattedSearchResult = computed(() => {
  if (!searchResponse) return [];
  const grouped = groupBy(searchResponse, "firstLevelTitle");
  const result: any[] = [];
  for (const [key, value] of Object.entries(grouped)) {
    result.push({
      title: key,
      data: Object.entries(groupBy(value, "secondLevelTitle")).map(
        ([subKey, subValue]) => ({
          title: subKey,
          judgments: subValue,
        })
      ),
    });
  }
  return result;
});
const hasResults = computed(() => formattedSearchResult.value.length > 0);

// Computed filtering for judgmentTypes
const judgmentTypesFiltered = computed(() => {
  if (isSearchJudgmentsTypeRollNumber.value) {
    return judgmentTypes.value.slice(0, 7);
  }
  if (isSearchJudgmentsTypeJurisdiction.value) {
    return judgmentTypes.value.filter(
      (type) => !(type.id === 1 || type.id === 2 || type.id === 4)
    );
  }
  return judgmentTypes.value;
});

// Tabs for the left column
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

// Also define search types for the radio group
const searchTypesForJudgment = [
  { id: SearchJudgmentsType.rollNumber, label: t("general.message.rollNumber") },
  { id: SearchJudgmentsType.applicant, label: t("general.message.applicant") },
  { id: SearchJudgmentsType.jurisdiction, label: t("general.message.jurisdisction") },
];

// Watch for changes to payload.type to reset the payload accordingly
watch(
  () => payload.type,
  (val) => {
    Object.assign(payload, {
      type: val,
      ...defaultPayloadByJudgmentsType[val],
    });
    searchResponse = null;
    searchError.value = null;
  }
);

const img = "banner-books.jpg";
</script>

<style scoped lang="scss">
.fill-height {
  min-height: 100vh;
}
.vertical-tabs {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}
.vertical-tabs .v-list-item {
  cursor: pointer;
}
.vertical-tabs .v-list-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.submit-button {
  background: $indigo !important;
  color: white;
}
.v-input {
  margin: 32px 0 !important;
  box-shadow: none;
}
</style>
