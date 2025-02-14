<template>
  <div class="content-wrapper">
    <BannerImage
      :title="t('menu.search.title')"
      :description="t('menu.search.title-description')"
      :image="img"
      :alt="t('alt.banner.books')"
    />
    <v-row v-if="pending" class="d-flex" align="start" justify="center">
      <div class="col-12 col-md-12">
        <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
      </div>
    </v-row>
    <v-row v-else-if="error" class="d-flex" align="start" justify="center">
      <div class="col-12 col-md-12">
        <ErrorCard :message="t('error.fetchingData')" :show-go-home="false" />
      </div>
    </v-row>
    <v-row v-else class="d-flex">
      <div class="col-4 col-xs-9 col-md-4">
        <v-tabs show-arrows vertical left>
          <v-tab
            v-for="tab of tabs"
            :key="tab.id"
            :value="tab.id"
            :to="tab.to"
            nuxt
            style="text-transform: none"
          >
            {{ tab.label }}
          </v-tab>
        </v-tabs>
      </div>
      <div class="col-8 col-xs-8 col-md-8">
        <client-only :placeholder="t('general.loading')">
          <ValidationObserver ref="observer" slim>
            <form>
              <ValidationProvider
                v-slot="{ errors }"
                key="type"
                name="type"
                rules="required"
              >
                <v-radio-group
                  v-model="type"
                  row
                  :error="errors && errors.length > 0"
                >
                  <v-radio
                    v-for="stype of searchTypesForJudgment"
                    :key="stype.id"
                    :label="stype.label"
                    :value="stype.id"
                    name="type"
                    required
                    :disabled="loading"
                  />
                </v-radio-group>
              </ValidationProvider>

              <!-- <ValidationProvider
                v-if="isSearchJudgmentsTypeApplicant"
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.applicantType'))"
                :name="toNameKey(t('general.message.applicantType'))"
                rules
              >
                <v-select
                  v-model="applicantTypes"
                  :items="applicantTypes"
                  multiple
                  :label="t('general.message.applicantType')"
                  item-value="id"
                  item-text="label"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>

              <ValidationProvider
                v-if="isSearchJudgmentsTypeApplicant"
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.applicant'))"
                :name="toNameKey(t('general.message.applicant'))"
                rules
              >
                <v-select
                  v-model="applicant"
                  :items="applicantList"
                  :label="t('general.message.applicant')"
                  item-value="id"
                  item-text="label"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>

              <ValidationProvider
                v-if="isSearchJudgmentsTypeJurisdiction"
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.jurisdisction'))"
                :name="toNameKey(t('general.message.jurisdisction'))"
                rules
              >
                <v-select
                  v-model="jurisdiction"
                  :items="jurisdictionList"
                  :label="t('general.message.jurisdisction')"
                  item-value="id"
                  item-text="label"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>

              <ValidationProvider
                v-if="isSearchJudgmentsTypeJurisdiction"
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.jurisdisctionArea'))"
                :name="toNameKey(t('general.message.jurisdisctionArea'))"
                rules
              >
                <v-select
                  v-model="jurisdictionArea"
                  :items="jurisdictionAreaList"
                  :label="t('general.message.jurisdisctionArea')"
                  item-value="id"
                  item-text="label"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>
              <ValidationProvider
                v-if="isSearchJudgmentsTypeJurisdiction"
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.referralDecision'))"
                class="d-flex"
                :name="toNameKey(t('general.message.referralDecision'))"
              >
                <v-text-field
                  v-model.lazy="referralDecisionDates[0]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.referralDecisionStart')"
                  persistent-hint
                  :error-messages="errors"
                />
                <span class="px-2" />
                <v-text-field
                  v-model.lazy="referralDecisionDates[1]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.referralDecisionEnd')"
                  persistent-hint
                  :error-messages="errors"
                />
              </ValidationProvider>

              <ValidationProvider
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.judgmentNumber'))"
                :name="toNameKey(t('general.message.judgmentNumber'))"
                rules
              >
                <v-text-field
                  v-model="judgmentNumber"
                  :label="t('general.message.judgmentNumber')"
                  :error-messages="errors"
                  required
                  hint="XX/YYYY"
                  :persistent-hint="true"
                  :disabled="!isSearchJudgmentsTypeSelected"
                />
              </ValidationProvider>

              <ValidationProvider
                v-if="isSearchJudgmentsTypeRollNumber"
                v-slot="{ errors }"
                :name="toNameKey(t('general.message.rollNumber'))"
                rules
              >
                <v-text-field
                  v-model="rollNumber"
                  :label="t('general.message.rollNumber')"
                  :error-messages="errors"
                  required
                />
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.dateOfJudgment'))"
                class="d-flex"
                :name="toNameKey(t('general.message.dateOfJudgment'))"
              >
                <v-text-field
                  v-model.lazy="judgmentDates[0]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.dateOfJudgmentStart')"
                  persistent-hint
                  :error-messages="errors"
                />
                <span class="px-2" />
                <v-text-field
                  v-model.lazy="judgmentDates[1]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.dateOfJudgmentEnd')"
                  persistent-hint
                  :error-messages="errors"
                />
              </ValidationProvider>
              <ValidationProvider
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.judgmentType'))"
                :name="toNameKey(t('general.message.judgmentType'))"
                rules
              >
                <v-select
                  v-model="judgmentTypes"
                  :items="judgmentTypesFiltered"
                  multiple
                  :label="t('general.message.judgmentType')"
                  item-value="id"
                  item-text="label"
                  :error-messages="errors"
                  required
                  :disabled="!isSearchJudgmentsTypeSelected"
                />
              </ValidationProvider>
              <ValidationProvider
                v-if="isSearchJudgmentsTypeRollNumber"
                v-slot="{ errors }"
                :key="toNameKey(t('general.message.dateOfBeOfficialJournal'))"
                class="d-flex"
                :name="toNameKey(t('general.message.dateOfBeOfficialJournal'))"
              >
                <v-text-field
                  v-model.lazy="beOfficialJournalDates[0]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.dateOfBeOfficialJournalStart')"
                  persistent-hint
                  :error-messages="errors"
                />
                <span class="px-2" />
                <v-text-field
                  v-model.lazy="beOfficialJournalDates[1]"
                  v-cleave="{
                    date: true,
                    datePattern: ['d', 'm', 'Y'],
                  }"
                  hint="DD/MM/YYYY"
                  :label="t('general.message.dateOfBeOfficialJournalEnd')"
                  persistent-hint
                  :error-messages="errors"
                />
              </ValidationProvider> -->
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
          </ValidationObserver>
        </client-only>

        A
        <!-- <div v-if="hasResults" ref="list">B
          <div v-for="result of formattedSearchResult" :key="result.title">
            <h1 v-if="result.title">
              {{ result.title }}
            </h1>

            <div v-for="data of result.data" :key="data.title">
              <h2 v-if="data.title">
                {{ data.title }}
              </h2>

              <search-result-judgment-card
                v-for="judgment of data.judgments"
                :id="judgment.id"
                :key="judgment.id"
                :judgment-number="judgment.nr"
                :judgment-file-path="judgment.filePath"
                :date-of-judgment="judgment.formatedJudmentDate"
                :roll-numbers="judgment.idsRole"
                :judgment-types="judgment.judgmentTypes"
                :date-of-be-official-journal="
                  judgment.formatedBelgianOfficialDate
                "
                :belgian-official-page="judgment.belgianOfficialPage"
              />
            </div>
          </div>
        </div> -->
        <div class="mt-6">
          <EmptyComponent v-if="(loaded && !hasResults) || searchError" />
        </div>
      </div>
    </v-row> 
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { ApiUrl, RoutePathKeys } from "~/core/constants";
import { groupBy, to } from "~/core/utilities";
import type {
  JudgmentType,
  ApplicantTable,
  ApplicantCategoryTable,
  Juridisction,
  JuridisctionArea,
} from "~/core/constants";

enum SearchJudgmentsType {
  rollNumber = "rollNumber",
  applicant = "applicant",
  jurisdiction = "jurisdiction",
}

const { t, locale } = useLanguage();
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

const judgmentTypes = ref<JudgmentType[]>([]);
const applicantList = ref<ApplicantTable>([]);
const applicantTypes = ref<ApplicantCategoryTable>([]);
const jurisdictionList = ref<Juridisction>([]);
const jurisdictionAreaList = ref<JuridisctionArea>([]);

onMounted(async () => {
  const [error, response] = await to(
    Promise.all([
      useFetch<JudgmentType>(
        `http://localhost:3000${ApiUrl.judgmentTypes}?lang=${locale.value}`
      ),
      useFetch<ApplicantTable>(
        `http://localhost:3000${ApiUrl.applicantList}?lang=${locale.value}`
      ),
      useFetch<ApplicantCategoryTable>(
        `http://localhost:3000${ApiUrl.applicantTypes}?lang=${locale.value}`
      ),
      useFetch<Juridisction>(
        `http://localhost:3000${ApiUrl.jurisdictionList}?lang=${locale.value}`
      ),
      useFetch<JuridisctionArea>(
        `http://localhost:3000${ApiUrl.jurisdictionAreaList}?lang=${locale.value}`
      ),
    ])
  );

  if (error || !response) {
    throw error;
  }

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
const jurisdiction = computed(() => undefined);
const jurisdictionArea = computed(() => undefined);
const judgmentNumber = computed(() => "12/3456");

let payload = {
  type: SearchJudgmentsType.rollNumber,
  ...defaultPayloadByJudgmentsType[SearchJudgmentsType.rollNumber],
};
const isSearchJudgmentsTypeSelected = computed(() => !!payload?.type);
const isSearchJudgmentsTypeRollNumber = computed(
  () => payload?.type === SearchJudgmentsType.rollNumber
);
const isSearchJudgmentsTypeJurisdiction = computed(
  () => payload?.type === SearchJudgmentsType.jurisdiction
);
const isSearchJudgmentsTypeApplicant = computed(
  () => payload?.type === SearchJudgmentsType.applicant
);
const isFormInvalid = computed(() => {
  if (isSearchJudgmentsTypeRollNumber.value) {
    return (
      !payload?.judgmentNumber &&
      (!payload?.judgmentTypes || payload?.judgmentTypes?.length === 0) &&
      (!payload?.judgmentDates || payload?.judgmentDates?.length === 0) &&
      !payload?.rollNumber &&
      (!payload?.beOfficialJournalDates ||
        payload?.beOfficialJournalDates?.length === 0)
    );
  }

  if (isSearchJudgmentsTypeApplicant.value) {
    return (
      !payload?.judgmentNumber &&
      (!payload?.judgmentTypes || payload?.judgmentTypes?.length === 0) &&
      (!payload?.judgmentDates || payload?.judgmentDates?.length === 0) &&
      !payload?.applicant &&
      payload?.applicantTypes?.length === 0
    );
  }

  if (isSearchJudgmentsTypeJurisdiction.value) {
    return (
      !payload?.judgmentNumber &&
      (!payload?.judgmentTypes || payload?.judgmentTypes?.length === 0) &&
      (!payload?.judgmentDates || payload?.judgmentDates?.length === 0) &&
      !payload?.jurisdiction &&
      !payload?.jurisdictionArea &&
      (!payload?.referralDecisionDates ||
        payload?.referralDecisionDates?.length === 0)
    );
  }
  return !payload?.type;
});
let searchResponse = null;
const formattedSearchResult = computed(() => {
  if (!searchResponse) {
    return [];
  }
  const groupedByFirstLevelTitle = groupBy(searchResponse, "firstLevelTitle");

  const result = [];

  for (const [key, value] of Object.entries(groupedByFirstLevelTitle)) {
    result.push({
      title: key,
      data: Object.entries(groupBy(value, "secondLevelTitle")).map(
        ([key, value]) => {
          return {
            title: key,
            judgments: value,
          };
        }
      ),
    });
  }

  return result;
});
const hasResults = computed(() => true);

const rollNumber = computed(() => "123456");
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

const toNameKey = (val: string = "") => {
  return val.toLowerCase();
};

const localePath = useLocalePath();

const searchTabs = [
  {
    id: "general.message.judgment",
    to: RoutePathKeys.searchJudgment,
  },
  {
    id: "general.message.standard",
    to: RoutePathKeys.searchStandard,
  },
  {
    id: "general.message.systematic-table-contents-label",
    to: RoutePathKeys.searchTableOfContent,
  },
  {
    id: "general.message.judgment-keywords-summary",
    to: RoutePathKeys.searchJudgmentKeywordSummary,
  },
  {
    id: "general.message.full-text-of-judgments",
    to: RoutePathKeys.searchFullTextJudgment,
  },
  {
    id: "general.message.keywords-judgments-pending-cases",
    to: RoutePathKeys.searchJudgmentsAndPendingCases,
  },
];

const tabs = searchTabs.map((tab) => {
  return {
    id: tab.id,
    to: localePath(tab.to),
    label: t(tab.id, 2),
  };
});

const referralDecisionDates = computed(() => ["24-01-2025", "24-01-2025"]);
const judgmentDates = computed(() => ["24-01-2025", "24-01-2025"]);
const beOfficialJournalDates = computed(() => ["24-01-2025", "24-01-2025"]);

const submit = async () => {
  console.log("submit");
};
const print = (id: string) => {
  console.log("print", id);
};

const applicant = computed(() => undefined);
const type = ref(SearchJudgmentsType.rollNumber);
const searchTypesForJudgment = [
  {
    id: SearchJudgmentsType.rollNumber,
    label: t("general.message.rollNumber"),
  },
  {
    id: SearchJudgmentsType.applicant,
    label: t("general.message.applicant"),
  },
  {
    id: SearchJudgmentsType.jurisdiction,
    label: t("general.message.jurisdisction"),
  },
];

const img = "banner-books.jpg";

watch(
  () => payload.type,
  (val) => {
    payload = {
      type: val,
      ...defaultPayloadByJudgmentsType[val],
    };
    searchResponse = null;
    searchError.value = null;
  }
);
</script>

<style scoped lang="scss">
.container {
  padding: 0 !important;
  @include mobile {
    padding: 32px;
  }
}
.d-flex {
  max-width: 1260px;
  margin: auto;
  @include mobile {
    width: 100% !important;
  }
}
.nuxt-content {
  padding-top: 32px;
}
.submit-button {
  background: $indigo !important;
  color: white;
}

.v-input {
  margin: 32px 0 !important;
  box-shadow: none;
}
.d-flex .v-input__slot {
  box-shadow: none !important;
}
.v-picker {
  margin-bottom: none;
}
</style>
