<!-- API based page -->
<script setup lang="ts">
import { ApiUrl } from '@core/constants'

// todo: move to a shared location
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

// todo: error handling
const { data, pending } = useAsyncData<DataResponse>(
  'articles-const-referred-by-const-court',
  () => $fetch<DataResponse>(`${baseURL}${ApiUrl.arcticlesConstReferredByConstCourt}`, {
    params: {
      'lang': locale.value,
      'page': page.value,
      'per-page': perPage.value,
    },
  }), {
    watch: [page, perPage],
    default: () => ({
      total: 0,
      rows: [],
    }),
  },
)

const total = computed(() => data.value?.total ?? 0)
const nrOfPages = computed(() => Math.ceil(Number(total.value) / Number(perPage.value)))
const rows = computed(() => data.value?.rows ?? [])

const updatePage = (newPage: number) => {
  page.value = newPage
}

const handleJudgmentHover = async (j: Judgment) => {
  try {
    console.info(`Judgment Number: ${j.nr}, File Path: ${j.filePath}`)
    const { exists: existFile, status } = await $fetch('/api/check-file', {
      query: { url: `${basePublicUrl}${j.filePath}` },
    })
    console.info(status === 200 && existFile ? `File exists for judgment ${j.nr}` : `File does not exist for judgment ${j.nr}`)
  }
  catch (error: unknown) {
    console.error(`Error checking file for judgment ${j.nr}:`, error)
  }
}
</script>

<template>
  <v-container class="flex-column align-start flex-nowrap" fluid>
    <v-row justify="center" class="my-4">
      <v-col cols="12" md="10" lg="8">
        <div class="d-flex justify-center my-2">
          <PageNav :current-page="page" :nr-of-pages="nrOfPages" @update:page="updatePage" />
        </div>
        <div class="text-center text-caption my-1">
          <template v-if="!pending && data">
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
            <v-progress-circular indeterminate color="primary" />
          </template>
        </div>
      </v-col>
    </v-row>

    <v-row justify="center" class="my-4">
      <v-col cols="12" md="10" lg="8">
        <v-card>
          <v-card-title>
            {{ t('general.message.article-const-referred-const-court') }}
          </v-card-title>
          <v-divider />
          <v-card-text>
            <template v-if="!pending && data">
              <v-expansion-panels accordion>
                <v-expansion-panel v-for="row in rows" :key="row.art">
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
              <v-skeleton-loader type="table" height="500px" class="my-4" />
            </template>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
