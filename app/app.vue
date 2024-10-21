// app.vue is the top-level component that wraps everything.
<template>
  <NuxtLayout>
    <header></header>
    <main>
      <v-app>
        <NuxtPage />
      </v-app>
    </main>
    <footer></footer>
  </NuxtLayout>
</template>

<script setup>
import { NuxtLayout, NuxtPage } from '#components'
</script>

<style scoped></style>
