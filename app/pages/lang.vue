<script setup lang="ts">
definePageMeta({ layout: 'fallback', })
useSeoMeta({ title: 'Taalkeuze', robots: 'noindex, nofollow', })

const localeCookie = useCookie('i18n_redirected')

function choose(lang: string) {
  localeCookie.value = lang
  window.location.href = `https://${lang}.const-court.be`
}
</script>

<template>
  <div class="grid gap-6 text-center px-4">
    <div>
      <h2 class="text-lg font-semibold">Gelieve uw voorkeurstaal te kiezen</h2>
      <p class="text-sm text-gray-600 mb-2">
        Na uw keuze wordt u automatisch doorgestuurd naar de juiste versie van onze website.
      </p>
      <button class="px-4 py-2 bg-yellow-400 text-black rounded" @click="choose('nl')">
        Nederlands
      </button>
      <p class="text-xs mt-1 text-gray-500">Uw taalkeuze wordt onthouden via een cookie.</p>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Veuillez choisir votre langue préférée</h2>
      <p class="text-sm text-gray-600 mb-2">
        Après votre choix, vous serez automatiquement redirigé vers la version appropriée de notre site.
      </p>
      <button class="px-4 py-2 bg-yellow-400 text-black rounded" @click="choose('fr')">
        Français
      </button>
      <p class="text-xs mt-1 text-gray-500">Votre choix linguistique sera mémorisé à l’aide d’un cookie.</p>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Bitte wählen Sie Ihre bevorzugte Sprache</h2>
      <p class="text-sm text-gray-600 mb-2">
        Nach Ihrer Auswahl werden Sie automatisch zur passenden Version unserer Website weitergeleitet.
      </p>
      <button class="px-4 py-2 bg-yellow-400 text-black rounded" @click="choose('de')">
        Deutsch
      </button>
      <p class="text-xs mt-1 text-gray-500">Ihre Sprachauswahl wird in einem Cookie gespeichert.</p>
    </div>

    <div>
      <h2 class="text-lg font-semibold">Please select your preferred language</h2>
      <p class="text-sm text-gray-600 mb-2">
        After your choice, you will be automatically redirected to the appropriate version of our website.
      </p>
      <button class="px-4 py-2 bg-yellow-400 text-black rounded" @click="choose('en')">
        English
      </button>
      <p class="text-xs mt-1 text-gray-500">Your language choice will be remembered using a cookie.</p>
    </div>
  </div>
</template>
