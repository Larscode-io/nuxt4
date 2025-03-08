<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'
import img from '~/assets/img/newsletter-background-opt.png'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps<{ contentPath: string }>()

const route = useRoute()
const hash = route.hash.substring(1)
const { locale } = useLanguage()

const currentActiveContentInToc = ref<string>('')

const page = ref(null)

const fetchContent = async () => {
  try {
    const collectionName = `pages_${locale.value}`
    const folderName = locale.value
    const doc = await queryCollection(collectionName)
      .path(`/${folderName}/${props.contentPath}`)
      .first()
    const idsTo = 'body' in doc ? doc.body?.toc?.links?.map(toc => toc.id) || [] : []
    currentActiveContentInToc.value
      = hash && idsTo.includes(hash) ? hash : idsTo[0] || ''
    page.value = doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    page.value = null
  }
}

onMounted(() => {
  fetchContent()
  startIntersectionObserver()
})

const sideBarLinks = computed(() => {
  if (!page.value) {
    return []
  }
  const r = page.value?.body?.toc?.links
    ?.filter(toc => toc.depth === 3)
    ?.map((toc) => {
      return {
        ...toc,
        id: toc.id,
        text: toc.text ? toc.text.split('.')[1]?.trim() || '' : '',
      }
    }) || []
  return r
})
const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0)
const ids = computed(() => sideBarLinks.value.map(link => link.id))

const updateCurrentActiveContentInToc = (section: string) => {
  currentActiveContentInToc.value = section
}

const startIntersectionObserver = () => {
  const options = {
    root: null,
    rootMargin: '0px', // margin around the root (top, right, bottom, left)
    threshold: 0.5, // 0.5 means when 50% of the element is visible
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const elem = entry.target

        if (entry.intersectionRatio >= 0) {
          updateCurrentActiveContentInToc(elem.id)
        }
      }
    })
  }, options)

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
      v-if="page"
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
          md="8"
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
