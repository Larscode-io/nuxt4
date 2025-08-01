<script setup lang="ts">
definePageMeta({
  layout: 'fallback',
  i18n: false
})
const labels = ['Language Selection', 'Taalkeuze', 'Choix de langue', 'Sprachauswahl']
const description_labels = [
  'Select your preferred language for the official website of the Constitutional Court.',
  'Kies uw voorkeurstaal voor de officiële website van het Grondwettelijk Hof.',
  'Choisissez votre langue préférée pour le site officiel de la Cour constitutionnelle.',
  'Wählen Sie Ihre bevorzugte Sprache für die offizielle Website des Verfassungsgerichts.',
]

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.const-court.be/language_selection_page' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.const-court.be/language_selection_page' }
  ],
})

useSeoMeta({
  title: labels.sort(() => Math.random() - 0.5).join(' | '),
  description: description_labels.sort(() => Math.random() - 0.5).join(' | '),
  robots: 'index, follow',
})
</script>

<template>
  <LanguageSelector />
</template>
