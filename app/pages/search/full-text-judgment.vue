<template>
  <v-container
    fluid
    class="fill-height pa-0 d-block"
  >
    <BannerImage
      :title="t('menu.search.title')"
      :description="t('menu.search.title-description')"
      :image="img"
    />
    <v-row
      v-if="pending"
      class="row d-flex"
      justify="center"
    >
      <v-col class="col-12 col-md-12">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="article"
        />
      </v-col>
    </v-row>
    <v-row class="row d-flex">
      <v-col
        cols="12"
        md="4"
        class="mt-4"
      >
        <SearchTabs active-tab="general.message.full-text-of-judgments" />
      </v-col>
      <v-col
        cols="12"
        md="8"
        class="mt-6"
      >
        <ClientOnly :placeholder="t('general.loading')">
          <form @submit.prevent="submit">
            <v-text-field
              v-model="payload.term"
              name="inputfield"
              :label="t('general.message.search-label')"
              :error-messages="formErrors.term"
            />

            <v-radio-group
              v-model="payload.sort"
              inline
              :error="!!formErrors.sort"
            >
              <v-radio
                v-for="sort of sorts"
                :key="sort.id"
                class="mr-2 text-gray"
                color="primary"
                :label="sort.label"
                :value="sort.value"
                name="type"
                required
                :disabled="loading"
              />
            </v-radio-group>

            <section
              v-if="hasContent"
              class="col-12 col-md-12"
            >
              <ContentRenderer
                :value="page || {}"
                class="pt-8"
              />
            </section>

            <v-btn
              name="knop"
              type="submit"
              class="mr-4 mt-4 submit-button"
              :loading="loading"
              :aria-label="t('aria-label-submit')"
            >
              {{ t('general.submit') }}
            </v-btn>

            <v-btn
              v-if="hasResults"
              class="mr-4 mt-4"
              @click.prevent="print('list')"
            >
              <v-icon left>
                mdi-printer
              </v-icon>
              <p class="ml-2">
                {{ t('general.message.print-list') }}
              </p>
            </v-btn>
          </form>
        </ClientOnly>
        <div
          v-if="hasResults"
          ref="list"
          class="mt-6 print-area"
        >
          <FullTextSearchJudgmentCard
            v-for="result of formattedSearchResult"
            :key="result.id"
            :search-term="payload.term"
            :pdf-url="result.filePath"
            :date="result.formatedJudmentDate"
            :title="result.fileName"
            :score="result.score"
            :description="result.highlightHTML"
            :page-count="result.pageCount"
          />
        </div>
        <div
          v-if="(loaded && !hasResults) || searchError"
          class="mt-6"
        >
          <EmptyComponent />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import img from '@assets/img/banner-text.png'
import { ApiUrl, ContentKeys } from '../../core/constants'
import FullTextSearchJudgmentCard from '../../components/FullTextSearchJudgementCard.vue'

const loading = ref(false)
const loaded = ref(false)
const searchError = ref(null)
const searchResponse = ref(null)
const list = ref(null)
const formErrors = ref({
  term: '',
  sort: '',
})

const { locale } = useI18n()
const { t, langCollection } = useLanguage()

const contentPath = ref(`${ContentKeys.fullTextSearchExplanation}`)
const pad = computed(() => `/${locale.value}/${contentPath.value}`)

const { data: page, pending } = await useAsyncData(
  () => `stay-informed-${locale.value}`,
  () => queryCollection(langCollection[locale.value])
    .path(pad.value)
    .first(),
)

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

const payload = ref({
  sort: 'score',
  term: '',
})

const formattedSearchResult = computed(() => {
  if (!searchResponse.value) {
    return []
  }
  return searchResponse.value
})

const hasContent = computed(() =>
  Array.isArray(page.value?.body?.value) && page.value.body.value.length > 0,
)

const hasResults = computed(() =>
  formattedSearchResult.value && formattedSearchResult.value.length > 0,
)

function validateForm() {
  formErrors.value = {
    term: '',
    sort: '',
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
  loading.value = true
  loaded.value = false
  searchError.value = null
  searchResponse.value = null

  if (!validateForm()) {
    loading.value = false
    return
  }

  try {
    const { data } = await cFetch(`${ApiUrl.searchFullTextOfJudgments}?lang=${locale.value}&term=${payload.value.term}&sort=${payload.value.sort}`)

    if (!data.value) {
      throw new Error('No data received')
    }

    searchResponse.value = data.value
    loaded.value = true
  }
  catch (err) {
    searchError.value = err || new Error('fout in full-text-judgment')
  }
  finally {
    loading.value = false
  }
}

const print = () => {
  printContent('.print-area')
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
    t('menu.search.title') || t('general.message.consts-court'),
  ),
  meta: [
    {
      name: 'description',
      content: computed(() => t('menu.search.title') || ''),
    },
  ],
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
