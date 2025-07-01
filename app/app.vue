// app.vue is the top-level component that wraps everything.
<template>
  <NuxtLayout>
    <header />
    <!-- todo: main removed here and v-main in layouts/default.vue -->
    <!-- <main> -->
    <v-app>
      <NuxtPage />
    </v-app>
    <!-- </main> -->
    <footer />
  </NuxtLayout>
</template>

<script setup>
import { NuxtLayout, NuxtPage } from '#components'
</script>

<style scoped></style>
