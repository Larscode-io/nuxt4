<script setup lang="ts">
import { ref, computed, onMounted, onUpdated } from 'vue'
import img from '~/assets/img/newsletter-background-opt.png'
import { ContentKeys } from '~/core/constants'

const route = useRoute()
const hash = route.hash.substring(1)
const { t, locale } = useLanguage()

const { data: page } = await useAsyncData('content', async () => {
  try {
    const doc = await queryContent(`${locale.value}/${ContentKeys.ruleAnonymizationPolicy}`)
      .findOne()
    return doc
  }
  catch (error) {
    console.error('Error fetching content:', error)
    return null
  }
})

</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.rule.anonymization-policy')"
      :description="t('menu.rule.anonymization-policy-description')"
      :image="img"
      :alt="t('alt.banner.judge')"
    />
    <v-container class="flex-column align-start flex-nowrap">
      <v-row>
        <v-col
          cols="12"
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
