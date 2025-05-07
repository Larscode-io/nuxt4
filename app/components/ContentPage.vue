<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'
import fallbackImg from '~/assets/img/newsletter-background-opt.png'

interface Props {
  contentPath: string
  img?: string
  enableToc?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  enableToc: true,
})

const showBanner = props.img ?? true
const enableToc = props.enableToc ?? true
const img = props.img || fallbackImg

let hash = ''
if (import.meta.client) {
  const route = useRoute()
  hash = route.hash.substring(1)
}

const { locale } = useLanguage()
const currentActiveContentInToc = ref<string>('')

const { data: page, pending } = await useAsyncData(
  `content-${locale.value}-${props.contentPath}`,
  async () => {
    return await queryContent(`${locale.value}/${props.contentPath}`).findOne()
  },
)

if (page.value) {
  const idsTo = page.value?.body?.toc?.links?.map(toc => toc.id) || []

  currentActiveContentInToc.value = (hash && idsTo.includes(hash))
    ? hash
    : idsTo[0] || ''
}

const sideBarLinks = computed(() => page.value ? extractSideBarLinks(page) : [])
const hasSidebarLinks = computed(() => enableToc && sideBarLinks.value.length > 0)
const ids = computed(() => sideBarLinks.value.map(link => link.id))

const updateCurrentActiveContentInToc = (section: string) => {
  currentActiveContentInToc.value = section
}

const startIntersectionObserver = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateCurrentActiveContentInToc(entry.target.id)
      }
    })
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  })

  const sections = document.querySelectorAll('h3')
  sections.forEach((el) => {
    if (ids.value.includes(el.id)) {
      observer.observe(el)
    }
  })
}

onMounted(() => {
  startIntersectionObserver()
})

onUpdated(() => {
  startIntersectionObserver()
})
</script>

<template>
  <div>
    <BannerImage
      v-if="showBanner && !pending && page"
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
