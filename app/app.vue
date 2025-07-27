// app.vue is the top-level component that wraps everything.
<template>
  <v-app>
    <NuxtLayout>
      <header />
      <CookieDebugger />

      <NuxtPage />
      <footer />
    </NuxtLayout>
  </v-app>
</template>

<script setup>
import { NuxtLayout, NuxtPage } from '#components'
</script>

<style scoped></style>
