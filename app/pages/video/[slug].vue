<!-- pages/video/[slug].vue -->
<!-- test: -->
<!-- http://localhost:3003/video/film2?a11y=true -->
<!-- http://localhost:3003/video/film2-trans -->

<template>
  <div class="d-flex flex-column align-center justify-center w-100 overflow-hidden">
    <video
      :key="videoKey"
      class="w-100"
      style="height: auto; border: 1px solid #ccc;"
      controls
      playsinline
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed } from 'vue'

const route = useRoute()
const { t, locale, langCollection } = useLanguage()

const slug = computed(() => route.params.slug as string)
const isTrans = computed(() => slug.value.endsWith('-trans'))
const baseSlug = computed(() => slug.value.replace('-trans', ''))

const titles = {
  film1: t('menu.press-and-media.video.film1.title'),
  film2: t('menu.press-and-media.video.film2.title'),
  film3: t('menu.press-and-media.video.film3.title')
}
// todo: use translations
const descriptions = {
  film1: 'In deze video krijgt u inzicht in de rol en bevoegdheden van het Grondwettelijk Hof.',
  film2: 'U krijgt inzicht in hoe een zaak wordt gestart bij het Hof.',
  film3: 'Een overzicht van de praktische werking van het Hof.'
}
const durations = {
  film1: 'PT2M45S',
  film2: 'PT2M30S',
  film3: 'PT2M20S'
}

const version = computed(() => isTrans.value ? 'TRANS' : 'SUBTI')
const langCode = computed(() => locale.value.toUpperCase())
const filename = computed(() => `${baseSlug.value.toUpperCase()}-${langCode.value}-DEF31032025-${version.value}-XX.mp4`)

const videoSrc = computed(() => `https://${locale.value}.const-court.be/public/media/${locale.value}/${filename.value}`)
const thumbnailUrl = computed(() => `https://${locale.value}.const-court.be/public/media/${locale.value}/thumbnails/${baseSlug.value.toUpperCase()}.jpg`)
const videoKey = ref(0)

useHead({
  title: titles[baseSlug.value] || 'Video',
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: titles[baseSlug.value],
        description: descriptions[baseSlug.value],
        thumbnailUrl: thumbnailUrl.value,
        uploadDate: '2025-03-31',
        contentUrl: videoSrc.value,
        embedUrl: `https://${locale.value}.const-court.be/video/${slug.value}`,
        duration: durations[baseSlug.value]
      })
    }
  ]
})
</script>

<style scoped>
video {
  max-width: 960px;
  margin: 32px auto;
}
</style>
