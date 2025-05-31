<!-- API based page -->
<script setup lang="ts">
import { ApiUrl } from '@core/constants'
import { ref, computed, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDebouncedRef } from '@/composables/useDebouncedRef'
import { useLanguage } from '@/composables/useLanguage'

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

// Huidige paginastatus
const page = ref(1)
const perPage = ref(50)

// Debouncing: de API-call wordt pas uitgevoerd na 300 ms stilte
const debouncedPage = useDebouncedRef(page, 300)
const debouncedPerPage = useDebouncedRef(perPage, 300)

// In-memory cache: per unieke key slaan we DataResponse op
// Key = `${locale.value}-articles-${debouncedPage.value}-${debouncedPerPage.value}`
const pagesCache = ref<Record<string, DataResponse>>({})

// Reactive holders voor de getoonde data en loading-state
const dataResponse = ref<DataResponse>({
  total: 0,
  rows: [],
})
const pending = ref(false)

// Computed key gebaseerd op locale, pagina, en perPage
const cacheKey = computed(() => {
  return `${locale.value}-articles-${debouncedPage.value}-${debouncedPerPage.value}`
})

// Zodra cacheKey verandert, voert deze watcher uit:
// 1) Als er al data in pagesCache zit, gebruik die direct.
// 2) Anders: haal van de API, bewaar in pagesCache, en update dataResponse.
watchEffect(async () => {
  const key = cacheKey.value

  // 1) Check op cache-hit
  if (pagesCache.value[key]) {
    dataResponse.value = pagesCache.value[key]!
    return
  }

  // 2) Cache-miss: haal nieuwe data op
  pending.value = true
  try {
    const fetched = await $fetch<DataResponse>(
      `${baseURL}${ApiUrl.arcticlesConstReferredByConstCourt}`, {
        params: {
          'lang': locale.value,
          'page': debouncedPage.value,
          'per-page': debouncedPerPage.value,
        },
      },
    )
    // Bewaar in cache en update de reactive data holder
    pagesCache.value[key] = fetched
    dataResponse.value = fetched
  }
  catch (error) {
    console.error('Fout bij API-call:', error)
  }
  finally {
    pending.value = false
  }
})

// Computed properties voor template gebruik
const total = computed(() => dataResponse.value?.total ?? 0)
const nrOfPages = computed(() => Math.ceil(Number(total.value) / Number(perPage.value)))
const rows = computed(() => dataResponse.value?.rows ?? [])

// Functie om pagina te updaten (gebruikt door de “>” en “<” buttons)
const updatePage = (newPage: number) => {
  page.value = newPage
}

// Hover-handler voor judgments: controleert of het bestand bestaat
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
        <div class="text-center text-caption my-1">
          <!-- Toon record‐info als er data is én niet loading -->
          <template v-if="!pending && rows.length">
            <div class="text-caption mt-1">
              <span>
                {{ t('Showing') }}
                <b>{{ ((page - 1) * perPage + 1) }}</b>
                {{ t('to') }}
                <b>{{ Math.min(page * perPage, total) }}</b>
                {{ t('of') }}
                <b>{{ total }}</b>
                {{ t('records') }}
              </span>
            </div>
          </template>
          <!-- Toon loader als loading -->
          <template v-if="pending">
            <div class="d-flex justify-center my-4">
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
                width="5"
              />
            </div>
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
            <!-- Indien niet loading én er zijn rows, toon de panels -->
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
            <!-- Anders, als geen data of tijdens loading, toon skeleton -->
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
