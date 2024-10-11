// app.vue is the top-level component that wraps everything.
<template>
  <NuxtLayout>
    <header></header>
    <main>
      <NuxtPage />
    </main>
    <footer></footer>
  </NuxtLayout>
</template>

<script setup>
import { NuxtLayout, NuxtPage } from '#components'
</script>

<style scoped></style>
