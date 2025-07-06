<!-- Content based Page -->
<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import img from '@assets/img/newsletter-background-opt.png'

const { t, locale, langCollection } = useLanguage()
const contentPath = computed(() => `/${locale.value}/${ContentKeys.ruleAnonymizationPolicy}`)
const l = computed(() => langCollection[locale.value])
// Use currentLocale instead of locale.value directly,
// because locale.value may differ between SSR and CSR,
// causing hydration mismatch or double-fetch in useAsyncData ?
const { data: page } = useAsyncData(
  () => `${locale.value}-${ContentKeys.ruleAnonymizationPolicy}`,
  () => queryCollection(l.value)
    .path(contentPath.value)
    .first(),
)
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
      <v-col>
        <article>
          <ContentRenderer :value="page || {}"/>
        </article>
      </v-col>
      <!-- <EmptyComponent
        :message="t('empty.no-content')"
        :show-icon="false"
      /> -->
    </v-container>
  </div>
</template>
