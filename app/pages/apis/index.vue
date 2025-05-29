<template>
  <ContentRenderer
    v-if="content"
    :value="content"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useSeoMeta } from '#imports'

const { locale, langCollection } = useLanguage()

useSeoMeta({
  title: 'API-informatie | Grondwettelijk Hof',
  description: 'Informatie over de beschikbare API\'s van het Grondwettelijk Hof, gebruiksrichtlijnen en juridische aandachtspunten.',
  ogTitle: 'API-informatie | Grondwettelijk Hof',
  ogDescription: 'Documentatie over de beschikbare API\'s voor arresten en hangende zaken van het Grondwettelijk Hof.',
  ogType: 'website',
  ogUrl: 'https://www.const-court.be/apis',
})
const route = useRoute()
// const contentPath = computed(() => `/${locale.value}/${ContentKeys.ruleAnonymizationPolicy}`)
const l = computed(() => langCollection[locale.value])
const { data: content } = await useAsyncData(
  `content-${route.fullPath}`,
  () => queryCollection(l.value)
    .path(route.path)
    .first(),
)
</script>
