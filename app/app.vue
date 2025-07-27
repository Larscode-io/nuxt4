<template>
  <v-app>
    <NuxtLayout>
      <header />
      <NuxtPage />
      <footer />
    </NuxtLayout>
  </v-app>
</template>

<script setup>
import { NuxtLayout, NuxtPage } from '#components'
</script>

<style scoped></style>
