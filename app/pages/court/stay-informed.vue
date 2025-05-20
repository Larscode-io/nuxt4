<script setup lang="ts">
import { ref, computed } from 'vue'
import { ContentKeys } from '@core/constants'
import img from 'assets/img/newsletter-background-opt.png'

const { currentActiveContentInToc, updateCurrentActiveContentInToc } = useActiveSectionObserver('h3', 0.75)

// ⚠️ This may warn in dev due to useRoute() inside useI18n()
// It's safe as we only use it after route has resolved
const { locale } = useI18n()
const { langCollection } = useLanguage()

const contentPath = ref(`${ContentKeys.informed}`)
const pad = computed(() => `/${locale.value}/${contentPath.value}`)

const { data: page, pending } = await useAsyncData(
  () => `stay-informed-${locale.value}`,
  () => queryCollection(langCollection[locale.value])
    .path(pad.value)
    .first(),
)
const { hasContent, sideBarLinks, hasSidebarLinks, extractSideBarLinks } = useSidebarLinks(page)

onMounted(() => {
  const sidebarLinks = extractSideBarLinks({ value: page.value })
  // jump to the first link in the sidebar
  if (sidebarLinks.length > 0 && sidebarLinks[0]?.id) {
    updateCurrentActiveContentInToc(sidebarLinks[0]?.id)
  }
})
</script>

<template>
  <div>
    <BannerImage
      v-if="!pending && page"
      :title="page?.title || ''"
      :description="page?.description"
      :image="img"
      alt=""
    />
    <v-container class="flex-column align-start flex-nowrap">
      <v-row>
        <v-col
          v-if="hasSidebarLinks"
          cols="12"
          md="4"
        >
          <Sidebar
            :active="currentActiveContentInToc"
            :toc="sideBarLinks"
            @click="updateCurrentActiveContentInToc"
          />
        </v-col>
        <v-col
          cols="12"
          :md="hasSidebarLinks ? 8 : 12"
        >
          <article v-if="page">
            <ContentRenderer
              :value="page.body || {}"
              class="nuxt-content content-renderer"
            />
          </article>
        </v-col>
      </v-row>
    </v-container>
  </div>
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

::v-deep(.nuxt-content h3) {
  padding-top: 32px;
  padding-bottom: 24px;
  font-size: 2rem;
  font-weight: 600;

  @media (max-width: 960px) {
    padding-top: 24px;
    padding-bottom: 16px;
    font-size: 1.5rem;
  }
}

::v-deep(.nuxt-content h3 a) {
  text-decoration: none;
}

::v-deep(.nuxt-content p) {
  padding: 10px;
}

.space {
  height: 60vh;
}
</style>
