<!-- API based page -->
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// import ErrorCard from '~/components/ErrorCard.vue'
import { ApiUrl, RoutePathKeys } from '@core/constants'
import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/newsletter-background-opt.png'

const { locale } = useI18n()
const { t } = useLanguage()

// const config = useRuntimeConfig()
// const baseURL = config.public.apiBaseUrl
// const url = `${ApiUrl.pressGeneralRelease}?lang=${locale.value}`

const rul = `https://node04.const-court.be/api/v1/juris/articles-const-referred-by-const-court?lang=${locale.value}`
const { data, error, pending } = await useFetch(rul)

// const page = ref(Number(route.query.page) || 1)
// const perPage = ref(Number(route.query['per-page']) || 50)
// const total = ref(1)
// const articles = ref<any[]>([])

// const validateQuery = () => {
//   const queryPage = Number(route.query.page)
//   const queryPerPage = Number(route.query['per-page'])
//   if (
//     !queryPage
//     || !queryPerPage
//     || queryPerPage > 100
//     || isNaN(queryPage)
//     || isNaN(queryPerPage)
//   ) {
//     router.replace(
//       `${localePath(RoutePathKeys.courtBasicTextTableOfTheArticlesOfTheConstitutionReferredToByTheConstitutionalCourt)}?page=1&per-page=50`,
//     )
//     return false
//   }
//   return true
// }

// if (!validateQuery()) {
//   // Early return if query is invalid, router.replace will redirect
//   // No further code needed here
// }

// const { pending, error, data, refresh } = await useAsyncData('articles', async () => {
//   const lang = locale.value
//   const pageNum = Number(route.query.page) || 1
//   const perPageNum = Number(route.query['per-page']) || 50
//   const response = await $fetch(`${ApiUrl.arcticlesConstReferredByConstCourt}?lang=${lang}&page=${pageNum}&per-page=${perPageNum}`)
//   return response
// }, { watch: [() => route.query.page, () => route.query['per-page'], () => locale.value] })

// watch(data, (val) => {
//   if (val) {
//     articles.value = val.rows
//     total.value = val.total
//   }
// })

// watch(
//   () => [route.query.page, route.query['per-page']],
//   ([newPage, newPerPage]) => {
//     page.value = Number(newPage) || 1
//     perPage.value = Number(newPerPage) || 50
//     refresh()
//   },
// )

// const paginationLength = computed(() => Math.ceil((total.value || 1) / perPage.value))

// function updatePageQuery(newPage: number) {
//   router.push({
//     path: localePath(RoutePathKeys.courtBasicTextTableOfTheArticlesOfTheConstitutionReferredToByTheConstitutionalCourt),
//     query: { 'per-page': perPage.value, 'page': newPage },
//   })
// }

// useHead(() => {
//   const title
//     = t('general.message.articleConstReferredConstCourt')
//   const description
//     = t('general.message.articleConstReferredConstCourt') || ''
//   return {
//     title,
//     htmlAttrs: { title },
//     meta: [
//       {
//         hid: 'description',
//         name: 'description',
//         content: description,
//       },
//     ],
//   }
// })
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
    <pre>{{ JSON.stringify(data, null, 2) }}</pre>
    <!-- <v-row
      v-if="$fetchState.pending"
      class="d-flex"
      align="flex-start"
      justify="center"
    >
      <div class="col-12 col-md-12">
        <v-skeleton-loader
          class="mx-auto"
          max-width="1000"
          type="article"
        />
      </div>
    </v-row> -->
    <!-- <v-row
      v-else-if="$fetchState.error"
      class="d-flex"
      align="flex-start"
      justify="center"
    >
      <div class="col-12 col-md-12">
        <ErrorCard
          :message="$t($i18nKeys.error.fetchingData)"
          :show-go-home="false"
        />
      </div>
    </v-row> -->
    <!-- <v-row
      v-else
      class="d-flex"
      align="flex-start"
      justify="center"
    >
      <div
        ref="list"
        class="col-12 col-md-12"
      >
        <v-pagination
          v-if="paginationLength > 1"
          :value="page"
          :length="paginationLength"
          :total-visible="6"
          class="mb-2"
          @input="updatePageQuery"
        />
        <v-expansion-panels multiple>
          <v-expansion-panel
            v-for="item in articles"
            :key="item.art"
          >
            <v-expansion-panel-header>
              <strong>{{ item.art }}</strong>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
                {{
                  $tc(
                    $i18nKeys.general.message.judgmentNumber,
                    item.judgments.length,
                  )
                }}
                {{ $t($i18nKeys.general.message.colon) }}
              </p>
              <a
                v-for="judgment of item.judgments"
                :key="judgment.filePath"
                :href="judgment.filePath"
                class="mx-2"
              >{{ judgment.nr }}</a>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </div>
    </v-row> -->
  </v-container>
</template>

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
  margin-bottom: 80px;
  @include mobile {
    margin-bottom: 40px;
    width: 100%;
  }
}
</style>
