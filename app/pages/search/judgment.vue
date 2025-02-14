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
      <!-- Left column: simulated vertical tabs using v-list -->
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

      <!-- Right column: Form -->
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

            <!-- Additional form fields can go here -->

            <v-btn
              type="submit"
              class="mr-4 submit-button"
              :loading="loading"
              :aria-label="t('aria.label.submit')"
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
        <div class="mt-6">
          <EmptyComponent v-if="(loaded && !hasResults) || searchError" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, computed } from "vue";
import { ApiUrl, RoutePathKeys } from "../../core/constants";
import { groupBy, to } from "../../core/utilities";
import type {
  JudgmentType,
  ApplicantTable,
  ApplicantCategoryTable,
  Juridisction,
  JuridisctionArea,
} from "../../core/constants";
import { useLanguage } from "../../composables/useLanguage";

enum SearchJudgmentsType {
  rollNumber = "rollNumber",
  applicant = "applicant",
  jurisdiction = "jurisdiction",
}

const { t, locale } = useLanguage();

// Default payload for each search type
const defaultPayloadByJudgmentsType = {
  [SearchJudgmentsType.rollNumber]: {
    judgmentNumber: "",
    rollNumber: "",
    applicant: "",
    jurisdiction: "",
    jurisdictionArea: "",
    referralDecisionDates: [],
    judgmentTypes: [],
    judgmentDates: [],
    applicantTypes: [],
    beOfficialJournalDates: [],
  },
  [SearchJudgmentsType.applicant]: {
    judgmentNumber: "",
    rollNumber: "",
    applicant: "",
    jurisdiction: "",
    jurisdictionArea: "",
    referralDecisionDates: [],
    judgmentTypes: [],
    judgmentDates: [],
    applicantTypes: [],
    beOfficialJournalDates: [],
  },
  [SearchJudgmentsType.jurisdiction]: {
    judgmentNumber: "",
    rollNumber: "",
    applicant: "",
    jurisdiction: "",
    jurisdictionArea: "",
    referralDecisionDates: [],
    judgmentTypes: [],
    judgmentDates: [],
    applicantTypes: [],
    beOfficialJournalDates: [],
  },
};

// Create a reactive payload to bind form values
const payload = reactive({
  type: SearchJudgmentsType.rollNumber,
  ...defaultPayloadByJudgmentsType[SearchJudgmentsType.rollNumber],
});

// Define a reactive errors object (example only for type field)
const errors = ref({
  type: [] as string[],
  // Additional error fields can be added here
});

// Simple custom validation function
const validateForm = (): boolean => {
  errors.value.type = [];
  if (!payload.type) {
    errors.value.type.push(t("validation.required") || "This field is required");
  }
  // Add additional validations here...
  return Object.values(errors.value).every((fieldErrors) => fieldErrors.length === 0);
};

const submit = async () => {
  if (!validateForm()) return;
  console.log("submit", JSON.stringify(payload));
  // Add your form submission logic here.
};

const print = (id: string) => {
  console.log("print", id);
};

// Data for select fields
const judgmentTypes = ref<JudgmentType[]>([]);
const applicantList = ref<ApplicantTable>([]);
const applicantTypes = ref<ApplicantCategoryTable>([]);
const jurisdictionList = ref<Juridisction>([]);
const jurisdictionAreaList = ref<JuridisctionArea>([]);

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

// Computed properties for UI state
const pending = computed(() => false);
const loaded = computed(() => true);
const loading = computed(() => false);
const searchError = ref(null);

const isSearchJudgmentsTypeRollNumber = computed(
  () => payload.type === SearchJudgmentsType.rollNumber
);
const isSearchJudgmentsTypeJurisdiction = computed(
  () => payload.type === SearchJudgmentsType.jurisdiction
);
const isSearchJudgmentsTypeApplicant = computed(
  () => payload.type === SearchJudgmentsType.applicant
);
const isSearchJudgmentsTypeSelected = computed(() => !!payload.type);

// Example search types for the radio group
const searchTypesForJudgment = [
  { id: SearchJudgmentsType.rollNumber, label: t("general.message.rollNumber") },
  { id: SearchJudgmentsType.applicant, label: t("general.message.applicant") },
  { id: SearchJudgmentsType.jurisdiction, label: t("general.message.jurisdisction") },
];

// Tabs for the left column; you can customize these as needed.
const localePath = useLocalePath();
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

// Watch for type changes to reset payload accordingly
watch(
  () => payload.type,
  (val) => {
    Object.assign(payload, {
      type: val,
      ...defaultPayloadByJudgmentsType[val],
    });
    // Reset search response & errors if needed
  }
);

const img = "banner-books.jpg";
let searchResponse: any = null;
</script>

<style scoped lang="scss">
.fill-height {
  min-height: 100vh;
}

/* Optional: style the vertical tabs (v-list) to mimic tab styling */
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
</style>
