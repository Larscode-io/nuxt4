// stay-informed.vue

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ContentKeys } from '@core/constants'
import img from 'assets/img/newsletter-background-opt.png'

// ⚠️ This may warn in dev due to useRoute() inside useI18n()
// It's safe as we only use it after route has resolved
const { locale } = useI18n()

const currentActiveContentInToc = ref<string>('')
const contentPath = ref(`${ContentKeys.informed}`)

const { data: page, pending } = await useAsyncData(
  `content-${locale.value}-${contentPath.value}`,
  async () => {
    try {
      const doc = await queryContent(`${locale.value}/${contentPath.value}`).findOne()
      return doc
    }
    catch (error) {
      console.error('Error fetching content:', error)
      return null
    }
  },
)

const sideBarLinks = computed(() => {
  if (!page.value) return []
  return extractSideBarLinks(page)
})

const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0)
const ids = computed(() => sideBarLinks.value.map(link => link.id))

const updateCurrentActiveContentInToc = (section: string) => {
  currentActiveContentInToc.value = section
}

let observer: IntersectionObserver | null = null
const handleIntersection = throttle((entries: IntersectionObserverEntry[]) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      updateCurrentActiveContentInToc(entry.target.id)
      break
    }
  }
}, 100)

const startIntersectionObserver = () => {
  // Disconnect old observer if it exists
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(handleIntersection, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  })

  const sections = document.querySelectorAll('h3')
  sections.forEach((el) => {
    if (ids.value.includes(el.id)) {
      observer!.observe(el)
    }
  })
}

// Handle locale changes and ensure proper hydration
watch([locale, contentPath], async () => {
  const doc = await queryContent(`${locale.value}/${contentPath.value}`).findOne()
  if (doc) {
    page.value = doc
    const idsTo = doc.body?.toc?.links?.map(toc => toc.id) || []
    const hash = window.location.hash.substring(1)
    currentActiveContentInToc.value = (hash && idsTo.includes(hash)) ? hash : idsTo[0] || ''
    startIntersectionObserver()
  }
})

// Initialize on mount
onMounted(() => {
  const hash = window.location.hash.substring(1)
  if (page.value) {
    const idsTo = page.value.body?.toc?.links?.map(toc => toc.id) || []
    currentActiveContentInToc.value = (hash && idsTo.includes(hash)) ? hash : idsTo[0] || ''
  }
  startIntersectionObserver()
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
            <ContentRendererMarkdown
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
