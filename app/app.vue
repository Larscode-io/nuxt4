// app.vue is the top-level component that wraps everything.
<template>
  <NuxtLayout>
    <header>
      <!-- Your custom header -->
    </header>
    
    <main>
      <NuxtPage />
    </main>
    
    <footer>
      <!-- Your custom footer -->
    </footer>
  </NuxtLayout>
</template>

<script setup>
import { NuxtLayout, NuxtPage } from '#components'
</script>

<style scoped>
/* Your global styles */
</style>
