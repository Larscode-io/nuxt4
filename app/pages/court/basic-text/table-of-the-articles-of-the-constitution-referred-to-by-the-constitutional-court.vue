<!-- API based page -->
<script setup lang="ts">
import { ApiUrl } from '@core/constants'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebouncedRef } from '@/composables/useDebouncedRef'

definePageMeta({
  ssr: false,
})

interface Judgment {
  nr: string
  filePath: string
}

interface ArticleRow {
  art: string
  judgments: Judgment[]
}

interface DataResponse {
  total: number
  rows: ArticleRow[]
}

const { locale } = useI18n()
const { t } = useLanguage()

const config = useRuntimeConfig()
const baseURL = config.public.apiBaseUrl
const basePublicUrl = config.public.basePublicUrl

const page = ref(1)
const perPage = ref(50)

// Debouncing: de API-call wordt pas uitgevoerd na 300 ms stilte
// zodat iemand die snel klikt niet onnodig veel API-calls triggert.
const debouncedPage = useDebouncedRef(page, 300)
const debouncedPerPage = useDebouncedRef(perPage, 300)

// In-memory cache: per unieke key slaan we DataResponse op
const pagesCache = ref<Record<string, DataResponse>>({})
const cacheHit = ref(false)

const dataResponse = ref<DataResponse>({
  total: 0,
  rows: [],
})
const pending = ref(false)

const cacheKey = computed(() => {
  return `${locale.value}-articles-${debouncedPage.value}-${debouncedPerPage.value}`
})

watch(
  [cacheKey, locale, debouncedPage, debouncedPerPage],
  async ([key, lang, page, perPage]) => {
    // 1) Check op cache-hit
    if (pagesCache.value[key]) {
      dataResponse.value = pagesCache.value[key]!
      cacheHit.value = true
      setTimeout(() => {
        cacheHit.value = false
      }, 500)
      return
    }

    // 2) Cache-miss: haal nieuwe data op
    pending.value = true
    try {
      const fetched = await $fetch<DataResponse>(
        `${baseURL}${ApiUrl.arcticlesConstReferredByConstCourt}`, {
          params: {
            'lang': lang,
            'page': page,
            'per-page': perPage,
          },
        },
      )
      pagesCache.value[key] = fetched
      dataResponse.value = fetched
    }
    catch (error) {
      console.error('Fout bij API-call:', error)
    }
    finally {
      pending.value = false
    }
  },
  { immediate: true },
)

const total = computed(() => dataResponse.value?.total ?? 0)
const nrOfPages = computed(() => Math.ceil(Number(total.value) / Number(perPage.value)))
const rows = computed(() => dataResponse.value?.rows ?? [])

const updatePage = (newPage: number) => {
  page.value = newPage
}

const handleJudgmentHover = async (j: Judgment) => {
  try {
    const existFile = await checkFileExists(`${basePublicUrl}${j.filePath}`)
    console.log(
      existFile
        ? `File exists for judgment ${j.nr}`
        : `File does not exist for judgment ${j.nr}`,
    )
  }
  catch (error: unknown) {
    console.error(`Error checking file for judgment ${j.nr}:`, error)
  }
}
</script>

<template>
  <v-container
    class="flex-column align-start flex-nowrap"
    fluid
  >
    <v-row
      justify="center"
      class="my-4"
    >
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <div class="d-flex justify-center my-2">
          <PageNav
            :current-page="page"
            :nr-of-pages="nrOfPages"
            @update:page="updatePage"
          />
        </div>
        <ClientOnly>
          <v-snackbar
            v-model="pending"
            color="info"
            timeout="-1"
            location="top"
          >
            <v-icon start>
              mdi-progress-clock
            </v-icon>
            Loading data from server...
          </v-snackbar>
        </ClientOnly>
        <div class="text-center text-caption my-1">
          <template v-if="!pending && rows.length">
            <div class="text-caption mt-1">
              <span>
                {{ t('general.message.table.showing') }}
                <b>{{ ((page - 1) * perPage + 1) }}</b>
                {{ t('general.message.table.to') }}
                <b>{{ Math.min(page * perPage, total) }}</b>
                {{ t('general.message.table.of') }}
                <b>{{ total }}</b>
                {{ t('general.message.table.records') }}
              </span>
            </div>
          </template>
          <template v-else>
            <div style="height: 20px" />
          </template>
        </div>
      </v-col>
    </v-row>

    <v-row
      justify="center"
      class="my-4"
    >
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <v-card>
          <v-card-title>
            {{ t('general.message.article-const-referred-const-court') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <template v-if="!pending && rows.length">
              <v-expansion-panels accordion>
                <v-expansion-panel
                  v-for="row in rows"
                  :key="row.art"
                >
                  <v-expansion-panel-title>
                    {{ row.art }}
                    <small class="text-caption">&nbsp;({{ row.judgments.length }} judgments)</small>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-chip-group column>
                      <v-chip
                        v-for="j in row.judgments"
                        :key="j.nr"
                        color="primary"
                        variant="outlined"
                        class="ma-1"
                        :href="`${basePublicUrl}${j.filePath}`"
                        target="_blank"
                        @mouseenter="handleJudgmentHover(j)"
                      >
                        {{ j.nr }}
                      </v-chip>
                    </v-chip-group>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <template v-else>
              <v-skeleton-loader
                type="table"
                height="500px"
                class="my-4"
              />
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
