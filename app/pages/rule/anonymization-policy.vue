<!-- Content based Page -->
<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import img from '@assets/img/newsletter-background-opt.png'

const { t, locale, langCollection } = useLanguage()
const currentLocale = locale.value
const contentPath = `/${currentLocale}/${ContentKeys.ruleAnonymizationPolicy}`

// Use currentLocale instead of locale.value directly,
// because locale.value may differ between SSR and CSR,
// causing hydration mismatch or double-fetch in useAsyncData
const { data: page } = await useAsyncData(`${currentLocale}-${ContentKeys.ruleAnonymizationPolicy}`, () =>
  queryCollection(langCollection[currentLocale]).path(contentPath).first(),
)
const hasContent = computed(() =>
  Array.isArray(page.value?.body?.value) && page.value.body.value.length > 0,
)
</script>

<template>
  <div>
    <BannerImage
      :title="t('menu.rule.anonymization-policy')"
      :description="t('menu.rule.anonymization-policy-description')"
      :image="img"
      :alt="t('alt.banner.judge')"
    />{{ t('empty.no-content') }}
    <v-container class="flex-column align-start flex-nowrap">
      <v-col v-if="hasContent">
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
    </v-container>
  </div>
</template>
