<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { MessageSchema } from '~~/types/i18n'

const route = useRoute()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const localeRoute = useLocaleRoute()
definePageMeta({
  layout: 'default',
})

const { t, locale, locales } = useI18n<[MessageSchema], 'nl' | 'fr' | 'en' | 'de'>()
// const $t = useI18n<MessageSchema>().t

// test how auto suggest works:
t('aria.label.dropdown.input')

// const { messages } = useI18n();
// // Access a specific locale's messages
// const messageInFrench = messages.value.fr["alt.banner.books"];
// console.log(messageInFrench);
</script>

<template>
  <div>
    <nav>
      <NuxtLink to="/nl/demo/languages">
        NL
      </NuxtLink>
      <NuxtLink to="/fr/demo/languages">
        FR
      </NuxtLink>
      <NuxtLink to="/de/demo/languages">
        DE
      </NuxtLink>
      <NuxtLink to="/en/demo/languages">
        EN
      </NuxtLink>
    </nav>
    <nav>
      <!-- <nuxt-link :to="switchLocalePath('en')">English</nuxt-link> -->
      <!-- <nuxt-link :to="switchLocalePath('fr')">Français</nuxt-link> -->
      <NuxtLink
        v-for="loc in locales"
        :key="loc.code"
        :to="switchLocalePath(loc.code)"
      >
        {{ loc.name }}
      </NuxtLink>
    </nav>

    <h2>Current Locale: {{ locale }}</h2>

    <p>route.name: {{ route.name }}</p>
    <!-- returns demo-languages___fr -->

    <p>localePath('demo-languages'): {{ localePath('demo-languages') }}</p>
    <!-- returns /nl/demo/languages -->

    <p>{{ switchLocalePath('fr') }}</p>
    <!-- returns /fr/demo/languages -->

    <!-- Remove the direct display of the localeRoute object to avoid circular structure error -->
    <!-- <p>{{ localeRoute('demo-languages') }}</p> -->
    <!-- localeRoute is a function that returns a Route object for a given page. This is different from localePath, which only returns the full path as a string. -->
    <p>{{ localeRoute('demo-languages').fullPath }}</p>
    <!-- Displays the full path -->
    <p>{{ localeRoute('demo-languages').name }}</p>
    <!-- Displays the route name like demo-languages___en -->
    <p>{{ localeRoute('demo-languages').params }}</p>
    <!-- Displays the route params -->

    <p>{{ t("alt.banner.books") }}</p>
    <!-- werkt niet: -->
    <p>{{ t("alt.banner.books", { locale: 'nl' }) }}</p>
    <p>{{ t("alt.banner.books", { locale: 'fr' }) }}</p>

    <NuxtPage />
  </div>
</template>

<style>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
</style>
