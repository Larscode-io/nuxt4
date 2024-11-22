<template>
  <div>
    <BannerImage
      :title="t('menu.rule.recommendations-to-the-judges-a-quo-and-the-parties')
      "
      :description="t('menu.rule.recommendations-to-the-judges-a-quo-and-the-parties-title-description', 2)"
      :image="img"
      :alt="t('alt.banner.judge')"
    />
    <v-container
      class="flex-column align-start flex-nowrap"
      fluid
    >
      <article v-if="page">
        <ContentRendererMarkdown
          :value="page.body"
          class="nuxt-content"
        />
      </article>
      <!-- <v-row v-if="$fetchState.pending" class="d-flex" align="flex-start" justify="center">
        <div class="col-12 col-md-12">
          <v-skeleton-loader class="mx-auto" max-width="300" type="article" />
        </div>
      </v-row>
      <v-row v-else-if="$fetchState.error" class="d-flex" align="flex-start" justify="center">
        <div class="col-12 col-md-12">
          <ErrorCard :message="$t($i18nKeys.error.fetchingData)" :show-go-home="false" />
        </div>
      </v-row>
      <v-row v-else class="d-flex" align="flex-start" justify="center">
        <div v-if="hasSidebarLinks" class="col-12 col-md-4">
          <Sidebar :active="currentActiveContentInToc" :toc="sideBarLinks" @click="updateCurrentActiveContentInToc" />
        </div>
        <div class="col-12 col-md-8">
          <section v-if="hasContent">
            <nuxt-content :document="page" class="section-content" />
          </section>
          <section v-else>
            <EmptyComponent />
          </section>
        </div>
      </v-row> -->
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Sidebar from '../../components/Sidebar.vue'
// import ErrorCard from '../../components/ErrorCard.vue'
// import EmptyComponent from '../../components/EmptyComponent.vue'
import img from '~/assets/img/newsletter-background-opt.png'
import BannerImage from '~/components/BannerImage.vue'
import { ContentKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useI18n()
const route = useRoute()
const hash = route.hash.substring(1)
const currentActiveContentInToc = ref<string>('')
const contentPath = ref(`${ContentKeys.ruleRecommendationsToTheJudgesAQuoAndTheParties}`)

const { data: page, pending, error } = await useLazyAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${contentPath.value}`)
      .findOne()
    const idsTo = doc.body?.toc?.links?.map(toc => toc.id) || []
    currentActiveContentInToc.value
      = hash && idsTo.includes(hash) ? hash : idsTo[0] || ''
    console.log('currentActiveContentInToc', currentActiveContentInToc.value)
    console.log('doc', doc)
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
})

// const fetchPage = async () => {
//   const content = useContent()
//   const fetchedPage = await content.fetch(
//     `${locale.value}/${ContentKeys.ruleRecommendationsToTheJudgesAQuoAndTheParties}`,
//   )

//   if (!fetchedPage) {
//     throw new Error('No Content')
//   }

//   page.value = fetchedPage
//   currentActiveContentInToc.value = getAnchor(fetchedPage)
// }

// const sideBarLinks = computed(() => {
//   if (!page.value) {
//     return []
//   }
//   return page.value.toc
//     .filter((toc: any) => toc.depth === 3)
//     .map((toc: any) => {
//       return {
//         ...toc,
//         text: toc.text?.split('.')[1]?.trim(),
//       }
//     })
// })

// const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0)
// const ids = computed(() => sideBarLinks.value.map((link: any) => link.id))
// const isFrench = computed(() => locale.value === Languages.FRENCH)
// const isDutch = computed(() => locale.value === Languages.DUTCH)
// const hasContent = computed(() => page.value?.body?.children?.length > 0)

// watch(route, () => {
//   if (page.value) {
//     currentActiveContentInToc.value = getAnchor(page.value)
//   }
// })

// const updateCurrentActiveContentInToc = (section: any) => {
//   currentActiveContentInToc.value = section
// }

// const getAnchor = (page: any) => {
//   const idsTo = page.toc?.map((toc: any) => toc.id)
//   const hash = route.hash?.substr(1)
//   return hash && idsTo.includes(hash) ? hash : idsTo[0]
// }

// const startIntersectionObserver = () => {
//   const options = {
//     threshold: 0.75,
//   }

//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.isIntersecting) {
//         const elem = entry.target as HTMLElement

//         if (entry.intersectionRatio >= 0.75) {
//           updateCurrentActiveContentInToc(elem.id)
//         }
//       }
//     })
//   }, options)

//   document.querySelectorAll('h3').forEach((el) => {
//     if (ids.value.includes(el.id)) {
//       observer.observe(el)
//     }
//   })
// }

// onMounted(() => {
//   fetchPage()
//   startIntersectionObserver()
// })

// useHead({
//   title: t(i18nKeys.value.menu.rule.recommendationsToTheJudgesAQuoAndTheParties),
//   meta: [
//     {
//       hid: 'description',
//       name: 'description',
//       content: t(i18nKeys.value.menu.rule.recommendationsToTheJudgesAQuoAndThePartiesTitleDescription) || '',
//     },
//   ],
// })
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
  margin-bottom: 80px;
  @include mobile {
    margin-bottom: 40px;
    width: 100%;
  }
}
::v-deep .nuxt-content {
  h2,
  h3 {
    padding-top: 32px;
    padding-bottom: 24px;
    font-size: 2rem;
    font-weight: 600;
    @include tablet-portrait {
      padding-top: 24px;
      padding-bottom: 16px;
      font-size: 1.5rem;
    }
  }
}
</style>
