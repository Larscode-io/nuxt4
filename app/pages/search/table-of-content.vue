<template>
  <v-container
    fluid
    class="fill-height pa-0 d-block"
  >
    <BannerImage
      :title="t('menu.search.title')"
      :description="t('menu.search.title-description')"
      :image="img"
      alt="Banner Image"
    />

    <v-row
      class="d-flex"
      justify="center"
    >
      <!-- Show error card if there was a search error -->
      <v-row
        v-if="searchError"
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

      <!-- Main content: Tabs, search form, and results -->
      <v-row
        v-else
        class="d-flex"
      >
        <v-col
          cols="12"
          md="4"
          class="mt-4"
        >
          <SearchTabs active-tab="general.message.table-of-content" />
        </v-col>

        <v-col
          cols="12"
          md="8"
          class="mt-6"
        >
          <client-only :placeholder="t('general.loading')">
            <form @submit.prevent="submit">
              <div class="d-flex">
                <v-text-field
                  v-model.lazy="formValues.judgmentDateStart"
                  v-date-format
                  hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-judgment-start')"
                  persistent-hint
                />
                <span class="px-2" />
                <v-text-field
                  v-model.lazy="formValues.judgmentDateEnd"
                  v-date-format
                  hint="DD/MM/YYYY"
                  :label="t('general.message.date-of-judgment-end')"
                  persistent-hint
                />
              </div>

              <v-text-field
                v-model="formValues.searchTerm"
                :label="t('general.message.search-label')"
              />

              <v-btn
                type="submit"
                class="mr-4 submit-button"
                :loading="loading"
                :aria-label="t('aria.label.submit')"
              >
                {{ t('general.submit') }}
              </v-btn>

              <v-btn
                v-if="hasResults"
                class="mr-4"
                :aria-label="t('aria.label.print')"
                @click.prevent="print('list')"
              >
                <v-icon left>
                  mdi-printer
                </v-icon>
                {{ t('general.message.print-list') }}
              </v-btn>
            </form>
          </client-only>

          <!-- Display search results -->
          <div
            v-if="hasResults"
            ref="list"
            class="mt-6 print-area"
          >
            <div
              v-for="(result, resultIndex) in formattedSearchResult"
              :key="resultIndex"
              class="table-container"
            >
              <ul>
                <li
                  v-for="(title, index) in result.paths"
                  :key="index"
                  :style="{ marginLeft: `${index * 0.5}em`, marginBottom: '8px' }"
                  :class="`li-l${index + 1}`"
                >
                  <span v-if="canDisplayPath(resultIndex, index)">
                    {{ title }}
                  </span>
                </li>
              </ul>
              <div class="judgment-links">
                <span>
                  {{ t('general.message.judgment-number', result.judgments?.length || 0) }}
                  {{ t('general.message.colon').trim() }}
                </span>
                <a
                  v-for="judgment in result.judgments"
                  :key="judgment.filePath"
                  :href="judgment.filePath"
                >
                  {{ judgment.label }}
                </a>
              </div>
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
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import img from '@assets/img/banner-text.png'
import BannerImage from '../../components/BannerImage.vue'
import ErrorCard from '../../components/ErrorCard.vue'
import EmptyComponent from '../../components/EmptyComponent.vue'
import { ApiUrl } from '../../core/constants'

const { t, locale } = useI18n()

const formValues = reactive({
  judgmentDateStart: '',
  judgmentDateEnd: '',
  searchTerm: '',
})

const loading = ref(false)
const loaded = ref(false)
const searchError = ref(null)
const searchResponse = ref(null)

const formattedSearchResult = computed(() => {
  return searchResponse.value?.value || []
},

)
const hasResults = computed(() => {
  return formattedSearchResult.value.length > 0
})

const list = ref(null)

function canDisplayPath(resultIndex: number, pathIndex: number): boolean {
  const results = formattedSearchResult.value
  const previousResult = results[resultIndex - 1]
  const currentResult = results[resultIndex]
  if (!previousResult) {
    return true
  }
  return (
    previousResult.paths[pathIndex] !== currentResult.paths[pathIndex]
    || previousResult.paths[pathIndex - 1] !== currentResult.paths[pathIndex - 1]
  )
}

async function submit() {
  loading.value = true
  loaded.value = false
  searchError.value = null
  searchResponse.value = null

  const payload = {
    searchTerm: formValues.searchTerm,
    judgmentDates: [
      formValues.judgmentDateStart ? formValues.judgmentDateStart.split('/').reverse().join('-') : '',
      formValues.judgmentDateEnd ? formValues.judgmentDateEnd.split('/').reverse().join('-') : '',
    ],
  }

  try {
    const { data } = await cPost(`${ApiUrl.searchForTableOfContent}?lang=${locale.value}`,
      payload,
    )

    console.log('data: ', data)

    loaded.value = true
    searchResponse.value = data
  }
  catch (err) {
    searchError.value = err
  }
  finally {
    loading.value = false
  }
}

const print = () => {
  printContent('.print-area')
}

useHead({
  title: t('menu.search.title') || t('general.message.constsCourt'),
  meta: [
    {
      name: 'description',
      content: t('menu.search.title') || '',
    },
  ],
})
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;

  @include mobile {
    padding: 32px;
  }
}

.d-flex {
  max-width: 1260px !important;
  margin: auto;
  width: 100%;

  @include mobile {
    width: 100%;
    margin-bottom: 40px;
  }
}

.nuxt-content {
  padding-top: 32px;
}

button {
  margin-top: 24px;
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

.table-container {
  padding: 16px 32px;
  box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;

  ul {
    padding: 8px 0;
  }

  .li-l1 {
    list-style-type: none;
    font-weight: 600;

    p {
      font-weight: 600;
    }
  }

  .li-l2 {
    list-style-type: none;
    color: $indigo;
  }

  .li-l3 {
    list-style-type: none;
    color: $successGreen;
  }

  .li-l4 {
    list-style-type: none;
    color: $warningOrange;
  }

  .li-l5 {
    list-style-type: none;
    color: $rajahYellow;
  }

  .li-l6 {
    list-style-type: none;
    color: $skyBlue;
    padding-left: 4px;
  }

  .li-l7 {
    list-style-type: none;
    color: $errorRed;
    padding-left: 4px;
  }

  .li-l8 {
    list-style-type: none;
    color: #18dcb5;
  }

  .li-l9 {
    color: #7d52e0;
    list-style-type: none;
  }

  .li-l10 {
    color: #e760aa;
    list-style-type: none;
  }

  .li-l11 {
    color: $logoColor;
    list-style-type: none;
  }

  .li-l12 {
    color: #01a6d6;
    list-style-type: none;
  }

  .li-l13 {
    color: #f3b86d;
    list-style-type: none;
  }

  .judgment-links {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;

    a {
      padding-left: 8px;
    }
  }
}
</style>
