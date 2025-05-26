<script setup lang="ts">
// import img from '@assets/img/banner-judgment.png'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

const { mail } = defineProps<{ mail: string }>()
</script>

<template>
  <div>
    <!-- <BannerImage
      :title="t('newsletter.title')"
      :description="t('newsletter.subtitle')"
      :image="img"
      :alt="t('alt.banner.courtroom')"
    /> -->
    <span>{{ t('newsletter.title') }}</span>
  </div>
</template>

    <!-- <NewsletterSubscription :mail="props.mail" /> -->
