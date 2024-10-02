<script setup lang="ts">
definePageMeta({
  layout: "default"
})

import type { MessageSchema } from "~~/types/i18n.js";
const { t } = useI18n<[MessageSchema], "nl" | "fr" | "en" | "de">();
const $t = useI18n<MessageSchema>().t;

const greeting = t("aria.label.dropdown.input");
</script>

<template>
  <nav>
    <NuxtLink to="/nl/demo/languages">NL</NuxtLink>
    <NuxtLink to="/fr/demo/languages">FR</NuxtLink>
    <NuxtLink to="/de/demo/languages">DE</NuxtLink>
    <NuxtLink to="/en/demo/languages">EN</NuxtLink>
  </nav>
  {{ t("alt.banner.books") }}
  <NuxtPage />
</template>

<style>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
}
</style>

