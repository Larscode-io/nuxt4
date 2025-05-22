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
        <SearchTabs active-tab="general.message.standard" />
      </v-col>
      <v-col
        cols="12"
        md="8"
        class="mt-6"
      >
        <ClientOnly :placeholder="t('general.loading')">
          <form @submit.prevent="submit">
            <!-- Radio group for search type -->
            <v-radio-group
              v-model="payload.type"
              inline
              color="primary"
              :error="!!errors.type"
              :error-messages="errors.type || []"
            >
              <v-radio
                v-for="type in types"
                :key="type.id"
                class="mr-2 text-gray"
                color="primary"
                :label="type.label"
                :value="type.id"
                name="type"
                required
                :disabled="loading"
              />
            </v-radio-group>

            <v-text-field
              v-model="payload.searchTerm"
              name="searchfield"
              :label="t('general.message.search-label')"
              :error-messages="errors.searchTerm || []"
            />

            <v-text-field
              v-model.lazy="payload.standardDate"
              v-date-format
              hint="DD/MM/YYYY"
              :label="t('general.message.standard-date')"
              persistent-hint
              :error-messages="errors.standardDate || []"
            />

            <v-text-field
              v-model="payload.clauseNumber"
              :label="t('general.message.article-number')"
              :error-messages="errors.clauseNumber || []"
            />

            <v-checkbox
              v-model="payload.searchByExactClauseNumber"
              :label="t('general.message.search-by-exact-clause-number')"
              :error-messages="errors.searchByExactClauseNumber || []"
            />

            <section
              v-if="hasContent"
              class="col-12 col-md-12"
            >
              <ContentRenderer
                :value="page"
                class="pt-8"
              />
            </section>

            <v-btn
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
          <div
            v-for="(result, key) in Object.values(formattedSearchResults)"
            :key="key"
            class="mb-8 table-standard-container"
          >
            <h3
              v-if="result && result[0] && result[0].standard"
              class="subtitle"
            >
              {{ result[0].formatedStandardDate }} - {{ result[0].standard }}
            </h3>
            <v-table density="compact">
              <thead>
                <tr>
                  <th
                    style="font-size: 12px; color: #666"
                    class=" text-left"
                  >
                    {{ t("general.message.article") }}
                  </th>
                  <th
                    style="font-size: 12px; color: #666"
                    class="text-left"
                  >
                    {{ t("general.message.judgment") }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="data in result"
                  :key="data.clauseNumber"
                >
                  <td>{{ data.clauseNumber }}</td>
                  <td>
                    <ul class="no-padding">
                      <li
                        v-for="judgment in data.judgments"
                        :key="judgment.filePath"
                        class="no-bullets"
                      >
                        <a :href="judgment.filePath">{{ judgment.label }}</a>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>
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
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import img from '@assets/img/banner-text.png'
import { ApiUrl, ContentKeys } from '../../core/constants'
import { groupBy } from '../../core/utilities'

// Data refs
const loading = ref(false)
const loaded = ref(false)
const searchError = ref(null)
const searchResults = ref(null)
const list = ref(null)

// Define payload with default radio selection
const payload = reactive({
  type: 'general.message.controlled',
  searchTerm: '',
  standardDate: '',
  clauseNumber: '',
  searchByExactClauseNumber: false,
})

// Define errors
const errors = reactive({
  type: undefined,
  searchTerm: undefined,
  standardDate: undefined,
  clauseNumber: undefined,
  searchByExactClauseNumber: undefined,
})

const { locale } = useI18n()
const { t, langCollection } = useLanguage()

const contentPath = ref(`${ContentKeys.standardSearchExplanation}`)
const pad = computed(() => `/${locale.value}/${contentPath.value}`)

const { data: page, pending } = await useAsyncData(
  () => `stay-informed-${locale.value}`,
  () => queryCollection(langCollection[locale.value])
    .path(pad.value)
    .first(),
)

const types = computed(() => [
  {
    id: 'general.message.controlled',
    label: t('general.message.controlled', 2),
  },
  {
    id: 'general.message.reference',
    label: t('general.message.reference', 2),
  },
])

const hasContent = computed(() =>
  page.value?.body?.children?.length > 0,
)

const formattedSearchResults = computed(() => {
  if (!searchResults.value) {
    return {}
  }

  return groupBy(searchResults.value, 'groupById')
})

const hasResults = computed(() =>
  formattedSearchResults.value && Object.keys(formattedSearchResults.value).length > 0,
)

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = undefined
  })

  const isValid = true

  return isValid
}

async function submit() {
  if (!validateForm()) {
    return
  }

  loading.value = true
  loaded.value = false
  searchError.value = null
  searchResults.value = null

  const { type, ...payloadData } = payload

  // Format the date from DD/MM/YYYY to YYYY-MM-DD for API
  const formattedPayload = {
    ...payloadData,
    standardDate: payload.standardDate
      ? payload.standardDate.split('/').reverse().join('-')
      : undefined,
  }

  try {
    // Determine which API endpoint to use based on the selected type
    const apiUrl = type === 'general.message.controlled'
      ? ApiUrl.searchByControlledStandard
      : ApiUrl.searchByReferenceStandard

    const { data } = await cPost(`${apiUrl}?lang=${locale.value}`,
      formattedPayload,
    )

    if (!data.value) {
      throw new Error('No data received')
    }

    searchResults.value = data.value
    // console.log('searchResults.value: ', searchResults.value)
    // console.log('formattedSearchResults: ', formattedSearchResults.value)
    loaded.value = true
  }
  catch (err) {
    searchError.value = err || new Error('Error in standard search page')
    console.error('Search error:', err)
  }
  finally {
    loading.value = false
  }
}

const print = () => {
  printContent('.print-area')
}

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

.table-standard-container {
  padding: 16px 32px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);
}

a {
  color: #1976d2;
}
</style>
