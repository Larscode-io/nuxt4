<template>
  <v-container fluid class="fill-height pa-0 d-block">
    <!-- Banner -->
    <BannerImage :title="t('menu.search.title')" :description="t('menu.search.title-description')" :image="img" />

    <v-row class="d-flex" justify="center">
      <v-col cols="12" md="4" class="mt-4">
        <SearchTabs active-tab="general.message.standard" />
      </v-col>

      <v-col cols="12" md="8" class="mt-6">
        <client-only :placeholder="t('general.loading')">
          <form @submit.prevent="submit">
            <!-- Radio group for search type -->
            <v-radio-group color="primary" inline v-model="payload.type" row :error="!!errors.type"
              :error-messages="errors.type || []">
              <v-radio class="mr-2 text-gray" v-for="type in types" :key="type.id" :label="type.label" :value="type.id"
                name="type" :disabled="loading" />
            </v-radio-group>

            <v-text-field v-model="payload.searchTerm" :label="t('general.message.search-label')"
              :error-messages="errors.searchTerm || []" required />

            <v-text-field v-model.lazy="payload.standardDate" v-date-format hint="DD/MM/YYYY"
              :label="t('general.message.standard-date')" persistent-hint :error-messages="errors.standardDate || []" />

            <v-text-field v-model="payload.clauseNumber" :label="t('general.message.article-number')"
              :error-messages="errors.clauseNumber || []" required />

            <v-checkbox v-model="payload.searchByExactClauseNumber"
              :label="t('general.message.search-by-exact-clause-number')"
              :error-messages="errors.searchByExactClauseNumber || []" />

            <v-btn type="submit" class="mr-4 submit-button" :loading="loading">
              {{ t("general.submit") }}
            </v-btn>
            <v-btn v-if="hasResults" class="mr-4" @click.prevent="print('list')">
              <v-icon left> mdi-printer </v-icon>
              {{ t("general.message.print-list") }}
            </v-btn>
          </form>
        </client-only>

        <div v-if="(loaded && !hasResults) || searchError" class="mt-6">
          <EmptyComponent />
        </div>

        <div v-if="hasResults" ref="list" class="mt-6">
          <div v-for="result in Object.values(formattedSearchResult)" :key="result[0].standard"
            class="table-standard-container">
            <h3 v-if="result[0].standard">
              {{ result[0].formatedStandardDate }} - {{ result[0].standard }}
            </h3>
            <v-simple-table dense>
              <thead>
                <tr>
                  <th class="text-left">{{ t("general.message.article") }}</th>
                  <th class="text-left">{{ t("general.message.judgment") }}</th>
                </tr>
              </thead>
              <tbody>
                <!-- <tr v-for="data in result" :key="data.clauseNumber">
                  <td>{{ data.clauseNumber }}</td>
                  <td>
                    <ul>
                      <li v-for="judgment in data.judgments" :key="judgment.filePath">
                        <a :href="judgment.filePath">{{ judgment.label }}</a>
                      </li>
                    </ul>
                  </td>
                </tr> -->
              </tbody>
            </v-simple-table>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { RoutePathKeys } from "../../core/constants";
import img from "~/assets/img/banner-text.png";

const { t } = useI18n();
const localePath = useLocalePath();

// Define payload with default radio selection matching the first option's ID
const payload = reactive({
  type: "general.message.controlled", // Updated default value
  searchTerm: "",
  standardDate: "",
  clauseNumber: "",
  searchByExactClauseNumber: false,
});

const types = [
  {
    id: "general.message.controlled",
    label: t("general.message.controlled", 2),
  },
  {
    id: "general.message.reference",
    label: t("general.message.reference", 2),
  },
];

// Define errors
const errors = reactive({
  type: undefined,
  searchTerm: undefined,
  standardDate: undefined,
  clauseNumber: undefined,
  searchByExactClauseNumber: undefined,
});

// Dummy variables for demonstration (replace with actual implementation as needed)
const loading = ref(false);
const hasResults = false; // Set to true if search results exist
const loaded = true;
const searchError = false;
const formattedSearchResult = [];

// Validation function
const validateForm = (): boolean => {
  errors.searchTerm = payload.searchTerm ? undefined : ["Search term is required"];
  return !errors.searchTerm;
};

// Submit function
const submit = async () => {
  if (!validateForm()) return;
  console.log("submit", JSON.stringify(payload));
};

// Print function
const print = (ref: string) => {
  console.log("Print", ref);
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

.submit-button {
  background: $indigo !important;
  color: white;
}

.table-standard-container {
  padding: 16px 32px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
}
</style>
