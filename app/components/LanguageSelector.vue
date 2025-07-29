<script setup lang="ts">
interface Language {
  code: string
  name: string
  title: string
  description: string
  buttonText: string
  cookieText: string
}

const localeCookie = useCookie('i18n_redirected', {
  path: '/',
  domain: '.const-court.be', // ✅ ensures all subdomains can read it
  maxAge: 60 * 60 * 24 * 365, // 1 jaar
  sameSite: 'lax',
  secure: true
})

const languages: Language[] = [
  {
    code: 'nl',
    name: 'Nederlands',
    title: 'Gelieve uw voorkeurstaal te kiezen',
    description: 'Na uw keuze wordt u automatisch doorgestuurd naar de juiste versie van onze website.',
    buttonText: 'Nederlands',
    cookieText: 'Uw taalkeuze wordt onthouden via een cookie.'
  },
  {
    code: 'fr',
    name: 'Français',
    title: 'Veuillez choisir votre langue préférée',
    description: 'Après votre choix, vous serez automatiquement redirigé vers la version appropriée de notre site.',
    buttonText: 'Français',
    cookieText: 'Votre choix linguistique sera mémorisé à l\'aide d\'un cookie.'
  },
  {
    code: 'de',
    name: 'Deutsch',
    title: 'Bitte wählen Sie Ihre bevorzugte Sprache',
    description: 'Nach Ihrer Auswahl werden Sie automatisch zur passenden Version unserer Website weitergeleitet.',
    buttonText: 'Deutsch',
    cookieText: 'Ihre Sprachauswahl wird in einem Cookie gespeichert.'
  },
  {
    code: 'en',
    name: 'English',
    title: 'Please select your preferred language',
    description: 'After your choice, you will be automatically redirected to the appropriate version of our website.',
    buttonText: 'English',
    cookieText: 'Your language choice will be remembered using a cookie.'
  }
]

function chooseLanguage(langCode: string) {
  localeCookie.value = langCode
  window.location.href = `https://${langCode}.const-court.be`
}
</script>

<template>
  <div class="grid gap-6 text-center px-4">
    {{  localeCookie }}
    <div
      v-for="lang in languages"
      :key="lang.code"
    >
      <h2 class="text-lg font-semibold">
        {{ lang.title }}
      </h2>
      <p class="text-sm text-gray-600 mb-2">
        {{ lang.description }}
      </p>
      <button
        class="px-4 py-2 bg-yellow-400 text-black rounded"
        @click="chooseLanguage(lang.code)"
      >
        {{ lang.buttonText }}
      </button>
      <p class="text-xs mt-1 text-gray-500">
        {{ lang.cookieText }}
      </p>
    </div>
  </div>
</template>
