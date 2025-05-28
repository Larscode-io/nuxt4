<script setup lang="ts">
import { onMounted } from 'vue'
import fallbackImg from '@assets/img/newsletter-background-opt.png'

const { t, locale, langCollection } = useLanguage()
const currentLocale = locale.value

interface Props {
  contentPath: string
  img?: string
  hideImage?: boolean
  enableToc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hideImage: false,
  enableToc: true,
})

const img = props.img ?? fallbackImg
const { currentActiveContentInToc, updateCurrentActiveContentInToc } = useActiveSectionObserver('h3', 0.75)

const { data: page, pending } = useAsyncData(
  `content-${currentLocale}-${props.contentPath}`,
  () => queryCollection(langCollection[currentLocale]).path(`/${currentLocale}/${props.contentPath}`).first(),
)

const { hasContent, sideBarLinks, hasSidebarLinks, extractSideBarLinks } = useSidebarLinks(page)

onMounted(() => {
  // todo: check if this can be moved to the useSidebarLinks composable
  try {
    if (!page.value) return
    const sidebarLinks = extractSideBarLinks({ value: page.value })
    if (sidebarLinks.length > 0 && sidebarLinks[0]?.id) {
      updateCurrentActiveContentInToc(sidebarLinks[0]?.id)
    }
  }
  catch (e) {
    console.error('Error in onMounted:', e)
  }
})
</script>

<template>
  <div>
    <BannerImage
      v-if="!hideImage && !pending && page"
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
          <SideBar
            :active="currentActiveContentInToc"
            :toc="sideBarLinks"
            @click="updateCurrentActiveContentInToc"
          />
        </v-col>
        <v-col
          v-if="hasContent"
          cols="12"
          :md="hasSidebarLinks ? 8 : 12"
        >
          <article>
            <ContentRenderer
              :value="page || {}"
            />
          </article>
        </v-col>
        <v-col v-else>
          <EmptyComponent
            :message="t('empty.no-content')"
            :show-icon="false"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="1"
          md="2"
        />
        <v-col
          cols="10"
          md="8"
        >
          <slot name="extra-content" />
        </v-col>
        <v-col
          cols="1"
          md="2"
        />
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
    margin-bottom: 40px;

    @include mobile {
        margin-bottom: 24px;
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
</style>
