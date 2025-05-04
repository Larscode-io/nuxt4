<template>
  <div class="prose mx-auto p-4">
    <!-- $route.path contains /nl/apis and is the default path for ContentDoc -->
    <ContentDoc />
  </div>
</template>

<script setup>
import { useSeoMeta } from '#imports'

useSeoMeta({
  title: 'API-informatie | Grondwettelijk Hof',
  description: 'Informatie over de beschikbare API\'s van het Grondwettelijk Hof, gebruiksrichtlijnen en juridische aandachtspunten.',
  ogTitle: 'API-informatie | Grondwettelijk Hof',
  ogDescription: 'Documentatie over de beschikbare API\'s voor arresten en hangende zaken van het Grondwettelijk Hof.',
  ogType: 'website',
  ogUrl: 'https://www.const-court.be/apis',
})
</script>
