<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">

    <p class="text-xl font-semibold mb-6">
      <!-- {{ t('entry.select') }} -->
    </p>
    <slot />
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: 'fallback',
  robots: 'noindex, nofollow',
})
</script>
