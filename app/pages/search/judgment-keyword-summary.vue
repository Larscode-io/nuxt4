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
      class="d-flex"
      justify="center"
    >
      <div class="col-12 col-md-12">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="article"
        />
      </div>
    </v-row>
    <v-row
      v-else-if="error"
      class="d-flex"
      justify="center"
    >
      <div class="col-12 col-md-12">
        <ErrorCard
          :message="t('error.fetchingData')"
          :show-go-home="false"
        />
      </div>
    </v-row>
    <v-row
      class="d-flex"
      justify="center"
    >
      <v-col
        cols="12"
        md="4"
        class="mt-4"
      >
        <SearchTabs active-tab="general.message.judgment-keywords-summary" />
      </v-col>
      <div class="v-col-md-8 v-col-12 mt-6">
        <ClientOnly>
          <template #fallback>
            {{ t('general.loading') }}
          </template>
          <form @submit.prevent="submit">
            <div class="d-flex">
              <v-text-field
                v-model="payload.judgmentDates[0]"
                v-date-format
                :label="t('general.message.date-of-judgment-start')"
                :error-messages="judgmentDateErrors"
                hint="DD/MM/YYYY"
                persistent-hint
              />
              <div class="px-2" />
              <v-text-field
                v-model="payload.judgmentDates[1]"
                v-date-format
                :label="t('general.message.date-of-judgment-end')"
                hint="DD/MM/YYYY"
                persistent-hint
              />
            </div>

            <v-text-field
              v-model="payload.keywords"
              :label="t('general.message.keywords', 2)"
              :error-messages="keywordsErrors"
            />

            <v-text-field
              v-model="payload.summary"
              :label="t('general.message.summary', 2)"
              :error-messages="summaryErrors"
            />

            <v-checkbox
              v-model="payload.lookForEntirePhrase"
              :label="t('general.message.look-for-entire-sentence')"
              :error-messages="lookForEntirePhraseErrors"
            />

            <v-btn
              type="submit"
              class="mr-4 submit-button"
              :loading="loading"
              :aria-label="t('aria.label.submit')"
              color="indigo"
              variant="flat"
            >
              {{ t('general.submit') }}
            </v-btn>
            <v-btn
              v-if="hasResults"
              class="mr-4"
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
          class="mt-6 print-area"
        >
          <v-expansion-panels
            ref="list"
            :model-value="openedPanels"
            multiple
          >
            <v-expansion-panel
              v-for="result in formattedSearchResult"
              :key="result"
            >
              <v-expansion-panel-title>
                <v-row no-gutters>
                  <v-col cols="6">
                    {{ t('general.message.judgment-number') }} :
                    <a
                      class="link"
                      :href="result.filePath"
                    >{{ getId(result.fileName) }}</a>
                  </v-col>
                  <v-col cols="6">
                    {{ t('general.message.date-of-judgment') }} :
                    {{ result.formatedJudmentDate }}
                  </v-col>
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div
                  v-for="data of result.summaries"
                  :key="data.summary"
                  class="my-2 p"
                >
                  <ul class="my-2">
                    <li
                      v-for="key of data.keywords"
                      :key="key"
                    >
                      {{ key }}
                    </li>
                  </ul>
                  <p class="my-2">
                    <i>{{ data.summary }}</i>
                  </p>
                  <v-divider class="my-2" />
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <div
          v-if="(loaded && !hasResults) || searchError"
          class="mt-6"
        >
          <EmptyComponent />
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ApiUrl } from '../../core/constants'
import { to } from '../../core/utilities'
import img from '@/assets/img/banner-text.png'

const judgmentDateErrors = ref<string[]>([])
const keywordsErrors = ref<string[]>([])
const summaryErrors = ref<string[]>([])
const lookForEntirePhraseErrors = ref<string[]>([])

const { t, locale } = useI18n()

const pending = ref(false)
const error = ref(null)
const loading = ref(false)
const loaded = ref(false)
const searchError = ref(null)
const searchResponse = ref(null)

const payload = ref({
  judgmentDates: ['', ''],
  keywords: '',
  summary: '',
  lookForEntirePhrase: false,
})

const isFormInvalid = computed(() => {
  return (
    !payload.value?.keywords
    && !payload.value?.summary
    && (!payload.value?.judgmentDates
      || payload.value?.judgmentDates?.length === 0
      || !payload.value?.judgmentDates[0])
  )
})

const formattedSearchResult = computed(() => {
  return searchResponse.value?.data || []
})

const hasResults = computed(() => {
  return formattedSearchResult.value && formattedSearchResult.value.length > 0
})

const openedPanels = computed(() => {
  return formattedSearchResult.value.map((_, i) => i)
})

watch(() => payload.value, () => {
  searchResponse.value = null
  searchError.value = null
}, { deep: true })

// Methods
function _toNameKey(val = '') {
  return val?.toLowerCase()
}

function getId(val = '') {
  const split = val?.split('-')
  const year = split?.[0]?.trim()
  const id = split?.[1]?.trim()
  return `${id ? `${id}/` : ''} ${year || ''}`
}

async function submit() {
  const valid = true

  judgmentDateErrors.value = []
  keywordsErrors.value = []
  summaryErrors.value = []
  lookForEntirePhraseErrors.value = []

  if (!valid || isFormInvalid.value) {
    return
  }

  loading.value = true
  loaded.value = false
  searchError.value = null
  searchResponse.value = null

  const [error, response] = await to(
    cPost(
      `${ApiUrl.searchByJudgmentKeywordsSummary}?lang=${locale.value}`,
      {
        ...payload.value,
        judgmentDates: payload.value.judgmentDates?.map(date =>
          date?.split('/')?.reverse()?.join('-'),
        ),
      },
    ),
  )

  loading.value = false

  if (error || !response) {
    searchError.value = error || new Error('Error in judgment-keyword-summary')
    return
  }

  loaded.value = true
  searchResponse.value = response
}

const print = () => {
  printContent('.print-area')
}

// Define the meta for the page
useHead({
  title: computed(() => t('menu.search.title') || t('general.message.const-court')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('menu.search.title') || ''),
    },
  ],
})
</script>

<style scoped>
.container {
  padding: 0 !important;
}

@media (max-width: 600px) {
  .container {
    padding: 32px !important;
  }
}

.d-flex {
  max-width: 1260px !important;
  margin: auto;
}

@media (max-width: 600px) {
  .d-flex {
    width: 100%;
  }
}

.nuxt-content {
  padding-top: 32px;
}

.submit-button {
  color: white;
}

.v-input {
  margin: 32px 0 !important;
}

.d-flex .v-input__slot {
  box-shadow: none !important;
}

/* Nieuwe stijlen voor de rotatieanimatie */
.rotate-icon {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

/* Zorg ervoor dat de link duidelijk klikbaar lijkt */
.link {
  position: relative;
  z-index: 1;
  text-decoration: underline;
  color: #1976d2;
}

.link:hover {
  color: #0d47a1;
}
</style>
