<!-- Content based Page -->
<template>
  <div>
    <BannerImage
      :title="t('menu.rule.pleadings-procedure')"
      :description="t('menu.rule.pleadings-procedure-title-description')"
      :image="img"
      :alt="t('alt.banner.judge')"
    />
    <v-container class="flex-column align-start flex-nowrap">
      <v-row>
        <v-col
          cols="12"
          md="8"
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

<script setup lang="ts">
import { ref, computed } from 'vue'
import img from '~/assets/img/newsletter-background-opt.png'
import { useLanguage } from '@/composables/useLanguage'
import { ContentKeys } from '~/core/constants'

const route = useRoute()
const hash = route.hash.substring(1)
const { t, locale } = useLanguage()

const currentActiveContentInToc = ref<string>('')

const { data: page } = await useAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${ContentKeys.rulePleadingsProcedure}`)
      .findOne()
    const idsTo = doc.body?.toc?.links?.map(toc => toc.id) || []
    currentActiveContentInToc.value
      = hash && idsTo.includes(hash) ? hash : idsTo[0] || ''
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
})
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

:deep(.nuxt-content h3 a) {
  text-decoration: none;
}

:deep(.nuxt-content p) {
  padding: 10px;
}
</style>
