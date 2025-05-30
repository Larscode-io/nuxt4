<!-- API based page -->
<script setup lang="ts">
import { ApiUrl } from '@core/constants'
import img from '~/assets/img/newsletter-background-opt.png'

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

const page = ref(1) // Current page number
const perPage = ref(50) // Number of items per page

const { data, pending, error } = useAsyncData<DataResponse>(
  `articles-const-referred-by-const-court`,
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
  console.log('updatePage in Parent', newPage)
  page.value = newPage
}

// Function to check if a file exists via HTTP HEAD request
const checkFileExists = async (url: string, nr: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    if (response.ok) {
      console.info(`File exists for judgment ${nr}: ${url}`)
    }
    else {
      console.info(`File does NOT exist for judgment ${nr}: ${url}`)
    }
  }
  catch (e) {
    console.info(`File does NOT exist for judgment ${nr}: ${url}`)
  }
}

const logJudgment = (j: Judgment) => {
  console.log('Hovered judgment:', j)
  const existFile = checkFileExists(`${basePublicUrl}${j.filePath}`, j.nr)
  existFile.then(() => {
    console.log(`Checked existence of file for judgment ${j.nr}`)
  }).catch((error) => {
    console.error(`Error checking file for judgment ${j.nr}:`, error)
  })
}
</script>

<template>
  <v-container
    class="flex-column align-start flex-nowrap"
    fluid
  >
    <BannerImage
      :title="t('general.message.article-const-referred-const-court')"
      :description="t('general.message.article-const-referred-const-court')"
      :image="img"
      alt="picture of the court"
    />
    <v-row
      justify="center"
      class="my-4"
    >
      <v-col
        cols="12"
        md="10"
        lg="8"
      >
        <v-alert
          type="info"
          variant="tonal"
          border="start"
          color="primary"
        >
          <PageNav
            :current-page="page"
            :nr-of-pages="nrOfPages"
            @update:page="updatePage"
          />
        </v-alert>
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
          <!-- <v-card-subtitle> -->
          <!-- {{ t('general.message.article-const-referred-const-court') }} -->
          <!-- </v-card-subtitle> -->
          <v-divider />
          <v-card-text>
            <template v-if="!pending && data">
              <!-- <div class="mb-2">
                <v-alert
                  type="info"
                  variant="tonal"
                  border="start"
                  color="primary"
                  class="mb-4"
                >
                  {{ t('general.message.page-info', { page: page, totalPages: nrOfPages }) }}
                </v-alert>
              </div> -->
              <v-expansion-panels accordion>
                <v-expansion-panel
                  v-for="row in rows"
                  :key="row.art"
                >
                  <v-expansion-panel-title>
                    {{ row.art }}
                    <small class="text-caption">({{ row.judgments.length }} judgments)</small>
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
                        @mouseenter="logJudgment(j)"
                      >
                        {{ j.nr }}
                      </v-chip>
                    </v-chip-group>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <!-- <div class="text-caption text-end mt-2"> -->
              <!-- {{ t('general.message.page-of', { page: page, totalPages: nrOfPages }) }} -->
              <!-- </div> -->
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
