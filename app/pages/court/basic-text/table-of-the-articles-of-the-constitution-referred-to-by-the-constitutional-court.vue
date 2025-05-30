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

const page = ref(1) // Current page number
const perPage = ref(50) // Number of items per page

const { data } = useAsyncData<DataResponse>(
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
    <div class="d-flex justify-center my-4">
      <v-icon
        size="64"
        color="primary"
      >
        mdi-office-building-cog
      </v-icon>
      Deze pagina is in ontwikkeling
    </div>
    <PageNav
      :current-page="page"
      :nr-of-pages
      @update:page="updatePage"
    />
    <template v-if="data">
      <p>
        `We are on page {{ page }} of {{ nrOfPages }}`
      </p>
      <pre>{{ JSON.stringify(rows, null, 2) }}</pre>
    </template>
    <template v-else>
      <v-skeleton-loader
        type="article"
        height="120px"
      />
    </template>
  </v-container>
</template>

<style lang="scss" scoped>
</style>
