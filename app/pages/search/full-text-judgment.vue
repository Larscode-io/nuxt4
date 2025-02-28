<template>
  <v-container fluid class="fill-height pa-0 d-block">
    <BannerImage :title="t('menu.search.title')" :description="t('menu.search.title-description')" :image="img" />
    <v-row v-if="pending" class="row d-flex" align="flex-start" justify="center">
      <v-col class="col-12 col-md-12">
        <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
      </v-col>
    </v-row>
    <v-row v-else-if="error" class="row d-flex" align="flex-start" justify="center">
      <v-col class="col-12 col-md-12">
        <ErrorCard :message="t('error-fetching-data')" :show-go-home="false" />
      </v-col>
    </v-row>
    <v-row v-else class="row d-flex">
      <v-col cols="12" md="4" class="mt-4">
        <v-tabs v-model="activeTab" color="primary" direction="vertical" class="vertical-tabs" background-color="white"
          grow>
          <v-tab v-for="tab in tabs" :key="tab.id" :value="tab.id" :to="tab.to" nuxt style="text-transform: none">
            {{ tab.label }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="12" md="8" class="mt-6">
        <ClientOnly :placeholder="'general.loading'">
          <form @submit.prevent="submit">
            <v-text-field v-model="payload.term" name="inputfield" :label="t('general.message.search-label')"
              :error-messages="formErrors.term" />

            <v-radio-group v-model="payload.sort" inline :error="!!formErrors.sort">
              <v-radio class="mr-2 text-gray" color="primary" v-for="sort of sorts" :key="sort.id" :label="sort.label"
                :value="sort.value" name="type" required :disabled="loading" />
            </v-radio-group>

            <section v-if="hasContent" class="col-12 col-md-12">
              <ContentRenderer :value="page" class="section-content" />
            </section>

            <v-btn name="knop" type="submit" class="mr-4 mt-4 submit-button" :loading="loading"
              :aria-label="t('aria-label-submit')">
              {{ t('general.submit') }}
            </v-btn>

            <v-btn v-if="hasResults" class="mr-4" @click.prevent="print('list')">
              <v-icon left>
                mdi-printer
              </v-icon>
              {{ t('general.message.print-list') }}
            </v-btn>
          </form>
        </ClientOnly>
        <div v-if="hasResults" ref="list" class="mt-6">
          <FullTextSearchJudgmentCard v-for="result of formattedSearchResult" :key="result.id" :search-term="payload.term"
            :pdf-url="result.filePath" :date="result.formatedJudmentDate" :title="result.fileName" :score="result.score"
            :description="result.highlightHTML" :page-count="result.pageCount" />
        </div>
        <div v-if="(loaded && !hasResults) || searchError" class="mt-6">
          <EmptyComponent />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiUrl, ContentKeys, RoutePathKeys } from '../../core/constants'
import img from '~/assets/img/banner-text.png'

// Setup composables
const { t, locale } = useI18n()
const localePath = useLocalePath()


// Data refs
const page = ref(null)
const loading = ref(false)
const loaded = ref(false)
const searchError = ref(null)
const searchResponse = ref(null)
const list = ref(null)
const formErrors = ref({
  term: '',
  sort: ''
})

// Fetch page content
const { data, pending, error } = await useAsyncData(
  'full-text-search-explanation',
  () => queryContent(`/${locale.value}/${ContentKeys.fullTextSearchExplanation}`).findOne()
)

page.value = data.value

// Computed properties
const sorts = computed(() => [
  {
    id: 'general.message.sort-by-score',
    value: 'score',
    label: t('general.message.sort-by-score'),
  },
  {
    id: 'general.message.sort-by-date',
    value: 'date',
    label: t('general.message.sort-by-date'),
  },
  {
    id: 'general.message.sort-by-alphabetical',
    value: 'alpha',
    label: t('general.message.sort-by-alphabetical'),
  },
])

// --- Tabs & Search Type Options ---
const searchTabs = [
  { id: "general.message.judgment", to: RoutePathKeys.searchJudgment },
  { id: "general.message.standard", to: RoutePathKeys.searchStandard },
  { id: "general.message.systematic-table-contents-label", to: RoutePathKeys.searchTableOfContent },
  { id: "general.message.judgment-keywords-summary", to: RoutePathKeys.searchJudgmentKeywordSummary },
  { id: "general.message.full-text-of-judgments", to: RoutePathKeys.searchFullTextJudgment },
  { id: "general.message.keywords-judgments-pending-cases", to: RoutePathKeys.searchJudgmentsAndPendingCases },
];
const activeTab = ref("general.message.keywords-judgments-pending-cases");

const tabs = searchTabs.map((tab) => ({
  id: tab.id,
  to: localePath(tab.to),
  label: t(tab.id, 2),
}));

const payload = ref({
  sort: 'score',
  term: ''
})

const formattedSearchResult = computed(() => {
  if (!searchResponse.value) {
    return []
  }
  return searchResponse.value
})

const hasContent = computed(() =>
  page.value?.body?.children?.length > 0
)

const hasResults = computed(() =>
  formattedSearchResult.value && formattedSearchResult.value.length > 0
)

// Methods
function validateForm() {
  // Reset errors
  formErrors.value = {
    term: '',
    sort: ''
  }

  let isValid = true

  // Validate term
  if (!payload.value.term) {
    formErrors.value.term = t('general.message.required-field')
    isValid = false
  }

  // Validate sort
  if (!payload.value.sort) {
    formErrors.value.sort = t('general.message.required-field')
    isValid = false
  }

  return isValid
}

async function submit() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  loaded.value = false
  searchError.value = null
  searchResponse.value = null

  const url = `${ApiUrl.searchFullTextOfJudgments}?lang=${locale.value}&term=${payload.value.term}&sort=${payload.value.sort}`

  try {
    const { data } = await useFetch(url, { method: 'GET' })

    if (!data.value) {
      throw new Error("No data received")
    }

    searchResponse.value = data.value
    loaded.value = true
  } catch (err) {
    searchError.value = err || new Error("fout in full-text-judgment")
  } finally {
    loading.value = false
  }
}

function print(refName) {
  // Print functionality
  const printElement = list.value
  if (printElement) {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${printElement.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

// Watch for sort changes to automatically resubmit
watch(() => payload.value.sort, () => {
  if (loaded.value) {
    submit()
  }
})

// Meta
useHead({
  title: computed(() =>
    t('menu.search.title') || t('general.message.consts-court')
  ),
  meta: [
    {
      name: 'description',
      content: computed(() => t('menu.search.title') || '')
    }
  ]
})
</script>

<style scoped lang="scss">
.container {
  padding: 0 !important;

  @include mobile {
    padding: 32px;
  }
}

.row.d-flex {
  max-width: 1260px !important;
  margin: auto;
  margin-bottom: 80px;

  @include mobile {
    margin-bottom: 40px;
    width: 100%;
  }
}

.section-content {
  padding-top: 32px;
}

.submit-button {
  background: $indigo !important;
  color: white;
}

.v-input {
  margin: 32px 0 !important;
}

.d-flex .v-input__slot {
  box-shadow: none !important;
}
</style>