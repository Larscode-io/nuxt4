<script setup lang="ts">
definePageMeta({
  layout: 'fallback'
})
const labels = [ 'Language Selection', 'Taalkeuze', 'Choix de langue', 'Sprachauswahl' ]

useSeoMeta({
  title: labels.sort(() => Math.random() - 0.5).join(' | '),
  robots: 'noindex, nofollow'
})
</script>

<template>
  <LanguageSelector />
</template>
