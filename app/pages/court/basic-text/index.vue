<!-- Content based Page -->
<template>
  <div>
    <BannerImage
      v-if="page"
      :title="page.title"
      :description="page.description"
      :image="img"
      alt=""
    />
    <v-container
      class="flex-column align-start flex-nowrap"
      fluid
    >
      <v-row
        v-if="status === 'loading'"
        class="d-flex"
        align="flex-start"
        justify="center"
      >
        <div class="col-12 col-md-12">
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="article"
          />
        </div>
      </v-row>
      <v-row
        v-else-if="status === 'error'"
        class="d-flex"
        align="flex-start"
        justify="center"
      >
        <div class="col-12 col-md-12">
          <ErrorCard
            :message="t('error.fetchingData')"
            :show-go-home="false"
          />
        </div>
      </v-row>
      <v-row
        v-else
        class="d-flex"
        align="flex-start"
        justify="center"
      >
        <v-col
          v-if="hasSidebarLinks"
          cols="12"
          md="3"
        >
          <Sidebar
            :active="currentActiveContentInToc"
            :toc="sideBarLinks"
            @click="updateCurrentActiveContentInToc"
          />
        </v-col>
        <v-col
          v-if="hasSidebarLinks"
          cols="12"
          md="9"
        >
          <article v-if="page">
            <ContentRendererMarkdown
              :value="page.body"
              class="nuxt-content"
            />
          </article>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'

import BannerImage from '~/components/BannerImage.vue'
import img from '~/assets/img/banner-text.png'
import { ContentKeys } from '~/core/constants'
import { useLanguage } from '@/composables/useLanguage'

const { t, locale } = useLanguage()
const route = useRoute()
const hash = route.hash.substring(1)

const currentActiveContentInToc = ref<string>('')
const contentPath = ref(`${ContentKeys.presentationBasicTexts}`)

const { data: page, pending, error } = await useLazyAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${contentPath.value}`).findOne()

    const idsTo = doc.body?.toc?.links?.map(toc => toc.id) || []
    currentActiveContentInToc.value
      = hash && idsTo.includes(hash) ? hash : idsTo[0] || ''
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
})
const status = computed(() => {
  if (pending.value) {
    return 'loading'
  }
  if (error.value) {
    return 'error'
  }
  return 'success'
})

const sideBarLinks = computed(() => {
  if (!page.value) {
    return []
  }
  return page.value?.body?.toc?.links
    ?.filter(toc => toc.depth === 3)
    ?.map((toc) => {
      return {
        ...toc,
        id: toc.id,
        text: toc.text ? toc.text.split('.')[1]?.trim() : 'Untitled',
      }
    }) || []
})
const hasSidebarLinks = computed(() => sideBarLinks.value.length > 0)
const ids = computed(() => sideBarLinks.value.map(link => link.id))

const updateCurrentActiveContentInToc = (section) => {
  currentActiveContentInToc.value = section
}

const startIntersectionObserver = () => {
  const options = {
    threshold: 0.9,
    rootMargin: '0px 0px -80% 0px',
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const elem = entry.target

        if (entry.intersectionRatio >= 0.75) {
          updateCurrentActiveContentInToc(elem.id)
        }
      }
    })
  }, options)

  document.querySelectorAll('h3').forEach((el) => {
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

<style lang="scss" scoped>
.d-flex {
  max-width: 1260px !important;
  margin: auto;
  margin-bottom: 80px;
  @include mobile {
    margin-bottom: 40px;
    width: 100%;
  }
}

:deep(.nuxt-content) {
  h3 {
    padding-top: 32px;
    padding-bottom: 24px;
    font-size: 2rem;
    font-weight: 600;
    t-size: 1.5rem;
  }
  h4 {
    text-align: left;
  }

  .accordion-trigger {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .accordion-trigger[aria-expanded='false'] + .accordion-content {
    display: none;
  }

  .v-icon {
    transition: transform 0.2s linear;
  }
  h4 {
    transition: font-size 0.2s linear, font-weight 0.2s linear;
  }

  .accordion-trigger[aria-expanded='true'] {
    .v-icon {
      transform: rotate(180deg);
    }

    h4 {
      // padding-top: 1rem;
      // padding-bottom: 24px;
      font-size: 2rem;
      font-weight: 600;
      @include tablet-portrait {
        padding-top: 24px;
        padding-bottom: 16px;
        font-size: 1.5rem;
      }
    }
  }

  .accordion {
    padding: 16px 24px;
    border-bottom: 0.5px solid #666;
    &:focus-within {
      outline: 1.5px solid black;
    }
    button:focus {
      outline: none;
    }
  }

  p {
    text-indent: 1rem;
  }
  .new-block {
    display: block;
  }

  h5,
  h6 {
    text-align: center;
  }

  h5 {
    font-size: 1.15rem;
  }

  h6 {
    font-size: 1rem;
  }

  .titles {
    font-size: 1.3em;
  }
  .chapters {
    font-size: 1rem;
  }
  .sections {
    font-size: 0.9rem;
  }
  .subsections {
    font-size: 0.85rem;
  }
  .titles,
  .chapters,
  .sections,
  .subsections {
    margin-top: 0.1rem;
  }
  ol {
    padding-left: 2.1rem;
    margin-bottom: 0;
  }
  ul {
    padding-left: 2.1rem;
    margin-bottom: 0;
  }
  .no-bottom-margin {
    margin-bottom: 0;
  }
  .no-text-indent p {
    text-indent: 0;
  }
  .gray-bg {
    background-color: rgb(230, 230, 230);
    margin-bottom: 16px;
    padding: 10px;
  }
  .gray-bg.inline {
    padding: 0;
  }
  .bold {
    font-weight: bold;
  }
  .art {
    font-family: proxima-nova, sans-serif;
    font-size: 85%;
    font-weight: normal;
    background-color: white;
    display: inline-block;
    padding: 3px;
    margin-bottom: 16px;
    text-indent: 0;
    margin-left: 1rem;
    margin-top: 16px;
  }
}
.space {
  height: 40vh;
}
</style>
