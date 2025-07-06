<!-- Content based Page -->
<script setup lang="ts">
import { ContentKeys } from '@core/constants'
import { computed } from 'vue'
import img from '@assets/img/newsletter-background-opt.png'

const { t, locale, langCollection } = useLanguage()
const currentLocale = locale.value
const contentPath = `/${currentLocale}/${ContentKeys.rulePleadingsProcedure}`

// Use currentLocale instead of locale.value directly,
// because locale.value may differ between SSR and CSR,
// causing hydration mismatch or double-fetch in useAsyncData
const { data: page } = useAsyncData(
  `${currentLocale}-${ContentKeys.rulePleadingsProcedure}`,
  () => queryCollection(langCollection[currentLocale]).path(contentPath).first(),
)

const hasContent = computed(() =>
  Array.isArray(page.value?.body?.value) && page.value.body.value.length > 0,
)
</script>

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
        <v-col v-if="hasContent">
          <article>
            <ContentRenderer :value="page || {}"/>
          </article>
        </v-col>
        <v-col v-else>
          <EmptyComponent
            :message="t('empty.no-content')"
            :show-icon="false"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
