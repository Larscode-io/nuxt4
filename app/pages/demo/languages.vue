<script setup lang="ts">
import type { MessageSchema } from "~~/types/i18n";

definePageMeta({
  layout: "default"
})

const { t } = useI18n<[MessageSchema], "nl" | "fr" | "en" | "de">();
const _$t = useI18n<MessageSchema>().t;

t("aria.label.dropdown.input");
</script>

<template>
  <div>
    <nav>
      <NuxtLink to="/nl/demo/languages">NL</NuxtLink>
      <NuxtLink to="/fr/demo/languages">FR</NuxtLink>
      <NuxtLink to="/de/demo/languages">DE</NuxtLink>
      <NuxtLink to="/en/demo/languages">EN</NuxtLink>
    </nav>
    <p>{{ t("alt.banner.books") }}</p>
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

